/*
  Warnings:

  - Added the required column `token_code` to the `TokenCandleModel` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TokenCandleModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token_code" TEXT NOT NULL,
    "time" DATETIME NOT NULL,
    "open" DECIMAL NOT NULL,
    "high" DECIMAL NOT NULL,
    "low" DECIMAL NOT NULL,
    "close" DECIMAL NOT NULL,
    "volume" DECIMAL NOT NULL,
    "stat_type" INTEGER NOT NULL
);
INSERT INTO "new_TokenCandleModel" ("close", "high", "id", "low", "open", "stat_type", "time", "volume") SELECT "close", "high", "id", "low", "open", "stat_type", "time", "volume" FROM "TokenCandleModel";
DROP TABLE "TokenCandleModel";
ALTER TABLE "new_TokenCandleModel" RENAME TO "TokenCandleModel";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
