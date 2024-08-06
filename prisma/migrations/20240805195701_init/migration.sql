/*
  Warnings:

  - The values [CREATE_REFRESH_TOKEN,UPDATE_REFRESH_TOKEN,DELETE_REFRESH_TOKEN] on the enum `PermissionList` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PermissionList_new" AS ENUM ('CREATE_USER', 'UPDATE_USER', 'DELETE_USER', 'CREATE_PERMISSION', 'UPDATE_PERMISSION', 'DELETE_PERMISSION', 'CREATE_ROLE', 'UPDATE_ROLE', 'DELETE_ROLE', 'GENERATE_RESUME', 'GENERATE_QR_CODE');
ALTER TABLE "User" ALTER COLUMN "permissions" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "permissions" TYPE "PermissionList_new"[] USING ("permissions"::text::"PermissionList_new"[]);
ALTER TYPE "PermissionList" RENAME TO "PermissionList_old";
ALTER TYPE "PermissionList_new" RENAME TO "PermissionList";
DROP TYPE "PermissionList_old";
ALTER TABLE "User" ALTER COLUMN "permissions" SET DEFAULT ARRAY[]::"PermissionList"[];
COMMIT;

-- CreateTable
CREATE TABLE "QR_Codes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "qrCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QR_Codes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QR_Codes" ADD CONSTRAINT "QR_Codes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
