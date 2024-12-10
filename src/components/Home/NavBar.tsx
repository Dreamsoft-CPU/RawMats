"use client";

import { MagnifyingGlassIcon, BellIcon } from "@heroicons/react/24/outline"; 
import { Input } from "@/components/ui/input";
import { SheetMenu } from "./SheetMenu";
import { User, Supplier } from "@prisma/client";
import { useState } from "react";
import NotificationPopup from "./NotifPopup";
import { useMediaQuery } from "react-responsive";

interface NavbarProps {
  user: User;
  supplier: Supplier | null;
}

export default function NavBar({ user, supplier }: NavbarProps) {
  const [showNotif, setShowNotif] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const handleNotifClick = () => {
    if (isMobile) {
      window.location.href = "/user-notif";
    } else {
      setShowNotif((prev) => !prev);
    }
  };

  return (
    <nav className="w-full bg-rawmats-secondary-700 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* RAWMATS text */}
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
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-rawmats-neutral-900" />
              </div>
              <Input
                type="search"
                placeholder="Search"
                className="w-full pl-10 bg-white text-rawmats-neutral-900 border-transparent focus:border-transparent focus:ring-0 rounded-full"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4 relative">
            <div className="relative">
              <BellIcon
                className="h-6 w-6 text-rawmats-neutral-900 cursor-pointer"
                onClick={handleNotifClick}
              />
              {!isMobile && (
                <NotificationPopup showNotif={showNotif} />
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
