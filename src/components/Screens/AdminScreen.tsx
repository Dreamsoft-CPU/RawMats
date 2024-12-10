"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChartArea, Mail, Package, Menu } from "lucide-react";
import logo from "../../public/logo.png";
import { useState } from "react";
import { ItemVerification } from "@/components/admin/ItemVerification";
import { Product, Supplier, User } from "@prisma/client";
import { SupplierVerification } from "../admin/SupplierVerification";
import Analytics from "../admin/Analytics";

interface AuthScreenProps {
  fetchedProducts: Product[];
  fetchedSuppliers: (Supplier & { user: User })[];
}

const AdminScreen: React.FC<AuthScreenProps> = ({
  fetchedProducts,
  fetchedSuppliers,
}) => {
  const [selectedTab, setSelectedTab] = useState("analytics");

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

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[rgba(254,254,254,0.962)]">
      {/* Mobile design */}
      <div className="md:hidden w-full flex flex-col h-screen overflow-hidden bg-[#CFEEF9]">
        <header className="flex items-center justify-between p-4 bg-card border-b">
          <Image
            src={logo}
            alt="RAWMATS Logo"
            width={100}
            height={50}
            className="max-w-full h-auto "
          />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="p-4 border-b">
                <Image
                  src={logo}
                  alt="RAWMATS Logo"
                  width={150}
                  height={50}
                  className="max-w-full h-auto self-center"
                />
              </div>
              <Tabs
                value={selectedTab}
                onValueChange={setSelectedTab}
                orientation="vertical"
                className="flex-1"
              >
                <TabsList className="flex flex-col w-full h-auto">
                  <TabsTrigger value="analytics" className="justify-start mb-2">
                    <ChartArea className="mr-2 h-4 w-4" />
                    Analytics
                  </TabsTrigger>
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
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 overflow-auto p-4">
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <TabsContent value="analytics">
              <Analytics />
            </TabsContent>
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

      {/* Desktop design */}
      <div className="hidden md:flex md:h-screen md:w-full bg-background">
        <aside className="flex flex-col w-64 bg-card border-r">
          <div className="p-4 border-b self-center">
            <Image
              src={logo}
              alt="RAWMATS Logo"
              width={150}
              height={50}
              className="max-w-full h-auto"
            />
          </div>
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            orientation="vertical"
            className="flex-1"
          >
            <TabsList className="flex flex-col w-full h-auto">
              <TabsTrigger value="analytics" className="justify-start mb-2">
                <ChartArea className="mr-2 h-4 w-4" />
                Analytics
              </TabsTrigger>
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
        </aside>

        <main className="flex-1 overflow-auto p-6">
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <TabsContent value="analytics">
              <Analytics />
            </TabsContent>
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
    </div>
  );
};

export default AdminScreen;
