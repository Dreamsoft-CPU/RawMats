import HomeSidebar from "@/components/home/HomeSidebar";
import ProductCard from "@/components/products/ProductCard";
import HomeInset from "@/components/sidebar/insets/HomeInset";
import prisma from "@/utils/prisma";
import { getDbUser } from "@/utils/server/getDbUser";
import { getSidebarData } from "@/utils/server/getSidebarData";

import React from "react";

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

  return (
    <div className="flex h-screen w-full">
      <HomeSidebar data={sidebarData} />
      <HomeInset userData={user}>
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
              supplier: {
                businessName: product.supplier.businessName,
              },
            }}
          />
        ))}
      </HomeInset>
    </div>
  );
};

export default HomePage;
