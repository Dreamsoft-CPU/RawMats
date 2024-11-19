-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "image" TEXT NOT NULL DEFAULT '/products/default.jpg';

-- AlterTable
ALTER TABLE "Supplier" ADD COLUMN     "bio" TEXT NOT NULL DEFAULT 'None',
ADD COLUMN     "businessPhone" TEXT NOT NULL DEFAULT 'None',
ADD COLUMN     "businessPicture" TEXT NOT NULL DEFAULT '/businesses/default.jpg';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phoneNumber" TEXT NOT NULL DEFAULT 'None',
ADD COLUMN     "profilePicture" TEXT NOT NULL DEFAULT '/users/default.jpg';
