import { NextFunction, Request, Response, Router } from "express";
import client from "@repo/db/client";
import { userDebitType } from "@repo/types/customTypes";
import {
  BankName,
  PaymentApp,
  PaymentStatus,
  TransactionType,
} from "@prisma/client";
import userAuthMiddleware from "../middlewares/userAuthMiddleware";
import jwt from "jsonwebtoken";
import { TransactionPaymentPayload } from "@repo/types/customTypes";
import { createClient } from "redis";
import axios from "axios";
import prisma from "@repo/db/client";

const debitRouter = Router();

debitRouter.post(
  "/",
  userAuthMiddleware,
  async function (req: Request, res: Response, next: NextFunction) {
    const { paymentAppToken, paymentApp, netbankApp }: userDebitType = req.body;

    try {
      const bankNameValue: BankName = netbankApp as BankName;
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

      const netBankingUser = await prisma.netbankingAccount.findUnique({
        where: { userId: Number(res.locals.userId) },
      });

      const registeredAppPayload = jwt.verify(
        paymentAppToken,
        registeredApp.secretKey
      ) as TransactionPaymentPayload;

      const bankAccount = await prisma.bankAccount.findUnique({
        where: { accountNumber: netBankingUser?.bankAccountId },
      });

      if (bankAccount!.balance < registeredAppPayload.amount) {
        res.status(411).json({ message: "User doesn't have enough money" });
        return;
      }

      await client.transaction.create({
        data: {
          paymentApp: paymentAppValue,
          token: paymentAppToken,
          status: PaymentStatus.INITIATED,
          amount: registeredAppPayload.amount,
          date: new Date(),
          netbankingUserId: Number(res.locals.userId),
          transactionType: TransactionType.OffRamp,
        },
      });

      const bankSignedToken = jwt.sign(
        {
          amount: registeredAppPayload.amount,
          paymntUserId: registeredAppPayload.paymntUserId,
        },
        registeredApp!.bankSecretKey
      );

      const webhookRes = await axios.post(registeredApp!.webhookUrl, {
        paymntToken: bankSignedToken,
        status: PaymentStatus.INITIATED,
      });

      if (webhookRes.status <= 300) {
        res.status(200).json({
          message:
            "Requested of payment transfer initiated. will transfer shortly and notify",
          registeredAppPayload,
        });

        const redisClient = createClient();

        await redisClient.connect();

        redisClient.lPush(
          "OFF_RAMP_TRANSACTIONS_QUEUE",
          JSON.stringify({
            paymntToken: paymentAppToken,
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

export default debitRouter;
