/*
  Warnings:

  - You are about to drop the column `team_name` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfSign` on the `Members` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[comp_name_eng]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[comp_name_thai]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[card_id]` on the table `Members` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[team_name]` on the table `Teams` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `comp_name_eng` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `comp_name_thai` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `card_id` to the `Members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_of_Sign` to the `Members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "team_name",
ADD COLUMN     "comp_name_eng" TEXT NOT NULL,
ADD COLUMN     "comp_name_thai" TEXT NOT NULL,
ADD COLUMN     "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Members" DROP COLUMN "dateOfSign",
ADD COLUMN     "card_id" TEXT NOT NULL,
ADD COLUMN     "date_of_Sign" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Company_comp_name_eng_key" ON "Company"("comp_name_eng");

-- CreateIndex
CREATE UNIQUE INDEX "Company_comp_name_thai_key" ON "Company"("comp_name_thai");

-- CreateIndex
CREATE UNIQUE INDEX "Members_card_id_key" ON "Members"("card_id");

-- CreateIndex
CREATE UNIQUE INDEX "Teams_team_name_key" ON "Teams"("team_name");
