/*
  Warnings:

  - You are about to drop the column `pac7` on the `ChecklistPhase2` table. All the data in the column will be lost.
  - You are about to drop the column `pac8` on the `ChecklistPhase2` table. All the data in the column will be lost.
  - You are about to drop the column `return_pac7_hum` on the `ChecklistPhase2` table. All the data in the column will be lost.
  - You are about to drop the column `return_pac7_temp` on the `ChecklistPhase2` table. All the data in the column will be lost.
  - You are about to drop the column `return_pac8_hum` on the `ChecklistPhase2` table. All the data in the column will be lost.
  - You are about to drop the column `return_pac8_temp` on the `ChecklistPhase2` table. All the data in the column will be lost.
  - You are about to drop the column `setpoint_pac7_hum` on the `ChecklistPhase2` table. All the data in the column will be lost.
  - You are about to drop the column `setpoint_pac7_temp` on the `ChecklistPhase2` table. All the data in the column will be lost.
  - You are about to drop the column `setpoint_pac8_hum` on the `ChecklistPhase2` table. All the data in the column will be lost.
  - You are about to drop the column `setpoint_pac8_temp` on the `ChecklistPhase2` table. All the data in the column will be lost.
  - You are about to drop the column `sw1_jd992a_check` on the `ChecklistPhase2` table. All the data in the column will be lost.
  - You are about to drop the column `sw2_jd992a_check` on the `ChecklistPhase2` table. All the data in the column will be lost.
  - You are about to drop the column `sw3_jd9663a_check` on the `ChecklistPhase2` table. All the data in the column will be lost.
  - You are about to drop the column `sw4_jd9663a_check` on the `ChecklistPhase2` table. All the data in the column will be lost.
  - Added the required column `sw1_jd96634_check` to the `ChecklistPhase2` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sw2_jd96634_check` to the `ChecklistPhase2` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sw3_1616e_check` to the `ChecklistPhase2` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sw4_1616e_check` to the `ChecklistPhase2` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChecklistPhase2" DROP COLUMN "pac7",
DROP COLUMN "pac8",
DROP COLUMN "return_pac7_hum",
DROP COLUMN "return_pac7_temp",
DROP COLUMN "return_pac8_hum",
DROP COLUMN "return_pac8_temp",
DROP COLUMN "setpoint_pac7_hum",
DROP COLUMN "setpoint_pac7_temp",
DROP COLUMN "setpoint_pac8_hum",
DROP COLUMN "setpoint_pac8_temp",
DROP COLUMN "sw1_jd992a_check",
DROP COLUMN "sw2_jd992a_check",
DROP COLUMN "sw3_jd9663a_check",
DROP COLUMN "sw4_jd9663a_check",
ADD COLUMN     "sw1_jd96634_check" BOOLEAN NOT NULL,
ADD COLUMN     "sw2_jd96634_check" BOOLEAN NOT NULL,
ADD COLUMN     "sw3_1616e_check" BOOLEAN NOT NULL,
ADD COLUMN     "sw4_1616e_check" BOOLEAN NOT NULL;
