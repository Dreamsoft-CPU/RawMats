"use client";
import { Logs } from "lucide-react";
import React from "react";
import { useSidebar } from "../ui/sidebar";

const CustomSidebarTrigger = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <Logs
      size={32}
      strokeWidth={3}
      onClick={toggleSidebar}
      className="hover:bg-slate-300 hover:text-primary-500 p-1 rounded-md cursor-pointer transition-all duration-200 ease-in-out"
    />
  );
};

export default CustomSidebarTrigger;
