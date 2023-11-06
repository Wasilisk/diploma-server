/*
  Warnings:

  - Added the required column `coverImage` to the `Tour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Tour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Tour` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tour" ADD COLUMN     "coverImage" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL;
