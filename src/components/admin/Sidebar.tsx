"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  AreaChartIcon as ChartArea,
  Mail,
  Package,
  LogOut,
  Home,
  RefreshCw,
} from "lucide-react";
import logo from "@/public/logo.png";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { logout } from "../AuthHandlers/LoginHandler";

interface SidebarProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

export function Sidebar({ selectedTab, setSelectedTab }: SidebarProps) {
  const router = useRouter();
  const [isSyncing, setIsSyncing] = useState(false);

  const syncProductsToAlgolia = async () => {
    try {
      setIsSyncing(true);
      const response = await fetch("/api/algolia-sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to sync products to Algolia");
      }

      alert("Products successfully synced to Algolia!");
    } catch (error) {
      console.error("Error syncing products to Algolia:", error);
      alert("Failed to sync products to Algolia.");
    } finally {
      setIsSyncing(false);
    }
  };

  const logoutUser = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error(error);
      router.push(
        `/error?message=${encodeURIComponent("An unexpected error occurred")}&code=500`,
      );
    }
  };

  return (
    <ShadcnSidebar>
      <SidebarHeader>
        <div className="flex items-center justify-center p-4 border-b">
          <Image
            src={logo}
            alt="RAWMATS Logo"
            width={150}
            height={50}
            className="max-w-full h-auto"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setSelectedTab("analytics")}
              isActive={selectedTab === "analytics"}
              className="flex flex-row items-center justify-center"
            >
              <ChartArea className="mr-2 h-4 w-4" />
              Analytics
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="flex flex-row items-center justify-center"
              onClick={() => setSelectedTab("supplier")}
              isActive={selectedTab === "supplier"}
            >
              <Mail className="mr-2 h-4 w-4" />
              Supplier Verification
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="flex flex-row items-center justify-center"
              onClick={() => setSelectedTab("item")}
              isActive={selectedTab === "item"}
            >
              <Package className="mr-2 h-4 w-4" />
              Item Verification
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {/* Sync to Algolia Button */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={syncProductsToAlgolia}
              disabled={isSyncing}
              className={`flex flex-row items-center justify-center ${
                isSyncing ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {isSyncing ? "Syncing..." : "Sync to Algolia"}
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Go Back to Home Button */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => router.push("/")}
              className="flex flex-row items-center justify-center"
            >
              <Home className="mr-2 h-4 w-4" />
              Go Back to Home
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Logout Button */}
          <SidebarMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <SidebarMenuButton className="flex flex-row items-center justify-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </SidebarMenuButton>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to log out?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    You will be redirected to the login page.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={logoutUser}>
                    Log out
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </ShadcnSidebar>
  );
}