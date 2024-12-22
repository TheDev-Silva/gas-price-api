/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `GasStation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GasStation_name_key" ON "GasStation"("name");
