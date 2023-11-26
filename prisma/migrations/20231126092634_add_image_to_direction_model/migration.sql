/*
  Warnings:

  - You are about to drop the column `image` on the `Direction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[directionId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `directionId` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Direction" DROP COLUMN "image";

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "directionId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Image_directionId_key" ON "Image"("directionId");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_directionId_fkey" FOREIGN KEY ("directionId") REFERENCES "Direction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
