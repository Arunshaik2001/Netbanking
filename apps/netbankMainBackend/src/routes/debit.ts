import { NextFunction, Request, Response, Router } from "express";
import client from "@repo/db/client";
import { userDebitType, debitTypeSchema } from "@repo/types/customTypes";
import { BankName, PaymentApp, PaymentStatus } from "@prisma/client";
import userAuthMiddleware from "../middlewares/userAuthMiddleware";
import jwt from "jsonwebtoken";
import { TransactionPaymentPayload } from "../types";
import { createClient } from "redis";

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

      const registeredAppPayload = jwt.verify(
        paymentAppToken,
        registeredApp.secretKey
      ) as TransactionPaymentPayload;

      await client.transaction.create({
        data: {
          paymentApp: paymentAppValue,
          token: paymentAppToken,
          status: PaymentStatus.INITIATED,
          amount: registeredAppPayload.amount,
          date: new Date(),
          netbankingUserId: Number(res.locals.userId),
        },
      });

      res.status(200).json({
        message:
          "Requested of payment transfer initiated. will transfer shortly and notify",
        registeredAppPayload,
      });

      const redisClient = createClient();

      await redisClient.connect();

      redisClient.lPush(
        "TRANSACTIONS_QUEUE",
        JSON.stringify({
          paymntToken: paymentAppToken,
          paymentApp: paymentAppValue,
          netbankApp: bankNameValue,
        })
      );

      // await new Promise((resolve) => setTimeout(resolve, 5000));

      // await client.transaction.update({
      //   where: {
      //     token: paymentAppToken,
      //   },
      //   data: {
      //     paymentApp: paymentAppValue,
      //     token: paymentAppToken,
      //     status: PaymentStatus.PROCESSING,
      //     amount: registeredAppPayload.amount,
      //     date: new Date(),
      //     netbankingUserId: Number(res.locals.userId),
      //   },
      // });
    } catch (error) {
      console.log(error);

      res.status(411).json({
        message: error,
      });
    }
  }
);

export default debitRouter;
