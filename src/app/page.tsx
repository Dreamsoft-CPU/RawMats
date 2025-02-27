import HomeSidebar from "@/components/home/HomeSidebar";
import ProductCard from "@/components/products/ProductCard";
import HomeInset from "@/components/sidebar/insets/HomeInset";
import { Button } from "@/components/ui/button";
import prisma from "@/utils/prisma";
import { getDbUser } from "@/utils/server/getDbUser";
import { getSidebarData } from "@/utils/server/getSidebarData";
import React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const HomePage = async () => {
  const sidebarData = await getSidebarData();
  const user = await getDbUser();

  if ("error" in user) {
    throw new Error(user.message);
  }

  const products = await prisma.product.findMany({
    where: {
      verified: true,
    },
    include: {
      favorites: {
        select: {
          id: true,
          userId: true,
        },
      },
      supplier: true,
    },
  });

  const min = 5;
  const max = Math.max(min, products.length - 5);
  const random = Math.floor(Math.random() * (max - min + 1)) + min;

  return (
    <div className="flex h-screen w-full">
      <HomeSidebar data={sidebarData} />
      <HomeInset userData={user}>
        <div className="flex flex-col w-full p-4">
          {/* Daily Discover Section */}
          <div className="flex flex-col mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-3xl font-bold text-primary">
                Daily Discover
              </h2>
            </div>
            <div className="justify-center items-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.slice(0, random).map((product) => (
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
                    {products.slice(0, 10).map((product) => (
                      <div key={product.id} className="w-[250px] flex-shrink-0">
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

          {/* Browse Catalogue Section */}
          <div>
            <h2 className="text-xl md:text-3xl font-bold text-primary mb-4">
              Browse Catalogue
            </h2>
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
                <Button variant="outline" size="sm" className="h-8 px-3">
                  Previous
                </Button>
                <Button variant="default" size="sm" className="h-8 w-8 p-0">
                  1
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  2
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  3
                </Button>
                <Button variant="outline" size="sm" className="h-8 px-3">
                  Next
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
