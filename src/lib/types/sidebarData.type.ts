import { LucideIcon } from "lucide-react";

export interface SidebarData {
  pages: {
    name: string;
    logo: LucideIcon;
    url: string;
  }[];
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  items: SidebarNavItems[];
}

export interface SidebarNavItems {
  title: string;
  url: string;
  icon?: LucideIcon;
}
