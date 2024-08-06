/*
  Warnings:

  - You are about to drop the `EcolabAssignment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EcolabAssignment" DROP CONSTRAINT "EcolabAssignment_ctsUserId_fkey";

-- DropForeignKey
ALTER TABLE "EcolabAssignment" DROP CONSTRAINT "EcolabAssignment_employeeId_fkey";

-- DropTable
DROP TABLE "EcolabAssignment";

-- CreateTable
CREATE TABLE "EcolabAssignments" (
    "beelineRequestId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "dtCompletedDate" TIMESTAMP(3) NOT NULL,
    "backgroundCompletedDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "position" "EcolabPosition" NOT NULL,
    "shift" "EcolabShift" NOT NULL,
    "payRate" DOUBLE PRECISION NOT NULL,
    "ctsUserId" TEXT NOT NULL,
    "terminationReason" "EcolabTerminationReason" NOT NULL,
    "terminationNotes" TEXT,

    CONSTRAINT "EcolabAssignments_pkey" PRIMARY KEY ("beelineRequestId")
);

-- CreateTable
CREATE TABLE "EcolabEmployeeAssignments" (
    "employeeId" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,

    CONSTRAINT "EcolabEmployeeAssignments_pkey" PRIMARY KEY ("employeeId","assignmentId")
);

-- CreateTable
CREATE TABLE "_EmployeeAssignments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EmployeeAssignments_AB_unique" ON "_EmployeeAssignments"("A", "B");

-- CreateIndex
CREATE INDEX "_EmployeeAssignments_B_index" ON "_EmployeeAssignments"("B");

-- AddForeignKey
ALTER TABLE "EcolabAssignments" ADD CONSTRAINT "EcolabAssignments_ctsUserId_fkey" FOREIGN KEY ("ctsUserId") REFERENCES "EcolabManager"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EcolabEmployeeAssignments" ADD CONSTRAINT "EcolabEmployeeAssignments_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "EcolabEmployee"("bullhornId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EcolabEmployeeAssignments" ADD CONSTRAINT "EcolabEmployeeAssignments_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "EcolabAssignments"("beelineRequestId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeAssignments" ADD CONSTRAINT "_EmployeeAssignments_A_fkey" FOREIGN KEY ("A") REFERENCES "EcolabAssignments"("beelineRequestId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeAssignments" ADD CONSTRAINT "_EmployeeAssignments_B_fkey" FOREIGN KEY ("B") REFERENCES "EcolabEmployee"("bullhornId") ON DELETE CASCADE ON UPDATE CASCADE;
