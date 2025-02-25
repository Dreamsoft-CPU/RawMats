import HomeSidebar from "@/components/home/HomeSidebar";
import ProductCard from "@/components/products/ProductCard";
import HomeInset from "@/components/sidebar/insets/HomeInset";
import { getSidebarData } from "@/utils/server/getSidebarData";

import React from "react";

const HomePage = async () => {
  const sidebarData = await getSidebarData();

  return (
    <div className="flex h-screen w-full">
      <HomeSidebar data={sidebarData} />
      <HomeInset>
        <ProductCard />
      </HomeInset>
    </div>
  );
};

export default HomePage;
