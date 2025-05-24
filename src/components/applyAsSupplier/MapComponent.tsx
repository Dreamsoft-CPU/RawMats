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
import { MapPin, Search } from "lucide-react";
import L, { LatLng } from "leaflet";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { MapComponentProps } from "@/lib/types/mapComponent.type";

// CPU Iloilo coordinates
const CPU_COORDINATES = {
  lat: 10.7275,
  lng: 122.5362,
};

const MapComponent: React.FC<MapComponentProps> = ({ onConfirmLocation }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [position, setPosition] = useState<LatLng | null>(null);
  const [googleMapsLink, setGoogleMapsLink] = useState("");
  const [locationName, setLocationName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    CPU_COORDINATES.lat,
    CPU_COORDINATES.lng,
  ]);
  const [mapKey, setMapKey] = useState<number>(0); // Used to force map re-render

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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      showErrorMessage("Please enter a location to search");
      return;
    }

    setSearchLoading(true);
    try {
      const response = await fetch(
        `/api/maps?q=${encodeURIComponent(searchQuery)}`,
      );

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setLocationName(display_name);

        // Update map center and position
        const newPosition = new LatLng(parseFloat(lat), parseFloat(lon));
        setPosition(newPosition);
        setMapCenter([parseFloat(lat), parseFloat(lon)]);
        setMapKey((prevKey) => prevKey + 1); // Force map re-render

        // Set Google Maps link
        setGoogleMapsLink(`https://www.google.com/maps?q=${lat},${lon}`);
      } else {
        showErrorMessage("Location not found");
      }
    } catch (error) {
      console.error("Search error:", error);
      showErrorMessage("Error searching for location");
    } finally {
      setSearchLoading(false);
    }
  };

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
      onConfirmLocation(location, locationName);
    }
  };

  const handleLocationSelect = async (latlng: {
    lat: number;
    lng: number;
  }): Promise<void> => {
    setPosition(new LatLng(latlng.lat, latlng.lng));
    const newGoogleMapsLink = `https://www.google.com/maps?q=${latlng.lat},${latlng.lng}`;
    setGoogleMapsLink(newGoogleMapsLink);

    // Fetch location name from coordinates using LocationIQ
    try {
      const response = await fetch(
        `/api/maps/reverse?lat=${latlng.lat}&lon=${latlng.lng}`,
      );
      if (response.ok) {
        const data = await response.json();
        // Format the display name to be more user-friendly
        const displayName = data.display_name || "Unknown location";
        setLocationName(displayName);
      } else {
        console.error("Failed to get location name");
        setLocationName("Unknown location");
      }
    } catch (error) {
      console.error("Error fetching location name:", error);
      setLocationName("Unknown location");
    }
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
        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="flex w-full items-center space-x-2 mb-4"
        >
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a location..."
            className="flex-1"
          />
          <Button type="submit" disabled={searchLoading}>
            {searchLoading ? (
              <div className="animate-spin w-4 h-4 border-2 border-t-transparent border-white rounded-full" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </form>

        <div className="h-96 w-full rounded-md border overflow-hidden">
          <MapContainer
            key={mapKey} // Force re-render when center changes
            center={mapCenter}
            zoom={17}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://locationiq.com">LocationIQ</a>'
              url="https://{s}-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key={accessToken}"
              accessToken={process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY || ""}
            />
            <LocationMarker onLocationSelect={handleLocationSelect} />
            {position && <Marker position={position} icon={customIcon} />}
          </MapContainer>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="w-full">
          <Input
            value={googleMapsLink}
            readOnly
            placeholder="Click on map to generate Google Maps link"
            className="w-full mb-2"
          />
          {locationName && (
            <div className="text-sm text-gray-600 overflow-hidden text-ellipsis">
              {locationName}
            </div>
          )}
        </div>
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
            href="https://locationiq.com"
            className="text-blue-500 hover:text-blue-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            LocationIQ
          </a>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MapComponent;
