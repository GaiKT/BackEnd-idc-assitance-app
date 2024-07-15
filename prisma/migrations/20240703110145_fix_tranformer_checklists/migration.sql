/*
  Warnings:

  - You are about to drop the column `status_capbank` on the `checklistTransformer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "checklistTransformer" DROP COLUMN "status_capbank",
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;
