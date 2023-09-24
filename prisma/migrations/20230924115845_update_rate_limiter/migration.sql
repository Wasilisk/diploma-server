/*
  Warnings:

  - You are about to drop the column `userId` on the `RateLimit` table. All the data in the column will be lost.
  - Added the required column `userIp` to the `RateLimit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RateLimit" DROP CONSTRAINT "RateLimit_userId_fkey";

-- AlterTable
ALTER TABLE "RateLimit" DROP COLUMN "userId",
ADD COLUMN     "userIp" TEXT NOT NULL;
