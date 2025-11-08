/*
  Warnings:

  - You are about to drop the column `receiverEventId` on the `SwapRequest` table. All the data in the column will be lost.
  - You are about to drop the column `receiverId` on the `SwapRequest` table. All the data in the column will be lost.
  - You are about to drop the column `senderEventId` on the `SwapRequest` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `SwapRequest` table. All the data in the column will be lost.
  - Added the required column `mySlotId` to the `SwapRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requestorId` to the `SwapRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responderId` to the `SwapRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `theirSlotId` to the `SwapRequest` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SwapRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mySlotId" TEXT NOT NULL,
    "theirSlotId" TEXT NOT NULL,
    "requestorId" TEXT NOT NULL,
    "responderId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SwapRequest_mySlotId_fkey" FOREIGN KEY ("mySlotId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SwapRequest_theirSlotId_fkey" FOREIGN KEY ("theirSlotId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SwapRequest_requestorId_fkey" FOREIGN KEY ("requestorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SwapRequest_responderId_fkey" FOREIGN KEY ("responderId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SwapRequest" ("createdAt", "id", "status") SELECT "createdAt", "id", "status" FROM "SwapRequest";
DROP TABLE "SwapRequest";
ALTER TABLE "new_SwapRequest" RENAME TO "SwapRequest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
