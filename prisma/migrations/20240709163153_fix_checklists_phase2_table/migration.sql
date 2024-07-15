/*
  Warnings:

  - You are about to drop the column `ups3` on the `ChecklistPhase2` table. All the data in the column will be lost.
  - You are about to drop the column `ups3_i1` on the `ChecklistPhase2` table. All the data in the column will be lost.
  - You are about to drop the column `ups3_i2` on the `ChecklistPhase2` table. All the data in the column will be lost.
  - You are about to drop the column `ups3_i3` on the `ChecklistPhase2` table. All the data in the column will be lost.
  - You are about to drop the column `ups3_ibatt` on the `ChecklistPhase2` table. All the data in the column will be lost.
  - You are about to drop the column `ups3_l1` on the `ChecklistPhase2` table. All the data in the column will be lost.
  - You are about to drop the column `ups3_l2` on the `ChecklistPhase2` table. All the data in the column will be lost.
  - You are about to drop the column `ups3_l3` on the `ChecklistPhase2` table. All the data in the column will be lost.
  - You are about to drop the column `ups3_load1` on the `ChecklistPhase2` table. All the data in the column will be lost.
  - You are about to drop the column `ups3_load2` on the `ChecklistPhase2` table. All the data in the column will be lost.
  - You are about to drop the column `ups3_load3` on the `ChecklistPhase2` table. All the data in the column will be lost.
  - You are about to drop the column `ups3_p1` on the `ChecklistPhase2` table. All the data in the column will be lost.
  - You are about to drop the column `ups3_p2` on the `ChecklistPhase2` table. All the data in the column will be lost.
  - You are about to drop the column `ups3_p3` on the `ChecklistPhase2` table. All the data in the column will be lost.
  - You are about to drop the column `ups3_remaining` on the `ChecklistPhase2` table. All the data in the column will be lost.
  - You are about to drop the column `ups3_vbatt` on the `ChecklistPhase2` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChecklistPhase2" DROP COLUMN "ups3",
DROP COLUMN "ups3_i1",
DROP COLUMN "ups3_i2",
DROP COLUMN "ups3_i3",
DROP COLUMN "ups3_ibatt",
DROP COLUMN "ups3_l1",
DROP COLUMN "ups3_l2",
DROP COLUMN "ups3_l3",
DROP COLUMN "ups3_load1",
DROP COLUMN "ups3_load2",
DROP COLUMN "ups3_load3",
DROP COLUMN "ups3_p1",
DROP COLUMN "ups3_p2",
DROP COLUMN "ups3_p3",
DROP COLUMN "ups3_remaining",
DROP COLUMN "ups3_vbatt";
