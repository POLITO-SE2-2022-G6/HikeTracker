-- AlterTable
ALTER TABLE "Hut" ADD COLUMN "altitude" REAL;
ALTER TABLE "Hut" ADD COLUMN "beds" INTEGER;
ALTER TABLE "Hut" ADD COLUMN "email" TEXT;
ALTER TABLE "Hut" ADD COLUMN "name" TEXT;
ALTER TABLE "Hut" ADD COLUMN "phone" TEXT;
ALTER TABLE "Hut" ADD COLUMN "website" TEXT;

-- AlterTable
ALTER TABLE "ParkingLot" ADD COLUMN "capacity" INTEGER;
ALTER TABLE "ParkingLot" ADD COLUMN "name" TEXT;
ALTER TABLE "ParkingLot" ADD COLUMN "position" TEXT;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("email", "id", "phoneNumber", "type", "username") SELECT "email", "id", "phoneNumber", "type", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
