/*
  Warnings:

  - The values [CANCELED] on the enum `GuidePermissionRequestStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GuidePermissionRequestStatus_new" AS ENUM ('PENDING', 'DECLINED', 'ACCEPTED');
ALTER TABLE "GuidePermissionRequest" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "GuidePermissionRequest" ALTER COLUMN "status" TYPE "GuidePermissionRequestStatus_new" USING ("status"::text::"GuidePermissionRequestStatus_new");
ALTER TYPE "GuidePermissionRequestStatus" RENAME TO "GuidePermissionRequestStatus_old";
ALTER TYPE "GuidePermissionRequestStatus_new" RENAME TO "GuidePermissionRequestStatus";
DROP TYPE "GuidePermissionRequestStatus_old";
ALTER TABLE "GuidePermissionRequest" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
