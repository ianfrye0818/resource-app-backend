/*
  Warnings:

  - The `roles` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RoleList" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "roles",
ADD COLUMN     "roles" "RoleList"[] DEFAULT ARRAY['USER']::"RoleList"[];

-- DropEnum
DROP TYPE "Role";
