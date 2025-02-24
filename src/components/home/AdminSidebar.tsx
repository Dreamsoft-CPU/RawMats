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
    { title: "Supplier Verification", url: "/admin/products", icon: Package },
    { title: "Product Verification", url: "/admin/suppliers", icon: User },
  ];

  const switcherData = [];
  if (isAdmin) {
    switcherData.push({ name: "Admin", logo: Shield, url: "/admin" });
  }
  if (isSupplier) {
    switcherData.push({
      name: "Supplier",
      logo: PackageSearch,
      url: "/supplier",
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
