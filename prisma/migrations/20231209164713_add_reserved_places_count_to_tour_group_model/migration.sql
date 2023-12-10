/*
  Warnings:

  - Made the column `tourGroupId` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_tourGroupId_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "tourGroupId" SET NOT NULL;

-- AlterTable
ALTER TABLE "TourGroup" ADD COLUMN     "reservedPlacesCount" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_tourGroupId_fkey" FOREIGN KEY ("tourGroupId") REFERENCES "TourGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
