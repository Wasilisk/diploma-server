-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'GUIDE', 'USER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';
