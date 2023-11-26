/*
  Warnings:

  - You are about to drop the column `coverImage` on the `Tour` table. All the data in the column will be lost.
  - Added the required column `content` to the `Tour` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tour" DROP COLUMN "coverImage",
ADD COLUMN     "content" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "TourInfo" (
    "id" SERIAL NOT NULL,
    "meetingPlace" TEXT NOT NULL,
    "endingPlace" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "groupSize" TEXT,
    "groupType" TEXT NOT NULL,
    "paymentInfo" TEXT,
    "tourId" INTEGER NOT NULL,

    CONSTRAINT "TourInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "src" TEXT NOT NULL,
    "tourId" INTEGER NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "tourId" INTEGER NOT NULL,

    CONSTRAINT "TicketType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TourInfo_tourId_key" ON "TourInfo"("tourId");

-- AddForeignKey
ALTER TABLE "TourInfo" ADD CONSTRAINT "TourInfo_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketType" ADD CONSTRAINT "TicketType_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
