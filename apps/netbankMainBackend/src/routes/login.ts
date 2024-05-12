import { NextFunction, Request, Response, Router } from "express";
import { userLoginType, userLoginScheme } from "@repo/types/customTypes";
import jwt from "jsonwebtoken";
import client from "@repo/db/client";
import bcrypt from "bcrypt";
const loginRouter = Router();

loginRouter.post(
  "/",
  async function (req: Request, res: Response, next: NextFunction) {
    const { userId, password }: userLoginType = req.body;

    try {
      const result = userLoginScheme.parse({ userId, password });
      const netbankingUser = await client.netbankingAccount.findUnique({
        where: {
          userId: Number(userId),
        },
      });

      if (!netbankingUser) {
        res.status(411).json({
          message: "No user with this userId. please check",
        });
        return;
      }

      const matching: boolean = await bcrypt.compare(
        password,
        netbankingUser!.password
      );

      if (!matching) {
        res.status(411).json({
          message: "Password Doesn't match",
        });
        return;
      }

      const token = jwt.sign(req.body, process.env.HDFC_JWT_LOGIN_SECRET!, {
        expiresIn: "5m",
      });

      res.cookie("token", token, {
        maxAge: 5 * 60 * 1000,
        secure: false,
        httpOnly: true,
      });

      res.status(200).json({
        message: "Success",
      });
    } catch (error) {
      console.log(error);

      res.status(411).json({
        message: error,
      });
    }
  }
);

export default loginRouter;
