/*
  Warnings:

  - A unique constraint covering the columns `[accountNumber]` on the table `BankAccount` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[linkedBankAccountNumber]` on the table `NetbankingAccount` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `linkedBankAccountNumber` to the `NetbankingAccount` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BankAccount" DROP CONSTRAINT "BankAccount_accountNumber_fkey";

-- AlterTable
ALTER TABLE "NetbankingAccount" ADD COLUMN     "linkedBankAccountNumber" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_accountNumber_key" ON "BankAccount"("accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "NetbankingAccount_linkedBankAccountNumber_key" ON "NetbankingAccount"("linkedBankAccountNumber");

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_accountNumber_fkey" FOREIGN KEY ("accountNumber") REFERENCES "NetbankingAccount"("linkedBankAccountNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
