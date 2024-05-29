-- CreateEnum
CREATE TYPE "PaymentApp" AS ENUM ('PAYMNT', 'PAYTM', 'PHONEPE', 'QUCKPAY', 'MOBIQWIK', 'ZEBPAY', 'XYZPAY');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "paymentApp" "PaymentApp";

-- CreateTable
CREATE TABLE "RegisteredApp" (
    "paymentApp" "PaymentApp" NOT NULL,
    "secretKey" TEXT NOT NULL,

    CONSTRAINT "RegisteredApp_pkey" PRIMARY KEY ("paymentApp")
);

-- CreateIndex
CREATE UNIQUE INDEX "RegisteredApp_paymentApp_key" ON "RegisteredApp"("paymentApp");
