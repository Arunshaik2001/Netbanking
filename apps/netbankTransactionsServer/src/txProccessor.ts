import { TransactionPaymentPayload } from "@repo/types/customTypes";
import { TxItem } from "@repo/types/customTypes";
import { PaymentStatus } from "@prisma/client";
import jwt from "jsonwebtoken";
import axios from "axios";
import prismaClient from "@repo/db/client";
import { generateRandom7DigitNumber } from "@repo/utils/utils";
import { WebSocket } from "ws";


export default async function processTransaction(txJsonString: string) {
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

      const bankAccount = await prismaClient.bankAccount.update({
        where: {
          accountNumber: netbankUserAccount?.bankAccountId,
        },
        data: {
          balance: {
            decrement: registeredAppPayload.amount,
          },
        },
      });

      console.log({ bankAccount });
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
