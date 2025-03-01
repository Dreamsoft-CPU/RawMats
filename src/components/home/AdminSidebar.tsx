"use client";

import { SidebarNavItems } from "@/lib/types/sidebarData.type";
import {
  LayoutDashboard,
  Package,
  PackageSearch,
  Shield,
  UserSearch,
} from "lucide-react";
import React from "react";
import { AppSidebar } from "../sidebar/AppSidebar";

interface AdminSidebarProps {
  data: {
    isSupplier: boolean;
    isAdmin: boolean;
    user: {
      name: string;
      email: string;
      avatar: string;
    };
  };
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  data: { isSupplier, isAdmin, user },
}) => {
  const homeSidebarData: SidebarNavItems[] = [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Supplier Verification",
      url: "/admin/suppliers",
      icon: UserSearch,
    },
    { title: "Product Verification", url: "/admin/products", icon: Package },
  ];

  const switcherData = [];
  if (isAdmin) {
    switcherData.push({ name: "Admin", logo: Shield, url: "/admin/dashboard" });
  }
  if (isSupplier) {
    switcherData.push({
      name: "Supplier",
      logo: PackageSearch,
      url: "/supplier/dashboard",
    });
  }

  const sidebarData = {
    items: homeSidebarData,
    user,
    pages: switcherData,
  };

  return <AppSidebar data={sidebarData} />;
};

export default AdminSidebar;
