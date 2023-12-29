-- CreateEnum
CREATE TYPE "GuidePermissionRequestStatus" AS ENUM ('PENDING', 'CANCELED', 'ACCEPTED');

-- CreateTable
CREATE TABLE "GuidePermissionRequest" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "status" "GuidePermissionRequestStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "GuidePermissionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GuidePermissionRequest_email_key" ON "GuidePermissionRequest"("email");

-- CreateIndex
CREATE UNIQUE INDEX "GuidePermissionRequest_phone_key" ON "GuidePermissionRequest"("phone");
