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
      supplierId: user.Supplier[0].id,
    },
    include: {
      favorites: true,
    },
  });

  return (
    <div className="flex h-screen w-full">
      <HomeSidebar data={sidebarData} />
      <HomeInset>
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
                businessName: user.Supplier[0].businessName,
              },
            }}
          />
        ))}
      </HomeInset>
    </div>
  );
};

export default HomePage;
