/*
  Warnings:

  - You are about to drop the column `locatioName` on the `Supplier` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Supplier" DROP COLUMN "locatioName",
ADD COLUMN     "locationName" TEXT NOT NULL DEFAULT 'None';
