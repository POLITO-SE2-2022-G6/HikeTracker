/*
  Warnings:

  - You are about to drop the column `pointid` on the `Hut` table. All the data in the column will be lost.
  - You are about to drop the column `pointid` on the `ParkingLot` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Hut" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "description" TEXT,
    "altitude" REAL,
    "beds" INTEGER,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT
);
INSERT INTO "new_Hut" ("altitude", "beds", "description", "email", "id", "name", "phone", "website") SELECT "altitude", "beds", "description", "email", "id", "name", "phone", "website" FROM "Hut";
DROP TABLE "Hut";
ALTER TABLE "new_Hut" RENAME TO "Hut";
CREATE TABLE "new_ParkingLot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT,
    "name" TEXT,
    "position" TEXT,
    "capacity" INTEGER
);
INSERT INTO "new_ParkingLot" ("capacity", "description", "id", "name", "position") SELECT "capacity", "description", "id", "name", "position" FROM "ParkingLot";
DROP TABLE "ParkingLot";
ALTER TABLE "new_ParkingLot" RENAME TO "ParkingLot";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
