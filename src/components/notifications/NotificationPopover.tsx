"use client";
import { useState } from "react";
import { Bell, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserDataProps } from "@/lib/interfaces/ProductListProps";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export function NotificationPopover({ userData }: UserDataProps) {
  // State to manage notifications locally
  const [notifications, setNotifications] = useState(userData.Notification);

  // Sort notifications by timestamp (newest first)
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const unreadCount = sortedNotifications.filter(
    (notification) => !notification.read,
  ).length;

  // Function to mark all notifications as read
  const markAllAsRead = async () => {
    const unreadNotificationIds = notifications
      .filter((notification) => !notification.read)
      .map((notification) => notification.id);

    if (unreadNotificationIds.length === 0) return;

    try {
      const response = await fetch("/api/notification", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: unreadNotificationIds }),
      });

      if (response.ok) {
        // Update local state
        setNotifications(
          notifications.map((notification) => ({
            ...notification,
            read: true,
          })),
        );
      } else {
        toast.error("Failed to mark notifications as read");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(`Failed to mark notifications as read: ${message}`);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <span className="relative p-2 cursor-pointer rounded-full hover:bg-gray-200 transition-colors">
          <Bell className="h-5 w-5" strokeWidth={3} size={24} />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
          )}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              {unreadCount > 0
                ? `You have ${unreadCount} unread ${
                    unreadCount === 1 ? "message" : "messages"
                  }.`
                : "No new notifications."}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 max-h-[300px] overflow-auto">
            <div>
              {sortedNotifications.length > 0 ? (
                sortedNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                  >
                    <span
                      className={cn(
                        "flex h-2 w-2 translate-y-1 rounded-full",
                        notification.read ? "bg-gray-300" : "bg-sky-500",
                      )}
                    />
                    <div className="space-y-1">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem
                          value={notification.id}
                          className="border-0"
                        >
                          <AccordionTrigger className="py-0 hover:no-underline">
                            <p className="text-sm font-medium leading-none text-left">
                              {notification.title.length > 50
                                ? `${notification.title.substring(0, 50)}...`
                                : notification.title}
                            </p>
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-sm">{notification.content}</p>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                      <p className="text-sm text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleTimeString(
                          [],
                          { hour: "2-digit", minute: "2-digit" },
                        )}{" "}
                        -{" "}
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-center text-muted-foreground">
                  No notifications
                </p>
              )}
            </div>
          </CardContent>
          {unreadCount > 0 && (
            <CardFooter>
              <Button className="w-full" onClick={markAllAsRead}>
                <Check className="mr-2 h-4 w-4" /> Mark all as read
              </Button>
            </CardFooter>
          )}
        </Card>
      </PopoverContent>
    </Popover>
  );
}
