import HomeSidebar from "@/components/home/HomeSidebar";
import ProductCard from "@/components/products/ProductCard";
import HomeInset from "@/components/sidebar/insets/HomeInset";
import { getDbUser } from "@/utils/server/getDbUser";
import { getSidebarData } from "@/utils/server/getSidebarData";

import React from "react";

const HomePage = async () => {
  const sidebarData = await getSidebarData();
  const user = await getDbUser();

  if ("error" in user) {
    throw new Error(user.message);
  }

  const sampleCard = {
    id: "nigga",
    name: "Product Name",
    image: "https://i.ytimg.com/vi/zCHdvXqYOrA/maxresdefault.jpg",
    price: 100.0,
    favorite: [
      {
        userId: "6a48f46c-53fd-40a6-982b-3623dc0cbda5",
      },
    ],
    userId: user.id,
    supplier: {
      businessName: "Supplier Name",
    },
  };

  return (
    <div className="flex h-screen w-full">
      <HomeSidebar data={sidebarData} />
      <HomeInset>
        <ProductCard data={sampleCard} />
      </HomeInset>
    </div>
  );
};

export default HomePage;
