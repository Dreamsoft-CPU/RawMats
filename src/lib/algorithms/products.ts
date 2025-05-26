import prisma from "@/utils/prisma";
import {
  Prisma,
  Product as PrismaProduct,
  Supplier,
  Rating as PrismaRating,
  Favorite,
} from "@prisma/client";

// Define a type for the product structure used internally from Prisma queries
type ProductWithDetailsPrisma = PrismaProduct & {
  supplier: Supplier;
  ratings: PrismaRating[];
  favorites: Pick<Favorite, "id" | "userId">[];
};

// Define the processed product type that includes calculated fields
export type ProcessedProduct = ProductWithDetailsPrisma & {
  averageRating: number;
  totalReviews: number;
};

// Helper function to process ratings for a product
function processProductRatings(
  product: ProductWithDetailsPrisma,
): ProcessedProduct {
  const totalReviews = product.ratings.length;
  const averageRating =
    totalReviews > 0
      ? product.ratings.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;
  return {
    ...product,
    averageRating,
    totalReviews,
  };
}

export async function getDailyDiscoverProducts(
  userId?: string,
): Promise<ProcessedProduct[]> {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const randomLetters: string[] = [];
  for (let i = 0; i < 4; i++) {
    randomLetters.push(
      letters.charAt(Math.floor(Math.random() * letters.length)),
    );
  }

  const orConditions = randomLetters.map((letter) => ({
    name: { contains: letter, mode: Prisma.QueryMode.insensitive },
  }));

  let products = await prisma.product.findMany({
    where: {
      verified: true,
      OR: orConditions,
    },
    include: {
      favorites: userId
        ? { where: { userId }, select: { id: true, userId: true } }
        : { select: { id: true, userId: true } },
      supplier: true,
      ratings: true,
    },
    take: 15, // Fetch a slightly larger pool to shuffle from
  });

  // Shuffle and pick up to 5
  products = products.sort(() => 0.5 - Math.random()).slice(0, 5);

  if (products.length < 5) {
    const additionalProductsNeeded = 5 - products.length;
    const existingProductIds = products.map((p) => p.id);
    const fallbackProducts = await prisma.product.findMany({
      where: {
        verified: true,
        NOT: { id: { in: existingProductIds } },
      },
      orderBy: { dateAdded: "desc" }, // Fallback to newest
      take: additionalProductsNeeded,
      include: {
        favorites: userId
          ? { where: { userId }, select: { id: true, userId: true } }
          : { select: { id: true, userId: true } },
        supplier: true,
        ratings: true,
      },
    });
    products.push(...fallbackProducts);
  }

  return products.map((p) =>
    processProductRatings(p as ProductWithDetailsPrisma),
  );
}

export async function getNewArrivalsProducts(
  userId?: string,
): Promise<ProcessedProduct[]> {
  const products = await prisma.product.findMany({
    where: { verified: true },
    orderBy: { dateAdded: "desc" },
    take: 10,
    include: {
      favorites: userId
        ? { where: { userId }, select: { id: true, userId: true } }
        : { select: { id: true, userId: true } },
      supplier: true,
      ratings: true,
    },
  });
  return products.map((p) =>
    processProductRatings(p as ProductWithDetailsPrisma),
  );
}

export async function getBrowseCatalogueProducts(
  searchQuery: string,
  page: number,
  productsPerPage: number,
  userId?: string,
): Promise<{
  products: ProcessedProduct[];
  totalProducts: number;
  totalPages: number;
}> {
  const whereCondition: Prisma.ProductWhereInput = {
    verified: true,
    ...(searchQuery
      ? {
          OR: [
            {
              name: {
                contains: searchQuery,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              description: {
                contains: searchQuery,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        }
      : {}),
  };

  const totalProducts = await prisma.product.count({ where: whereCondition });
  const productsData = await prisma.product.findMany({
    where: whereCondition,
    include: {
      favorites: userId
        ? { where: { userId }, select: { id: true, userId: true } }
        : { select: { id: true, userId: true } },
      supplier: true,
      ratings: true,
    },
    skip: (page - 1) * productsPerPage,
    take: productsPerPage,
  });

  return {
    products: productsData.map((p) =>
      processProductRatings(p as ProductWithDetailsPrisma),
    ),
    totalProducts,
    totalPages: Math.ceil(totalProducts / productsPerPage),
  };
}
