-- CreateEnum
CREATE TYPE "SupportMessageStatus" AS ENUM ('ACTIVE', 'RESOLVED');

-- AlterTable
ALTER TABLE "SupportMessage" ADD COLUMN     "status" "SupportMessageStatus" NOT NULL DEFAULT 'ACTIVE';
