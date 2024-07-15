/*
  Warnings:

  - Added the required column `backupvm_cpu_usage` to the `ChecklistPhase2` table without a default value. This is not possible if the table is not empty.
  - Added the required column `backupvm_memory_usage` to the `ChecklistPhase2` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChecklistPhase1" ADD COLUMN     "tvss_comment" TEXT;

-- AlterTable
ALTER TABLE "ChecklistPhase2" ADD COLUMN     "backupvm_cpu_usage" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "backupvm_memory_usage" DOUBLE PRECISION NOT NULL;
