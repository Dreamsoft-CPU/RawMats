"use client";

import * as React from "react";
import { ChevronsRight } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function PageSwitcher({
  pages,
}: {
  pages: {
    name: string;
    logo: React.ElementType;
    url: string;
  }[];
}) {
  const { isMobile } = useSidebar();
  const pathname = usePathname();

  // Helper function to check if a path matches the current URL
  const isPathMatch = React.useCallback(
    (pagePath: string) => {
      // Special case for home page
      if (pagePath === "/") {
        // Home page handles all paths except those that explicitly belong to admin
        // or those that are in the supplier dashboard
        return !(
          pathname.startsWith("/admin") ||
          pathname.startsWith("/supplier/dashboard") ||
          pathname.startsWith("/supplier/products") ||
          pathname.startsWith("/supplier/profile") ||
          pathname.startsWith("/supplier/sales")
        );
      }

      // For supplier dashboard - match only specific supplier dashboard routes
      if (pagePath.includes("/supplier")) {
        // Check for specific supplier dashboard paths
        return (
          pathname.startsWith("/supplier/dashboard") ||
          pathname.startsWith("/supplier/products") ||
          pathname.startsWith("/supplier/profile") ||
          pathname.startsWith("/supplier/sales")
        );
      }

      // For admin section
      if (pagePath.includes("/admin")) {
        return pathname.startsWith("/admin");
      }

      return false;
    },
    [pathname]
  );

  // Find the active page based on URL or default to the first page
  const [activePage, setActivePage] = React.useState(() => {
    const matchedPage = pages.find((page) => isPathMatch(page.url));
    return matchedPage || pages[0];
  });

  // Update active page when pathname changes
  React.useEffect(() => {
    const matchedPage = pages.find((page) => isPathMatch(page.url));
    if (matchedPage) {
      setActivePage(matchedPage);
    }
  }, [pathname, pages, isPathMatch]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary bg-black text-sidebar-primary-foreground">
                <activePage.logo className="size-4 " />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activePage.name}
                </span>
              </div>
              {pages.length > 1 && <ChevronsRight className="ml-auto size-4" />}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          {pages.length > 1 && (
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg "
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              {pages.map((page, index) => (
                <Link href={page.url} key={index}>
                  <DropdownMenuItem
                    onClick={() => setActivePage(page)}
                    className="gap-2 p-2"
                  >
                    <div className="flex size-6 items-center justify-center rounded-sm border bg-black">
                      <page.logo className="size-4 shrink-0 text-white" />
                    </div>
                    {page.name}
                  </DropdownMenuItem>
                </Link>
              ))}
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
