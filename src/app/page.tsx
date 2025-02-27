import HomeSidebar from "@/components/home/HomeSidebar";
import ProductCard from "@/components/products/ProductCard";
import HomeInset from "@/components/sidebar/insets/HomeInset";
import { Button } from "@/components/ui/button";
import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";
import { getDbUser } from "@/utils/server/getDbUser";
import { getSidebarData } from "@/utils/server/getSidebarData";
import React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HomePage = async ({
  searchParams,
}: {
  searchParams: { search?: string; page?: string };
}) => {
  const sidebarData = await getSidebarData();
  const user = await getDbUser();

  if ("error" in user) {
    throw new Error(user.message);
  }

  const searchQuery = searchParams.search || "";
  const page = Number(searchParams.page) || 1;
  const productsPerPage = 12;

  // Build the query based on search params
  const where = {
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

  // Count total products for pagination
  const totalProducts = await prisma.product.count({ where });
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  // Get products based on search and pagination
  const products = await prisma.product.findMany({
    where,
    include: {
      favorites: {
        select: {
          id: true,
          userId: true,
        },
      },
      supplier: true,
    },
    skip: (page - 1) * productsPerPage,
    take: productsPerPage,
  });

  // For featured sections (Daily Discover, New Arrivals)
  const featuredProducts = await prisma.product.findMany({
    where: { verified: true },
    include: {
      favorites: {
        select: {
          id: true,
          userId: true,
        },
      },
      supplier: true,
    },
    take: 20,
  });

  const min = 5;
  const max = Math.max(min, featuredProducts.length - 5);
  const random = Math.floor(Math.random() * (max - min + 1)) + min;

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
                  {featuredProducts.slice(0, random).map((product) => (
                    <ProductCard
                      key={product.id}
                      data={{
                        id: product.id,
                        name: product.name,
                        image: product.image,
                        price: product.price,
                        userId: user.id,
                        favorite: product.favorites,
                        supplier: product.supplier,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* New Arrivals Section */}
              <div className="mb-8">
                <h2 className="text-xl md:text-3xl text-primary font-bold mb-4">
                  New Arrivals
                </h2>
                <div className="relative">
                  <div className="flex pb-4 gap-4 items-center justify-center">
                    <ScrollArea className="w-[80vw] overflow-hidden items-center">
                      <div className="flex space-x-4">
                        {featuredProducts.slice(0, 10).map((product) => (
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
                                userId: user.id,
                                favorite: product.favorites,
                                supplier: product.supplier,
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
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-3xl font-bold text-primary">
                {searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : "Browse Catalogue"}
              </h2>
              {searchQuery && (
                <Button variant="outline" asChild>
                  <Link href="/">Browse All</Link>
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 items-center justify-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  data={{
                    id: product.id,
                    name: product.name,
                    image: product.image,
                    price: product.price,
                    userId: user.id,
                    favorite: product.favorites,
                    supplier: product.supplier,
                  }}
                />
              ))}
            </div>
            <div className="mt-6 flex justify-center overflow-x-auto pb-2">
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
          </div>
        </div>
      </HomeInset>
    </div>
  );
};

export default HomePage;
