/*
  Warnings:

  - You are about to drop the column `averageReaction` on the `TestResult` table. All the data in the column will be lost.
  - You are about to drop the column `black` on the `TestResult` table. All the data in the column will be lost.
  - You are about to drop the column `correct` on the `TestResult` table. All the data in the column will be lost.
  - You are about to drop the column `incorrect` on the `TestResult` table. All the data in the column will be lost.
  - Added the required column `isArmed` to the `TestResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isBlack` to the `TestResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isCorrect` to the `TestResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reactionTime` to the `TestResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TestResult" DROP COLUMN "averageReaction",
DROP COLUMN "black",
DROP COLUMN "correct",
DROP COLUMN "incorrect",
ADD COLUMN     "isArmed" BOOLEAN NOT NULL,
ADD COLUMN     "isBlack" BOOLEAN NOT NULL,
ADD COLUMN     "isCorrect" BOOLEAN NOT NULL,
ADD COLUMN     "reactionTime" INTEGER NOT NULL;
