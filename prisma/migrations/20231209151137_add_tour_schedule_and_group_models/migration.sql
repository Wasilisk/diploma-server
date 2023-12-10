/*
  Warnings:

  - You are about to drop the column `paymentInfo` on the `TourInfo` table. All the data in the column will be lost.
  - Added the required column `groupSize` to the `TourInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "tourGroupId" INTEGER;

-- AlterTable
ALTER TABLE "TourInfo" DROP COLUMN "paymentInfo",
DROP COLUMN "groupSize",
ADD COLUMN     "groupSize" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "TourSchedule" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "daysOff" TIMESTAMP(3)[],
    "monday" TEXT[],
    "tuesday" TEXT[],
    "wednesday" TEXT[],
    "thursday" TEXT[],
    "friday" TEXT[],
    "saturday" TEXT[],
    "sunday" TEXT[],
    "tourId" INTEGER NOT NULL,

    CONSTRAINT "TourSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TourGroup" (
    "id" SERIAL NOT NULL,
    "time" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "tourId" INTEGER NOT NULL,

    CONSTRAINT "TourGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TourSchedule_tourId_key" ON "TourSchedule"("tourId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_tourGroupId_fkey" FOREIGN KEY ("tourGroupId") REFERENCES "TourGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourSchedule" ADD CONSTRAINT "TourSchedule_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourGroup" ADD CONSTRAINT "TourGroup_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
