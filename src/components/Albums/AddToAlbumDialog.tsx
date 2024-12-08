"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CreateAlbumDialog } from "./CreateAlbumDialog";

interface Album {
  id: string;
  name: string;
}

interface AddToAlbumDialogProps {
  userId: string;
  productId: string;
  albums: Album[];
}

export function AddToAlbumDialog({
  userId,
  productId,
  albums,
}: AddToAlbumDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const router = useRouter();

  const handleAddToAlbum = async () => {
    if (selectedAlbum) {
      try {
        const response = await fetch(
          `/api/albums/${selectedAlbum.id}/add-favorite`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, productId }),
          },
        );

        if (response.ok) {
          setOpen(false);
          setIsAlertOpen(false);
          router.refresh();
        } else {
          console.error("Failed to add to album");
        }
      } catch (error) {
        console.error("Error adding to album:", error);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          Add to Albums
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add to Album</DialogTitle>
        </DialogHeader>
        {albums.length > 0 ? (
          <ScrollArea className="h-[300px] pr-4">
            {albums.map((album) => (
              <Button
                key={album.id}
                variant="ghost"
                className="w-full justify-start mb-2"
                onClick={() => {
                  setSelectedAlbum(album);
                  setIsAlertOpen(true);
                }}
              >
                {album.name}
              </Button>
            ))}
          </ScrollArea>
        ) : (
          <div className="text-center py-4">
            <p className="mb-4">{"You don't have any albums yet."}</p>
            <CreateAlbumDialog userId={userId} />
          </div>
        )}
      </DialogContent>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Add to Album</AlertDialogTitle>
            <AlertDialogDescription>
              {`Are you sure you want to add this item to the album "
              ${selectedAlbum?.name}"?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAddToAlbum}
              className="bg-rawmats-primary-500 text-white hover:bg-rawmats-primary-700"
            >
              Add to Album
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
