import { SweeperTransactionPayload } from "@repo/types/customTypes";
import { TxItem } from "@repo/types/customTypes";
import { PaymentStatus } from "@prisma/client";
import jwt from "jsonwebtoken";
import axios from "axios";
import prismaClient from "@repo/db/client";


export default async function processTransaction(txJsonString: string) {
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
