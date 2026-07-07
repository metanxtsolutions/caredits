-- CreateTable
CREATE TABLE "BlockedSlot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "startMinutes" INTEGER,
    "endMinutes" INTEGER,
    "reason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "BlockedSlot_date_idx" ON "BlockedSlot"("date");
