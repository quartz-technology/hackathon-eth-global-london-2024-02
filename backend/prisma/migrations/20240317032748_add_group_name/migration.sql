/*
  Warnings:

  - Added the required column `address` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `Organisation` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Group" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "organisationId" INTEGER NOT NULL,
    CONSTRAINT "Group_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Group" ("id", "name", "organisationId") SELECT "id", "name", "organisationId" FROM "Group";
DROP TABLE "Group";
ALTER TABLE "new_Group" RENAME TO "Group";
CREATE TABLE "new_Organisation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL
);
INSERT INTO "new_Organisation" ("id", "name") SELECT "id", "name" FROM "Organisation";
DROP TABLE "Organisation";
ALTER TABLE "new_Organisation" RENAME TO "Organisation";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
