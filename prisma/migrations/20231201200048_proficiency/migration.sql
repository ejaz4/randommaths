/*
  Warnings:

  - The primary key for the `Proficiency` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `genId` on table `Proficiency` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Proficiency" (
    "genId" TEXT NOT NULL PRIMARY KEY,
    "id" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "level" INTEGER NOT NULL,
    "gradient" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Proficiency_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Proficiency" ("createdAt", "genId", "gradient", "id", "level", "updatedAt", "userId") SELECT "createdAt", "genId", "gradient", "id", "level", "updatedAt", "userId" FROM "Proficiency";
DROP TABLE "Proficiency";
ALTER TABLE "new_Proficiency" RENAME TO "Proficiency";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
