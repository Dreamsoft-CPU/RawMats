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
    <Card className="min-w-[200px] max-w-[250px] relative">
      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
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

      <CardHeader>
        <CardTitle className="truncate">{album.name}</CardTitle>
        <CardDescription>{album.AlbumFavorite.length} items</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-square bg-muted rounded-md flex items-center justify-center overflow-hidden">
          {album.AlbumFavorite.length > 0 ? (
            <Image
              src={album.AlbumFavorite[0].favorite.product.image}
              alt={album.name}
              width={200}
              height={200}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-muted-foreground">No items</div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => router.push(`/favorites/album/${album.id}`)}
          variant="outline"
          size="sm"
          className="w-full"
        >
          View Album
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AlbumCard;
