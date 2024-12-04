"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ManageListings from "@/components/supplier-dashboard/contents/ManageListing";
import Notification from "@/components/supplier-dashboard/contents/Notification";
import ProductListingForm from "@/components/supplier-dashboard/contents/ProductForm";
import ProductList from "@/components/supplier-dashboard/contents/ProductList";
import { useState } from "react";
import { Product } from "@/types/types";
import {CubeIcon, FolderOpenIcon, BellIcon, HomeIcon} from "@heroicons/react/24/outline";
import Link from "next/link";

const MobileSupplier = ({
  fetchedProducts,
  userID,
}: {
  fetchedProducts: {
    id: string;
    name: string;
    supplierId: string;
    price: number;
    description: string;
    verified: boolean;
    verifiedDate: Date;
    dateAdded: Date;
    image?: string;
  }[];
  userID: string;
  // supplierName: string;
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [tabValue, setTabValue] = useState("create-listing");

  const handleAddProduct = (product: Product) => {
    setProducts([...products, product]);
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="flex-1 flex flex-col pb-20 md:pb-0">
        <div className="bg-[#A3E6FD] shadow p-9 sticky top-0 z-10 bg-opacity-80"></div>

        <div className="p-10 flex-1 bg-transparent">
          <Tabs value={tabValue} onValueChange={setTabValue}>
            <TabsContent value="create-listing">
              <ProductListingForm
                onAddProduct={handleAddProduct}
                supplierId={userID}
              />
              <ProductList products={fetchedProducts} />
            </TabsContent>

            <TabsContent value="manage-listing">
              <ManageListings fetchedProducts={fetchedProducts} />
            </TabsContent>

            <TabsContent value="notifications">
              <Notification />
            </TabsContent>

            <TabsList className="fixed bottom-0 left-0 right-0 p-6 bg-[#B9EBFC] shadow-lg md:hidden flex items-center justify-between space-x-6">
              <div className="flex flex-col items-center">
                <Link href="/" passHref>
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center hover:bg-gray-400">
                    <HomeIcon className="h-6 w-6 text-gray-700 hover:text-gray-900" />
                  </div>
                </Link>
              </div>

              <TabsTrigger
                value="create-listing"
                className="flex flex-col items-center space-y-1"
              >
                <CubeIcon className="h-6 w-6 text-gray-700 hover:text-gray-900" />
              </TabsTrigger>

              <TabsTrigger
                value="manage-listing"
                className="flex flex-col items-center space-y-1"
              >
                <FolderOpenIcon className="h-6 w-6 text-gray-700 hover:text-gray-900" />
              </TabsTrigger>

              <TabsTrigger
                value="notifications"
                className="flex flex-col items-center space-y-1"
              >
                <BellIcon className="h-6 w-6 text-gray-700 hover:text-gray-900" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MobileSupplier;
