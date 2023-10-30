/*
  Warnings:

  - A unique constraint covering the columns `[confirmationToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "confirmationToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_confirmationToken_key" ON "User"("confirmationToken");
