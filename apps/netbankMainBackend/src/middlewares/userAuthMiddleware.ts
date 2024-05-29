import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserIdPayload } from "../types";

export default async function userAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token: string = req.cookies.token;
  console.log(req.cookies);

  if (!token) {
    res.status(401).json({ message: "User Verification Failed" });
  }

  const SECRET_KEY = process.env.HDFC_JWT_LOGIN_SECRET;

  try {
    const decoded = jwt.verify(token, SECRET_KEY!) as UserIdPayload;
    res.locals.userId = decoded.userId;
    next();
  } catch (error) {
    console.log(error);
  }
}
