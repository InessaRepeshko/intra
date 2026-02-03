/*
  Warnings:

  - You are about to drop the column `password_hash` on the `identity_users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "identity_users" DROP COLUMN "password_hash",
ADD COLUMN     "avatar_url" TEXT;
