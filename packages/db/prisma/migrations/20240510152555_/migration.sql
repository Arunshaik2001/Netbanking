/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `NetbankingAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "NetbankingAccount_userId_key" ON "NetbankingAccount"("userId");
