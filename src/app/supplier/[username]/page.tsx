import HomeSidebar from "@/components/home/HomeSidebar";
import HomeInset from "@/components/sidebar/insets/HomeInset";
import SupplierProfileCard from "@/components/supplier/profile/SupplierProfile";
import { getDbUser } from "@/utils/server/getDbUser";
import { getSidebarData } from "@/utils/server/getSidebarData";
import { getSupplierData } from "@/utils/server/getSupplierData";

const SupplierPage = async ({ params }: { params: { username: string } }) => {
  const username = decodeURIComponent(params.username);
  const sidebarData = await getSidebarData();
  const user = await getDbUser();
  const supplierInfo = await getSupplierData(username);

  if ("error" in user) {
    throw new Error(user.message);
  }

  return (
    <div className="flex h-screen w-full">
      <HomeSidebar data={sidebarData} />
      <HomeInset userData={user}>
        {"error" in supplierInfo ? (
          <div>Sorry, supplier {username} does not exist.</div>
        ) : (
          <SupplierProfileCard data={supplierInfo} />
        )}
      </HomeInset>
    </div>
  );
};

export default SupplierPage;
