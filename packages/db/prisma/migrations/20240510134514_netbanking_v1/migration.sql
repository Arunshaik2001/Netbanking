-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('INITIATED', 'PROCESSING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "BankName" AS ENUM ('HDFC', 'KOTAK');

-- CreateTable
CREATE TABLE "NetbankingAccount" (
    "userId" SERIAL NOT NULL,
    "password" TEXT NOT NULL,
    "bankName" "BankName" NOT NULL,

    CONSTRAINT "NetbankingAccount_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "BankAccount" (
    "accountNumber" INTEGER NOT NULL,
    "balance" INTEGER NOT NULL,
    "userName" TEXT NOT NULL,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("accountNumber")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "txId" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "amount" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "netbankingAccountUserId" INTEGER NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("txId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_token_key" ON "Transaction"("token");

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_accountNumber_fkey" FOREIGN KEY ("accountNumber") REFERENCES "NetbankingAccount"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_netbankingAccountUserId_fkey" FOREIGN KEY ("netbankingAccountUserId") REFERENCES "NetbankingAccount"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
