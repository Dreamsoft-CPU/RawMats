"use client";

import React, { useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MapView from "./maps/mapView";

interface LocationSelectProps {
  apiKey: string;
  mapId: string;
  setBusinessAddress: (location: string) => void;
}

export default function LocationSelect({
  apiKey,
  mapId,
  setBusinessAddress,
}: LocationSelectProps) {
  const [address, setAddress] = useState<google.maps.LatLngLiteral | null>(
    null,
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    if (address) {
      setBusinessAddress(
        `https://www.google.com/maps/place/${address.lat},${address.lng}`,
      );
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="bg-[#0A0830] text-white border-[#5477e8a4] hover:bg-blue-500 transition-colors"
        >
          <MapPin className="h-4 w-4" />
          <span className="sr-only">Select location</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[95%] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Select location</DialogTitle>
          <DialogDescription>
            Pinpoint the location of your business on the map and confirm.
          </DialogDescription>
        </DialogHeader>
        <div className="h-[60vh] w-full">
          <MapView apiKey={apiKey} mapId={mapId} setAddress={setAddress} />
        </div>
        <DialogFooter className="sm:justify-start gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsOpen(false)}
          >
            Close
          </Button>
          {address && (
            <Button
              type="button"
              onClick={handleConfirm}
              className="bg-green-600 hover:bg-green-700"
            >
              Confirm Selection
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
