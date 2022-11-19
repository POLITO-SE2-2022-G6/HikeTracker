/*
  Warnings:

  - You are about to drop the `_HikeToPoint` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `Description` on the `Hike` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "_HikeToPoint_B_index";

-- DropIndex
DROP INDEX "_HikeToPoint_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_HikeToPoint";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_hikes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_hikes_A_fkey" FOREIGN KEY ("A") REFERENCES "Hike" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_hikes_B_fkey" FOREIGN KEY ("B") REFERENCES "Point" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Hike" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Title" TEXT NOT NULL,
    "Length" REAL NOT NULL,
    "Expected_time" INTEGER NOT NULL,
    "Ascent" REAL NOT NULL,
    "Difficulty" INTEGER NOT NULL,
    "StartPointId" INTEGER,
    "EndPointId" INTEGER,
    "GpsTrack" TEXT,
    "LocalGuideId" INTEGER,
    CONSTRAINT "Hike_StartPointId_fkey" FOREIGN KEY ("StartPointId") REFERENCES "Point" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Hike_EndPointId_fkey" FOREIGN KEY ("EndPointId") REFERENCES "Point" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Hike_LocalGuideId_fkey" FOREIGN KEY ("LocalGuideId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Hike" ("Ascent", "Difficulty", "EndPointId", "Expected_time", "GpsTrack", "Length", "LocalGuideId", "StartPointId", "Title", "id") SELECT "Ascent", "Difficulty", "EndPointId", "Expected_time", "GpsTrack", "Length", "LocalGuideId", "StartPointId", "Title", "id" FROM "Hike";
DROP TABLE "Hike";
ALTER TABLE "new_Hike" RENAME TO "Hike";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_hikes_AB_unique" ON "_hikes"("A", "B");

-- CreateIndex
CREATE INDEX "_hikes_B_index" ON "_hikes"("B");
