import HomeSidebar from "@/components/home/HomeSidebar";
import ProductCard from "@/components/products/ProductCard";
import HomeInset from "@/components/sidebar/insets/HomeInset";
import { Button } from "@/components/ui/button";
import prisma from "@/utils/prisma";
import { getDbUser } from "@/utils/server/getDbUser";
import { getSidebarData } from "@/utils/server/getSidebarData";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  getDailyDiscoverProducts,
  getNewArrivalsProducts,
  getBrowseCatalogueProducts,
} from "@/lib/algorithms/products";
import FeaturedSuppliers, {
  type FeaturedSupplierData,
} from "@/components/home/FeaturedSuppliers";

const HomePage = async ({
  searchParams,
}: {
  searchParams: { search?: string; page?: string };
}) => {
  const sidebarData = await getSidebarData();
  const user = await getDbUser();

  if ("error" in user) {
    throw new Error(user.message || "User not found");
  }
  const userId = user.id;

  const searchQuery = searchParams.search || "";
  const page = Number(searchParams.page) || 1;
  const productsPerPage = 12;

  // Fetch products using new algorithms
  const dailyDiscoverProducts = await getDailyDiscoverProducts(userId);
  const newArrivalsProducts = await getNewArrivalsProducts(userId);
  const { products: browseCatalogueProducts, totalPages } =
    await getBrowseCatalogueProducts(
      searchQuery,
      page,
      productsPerPage,
      userId,
    );

  // Fetch featured suppliers data
  const allSuppliers = await prisma.supplier.findMany({
    where: { verified: true },
    include: {
      _count: {
        select: { Product: { where: { verified: true } } },
      },
      Product: {
        where: { verified: true },
        select: {
          ratings: {
            select: { rating: true },
          },
        },
      },
    },
  });

  const shuffledSuppliers = allSuppliers.sort(() => 0.5 - Math.random());
  const selectedSuppliers = shuffledSuppliers.slice(0, 5);

  const featuredSuppliers: FeaturedSupplierData[] = selectedSuppliers.map(
    (s) => {
      let totalRatingSum = 0;
      let totalRatingsCount = 0;
      s.Product.forEach((product) => {
        product.ratings.forEach((rating) => {
          totalRatingSum += rating.rating;
          totalRatingsCount++;
        });
      });
      const averageRating =
        totalRatingsCount > 0 ? totalRatingSum / totalRatingsCount : 0;
      return {
        id: s.id,
        businessName: s.businessName,
        businessPicture: s.businessPicture,
        productCount: s._count.Product,
        averageRating: averageRating,
        totalReviews: totalRatingsCount,
      };
    },
  );

  return (
    <div className="flex h-screen w-full">
      <HomeSidebar data={sidebarData} />
      <HomeInset userData={user}>
        <div className="flex flex-col w-full p-4">
          {!searchQuery && (
            <>
              {/* Daily Discover Section */}
              <div className="flex flex-col mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl md:text-3xl font-bold text-primary">
                    Daily Discover
                  </h2>
                </div>
                <div className="justify-center items-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {dailyDiscoverProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      data={{
                        id: product.id,
                        name: product.name,
                        image: product.image,
                        price: product.price,
                        userId: userId,
                        favorite: product.favorites,
                        supplier: product.supplier,
                        averageRating: product.averageRating,
                        totalReviews: product.totalReviews,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Featured Suppliers Section */}
              <FeaturedSuppliers suppliers={featuredSuppliers} />

              {/* New Arrivals Section */}
              <div className="mb-8">
                <h2 className="text-xl md:text-3xl text-primary font-bold mb-4">
                  New Arrivals
                </h2>
                <div className="relative">
                  <div className="flex pb-4 gap-4 items-center justify-center">
                    <ScrollArea className="w-[80vw] overflow-hidden items-center">
                      <div className="flex space-x-4">
                        {newArrivalsProducts.map((product) => (
                          <div
                            key={product.id}
                            className="w-[250px] flex-shrink-0"
                          >
                            <ProductCard
                              data={{
                                id: product.id,
                                name: product.name,
                                image: product.image,
                                price: product.price,
                                userId: userId,
                                favorite: product.favorites,
                                supplier: product.supplier,
                                averageRating: product.averageRating,
                                totalReviews: product.totalReviews,
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Browse Catalogue or Search Results Section */}
          <div className="flex flex-col min-h-[calc(100vh-200px)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-3xl font-bold text-primary">
                {searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : "Browse Catalogue"}
              </h2>
            </div>
            {browseCatalogueProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 items-center justify-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {browseCatalogueProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      data={{
                        id: product.id,
                        name: product.name,
                        image: product.image,
                        price: product.price,
                        userId: userId,
                        favorite: product.favorites,
                        supplier: product.supplier,
                        averageRating: product.averageRating,
                        totalReviews: product.totalReviews,
                      }}
                    />
                  ))}
                </div>
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      asChild
                      className="h-8 px-3"
                    >
                      <Link
                        href={`/?page=${Math.max(1, page - 1)}${searchQuery ? `&search=${searchQuery}` : ""}`}
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Link>
                    </Button>

                    <span className="text-primary font-medium px-3">
                      Page {page} of {totalPages || 1}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      asChild
                      className="h-8 px-3"
                    >
                      <Link
                        href={`/?page=${Math.min(totalPages, page + 1)}${searchQuery ? `&search=${searchQuery}` : ""}`}
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </nav>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    No results found
                  </h3>
                  <p className="text-gray-500 max-w-md">
                    We couldn&apos;t find any products matching &quot;
                    {searchQuery}&quot;. Try adjusting your search or browse our
                    catalogue.
                  </p>
                  <Button variant="outline" asChild className="mt-4">
                    <Link href="/">Browse All Products</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </HomeInset>
    </div>
  );
};

export default HomePage;
