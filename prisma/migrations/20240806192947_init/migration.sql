-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PermissionList" ADD VALUE 'GET_USERS';
ALTER TYPE "PermissionList" ADD VALUE 'GET_PERMISSIONS';
ALTER TYPE "PermissionList" ADD VALUE 'GET_ROLES';
ALTER TYPE "PermissionList" ADD VALUE 'GET_ECOLAB_ASSIGNMENTS';
ALTER TYPE "PermissionList" ADD VALUE 'GET_ECOLAB_EMPLOYEES';
ALTER TYPE "PermissionList" ADD VALUE 'GET_ECOLAB_MANAGERS';
