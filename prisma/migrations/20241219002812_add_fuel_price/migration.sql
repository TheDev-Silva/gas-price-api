/*
  Warnings:

  - Added the required column `address` to the `FuelPrice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FuelPrice" ADD COLUMN     "address" TEXT NOT NULL;
