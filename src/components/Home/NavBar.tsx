"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SheetMenu } from "./SheetMenu";
import { User, Supplier } from "@prisma/client";
import { useRouter } from "next/navigation";

interface NavbarProps {
  user: User;
  supplier: Supplier | null;
}

export default function NavBar({ user, supplier }: NavbarProps) {
  const router = useRouter();
  return (
    <nav className="w-full bg-rawmats-secondary-700 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* RAWMATS text */}
        <div className="flex justify-center py-4">
          <h1
            onClick={() => router.push("/")}
            className="text-3xl px-2 py-1 rounded-md text-white hover:cursor-pointer hover:bg-rawmats-secondary-900"
          >
            <span className="font-bold">RAW</span>MATS
          </h1>
        </div>

        {/* Menu and Search Bar */}
        <div className="flex items-center justify-between h-16">
          {/* Menu Button */}
          <div className="flex items-center">
            <SheetMenu user={user} supplier={supplier} />
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-rawmats-neutral-900" />
              </div>
              <Input
                type="search"
                placeholder="Search"
                className="w-full pl-10 bg-white text-rawmats-neutral-900 border-transparent focus:border-transparent focus:ring-0 rounded-full"
              />
            </div>
          </div>

          {/* Placeholder for right side to maintain layout */}
          <div className="w-10"></div>
        </div>
      </div>
    </nav>
  );
}
