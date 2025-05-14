"use client";

import { SidebarNavItems } from "@/lib/types/sidebarData.type";
import {
  LayoutDashboard,
  Package,
  PackageSearch,
  Shield,
  User,
} from "lucide-react";
import React from "react";
import { AppSidebar } from "../sidebar/AppSidebar";

interface SupplierSidebarProps {
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

const SupplierSidebar: React.FC<SupplierSidebarProps> = ({
  data: { isSupplier, isAdmin, user },
}) => {
  const homeSidebarData: SidebarNavItems[] = [
    {
      title: "Dashboard",
      url: "/supplier/dashboard",
      icon: LayoutDashboard,
    },
    { title: "Products", url: "/supplier/products", icon: Package },
    { title: "Profile", url: "/supplier/profile", icon: User },
    { title: "Sales Report", url: "/supplier/sales", icon: PackageSearch },
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

export default SupplierSidebar;
