-- CreateTable
CREATE TABLE "Direction" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "Direction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tour" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "directionId" INTEGER NOT NULL,

    CONSTRAINT "Tour_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tour" ADD CONSTRAINT "Tour_directionId_fkey" FOREIGN KEY ("directionId") REFERENCES "Direction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
