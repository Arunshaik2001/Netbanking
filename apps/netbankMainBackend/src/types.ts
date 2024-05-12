import { JwtPayload } from "jsonwebtoken";

export interface UserIdPayload extends JwtPayload {
  userId: string;
}

export interface TransactionPaymentPayload extends JwtPayload {
  amount: number;
  paymntUserId: number;
}
