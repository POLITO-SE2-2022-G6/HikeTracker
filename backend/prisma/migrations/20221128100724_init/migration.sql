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

-- CreateTable
CREATE TABLE "Point" (
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

-- CreateTable
CREATE TABLE "Hike" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Title" TEXT NOT NULL,
    "Length" REAL NOT NULL,
    "Expected_time" INTEGER NOT NULL,
    "Ascent" REAL NOT NULL,
    "Difficulty" INTEGER NOT NULL,
    "Description" TEXT,
    "StartPointId" INTEGER,
    "EndPointId" INTEGER,
    "GpsTrack" TEXT,
    "LocalGuideId" INTEGER,
    CONSTRAINT "Hike_StartPointId_fkey" FOREIGN KEY ("StartPointId") REFERENCES "Point" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Hike_EndPointId_fkey" FOREIGN KEY ("EndPointId") REFERENCES "Point" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Hike_LocalGuideId_fkey" FOREIGN KEY ("LocalGuideId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Performance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "duration" INTEGER NOT NULL,
    "altitude" REAL NOT NULL,
    "UserId" INTEGER NOT NULL,
    CONSTRAINT "Performance_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
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

-- CreateIndex
CREATE UNIQUE INDEX "Point_HutId_key" ON "Point"("HutId");

-- CreateIndex
CREATE UNIQUE INDEX "Point_ParkingLotId_key" ON "Point"("ParkingLotId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "_hikes_AB_unique" ON "_hikes"("A", "B");

-- CreateIndex
CREATE INDEX "_hikes_B_index" ON "_hikes"("B");
