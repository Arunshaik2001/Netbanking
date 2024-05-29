/*
  Warnings:

  - You are about to drop the `BankAccount` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `netbankingUserId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BankAccount" DROP CONSTRAINT "BankAccount_netbankUserId_fkey";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "netbankingUserId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "BankAccount";

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_netbankingUserId_fkey" FOREIGN KEY ("netbankingUserId") REFERENCES "NetbankingAccount"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
