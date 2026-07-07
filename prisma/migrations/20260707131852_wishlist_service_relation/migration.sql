-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WishlistItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WishlistItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WishlistItem_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_WishlistItem" ("createdAt", "id", "serviceId", "userId") SELECT "createdAt", "id", "serviceId", "userId" FROM "WishlistItem";
DROP TABLE "WishlistItem";
ALTER TABLE "new_WishlistItem" RENAME TO "WishlistItem";
CREATE UNIQUE INDEX "WishlistItem_userId_serviceId_key" ON "WishlistItem"("userId", "serviceId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
