/*
  Warnings:

  - You are about to drop the column `fuelTypeId` on the `FuelPrice` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `FuelPrice` table. All the data in the column will be lost.
  - You are about to drop the `FuelType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `address` to the `FuelPrice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fuelType` to the `FuelPrice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FuelPrice" DROP CONSTRAINT "FuelPrice_fuelTypeId_fkey";

-- DropForeignKey
ALTER TABLE "FuelType" DROP CONSTRAINT "FuelType_createdBy_fkey";

-- AlterTable
ALTER TABLE "FuelPrice" DROP COLUMN "fuelTypeId",
DROP COLUMN "updatedAt",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "fuelType" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "FuelType";
