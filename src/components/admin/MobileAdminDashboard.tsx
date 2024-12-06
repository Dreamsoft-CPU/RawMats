"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Package, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logo from "../../public/logo.png";
import { Product, Supplier, User } from "@prisma/client";
import { ItemVerification } from "@/components/Admin/ItemVerification";
import { SupplierVerification } from "@/components/Admin/SupplierVerification";

const MobileAdminDashboard = ({
  fetchedProducts,
  fetchedSuppliers,
}: {
  fetchedProducts: Product[];
  fetchedSuppliers: (Supplier & { user: User })[];
}) => {
  const [selectedTab, setSelectedTab] = useState("supplier");
  const [isSyncing, setIsSyncing] = useState(false);

  const handleVerify = async (id: string) => {
    try {
      const response = await fetch(`/api/product/verify/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error("Failed to verify product");
      }
      alert("Product verified successfully.");
    } catch (error) {
      console.error("Error verifying product:", error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`/api/product/reject/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error("Failed to reject product");
      }
      alert("Product rejected successfully.");
    } catch (error) {
      console.error("Error rejecting product:", error);
    }
  };

  const handleSync = async () => {
    try {
      setIsSyncing(true);

      const response = await fetch("/api/algolia-sync", {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to sync products to Algolia.",
        );
      }

      const data = await response.json();
      alert(`Products successfully synced to Algolia: ${data.syncedRecords}`);
    } catch (error) {
      console.error("Error syncing products to Algolia:", error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unknown error occurred.");
      }
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between p-4 bg-card border-b">
        <Image
          src={logo}
          alt="RAWMATS Logo"
          width={150}
          height={80}
          className="max-w-full h-auto"
        />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-10 w-10" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="p-4 border-b">
              <Image
                src={logo}
                alt="RAWMATS Logo"
                width={150}
                height={50}
                className="max-w-full h-auto ml-8"
              />
            </div>
            <Tabs
              value={selectedTab}
              onValueChange={setSelectedTab}
              orientation="vertical"
              className="flex-1"
            >
              <TabsList className="flex flex-col w-full h-auto">
                <TabsTrigger value="supplier" className="justify-start mb-2">
                  <Mail className="mr-2 h-4 w-4" />
                  Supplier Verification
                </TabsTrigger>
                <TabsTrigger value="item" className="justify-start">
                  <Package className="mr-2 h-4 w-4" />
                  Item Verification
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="p-4 border-t mt-auto">
              <Button
                onClick={handleSync}
                variant="secondary"
                className="w-full mb-2 bg-rawmats-primary-100 hover:bg-rawmats-primary-500 text-white"
                disabled={isSyncing}
              >
                {isSyncing ? "Syncing..." : "Sync to Algolia"}
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="/">Go to Home</a>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <main className="flex-1 overflow-auto p-4">
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsContent value="supplier">
            <h2 className="text-2xl font-bold mb-4">Supplier Verification</h2>
            {fetchedSuppliers.length === 0 && (
              <p>No supplier applications currently</p>
            )}
            <SupplierVerification suppliers={fetchedSuppliers} />
          </TabsContent>
          <TabsContent value="item">
            <h2 className="text-2xl font-bold mb-4">Item Verification</h2>
            <ItemVerification
              products={fetchedProducts}
              verifyProduct={handleVerify}
              rejectProduct={handleReject}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MobileAdminDashboard;
