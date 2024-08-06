-- CreateEnum
CREATE TYPE "EcolabLocation" AS ENUM ('WINSTON_SALEM', 'GREENSBORO');

-- CreateEnum
CREATE TYPE "EcolabTerminationReason" AS ENUM ('TERMINATED_PERFORMANCE', 'TERMINATED_POLICY_VIOLATION', 'TERMINATED_ATTENDANCE', 'TERMINATED_OTHER', 'QUIT_NOT_ELIGIBLE_FOR_REHIRE', 'QUIT_ELIGIBLE_FOR_REHIRE', 'HIRED_PERM', 'PROJECT_COMPLETE', 'ASSIGNMENT_COMPLETE', 'OVER_ONE_YEAR_ASSIGNMENT');

-- CreateEnum
CREATE TYPE "EcolabPosition" AS ENUM ('FORKLIFT_1', 'GENERAL_LABOR_1', 'ASSEMBLER_1', 'WAREHOUSE_1');

-- CreateEnum
CREATE TYPE "EcolabShift" AS ENUM ('FIRST', 'SECOND', 'THIRD');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PermissionList" ADD VALUE 'CREATE_ECOLAB_ASSIGNEMNTS';
ALTER TYPE "PermissionList" ADD VALUE 'UPDATE_ECOLAB_ASSIGNMENTS';
ALTER TYPE "PermissionList" ADD VALUE 'DELETE_ECOLAB_ASSIGNMENTS';
ALTER TYPE "PermissionList" ADD VALUE 'CREATE_ECOLAB_EMPLOYEES';
ALTER TYPE "PermissionList" ADD VALUE 'UPDATE_ECOLAB_EMPLOYEES';
ALTER TYPE "PermissionList" ADD VALUE 'DELETE_ECOLAB_EMPLOYEES';
ALTER TYPE "PermissionList" ADD VALUE 'CREATE_ECOLAB_MANAGERS';
ALTER TYPE "PermissionList" ADD VALUE 'UPDATE_ECOLAB_MANAGERS';
ALTER TYPE "PermissionList" ADD VALUE 'DELETE_ECOLAB_MANAGERS';

-- CreateTable
CREATE TABLE "EcolabEmployee" (
    "bullhornId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EcolabEmployee_pkey" PRIMARY KEY ("bullhornId")
);

-- CreateTable
CREATE TABLE "EcolabAssignment" (
    "beelineRequestId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "dtCompletedDate" TIMESTAMP(3) NOT NULL,
    "backgroundCompletedDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "position" "EcolabPosition" NOT NULL,
    "shift" "EcolabShift" NOT NULL,
    "payRate" DOUBLE PRECISION NOT NULL,
    "employeeId" TEXT NOT NULL,
    "ctsUserId" TEXT NOT NULL,
    "terminationReason" "EcolabTerminationReason" NOT NULL,
    "terminationNotes" TEXT,

    CONSTRAINT "EcolabAssignment_pkey" PRIMARY KEY ("beelineRequestId")
);

-- CreateTable
CREATE TABLE "EcolabManager" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "location" "EcolabLocation" NOT NULL,

    CONSTRAINT "EcolabManager_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EcolabAssignment" ADD CONSTRAINT "EcolabAssignment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "EcolabEmployee"("bullhornId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EcolabAssignment" ADD CONSTRAINT "EcolabAssignment_ctsUserId_fkey" FOREIGN KEY ("ctsUserId") REFERENCES "EcolabManager"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
