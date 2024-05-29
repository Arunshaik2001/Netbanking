/*
  Warnings:

  - The primary key for the `RegisteredApp` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `bankName` to the `RegisteredApp` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "RegisteredApp_paymentApp_key";

-- AlterTable
ALTER TABLE "RegisteredApp" DROP CONSTRAINT "RegisteredApp_pkey",
ADD COLUMN     "bankName" "BankName" NOT NULL,
ADD CONSTRAINT "RegisteredApp_pkey" PRIMARY KEY ("paymentApp", "bankName");
