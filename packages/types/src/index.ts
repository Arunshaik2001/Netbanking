import { BankName, PaymentApp } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import z from "zod";

export const userLoginScheme = z.object({
  userId: z.string(),
  password: z.string(),
});

export type userLoginType = z.infer<typeof userLoginScheme>;

export const debitTypeSchema = z.object({
  paymentAppToken: z.string(),
  paymentApp: z.string(),
  netbankApp: z.string(),
});

export type userDebitType = z.infer<typeof debitTypeSchema>;

export const creditTypeSchema = z.object({
  amount: z.number(),
  bankAccountNumber: z.number(),
  bankName: z.string(),
  paymentApp: z.string(),
});

export type userCreditType = z.infer<typeof creditTypeSchema>;
export type sweeperCreditType = {
  sweeperToken: string;
  paymentApp: string;
  bankName: string;
};

export interface SweeperTransactionPayload extends JwtPayload {
  amount: number;
  bankAccountNumber: number;
}

export interface TransactionPaymentPayload extends JwtPayload {
  amount: number;
  paymntUserId: number;
}

export type TxItem = {
  paymntToken: string;
  paymentApp: PaymentApp;
  netbankApp: BankName;
  bankAppPaymentToken: string;
};

export const userSignUpScheme = z.object({
  accountNumber: z.string().length(7),
  password: z.string().min(6),
  bankName: z.string(),
});

export type usersignUpType = z.infer<typeof userSignUpScheme>;

type MessageType = "identifier" | "message";

export type WebsocketTransactionPayload = {
  type: MessageType;
  content: {
    data: {
      [key: string]: string | number;
    };
  };
};
