"use client";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Album } from "./albumTypes.type";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Album Card Component
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

const AlbumCard: React.FC<{ album: Album }> = ({ album }) => {
  const router = useRouter();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const deleteAlbum = async (id: string) => {
    try {
      const response = await fetch("/api/album", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete album");
      }

      return true;
    } catch (error) {
      console.error("Error deleting album:", error);
      throw error;
    }
  };
  return (
    <Card className="mobile-card w-full border border-blue-950 hover:border-primary card-hover overflow-hidden relative">
      <div className="absolute top-2 right-2 z-10 opacity-0 hover:opacity-100 transition-opacity duration-200 sm:opacity-100">
        <div className="bg-white/90 backdrop-blur-sm rounded-full p-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-gray-100"
              >
                <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setShowDeleteAlert(true)}
                className="text-destructive"
              >
                Delete Album
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the album {album.name} and remove it
              from your favorites.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                try {
                  await deleteAlbum(album.id);
                  toast("Album deleted successfully");
                  router.refresh();
                } catch (error) {
                  const message =
                    error instanceof Error
                      ? error.message
                      : "An error occurred";
                  toast.error(`Failed to delete album: ${message}`);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CardHeader className="p-0">
        <div className="mobile-card-image w-full overflow-hidden relative group">
          <div className="w-full h-full bg-muted rounded-t-xl flex items-center justify-center overflow-hidden">
            {album.AlbumFavorite.length > 0 ? (
              <Image
                src={album.AlbumFavorite[0].favorite.product.image}
                alt={album.name}
                width={300}
                height={300}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="text-mobile-sm text-muted-foreground">
                No items
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="mobile-card-content flex-1 flex flex-col">
        <CardTitle className="text-mobile-base font-semibold line-clamp-2 mb-1 min-h-[2rem] sm:min-h-[2.5rem] leading-tight">
          {album.name}
        </CardTitle>
        <CardDescription className="text-mobile-sm mb-3">
          {album.AlbumFavorite.length}{" "}
          {album.AlbumFavorite.length === 1 ? "item" : "items"}
        </CardDescription>

        <CardFooter className="p-0 mt-auto">
          <Button
            onClick={() => router.push(`/favorites/album/${album.id}`)}
            variant="outline"
            size="sm"
            className="w-full text-mobile-sm h-8 sm:h-9"
          >
            View Album
          </Button>
        </CardFooter>
      </CardContent>

      {/* Mobile-only menu button */}
      <div className="block sm:hidden absolute top-2 right-2 z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-full p-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-gray-100"
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setShowDeleteAlert(true)}
                className="text-destructive"
              >
                Delete Album
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
};

export default AlbumCard;
