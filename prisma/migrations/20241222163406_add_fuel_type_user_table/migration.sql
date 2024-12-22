/*
  Warnings:

  - You are about to drop the column `address` on the `FuelPrice` table. All the data in the column will be lost.
  - You are about to drop the column `fuelType` on the `FuelPrice` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,address]` on the table `GasStation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fuelTypeId` to the `FuelPrice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `FuelPrice` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "GasStation_name_key";

-- AlterTable
ALTER TABLE "FuelPrice" DROP COLUMN "address",
DROP COLUMN "fuelType",
ADD COLUMN     "fuelTypeId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "FuelType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FuelType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FuelType_name_key" ON "FuelType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GasStation_name_address_key" ON "GasStation"("name", "address");

-- AddForeignKey
ALTER TABLE "FuelPrice" ADD CONSTRAINT "FuelPrice_fuelTypeId_fkey" FOREIGN KEY ("fuelTypeId") REFERENCES "FuelType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelType" ADD CONSTRAINT "FuelType_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
