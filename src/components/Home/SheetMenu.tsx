"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Menu,
  CircleUser,
  Building,
  ShieldEllipsis,
  LogOut,
  Flag,
  Heart,
} from "lucide-react";
import { User, Supplier } from "@prisma/client";
import { logout } from "../AuthHandlers/LoginHandler";

interface SheetMenuProps {
  user: User;
  supplier: Supplier | null;
}

export function SheetMenu({ user, supplier }: SheetMenuProps) {
  const router = useRouter();
  const isSupplier = !!supplier;
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const logoutUser = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.log(error);
      router.push(
        `/error?message=${encodeURIComponent("An unexpected error occurred")}&code=500`,
      );
    }
  };

  const goToFavorites = () => {
    router.push("/favorites");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="lg"
          className="text-rawmats-primary-900 hover:bg-rawmats-secondary-500 p-1"
        >
          <Menu size={36} strokeWidth={2} />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[300px] sm:w-[400px] flex flex-col"
      >
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.displayName}`}
              />
              <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{user.displayName}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
              <div className="flex space-x-2 mt-2">
                {isSupplier && <Badge>Supplier</Badge>}
                {user.role === "ADMIN" && (
                  <Badge variant="destructive">Admin</Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        <nav className="space-y-4 mt-4 flex-grow">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => router.push("/profile")}
          >
            <CircleUser className="mr-2" /> Profile
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={goToFavorites}
          >
            <Heart className="mr-2" /> Favorites
          </Button>
          {isSupplier ? (
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push("/supplier-dashboard")}
            >
              <Building className="mr-2" /> Supplier Dashboard
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push("/apply-supplier")}
            >
              <Building className="mr-2" /> Apply as a Supplier
            </Button>
          )}
          {user.role === "ADMIN" && (
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push("/admin")}
            >
              <ShieldEllipsis className="mr-2" />
              Admin Dashboard
            </Button>
          )}
          <Button variant="ghost" className="w-full justify-start">
            <Flag className="mr-2" />
            Report an Issue
          </Button>
        </nav>
        <SheetFooter>
          <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-100"
              >
                <LogOut className="mr-2" />
                Logout
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to log out?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  You will be redirected to the login page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={logoutUser}>
                  Log out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
