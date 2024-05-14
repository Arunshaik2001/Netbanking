/*
  Warnings:

  - Added the required column `offRampWebhookEndpoint` to the `RegisteredApp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionType` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('OnRamp', 'OffRamp');

-- AlterTable
ALTER TABLE "RegisteredApp" ADD COLUMN     "offRampWebhookEndpoint" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "transactionType" "TransactionType" NOT NULL;
