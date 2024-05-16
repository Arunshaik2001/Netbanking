import prismaClient from "@repo/db/client";
import { createClient } from "redis";
import { SweeperTransactionPayload } from "@repo/types/customTypes";
import { TxItem } from "@repo/types/customTypes";
import { PaymentStatus } from "@prisma/client";
import jwt from "jsonwebtoken";
import axios from "axios";

async function processTransaction(txJsonString: string) {
  const { paymntToken, paymentApp, netbankApp, bankAppPaymentToken }: TxItem =
    JSON.parse(txJsonString);

  console.log(txJsonString);
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
  ) as SweeperTransactionPayload;

  try {
    await prismaClient.$transaction(async (tx) => {
      const transaction = await prismaClient.transaction.update({
        where: {
          token: paymntToken,
        },
        data: {
          status: PaymentStatus.SUCCESS,
          date: new Date(),
          transactionType: "OnRamp",
        },
      });

      await prismaClient.bankAccount.update({
        where: {
          accountNumber: registeredAppPayload.bankAccountNumber,
        },
        data: {
          balance: {
            increment: registeredAppPayload.amount,
          },
        },
      });
    });

    const res = await axios.post(
      registeredPartnerDetails!.offRampWebhookEndpoint,
      {
        paymntToken: bankAppPaymentToken,
        status: PaymentStatus.SUCCESS,
      }
    );

    if (res.status <= 300) {
      console.log("DONE");
    } else {
      console.log("FAILED FROM APP SIDE");
    }
    console.log(res.status);
  } catch (error) {
    console.log(error);
  }
}

async function main() {
  console.log("Starting Transaction Handler");
  const redisClient = createClient({
    url: "redis://localhost:6379",
  });
  try {
    await redisClient.connect();
    while (true) {
      const txItem = await redisClient.rPop("ON_RAMP_TRANSACTIONS_QUEUE");
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
