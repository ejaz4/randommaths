-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Proficiency" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "level" INTEGER NOT NULL,
    "gradient" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "workId" TEXT,
    CONSTRAINT "Proficiency_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Proficiency_workId_fkey" FOREIGN KEY ("workId") REFERENCES "Work" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Proficiency" ("createdAt", "gradient", "id", "level", "updatedAt", "userId") SELECT "createdAt", "gradient", "id", "level", "updatedAt", "userId" FROM "Proficiency";
DROP TABLE "Proficiency";
ALTER TABLE "new_Proficiency" RENAME TO "Proficiency";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
