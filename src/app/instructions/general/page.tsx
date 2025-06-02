import React from "react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import HomeSidebar from "@/components/home/HomeSidebar";
import HomeInset from "@/components/sidebar/insets/HomeInset";
import { getSidebarData } from "@/utils/server/getSidebarData";
import { getDbUser } from "@/utils/server/getDbUser";
import GeneralInstructionsContent from "@/components/instructions/GeneralInstructionsContent";

const GeneralInstructionsPage = async () => {
  const sidebarData = await getSidebarData();
  const user = await getDbUser();

  if ("error" in user) {
    throw new Error(user.message || "User not found");
  }

  return (
    <div className="flex h-screen w-full">
      <HomeSidebar data={sidebarData} />
      <HomeInset userData={user}>
        <LanguageProvider>
          <GeneralInstructionsContent />
        </LanguageProvider>
      </HomeInset>
    </div>
  );
};

export default GeneralInstructionsPage;
