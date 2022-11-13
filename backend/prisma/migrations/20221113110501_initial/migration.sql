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
    "Type" TEXT,
    "Description" TEXT
);

-- CreateTable
CREATE TABLE "Hike" (
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
    CONSTRAINT "Hike_StartPointId_fkey" FOREIGN KEY ("StartPointId") REFERENCES "Point" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Hike_EndPointId_fkey" FOREIGN KEY ("EndPointId") REFERENCES "Point" ("id") ON DELETE SET NULL ON UPDATE CASCADE
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
CREATE TABLE "_HikeToPoint" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_HikeToPoint_A_fkey" FOREIGN KEY ("A") REFERENCES "Hike" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_HikeToPoint_B_fkey" FOREIGN KEY ("B") REFERENCES "Point" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "_HikeToPoint_AB_unique" ON "_HikeToPoint"("A", "B");

-- CreateIndex
CREATE INDEX "_HikeToPoint_B_index" ON "_HikeToPoint"("B");
