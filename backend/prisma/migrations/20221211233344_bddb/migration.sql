/*
  Warnings:

  - You are about to drop the column `performanceid` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Hike" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "length" REAL NOT NULL,
    "expected_time" INTEGER NOT NULL,
    "ascent" REAL NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "description" TEXT,
    "startpointid" INTEGER,
    "endpointid" INTEGER,
    "gpstrack" TEXT,
    "conditions" TEXT NOT NULL DEFAULT 'open',
    "conddescription" TEXT,
    "localguideid" INTEGER,
    CONSTRAINT "Hike_localguideid_fkey" FOREIGN KEY ("localguideid") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Hike_endpointid_fkey" FOREIGN KEY ("endpointid") REFERENCES "Point" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Hike_startpointid_fkey" FOREIGN KEY ("startpointid") REFERENCES "Point" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Hike" ("ascent", "description", "difficulty", "endpointid", "expected_time", "gpstrack", "id", "length", "localguideid", "startpointid", "title") SELECT "ascent", "description", "difficulty", "endpointid", "expected_time", "gpstrack", "id", "length", "localguideid", "startpointid", "title" FROM "Hike";
DROP TABLE "Hike";
ALTER TABLE "new_Hike" RENAME TO "Hike";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "hutid" INTEGER,
    CONSTRAINT "User_hutid_fkey" FOREIGN KEY ("hutid") REFERENCES "Hut" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("email", "id", "phoneNumber", "type", "username", "verified") SELECT "email", "id", "phoneNumber", "type", "username", "verified" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");
CREATE UNIQUE INDEX "User_hutid_key" ON "User"("hutid");
CREATE TABLE "new_Performance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "length" REAL NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "altitude" REAL NOT NULL DEFAULT 0,
    "difficulty" INTEGER NOT NULL DEFAULT 0,
    "hikerid" INTEGER,
    CONSTRAINT "Performance_hikerid_fkey" FOREIGN KEY ("hikerid") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Performance" ("altitude", "difficulty", "duration", "hikerid", "id", "length") SELECT "altitude", "difficulty", "duration", "hikerid", "id", "length" FROM "Performance";
DROP TABLE "Performance";
ALTER TABLE "new_Performance" RENAME TO "Performance";
CREATE UNIQUE INDEX "Performance_hikerid_key" ON "Performance"("hikerid");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
