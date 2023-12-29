/*
  Warnings:

  - Added the required column `description` to the `GuidePermissionRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "GuidePermissionRequest_phone_key";

-- AlterTable
ALTER TABLE "GuidePermissionRequest" ADD COLUMN     "description" TEXT NOT NULL;
