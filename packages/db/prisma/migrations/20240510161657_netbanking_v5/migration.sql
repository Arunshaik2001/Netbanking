/*
  Warnings:

  - You are about to drop the column `linkedBankAccountNumber` on the `NetbankingAccount` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "NetbankingAccount_linkedBankAccountNumber_key";

-- AlterTable
ALTER TABLE "NetbankingAccount" DROP COLUMN "linkedBankAccountNumber";
