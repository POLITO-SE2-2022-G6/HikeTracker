-- CreateTable
CREATE TABLE "Hut" (
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

-- CreateTable
CREATE TABLE "ParkingLot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT,
    "name" TEXT,
    "position" TEXT,
    "capacity" INTEGER,
    "pointid" INTEGER,
    CONSTRAINT "ParkingLot_pointid_fkey" FOREIGN KEY ("pointid") REFERENCES "Point" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Point" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "elevation" REAL,
    "city" TEXT,
    "region" TEXT,
    "province" TEXT
);

-- CreateTable
CREATE TABLE "Hike" (
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

-- CreateTable
CREATE TABLE "Performance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "length" REAL NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "altitude" REAL NOT NULL DEFAULT 0,
    "difficulty" INTEGER NOT NULL DEFAULT 0,
    "hikerid" INTEGER,
    CONSTRAINT "Performance_hikerid_fkey" FOREIGN KEY ("hikerid") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "hutid" INTEGER,
    CONSTRAINT "User_hutid_fkey" FOREIGN KEY ("hutid") REFERENCES "Hut" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserHikes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "hike_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ongoing',
    "refPoint_id" INTEGER,
    CONSTRAINT "UserHikes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserHikes_hike_id_fkey" FOREIGN KEY ("hike_id") REFERENCES "Hike" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserHikes_refPoint_id_fkey" FOREIGN KEY ("refPoint_id") REFERENCES "Point" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_hikes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_hikes_A_fkey" FOREIGN KEY ("A") REFERENCES "Hike" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_hikes_B_fkey" FOREIGN KEY ("B") REFERENCES "Point" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_huts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_huts_A_fkey" FOREIGN KEY ("A") REFERENCES "Hike" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_huts_B_fkey" FOREIGN KEY ("B") REFERENCES "Hut" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Hut_pointid_key" ON "Hut"("pointid");

-- CreateIndex
CREATE UNIQUE INDEX "ParkingLot_pointid_key" ON "ParkingLot"("pointid");

-- CreateIndex
CREATE UNIQUE INDEX "Performance_hikerid_key" ON "Performance"("hikerid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_hutid_key" ON "User"("hutid");

-- CreateIndex
CREATE UNIQUE INDEX "_hikes_AB_unique" ON "_hikes"("A", "B");

-- CreateIndex
CREATE INDEX "_hikes_B_index" ON "_hikes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_huts_AB_unique" ON "_huts"("A", "B");

-- CreateIndex
CREATE INDEX "_huts_B_index" ON "_huts"("B");
