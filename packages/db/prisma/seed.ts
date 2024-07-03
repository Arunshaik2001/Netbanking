import {
  BankName,
  PaymentApp,
} from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from '@repo/db/client'
import dotenv from "dotenv";

dotenv.config({ path: __dirname + "/../../../.env" })

async function main() {
  const netbankingUser = {
    userId: 1234567,
    bankName: BankName.HDFC,
    password: bcrypt.hashSync("1234567", 10),
  };

  await prisma.bankAccount.upsert({
    where: { accountNumber: 1234567 },
    update: {},
    create: {
      accountNumber: 1234567,
      balance: 1000000,
      userName: "Arun Sk",
      netbankAccount: {
        create: netbankingUser,
      },
    },
  });


  await prisma.bankAccount.upsert({
    where: { accountNumber: 7894561 },
    update: {},
    create: {
      accountNumber: 7894561,
      balance: 2000000,
      userName: "Varun",
    },
  });

  await prisma.bankAccount.upsert({
    where: { accountNumber: 7894562 },
    update: {},
    create: {
      accountNumber: 7894562,
      balance: 2000000,
      userName: "Tarun",
    },
  });


  await prisma.bankAccount.upsert({
    where: { accountNumber: 4561234 },
    update: {},
    create: {
      accountNumber: 4561234,
      balance: 3000000,
      userName: "Rohan",
    },
  });


  await prisma.bankAccount.upsert({
    where: { accountNumber: 1237894 },
    update: {},
    create: {
      accountNumber: 1237894,
      balance: 2000000,
      userName: "Rakesh",
    },
  });


  await prisma.registeredApp.upsert({
    where: {
      paymentApp_bankName: {
        paymentApp: PaymentApp.PAYMNT,
        bankName: BankName.HDFC,
      },
    },
    update: {
      paymentApp: PaymentApp.PAYMNT,
      secretKey: "PAYMNT_SECRET_HDFC",
      bankSecretKey: "HDFC_SECRET",
      bankName: BankName.HDFC,
      webhookUrl: "http://paymnt-app:3005/api/v1/transaction/hdfcWebhook",
      offRampWebhookEndpoint:
        "http://paymnt-app:3005/api/v1/transaction/hdfcWebhook/offRamp",
    },
    create: {
      paymentApp: PaymentApp.PAYMNT,
      secretKey: "PAYMNT_SECRET_HDFC",
      bankSecretKey: "HDFC_SECRET",
      bankName: BankName.HDFC,
      webhookUrl: "http://paymnt-app:3005/api/v1/transaction/hdfcWebhook",
      offRampWebhookEndpoint:
        "http://paymnt-app:3005/api/v1/transaction/hdfcWebhook/offRamp",
    },
  });

  await prisma.registeredApp.upsert({
    where: {
      paymentApp_bankName: {
        paymentApp: PaymentApp.PAYMNT,
        bankName: BankName.KOTAK,
      },
    },
    update: {
      paymentApp: PaymentApp.PAYMNT,
      secretKey: "PAYMNT_SECRET_KOTAK",
      bankName: BankName.KOTAK,
      bankSecretKey: "KOTAK_SECRET",
      webhookUrl: "http://paymnt-app:3005/api/v1/transaction/kotakWebhook",
      offRampWebhookEndpoint:
        "http://paymnt-app:3005/api/v1/transaction/kotakWebhook/offRamp",
    },
    create: {
      paymentApp: PaymentApp.PAYMNT,
      secretKey: "PAYMNT_SECRET_KOTAK",
      bankSecretKey: "KOTAK_SECRET",
      bankName: BankName.KOTAK,
      webhookUrl: "http://paymnt-app:3005/api/v1/transaction/kotakWebhook",
      offRampWebhookEndpoint:
        "http://paymnt-app:3005/api/v1/transaction/kotakWebhook/offRamp",
    },
  });
}

main()
  .finally(() => { prisma.$disconnect(); })
