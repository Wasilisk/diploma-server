/*
  Warnings:

  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `image` to the `Direction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_directionId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_tourId_fkey";

-- AlterTable
ALTER TABLE "Direction" ADD COLUMN     "image" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tour" ADD COLUMN     "gallery" TEXT[];

-- DropTable
DROP TABLE "Image";
