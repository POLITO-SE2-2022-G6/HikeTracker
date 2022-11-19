/*
  Warnings:

  - You are about to drop the column `Description` on the `Point` table. All the data in the column will be lost.
  - You are about to drop the column `Type` on the `Point` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Hut" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Description" TEXT,
    "PointId" INTEGER
);

-- CreateTable
CREATE TABLE "ParkingLot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Description" TEXT,
    "PointId" INTEGER
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Point" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Label" TEXT,
    "Latitude" REAL,
    "Longitude" REAL,
    "Elevation" REAL,
    "City" TEXT,
    "Region" TEXT,
    "Province" TEXT,
    "HutId" INTEGER,
    "ParkingLotId" INTEGER,
    CONSTRAINT "Point_HutId_fkey" FOREIGN KEY ("HutId") REFERENCES "Hut" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Point_ParkingLotId_fkey" FOREIGN KEY ("ParkingLotId") REFERENCES "ParkingLot" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Point" ("City", "Elevation", "Label", "Latitude", "Longitude", "Province", "Region", "id") SELECT "City", "Elevation", "Label", "Latitude", "Longitude", "Province", "Region", "id" FROM "Point";
DROP TABLE "Point";
ALTER TABLE "new_Point" RENAME TO "Point";
CREATE UNIQUE INDEX "Point_HutId_key" ON "Point"("HutId");
CREATE UNIQUE INDEX "Point_ParkingLotId_key" ON "Point"("ParkingLotId");
CREATE TABLE "new_Hike" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Title" TEXT NOT NULL,
    "Length" REAL NOT NULL,
    "Expected_time" INTEGER NOT NULL,
    "Ascent" REAL NOT NULL,
    "Difficulty" INTEGER NOT NULL,
    "StartPointId" INTEGER,
    "EndPointId" INTEGER,
    "Description" TEXT,
    "GpsTrack" TEXT,
    "LocalGuideId" INTEGER,
    CONSTRAINT "Hike_StartPointId_fkey" FOREIGN KEY ("StartPointId") REFERENCES "Point" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Hike_EndPointId_fkey" FOREIGN KEY ("EndPointId") REFERENCES "Point" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Hike_LocalGuideId_fkey" FOREIGN KEY ("LocalGuideId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Hike" ("Ascent", "Description", "Difficulty", "EndPointId", "Expected_time", "GpsTrack", "Length", "StartPointId", "Title", "id") SELECT "Ascent", "Description", "Difficulty", "EndPointId", "Expected_time", "GpsTrack", "Length", "StartPointId", "Title", "id" FROM "Hike";
DROP TABLE "Hike";
ALTER TABLE "new_Hike" RENAME TO "Hike";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
