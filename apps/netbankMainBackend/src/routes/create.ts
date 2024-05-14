import { NextFunction, Request, Response, Router } from "express";
import { usersignUpType, userSignUpScheme } from "@repo/types/customTypes";
import client from "@repo/db/client";
import bcrypt from "bcrypt";
import { BankName } from "@prisma/client";

const signOutRouter = Router();

function generateRandom7DigitNumber() {
  const min = 1000000; // Minimum 7-digit number
  const max = 9999999; // Maximum 7-digit number
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

signOutRouter.post(
  "/",
  async function (req: Request, res: Response, next: NextFunction) {
    const { accountNumber, password, bankName }: usersignUpType = req.body;

    try {
      const result = userSignUpScheme.parse({
        accountNumber,
        password,
        bankName,
      });
      console.log(result);
      const netbankingUser = await client.netbankingAccount.findUnique({
        where: {
          bankAccountId: Number(accountNumber),
        },
      });

      if (netbankingUser) {
        res.status(411).json({
          message: "Netbanking already created for this account.",
        });
        return;
      }

      const bankNameValue: BankName = bankName as BankName;
      const passwordHash = await bcrypt.hash(password, 10);

      const createUser = await client.netbankingAccount.create({
        data: {
          bankName: bankNameValue,
          bankAccountId: Number(accountNumber),
          userId: generateRandom7DigitNumber(),
          password: passwordHash,
        },
      });

      res.status(200).json({
        message: "Success",
        userId: createUser.userId,
      });
    } catch (error) {
      console.log(error);

      res.status(411).json({
        message: error,
      });
    }
  }
);

export default signOutRouter;
