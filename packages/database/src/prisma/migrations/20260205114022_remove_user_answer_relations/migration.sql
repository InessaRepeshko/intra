/*
  Warnings:

  - You are about to drop the column `userId` on the `feedback360_answers` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "feedback360_answers" DROP CONSTRAINT "feedback360_answers_userId_fkey";

-- AlterTable
ALTER TABLE "feedback360_answers" DROP COLUMN "userId";
