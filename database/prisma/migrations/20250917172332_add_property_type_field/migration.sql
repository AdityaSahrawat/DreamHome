/*
  Warnings:

  - You are about to alter the column `latitude` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,8)` to `Decimal(12,8)`.
  - You are about to alter the column `longitude` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,8)` to `Decimal(12,8)`.

*/
-- AlterTable
ALTER TABLE "public"."Property" ADD COLUMN     "type" TEXT,
ALTER COLUMN "latitude" SET DATA TYPE DECIMAL(12,8),
ALTER COLUMN "longitude" SET DATA TYPE DECIMAL(12,8);
