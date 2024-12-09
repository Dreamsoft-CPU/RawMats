import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import LoadingModal from "../Loading/LoadingModal";
import { Product, Supplier, User } from "@prisma/client";

const AdminScreen = dynamic(() => import("@/components/Screens/AdminScreen"), {
  loading: () => <LoadingModal message="Loading..." />,
  ssr: true,
});

interface DynamicScreenProps {
  fetchedProducts: Product[];
  fetchedSuppliers: (Supplier & { user: User })[];
}

const DynamicScreen: React.FC<DynamicScreenProps> = ({
  fetchedProducts,
  fetchedSuppliers,
}) => {
  return (
    <Suspense fallback={<LoadingModal />}>
      <AdminScreen
        fetchedProducts={fetchedProducts}
        fetchedSuppliers={fetchedSuppliers}
      />
    </Suspense>
  );
};

export default DynamicScreen;
