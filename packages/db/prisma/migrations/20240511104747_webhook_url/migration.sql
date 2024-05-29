/*
  Warnings:

  - Added the required column `webhookUrl` to the `RegisteredApp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RegisteredApp" ADD COLUMN     "webhookUrl" TEXT NOT NULL;
