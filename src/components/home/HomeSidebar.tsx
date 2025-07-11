"use client";

import { SidebarNavItems } from "@/lib/types/sidebarData.type";
import {
  BookOpen,
  Heart,
  HelpCircle,
  Home,
  Mail,
  PackageSearch,
  Shield,
} from "lucide-react";
import React from "react";
import { AppSidebar } from "../sidebar/AppSidebar";

interface HomeSidebarProps {
  data: {
    isSupplier: boolean;
    isAdmin: boolean;
    isSupplierPending: boolean;
    user: {
      name: string;
      email: string;
      avatar: string;
    };
  };
}

const HomeSidebar: React.FC<HomeSidebarProps> = ({
  data: { isSupplier, isAdmin, isSupplierPending, user },
}) => {
  const homeSidebarData: SidebarNavItems[] = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    { title: "Favorites", url: "/favorites", icon: Heart },
    {
      title: "Conversations",
      url: "/conversations",
      icon: Mail,
    },
    {
      title: "Instructions",
      url: "/instructions",
      icon: BookOpen,
    },
    {
      title: "Help Center",
      url: "https://www.dti.gov.ph/konsyumer/complaints/",
      icon: HelpCircle,
    },
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
  if (!isSupplierPending && !isSupplier) {
    homeSidebarData.push({
      title: "Apply as a Supplier",
      url: "/apply",
      icon: PackageSearch,
    });
  }

  const sidebarData = {
    items: homeSidebarData,
    user,
    pages: switcherData,
  };

  return <AppSidebar data={sidebarData} />;
};

export default HomeSidebar;
