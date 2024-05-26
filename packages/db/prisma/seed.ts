import {
  BankName,
  PaymentApp,
} from "@prisma/client";
import prisma from '@repo/db/client'

async function main() {


  await prisma.registeredApp.upsert({
    where: {
      paymentApp_bankName: {
        paymentApp: PaymentApp.PAYMNT,
        bankName: BankName.HDFC
      },
    },
    update: {
      paymentApp: PaymentApp.PAYMNT,
      secretKey: "PAYMNT_SECRET_HDFC",
      bankSecretKey: "HDFC_SECRET",
      bankName: BankName.HDFC,
      webhookUrl: "http://localhost:3005/api/v1/transaction/hdfcWebhook",
      offRampWebhookEndpoint:
        "http://localhost:3005/api/v1/transaction/hdfcWebhook/offRamp",
    },
    create: {
      paymentApp: PaymentApp.PAYMNT,
      secretKey: "PAYMNT_SECRET_HDFC",
      bankSecretKey: "HDFC_SECRET",
      bankName: BankName.HDFC,
      webhookUrl: "http://localhost:3005/api/v1/transaction/hdfcWebhook",
      offRampWebhookEndpoint:
        "http://localhost:3005/api/v1/transaction/hdfcWebhook/offRamp",
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
      webhookUrl:
        "http://localhost:3005/api/v1/transaction/kotakWebhook/offRamp",
    },
    create: {
      paymentApp: PaymentApp.PAYMNT,
      secretKey: "PAYMNT_SECRET_KOTAK",
      bankSecretKey: "KOTAK_SECRET",
      bankName: BankName.KOTAK,
      webhookUrl: "http://localhost:3005/api/v1/transaction/kotakWebhook",
      offRampWebhookEndpoint:
        "http://localhost:3005/api/v1/transaction/kotakWebhook/offRamp",
    },
  });
}

main()
  .finally(() => { prisma.$disconnect(); })
