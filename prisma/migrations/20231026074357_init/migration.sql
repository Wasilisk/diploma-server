/*
  Warnings:

  - You are about to drop the column `isPhoneVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `twoFA` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Otp` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RateLimit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Otp" DROP CONSTRAINT "Otp_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isPhoneVerified",
DROP COLUMN "twoFA";

-- DropTable
DROP TABLE "Otp";

-- DropTable
DROP TABLE "RateLimit";

-- DropEnum
DROP TYPE "UseCase";
