/*
  Warnings:

  - You are about to drop the column `createdAt` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `sessions` table. All the data in the column will be lost.
  - Added the required column `expires_at` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."sessions" DROP COLUMN "createdAt",
DROP COLUMN "expiresAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL;
