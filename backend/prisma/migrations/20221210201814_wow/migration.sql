-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Point" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "elevation" REAL,
    "city" TEXT,
    "region" TEXT,
    "province" TEXT,
    "hutid" INTEGER,
    "parkinglotid" INTEGER,
    CONSTRAINT "Point_parkinglotid_fkey" FOREIGN KEY ("parkinglotid") REFERENCES "ParkingLot" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Point_hutid_fkey" FOREIGN KEY ("hutid") REFERENCES "Hut" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Point" ("city", "elevation", "hutid", "id", "label", "latitude", "longitude", "parkinglotid", "province", "region") SELECT "city", "elevation", "hutid", "id", "label", "latitude", "longitude", "parkinglotid", "province", "region" FROM "Point";
DROP TABLE "Point";
ALTER TABLE "new_Point" RENAME TO "Point";
CREATE UNIQUE INDEX "Point_hutid_key" ON "Point"("hutid");
CREATE UNIQUE INDEX "Point_parkinglotid_key" ON "Point"("parkinglotid");
CREATE TABLE "new_Performance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "length" REAL NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "altitude" REAL NOT NULL DEFAULT 0,
    "difficulty" INTEGER NOT NULL DEFAULT 0,
    "hikerid" INTEGER NOT NULL,
    CONSTRAINT "Performance_hikerid_fkey" FOREIGN KEY ("hikerid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Performance" ("altitude", "difficulty", "duration", "hikerid", "id", "length") SELECT "altitude", "difficulty", "duration", "hikerid", "id", "length" FROM "Performance";
DROP TABLE "Performance";
ALTER TABLE "new_Performance" RENAME TO "Performance";
CREATE UNIQUE INDEX "Performance_hikerid_key" ON "Performance"("hikerid");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
