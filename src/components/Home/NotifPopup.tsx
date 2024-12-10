"use client";

import { useMediaQuery } from "react-responsive";
import {Popover, PopoverTrigger, PopoverContent} from "@/components/ui/popover";

interface NotificationPopupProps {
  showNotif: boolean;
}

export default function NotificationPopup({
  showNotif,
}: NotificationPopupProps) {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  if (isMobile || !showNotif) return null;

  return (
    <Popover open={showNotif}>
      <PopoverTrigger></PopoverTrigger>
      <PopoverContent
        align="end"
        side="top"
        className="absolute right-0 mt-2 bg-white p-4 shadow-lg rounded-md w-80 max-h-[500px] overflow-y-auto"
      >
        {/* Examples only:))) */}
        <h3 className="font-semibold text-lg">Notifications</h3>
        <div className="mt-2 space-y-2">
          <div className="bg-gray-100 p-2 rounded-md">
            <p className="text-gray-700">Notification 1</p>
          </div>
          <div className="bg-gray-100 p-2 rounded-md">
            <p className="text-gray-700">Notification 2</p>
          </div>
          <div className="bg-gray-100 p-2 rounded-md">
            <p className="text-gray-700">Notification 3</p>
          </div>
          <div className="bg-gray-100 p-2 rounded-md">
            <p className="text-gray-700">Notification 4</p>
          </div>
          <div className="bg-gray-100 p-2 rounded-md">
            <p className="text-gray-700">Notification 5</p>
          </div>
          <div className="bg-gray-100 p-2 rounded-md">
            <p className="text-gray-700">Notification 6</p>
          </div>
          <div className="bg-gray-100 p-2 rounded-md">
            <p className="text-gray-700">Notification 7</p>
          </div>
          <div className="bg-gray-100 p-2 rounded-md">
            <p className="text-gray-700">Notification 8</p>
          </div>
          <div className="bg-gray-100 p-2 rounded-md">
            <p className="text-gray-700">Notification 9</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
