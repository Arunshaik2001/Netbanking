import { BankName, PaymentApp } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";

export type TxItem = {
  paymntToken: string;
  paymentApp: PaymentApp;
  netbankApp: BankName;
};

export interface TransactionPaymentPayload extends JwtPayload {
  amount: number;
  paymntUserId: number;
}
