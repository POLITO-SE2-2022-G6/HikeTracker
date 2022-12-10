/*
  Warnings:

  - You are about to drop the column `hikerid` on the `Performance` table. All the data in the column will be lost.
  - You are about to drop the column `hutid` on the `Point` table. All the data in the column will be lost.
  - You are about to drop the column `parkinglotid` on the `Point` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ParkingLot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT,
    "name" TEXT,
    "position" TEXT,
    "capacity" INTEGER,
    "pointid" INTEGER,
    CONSTRAINT "ParkingLot_pointid_fkey" FOREIGN KEY ("pointid") REFERENCES "Point" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ParkingLot" ("capacity", "description", "id", "name", "position") SELECT "capacity", "description", "id", "name", "position" FROM "ParkingLot";
DROP TABLE "ParkingLot";
ALTER TABLE "new_ParkingLot" RENAME TO "ParkingLot";
CREATE UNIQUE INDEX "ParkingLot_pointid_key" ON "ParkingLot"("pointid");
CREATE TABLE "new_Performance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "length" REAL NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "altitude" REAL NOT NULL DEFAULT 0,
    "difficulty" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Performance" ("altitude", "difficulty", "duration", "id", "length") SELECT "altitude", "difficulty", "duration", "id", "length" FROM "Performance";
DROP TABLE "Performance";
ALTER TABLE "new_Performance" RENAME TO "Performance";
CREATE TABLE "new_Point" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "elevation" REAL,
    "city" TEXT,
    "region" TEXT,
    "province" TEXT
);
INSERT INTO "new_Point" ("city", "elevation", "id", "label", "latitude", "longitude", "province", "region") SELECT "city", "elevation", "id", "label", "latitude", "longitude", "province", "region" FROM "Point";
DROP TABLE "Point";
ALTER TABLE "new_Point" RENAME TO "Point";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "performanceid" INTEGER,
    CONSTRAINT "User_performanceid_fkey" FOREIGN KEY ("performanceid") REFERENCES "Performance" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("email", "id", "phoneNumber", "type", "username", "verified") SELECT "email", "id", "phoneNumber", "type", "username", "verified" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");
CREATE UNIQUE INDEX "User_performanceid_key" ON "User"("performanceid");
CREATE TABLE "new_Hut" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "description" TEXT,
    "altitude" REAL,
    "beds" INTEGER,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "pointid" INTEGER,
    CONSTRAINT "Hut_pointid_fkey" FOREIGN KEY ("pointid") REFERENCES "Point" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Hut" ("altitude", "beds", "description", "email", "id", "name", "phone", "website") SELECT "altitude", "beds", "description", "email", "id", "name", "phone", "website" FROM "Hut";
DROP TABLE "Hut";
ALTER TABLE "new_Hut" RENAME TO "Hut";
CREATE UNIQUE INDEX "Hut_pointid_key" ON "Hut"("pointid");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
