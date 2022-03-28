-- CreateTable
CREATE TABLE "TokenCandleModel" (
    "id" SERIAL NOT NULL,
    "token_code" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "open" DECIMAL(22,10),
    "high" DECIMAL(22,10),
    "low" DECIMAL(22,10),
    "close" DECIMAL(22,10),
    "volume" DECIMAL(22,10),
    "stat_type" INTEGER NOT NULL,

    CONSTRAINT "TokenCandleModel_pkey" PRIMARY KEY ("id")
);
