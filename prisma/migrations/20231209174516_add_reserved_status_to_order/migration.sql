/*
  Warnings:

  - You are about to drop the column `reservedPlacesCount` on the `TourGroup` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'RESERVED';

-- AlterTable
ALTER TABLE "TourGroup" DROP COLUMN "reservedPlacesCount";
