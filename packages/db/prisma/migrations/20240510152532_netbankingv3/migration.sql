-- AlterTable
ALTER TABLE "NetbankingAccount" ALTER COLUMN "userId" DROP DEFAULT;
DROP SEQUENCE "NetbankingAccount_userId_seq";
