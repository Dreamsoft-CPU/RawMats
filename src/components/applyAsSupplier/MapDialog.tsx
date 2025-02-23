"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { MapPin } from "lucide-react";
import MapComponent from "./MapComponent";
import { MapComponentProps } from "@/lib/types/mapComponent.type";

const MapDialog: React.FC<MapComponentProps> = ({ onConfirmLocation }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirmLocation = (location: string) => {
    setIsOpen(!isOpen);
    onConfirmLocation(location);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(!isOpen)}>
          <MapPin />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <MapComponent onConfirmLocation={handleConfirmLocation} />
      </DialogContent>
    </Dialog>
  );
};

export default MapDialog;
