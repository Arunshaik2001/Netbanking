/*
  Warnings:

  - You are about to drop the column `netbankingAccountUserId` on the `Transaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_netbankingAccountUserId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "netbankingAccountUserId";
