-- CreateTable
CREATE TABLE "BankAccount" (
    "accountNumber" INTEGER NOT NULL,
    "balance" INTEGER NOT NULL,
    "userName" TEXT NOT NULL,
    "netbankUserId" INTEGER NOT NULL,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("accountNumber")
);

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_accountNumber_key" ON "BankAccount"("accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_netbankUserId_key" ON "BankAccount"("netbankUserId");

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_netbankUserId_fkey" FOREIGN KEY ("netbankUserId") REFERENCES "NetbankingAccount"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
