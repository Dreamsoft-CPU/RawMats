import { Bell } from "lucide-react";
import React from "react";

const NotificationBell = () => {
  return (
    <Bell
      size={32}
      strokeWidth={3}
      className="hover:bg-slate-300 hover:text-primary-500 p-1 rounded-md cursor-pointer transition-all duration-200 ease-in-out"
    />
  );
};

export default NotificationBell;
