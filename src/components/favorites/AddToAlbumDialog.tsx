"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Album } from "./albumTypes.type";

interface AddToAlbumDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  albums: Album[];
  favoriteId: string;
}

const AddToAlbumDialog = ({
  open,
  setOpen,
  albums,
  favoriteId,
}: AddToAlbumDialogProps) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleAddToAlbum = async (albumId: string) => {
    try {
      setIsLoading(albumId);

      const response = await fetch(`/api/album/${albumId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          favoriteId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add to album");
      }

      toast.success("Added to album successfully");
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add to album",
      );
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Album</DialogTitle>
          <DialogDescription>
            Select an album to add this favorite to.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-60 pr-4">
          <div className="space-y-2">
            {albums.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No albums available. Create an album first.
              </p>
            ) : (
              albums.map((album) => (
                <Button
                  key={album.id}
                  variant="outline"
                  className="w-full justify-start text-left"
                  disabled={isLoading !== null}
                  onClick={() => handleAddToAlbum(album.id)}
                >
                  <div className="flex items-center w-full justify-between">
                    <span>{album.name}</span>
                    {isLoading === album.id ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : (
                      <Plus size={16} />
                    )}
                  </div>
                </Button>
              ))
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={isLoading !== null}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddToAlbumDialog;
