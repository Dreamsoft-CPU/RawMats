"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import L, { LatLng } from "leaflet";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { MapComponentProps } from "@/lib/types/mapComponent.type";

const MapComponent: React.FC<MapComponentProps> = ({ onConfirmLocation }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [position, setPosition] = useState<LatLng | null>(null);
  const [googleMapsLink, setGoogleMapsLink] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const customIcon = L.divIcon({
    html: `<div class="w-8 h-8 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#ef4444" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    </div>`,
    className: "",
  });

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location Picker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 w-full rounded-md border bg-gray-100 animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  const LocationMarker = ({
    onLocationSelect,
  }: {
    onLocationSelect: (latlng: { lat: number; lng: number }) => void;
  }) => {
    useMapEvents({
      click: (e: { latlng: { lat: number; lng: number } }) => {
        onLocationSelect(e.latlng);
      },
    });
    return null;
  };

  const returnLocation = (location: string) => {
    if (location === "") {
      showErrorMessage("Location cannot be empty!");
    } else {
      onConfirmLocation(location);
    }
  };

  const handleLocationSelect = (latlng: { lat: number; lng: number }): void => {
    setPosition(new LatLng(latlng.lat, latlng.lng));
    setGoogleMapsLink(
      `https://www.google.com/maps?q=${latlng.lat},${latlng.lng}`,
    );
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location Picker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full rounded-md border overflow-hidden">
          <MapContainer
            center={[10.730715190944814, 122.54871368408205]}
            zoom={17}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker onLocationSelect={handleLocationSelect} />
            {position && <Marker position={position} icon={customIcon} />}
          </MapContainer>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Input
          value={googleMapsLink}
          readOnly
          placeholder="Click on map to generate Google Maps link"
          className="w-full"
        />
        <Button
          onClick={() => returnLocation(googleMapsLink)}
          disabled={!googleMapsLink}
          className="w-full"
        >
          Confirm Location
        </Button>
        {errorMessage && (
          <div className="text-sm text-feedback-error text-center">
            {errorMessage}
          </div>
        )}
        <div className="text-sm text-gray-500 text-center">
          Map data &copy;{" "}
          <a
            href="https://www.openstreetmap.org/copyright"
            className="text-blue-500 hover:text-blue-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenStreetMap
          </a>{" "}
          contributors
        </div>
      </CardFooter>
    </Card>
  );
};

export default MapComponent;
