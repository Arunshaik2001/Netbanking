import { NextFunction, Request, Response, Router } from "express";
import client from "@repo/db/client";
import { userCreditType, sweeperCreditType } from "@repo/types/customTypes";
import {
  BankName,
  PaymentApp,
  PaymentStatus,
  TransactionType,
} from "@prisma/client";
import jwt from "jsonwebtoken";
import {
  TransactionPaymentPayload,
  SweeperTransactionPayload,
} from "@repo/types/customTypes";
import { createClient } from "redis";
import axios from "axios";
import prisma from "@repo/db/client";

const creditRouter = Router();

creditRouter.post(
  "/",
  async function (req: Request, res: Response, next: NextFunction) {
    const { sweeperToken, paymentApp, bankName }: sweeperCreditType = req.body;

    try {
      const bankNameValue: BankName = bankName as BankName;
      const paymentAppValue: PaymentApp = paymentApp as PaymentApp;

      const registeredApp = await client.registeredApp.findUnique({
        where: {
          paymentApp_bankName: {
            bankName: bankNameValue,
            paymentApp: paymentAppValue,
          },
        },
      });

      if (!registeredApp) {
        res.status(411).json({
          message: "No registered financial app",
        });
        return;
      }

      const registeredAppPayload = jwt.verify(
        sweeperToken,
        registeredApp.secretKey
      ) as SweeperTransactionPayload;

      console.log(registeredAppPayload);

      const netBankAccount = await prisma.netbankingAccount.findUnique({
        where: {
          bankAccountId: Number(registeredAppPayload.bankAccountNumber),
        },
      });

      if (!netBankAccount) {
        res.status(411).json({ message: "No account found" });
        return;
      }

      await client.transaction.create({
        data: {
          paymentApp: paymentAppValue,
          token: sweeperToken,
          status: PaymentStatus.INITIATED,
          amount: registeredAppPayload.amount,
          date: new Date(),
          netbankingUserId: netBankAccount.userId,
          transactionType: TransactionType.OnRamp,
        },
      });

      const bankSignedToken = jwt.sign(
        {
          amount: registeredAppPayload.amount,
          bankAccountNumber: registeredAppPayload.bankAccountNumber,
        },
        registeredApp!.bankSecretKey
      );

      const webhookRes = await axios.post(
        registeredApp!.offRampWebhookEndpoint,
        {
          paymntToken: bankSignedToken,
          status: PaymentStatus.INITIATED,
        }
      );

      if (webhookRes.status <= 300) {
        res.status(200).json({
          message:
            "Requested of payment transfer initiated. will transfer shortly and notify",
          registeredAppPayload,
        });

        const redisClient = createClient();

        await redisClient.connect();

        redisClient.lPush(
          "ON_RAMP_TRANSACTIONS_QUEUE",
          JSON.stringify({
            paymntToken: sweeperToken,
            paymentApp: paymentAppValue,
            netbankApp: bankNameValue,
            bankAppPaymentToken: bankSignedToken,
          })
        );

        await redisClient.quit();
      } else {
        res.status(411).json({
          message:
            "Webhook not responding to transaction initiate. Please retry",
          registeredAppPayload,
        });
      }
    } catch (error) {
      console.log(error);

      res.status(411).json({
        message: error,
      });
    }
  }
);

export default creditRouter;
