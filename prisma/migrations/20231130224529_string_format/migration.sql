/*
  Warnings:

  - You are about to drop the column `workId` on the `Proficiency` table. All the data in the column will be lost.
  - Added the required column `subTopics` to the `Work` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Proficiency" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "level" INTEGER NOT NULL,
    "gradient" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Proficiency_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Proficiency" ("createdAt", "gradient", "id", "level", "updatedAt", "userId") SELECT "createdAt", "gradient", "id", "level", "updatedAt", "userId" FROM "Proficiency";
DROP TABLE "Proficiency";
ALTER TABLE "new_Proficiency" RENAME TO "Proficiency";
CREATE TABLE "new_Work" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'incomplete',
    "subTopics" TEXT NOT NULL,
    "questionMax" INTEGER NOT NULL,
    "breaksAllowed" BOOLEAN NOT NULL,
    "reviewAfter" BOOLEAN NOT NULL,
    "onBreak" BOOLEAN NOT NULL,
    "startTime" DATETIME,
    "endTime" DATETIME,
    "currentQuestion" INTEGER NOT NULL,
    "questionsCorrect" INTEGER NOT NULL,
    "cheating" BOOLEAN NOT NULL DEFAULT false,
    "sendtoId" TEXT,
    CONSTRAINT "Work_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Work_sendtoId_fkey" FOREIGN KEY ("sendtoId") REFERENCES "Class" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Work" ("breaksAllowed", "cheating", "createdAt", "currentQuestion", "endTime", "id", "onBreak", "progress", "questionMax", "questionsCorrect", "reviewAfter", "sendtoId", "startTime", "status", "title", "updatedAt", "userId") SELECT "breaksAllowed", "cheating", "createdAt", "currentQuestion", "endTime", "id", "onBreak", "progress", "questionMax", "questionsCorrect", "reviewAfter", "sendtoId", "startTime", "status", "title", "updatedAt", "userId" FROM "Work";
DROP TABLE "Work";
ALTER TABLE "new_Work" RENAME TO "Work";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
