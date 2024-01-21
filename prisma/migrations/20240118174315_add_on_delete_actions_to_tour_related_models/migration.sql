-- DropForeignKey
ALTER TABLE "TicketType" DROP CONSTRAINT "TicketType_tourId_fkey";

-- DropForeignKey
ALTER TABLE "TourGroup" DROP CONSTRAINT "TourGroup_tourId_fkey";

-- DropForeignKey
ALTER TABLE "TourInfo" DROP CONSTRAINT "TourInfo_tourId_fkey";

-- DropForeignKey
ALTER TABLE "TourSchedule" DROP CONSTRAINT "TourSchedule_tourId_fkey";

-- AddForeignKey
ALTER TABLE "TourInfo" ADD CONSTRAINT "TourInfo_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketType" ADD CONSTRAINT "TicketType_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourSchedule" ADD CONSTRAINT "TourSchedule_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourGroup" ADD CONSTRAINT "TourGroup_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;
