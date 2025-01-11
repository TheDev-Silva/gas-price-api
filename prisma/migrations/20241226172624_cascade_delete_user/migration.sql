-- DropForeignKey
ALTER TABLE "FuelPrice" DROP CONSTRAINT "FuelPrice_userId_fkey";

-- AddForeignKey
ALTER TABLE "FuelPrice" ADD CONSTRAINT "FuelPrice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
