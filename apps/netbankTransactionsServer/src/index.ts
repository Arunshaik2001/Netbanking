import prismaClient from "@repo/db/client";
import { createClient } from "redis";
import { TransactionPaymentPayload, TxItem } from "../types";
import { PaymentStatus } from "@prisma/client";
import jwt from "jsonwebtoken";
import axios from "axios";

async function processTransaction(txJsonString: string) {
  const { paymntToken, paymentApp, netbankApp }: TxItem =
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
      paymntToken: paymntToken,
      status: PaymentStatus.SUCCESS,
    });

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
  try {
    console.log("Starting Transaction Handler");
    const redisClient = createClient({
      url: "redis://localhost:6379",
    });

    await redisClient.connect();
    while (true) {
      const txItem = await redisClient.rPop("TRANSACTIONS_QUEUE");
      if (txItem) {
        processTransaction(txItem);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

main()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
