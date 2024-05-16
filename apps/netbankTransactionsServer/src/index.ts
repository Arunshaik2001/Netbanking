import prismaClient from "@repo/db/client";
import { createClient } from "redis";
import { TransactionPaymentPayload, TxItem } from "@repo/types/customTypes";
import { PaymentStatus } from "@prisma/client";
import jwt from "jsonwebtoken";
import axios from "axios";
import { WebSocket } from "ws";

async function processTransaction(txJsonString: string) {
  const { paymntToken, paymentApp, netbankApp, bankAppPaymentToken }: TxItem =
    JSON.parse(txJsonString);

  await new Promise((resolve) => setTimeout(resolve, 5000));

  console.log(txJsonString);

  const registeredPartnerDetails = await prismaClient.registeredApp.findUnique({
    where: {
      paymentApp_bankName: {
        paymentApp: paymentApp,
        bankName: netbankApp,
      },
    },
  });

  //again verifying so that faulter cannot pass from this jwt verification
  const registeredAppPayload = jwt.verify(
    paymntToken,
    registeredPartnerDetails!.secretKey
  ) as TransactionPaymentPayload;

  try {
    await prismaClient.$transaction(async (tx) => {
      const transaction = await prismaClient.transaction.update({
        where: {
          token: paymntToken,
        },
        data: {
          status: PaymentStatus.SUCCESS,
          date: new Date(),
        },
      });

      const netbankUserAccount =
        await prismaClient.netbankingAccount.findUnique({
          where: { userId: transaction!.netbankingUserId },
        });

      await prismaClient.bankAccount.update({
        where: {
          accountNumber: netbankUserAccount?.bankAccountId,
        },
        data: {
          balance: {
            decrement: registeredAppPayload.amount,
          },
        },
      });
    });

    const res = await axios.post(registeredPartnerDetails!.webhookUrl, {
      paymntToken: bankAppPaymentToken,
      status: PaymentStatus.SUCCESS,
    });

    if (res.status <= 300) {
      console.log("DONE");
    } else {
      console.log("FAILED FROM APP SIDE");
    }

    console.log(res.status);
    const transaction = await prismaClient.transaction.findUnique({
      where: {
        token: paymntToken,
      },
    });

    const newSocket = new WebSocket("ws://localhost:4000");

    newSocket.onopen = () => {
      console.log("Connection established");
      newSocket.send(
        JSON.stringify({
          type: "identifier",
          content: {
            data: {
              clientId: generateRandom7DigitNumber(),
            },
          },
        }),
        {
          binary: false,
        }
      );

      newSocket.send(
        JSON.stringify({
          type: "message",
          content: {
            data: {
              paymntToken: paymntToken,
              status: res.status < 300 ? "SUCCESS" : "FAILURE",
              clientIdToSend: transaction!.netbankingUserId,
            },
          },
        }),
        {
          binary: false,
        }
      );
    };
    newSocket.onmessage = (message) => {
      console.log("Message received:", message.data);
    };
  } catch (error) {
    console.log(error);
  }
}

function generateRandom7DigitNumber() {
  const min = 1000000; // Minimum 7-digit number
  const max = 9999999; // Maximum 7-digit number
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log("Starting Transaction Handler");
  const redisClient = createClient({
    url: "redis://localhost:6379",
  });
  try {
    await redisClient.connect();
    while (true) {
      const txItem = await redisClient.rPop("OFF_RAMP_TRANSACTIONS_QUEUE");
      if (txItem) {
        processTransaction(txItem);
      }
    }
  } catch (error) {
    console.log(error);
    await redisClient.quit();
  }
}

main()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
