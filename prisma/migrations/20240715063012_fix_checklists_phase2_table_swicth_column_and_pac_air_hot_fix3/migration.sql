/*
  Warnings:

  - Made the column `ats_meter_unit` on table `ChecklistGenerator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `around_check` on table `ChecklistGenerator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `batt_check` on table `ChecklistGenerator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `batt_connection_check` on table `ChecklistGenerator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `volt_batt_check` on table `ChecklistGenerator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fuel_value_check` on table `ChecklistGenerator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fuel_leak_check` on table `ChecklistGenerator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `oil_value_check` on table `ChecklistGenerator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `oil_leak_check` on table `ChecklistGenerator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cooler_check` on table `ChecklistGenerator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `filter_cooler_check` on table `ChecklistGenerator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fan_cooler_check` on table `ChecklistGenerator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cooler_leak_check` on table `ChecklistGenerator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `airduct_check` on table `ChecklistGenerator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `airfilter_condition_check` on table `ChecklistGenerator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `electic_junction_check` on table `ChecklistGenerator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `electic_insulation_check` on table `ChecklistGenerator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ground_check` on table `ChecklistGenerator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `electic_panel_check` on table `ChecklistGenerator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `time_start` on table `ChecklistGenerator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `engine_check` on table `ChecklistGenerator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `afterstart_junction_check` on table `ChecklistGenerator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `afterstart_insulation_check` on table `ChecklistGenerator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `l1` on table `ChecklistGenerator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `l2` on table `ChecklistGenerator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `l3` on table `ChecklistGenerator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `i1` on table `ChecklistGenerator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `i2` on table `ChecklistGenerator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `i3` on table `ChecklistGenerator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `frequency` on table `ChecklistGenerator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rpm` on table `ChecklistGenerator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `voltbatt` on table `ChecklistGenerator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `enginetemp` on table `ChecklistGenerator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cooldown` on table `ChecklistGenerator` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `backupvm_cpu_usage` to the `ChecklistPhase1` table without a default value. This is not possible if the table is not empty.
  - Added the required column `backupvm_memory_usage` to the `ChecklistPhase1` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChecklistGenerator" ALTER COLUMN "ats_meter_unit" SET NOT NULL,
ALTER COLUMN "around_check" SET NOT NULL,
ALTER COLUMN "batt_check" SET NOT NULL,
ALTER COLUMN "batt_connection_check" SET NOT NULL,
ALTER COLUMN "volt_batt_check" SET NOT NULL,
ALTER COLUMN "fuel_value_check" SET NOT NULL,
ALTER COLUMN "fuel_leak_check" SET NOT NULL,
ALTER COLUMN "oil_value_check" SET NOT NULL,
ALTER COLUMN "oil_leak_check" SET NOT NULL,
ALTER COLUMN "cooler_check" SET NOT NULL,
ALTER COLUMN "filter_cooler_check" SET NOT NULL,
ALTER COLUMN "fan_cooler_check" SET NOT NULL,
ALTER COLUMN "cooler_leak_check" SET NOT NULL,
ALTER COLUMN "airduct_check" SET NOT NULL,
ALTER COLUMN "airfilter_condition_check" SET NOT NULL,
ALTER COLUMN "electic_junction_check" SET NOT NULL,
ALTER COLUMN "electic_insulation_check" SET NOT NULL,
ALTER COLUMN "ground_check" SET NOT NULL,
ALTER COLUMN "electic_panel_check" SET NOT NULL,
ALTER COLUMN "time_start" SET NOT NULL,
ALTER COLUMN "time_start" SET DATA TYPE TEXT,
ALTER COLUMN "engine_check" SET NOT NULL,
ALTER COLUMN "afterstart_junction_check" SET NOT NULL,
ALTER COLUMN "afterstart_insulation_check" SET NOT NULL,
ALTER COLUMN "l1" SET NOT NULL,
ALTER COLUMN "l2" SET NOT NULL,
ALTER COLUMN "l3" SET NOT NULL,
ALTER COLUMN "i1" SET NOT NULL,
ALTER COLUMN "i2" SET NOT NULL,
ALTER COLUMN "i3" SET NOT NULL,
ALTER COLUMN "frequency" SET NOT NULL,
ALTER COLUMN "rpm" SET NOT NULL,
ALTER COLUMN "voltbatt" SET NOT NULL,
ALTER COLUMN "enginetemp" SET NOT NULL,
ALTER COLUMN "cooldown" SET NOT NULL;

-- AlterTable
ALTER TABLE "ChecklistPhase1" ADD COLUMN     "backupvm_cpu_usage" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "backupvm_memory_usage" DOUBLE PRECISION NOT NULL;
