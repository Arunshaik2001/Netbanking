/*
  Warnings:

  - A unique constraint covering the columns `[netbankUserId]` on the table `BankAccount` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `netbankUserId` to the `BankAccount` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BankAccount" DROP CONSTRAINT "BankAccount_accountNumber_fkey";

-- AlterTable
ALTER TABLE "BankAccount" ADD COLUMN     "netbankUserId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_netbankUserId_key" ON "BankAccount"("netbankUserId");

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_netbankUserId_fkey" FOREIGN KEY ("netbankUserId") REFERENCES "NetbankingAccount"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
