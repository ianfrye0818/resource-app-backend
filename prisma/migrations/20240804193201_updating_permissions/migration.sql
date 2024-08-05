/*
  Warnings:

  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PermissionToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PermissionList" AS ENUM ('CREATE_USER', 'UPDATE_USER', 'DELETE_USER', 'CREATE_PERMISSION', 'UPDATE_PERMISSION', 'DELETE_PERMISSION', 'CREATE_ROLE', 'UPDATE_ROLE', 'DELETE_ROLE', 'CREATE_REFRESH_TOKEN', 'UPDATE_REFRESH_TOKEN', 'DELETE_REFRESH_TOKEN');

-- DropForeignKey
ALTER TABLE "_PermissionToUser" DROP CONSTRAINT "_PermissionToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_PermissionToUser" DROP CONSTRAINT "_PermissionToUser_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "permissions" "PermissionList"[];

-- DropTable
DROP TABLE "Permission";

-- DropTable
DROP TABLE "_PermissionToUser";
