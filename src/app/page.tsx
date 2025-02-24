import HomeSidebar from "@/components/home/HomeSidebar";
import { getSidebarData } from "@/utils/server/getSidebarData";

import React from "react";

const HomePage = async () => {
  const sidebarData = await getSidebarData();

  return (
    <div>
      <HomeSidebar data={sidebarData} />
    </div>
  );
};

export default HomePage;
