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

  // Find the active page based on URL or default to the first page
  const [activePage, setActivePage] = React.useState(() => {
    const matchedPage = pages.find(
      (page) => pathname === page.url || pathname.startsWith(`${page.url}`)
    );
    return matchedPage || pages[0];
  });

  // Update active page when pathname changes
  React.useEffect(() => {
    const matchedPage = pages.find(
      (page) => pathname === page.url || pathname.startsWith(`${page.url}`)
    );
    if (matchedPage) {
      setActivePage(matchedPage);
    }
  }, [pathname, pages]);

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
