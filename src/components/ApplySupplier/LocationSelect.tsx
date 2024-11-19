"use client";

import React, { useState } from "react";
import MapView from "./maps/MapView";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPinIcon } from "@heroicons/react/24/outline";

function LocationSelect({
  apiKey,
  mapId,
  setBusinessAddress,
}: {
  apiKey: string;
  mapId: string;
  setBusinessAddress: (location: null | string) => void;
}) {
  const [address, setAddress] = useState<null | google.maps.LatLngLiteral>(
    null,
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="h-11 flex items-center">
          <Button
            type="button"
            variant="default"
            className="p-2 bg-[#0A0830] text-white border border-[#5477e8a4] rounded hover:bg-blue-500 transition-colors"
          >
            <MapPinIcon className="h-7 w-6 text-white" aria-hidden="true" />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="min-w-[95%] overflow-y-scroll max-h-screen">
        <DialogHeader>
          <DialogTitle>Select location</DialogTitle>
          <DialogDescription>
            Pinpoint the location of your business on the map and submit.
          </DialogDescription>
        </DialogHeader>
        <div className="flex h-[600px] md:h-[500px] w-full">
          <MapView apiKey={apiKey} mapId={mapId} setAddress={setAddress} />
        </div>
        <DialogFooter className={`sm:justify-start ${address && "gap-3"}`}>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          {address && (
            <DialogClose asChild>
              <Button
                type="button"
                variant="default"
                onClick={() => {
                  setBusinessAddress(
                    `https://www.google.com/maps/place/${address.lat},${address.lng}`,
                  );
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                Confirm Selection
              </Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default LocationSelect;
