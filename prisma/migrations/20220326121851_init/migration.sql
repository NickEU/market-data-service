/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `UserModel` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "TokenCandleModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "time" DATETIME NOT NULL,
    "open" DECIMAL NOT NULL,
    "high" DECIMAL NOT NULL,
    "low" DECIMAL NOT NULL,
    "close" DECIMAL NOT NULL,
    "volume" DECIMAL NOT NULL,
    "stat_type" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserModel_email_key" ON "UserModel"("email");
