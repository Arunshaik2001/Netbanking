/*
  Warnings:

  - You are about to drop the column `netbankUserId` on the `BankAccount` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bankAccountId]` on the table `NetbankingAccount` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bankAccountId` to the `NetbankingAccount` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BankAccount" DROP CONSTRAINT "BankAccount_netbankUserId_fkey";

-- DropIndex
DROP INDEX "BankAccount_netbankUserId_key";

-- AlterTable
ALTER TABLE "BankAccount" DROP COLUMN "netbankUserId";

-- AlterTable
ALTER TABLE "NetbankingAccount" ADD COLUMN     "bankAccountId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "NetbankingAccount_bankAccountId_key" ON "NetbankingAccount"("bankAccountId");

-- AddForeignKey
ALTER TABLE "NetbankingAccount" ADD CONSTRAINT "NetbankingAccount_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount"("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
