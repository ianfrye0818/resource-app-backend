/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `EcolabEmployeeAssignments` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `EcolabManager` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "EcolabEmployeeAssignments" DROP CONSTRAINT "EcolabEmployeeAssignments_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "EcolabEmployeeAssignments" DROP CONSTRAINT "EcolabEmployeeAssignments_employeeId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "roles" "Role"[] DEFAULT ARRAY['USER']::"Role"[];

-- DropTable
DROP TABLE "EcolabEmployeeAssignments";

-- CreateIndex
CREATE UNIQUE INDEX "EcolabManager_email_key" ON "EcolabManager"("email");
