-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ClassAndOwner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teacherId" TEXT NOT NULL,
    CONSTRAINT "ClassAndOwner_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ClassAndOwner" ("id", "teacherId") SELECT "id", "teacherId" FROM "ClassAndOwner";
DROP TABLE "ClassAndOwner";
ALTER TABLE "new_ClassAndOwner" RENAME TO "ClassAndOwner";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
