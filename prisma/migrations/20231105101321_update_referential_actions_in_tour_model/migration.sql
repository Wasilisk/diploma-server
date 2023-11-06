-- DropForeignKey
ALTER TABLE "Tour" DROP CONSTRAINT "Tour_directionId_fkey";

-- AddForeignKey
ALTER TABLE "Tour" ADD CONSTRAINT "Tour_directionId_fkey" FOREIGN KEY ("directionId") REFERENCES "Direction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
