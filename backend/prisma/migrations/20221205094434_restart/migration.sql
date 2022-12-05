-- CreateTable
CREATE TABLE "Hut" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT,
    "pointid" INTEGER
);

-- CreateTable
CREATE TABLE "ParkingLot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT,
    "pointid" INTEGER
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
    "province" TEXT,
    "hutid" INTEGER,
    "parkinglotid" INTEGER,
    CONSTRAINT "Point_hutid_fkey" FOREIGN KEY ("hutid") REFERENCES "Hut" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Point_parkinglotid_fkey" FOREIGN KEY ("parkinglotid") REFERENCES "ParkingLot" ("id") ON DELETE SET NULL ON UPDATE CASCADE
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
    "localguideid" INTEGER,
    CONSTRAINT "Hike_startpointid_fkey" FOREIGN KEY ("startpointid") REFERENCES "Point" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Hike_endpointid_fkey" FOREIGN KEY ("endpointid") REFERENCES "Point" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Hike_localguideid_fkey" FOREIGN KEY ("localguideid") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Performance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "duration" INTEGER NOT NULL,
    "altitude" REAL NOT NULL,
    "userid" INTEGER NOT NULL,
    CONSTRAINT "Performance_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL
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
CREATE UNIQUE INDEX "Point_hutid_key" ON "Point"("hutid");

-- CreateIndex
CREATE UNIQUE INDEX "Point_parkinglotid_key" ON "Point"("parkinglotid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "_hikes_AB_unique" ON "_hikes"("A", "B");

-- CreateIndex
CREATE INDEX "_hikes_B_index" ON "_hikes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_huts_AB_unique" ON "_huts"("A", "B");

-- CreateIndex
CREATE INDEX "_huts_B_index" ON "_huts"("B");
