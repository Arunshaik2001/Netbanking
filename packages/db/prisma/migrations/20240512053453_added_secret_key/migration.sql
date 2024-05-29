/*
  Warnings:

  - Added the required column `bankSecretKey` to the `RegisteredApp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RegisteredApp" ADD COLUMN     "bankSecretKey" TEXT NOT NULL;
