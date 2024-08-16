/*
  Warnings:

  - Added the required column `educationVerified` to the `EcolabAssignments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EcolabAssignments" ADD COLUMN     "educationVerified" BOOLEAN NOT NULL;
