"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { User, Supplier } from "@prisma/client";
import SearchModal from "./SearchModal";
import { SheetMenu } from "./SheetMenu";

interface NavbarProps {
  user: User;
  supplier: Supplier | null;
}

export default function NavBar({ user, supplier }: NavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="w-full bg-rawmats-secondary-700 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center py-4">
          <h1 className="text-3xl text-white">
            <span className="font-bold">RAW</span>MATS
          </h1>
        </div>

        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <SheetMenu user={user} supplier={supplier} />
          </div>

          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <div
                className="absolute inset-y-0 left-0 pl-3 flex items-center cursor-pointer"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5 text-rawmats-neutral-900" />
              </div>
              <Input
                type="text"
                placeholder="Search"
                className="w-full pl-10 bg-white text-rawmats-neutral-900 border-transparent focus:border-transparent focus:ring-0 rounded-full"
                onFocus={() => setIsSearchOpen(true)}
                readOnly
              />
            </div>
          </div>

          <div className="w-10"></div>
        </div>
      </div>

      {isSearchOpen && (
        <SearchModal onClose={() => setIsSearchOpen(false)} products={[]} />
      )}
    </nav>
  );
}
