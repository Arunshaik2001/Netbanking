import { BankName, PaymentStatus, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const client = new PrismaClient();
async function main() {
  const netbankingUser = {
    userId: 1234567,
    bankName: BankName.HDFC,
    password: await bcrypt.hash("1234567", 10),
  };

  await client.bankAccount.upsert({
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

  await client.transaction.upsert({
    where: {
      txId: 1,
    },
    update: {},
    create: {
      token: "TOKEN_1",
      status: PaymentStatus.INITIATED,
      amount: 100,
      date: new Date(),
      netbankingAccount: {
        connect: netbankingUser,
      },
    },
  });
  const transaction2 = await client.transaction.upsert({
    where: {
      txId: 2,
    },
    update: {},
    create: {
      token: "TOKEN_2",
      status: PaymentStatus.SUCCESS,
      amount: 1000,
      date: new Date(),
      netbankingAccount: {
        connect: netbankingUser,
      },
    },
  });

  const transaction3 = await client.transaction.upsert({
    where: {
      txId: 3,
    },
    update: {},
    create: {
      token: "TOKEN_3",
      status: PaymentStatus.FAILED,
      amount: 10000,
      date: new Date(),
      netbankingAccount: {
        connect: netbankingUser,
      },
    },
  });
}

main()
  .then(() => {
    client.$disconnect();
    process.exit(0);
  })
  .catch((e) => {
    console.log(e);
    client.$disconnect();
    process.exit(1);
  });
