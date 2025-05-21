"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { MapPin } from "lucide-react";
import MapComponent from "./MapComponent";

interface MapDialogProps {
  onConfirmLocation: (location: string, locationName: string) => void;
}

const MapDialog: React.FC<MapDialogProps> = ({ onConfirmLocation }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirmLocation = (location: string, locationName: string) => {
    setIsOpen(false);
    onConfirmLocation(location, locationName);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>
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
