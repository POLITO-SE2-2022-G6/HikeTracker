/*
  Warnings:

  - A unique constraint covering the columns `[hikerid]` on the table `Performance` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Performance" ADD COLUMN "hikerid" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Performance_hikerid_key" ON "Performance"("hikerid");
