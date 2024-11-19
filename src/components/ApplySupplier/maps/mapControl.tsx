import React from "react";
import { ControlPosition, MapControl } from "@vis.gl/react-google-maps";

import { PlaceAutocompleteClassic } from "./autocomplete";

type CustomAutocompleteControlProps = {
  controlPosition: ControlPosition;
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
};

export const CustomMapControl = ({
  controlPosition,
  onPlaceSelect,
}: CustomAutocompleteControlProps) => {
  return (
    <MapControl position={controlPosition}>
      <div className="flex flex-row gap-2 w-56 sm:w-96 mt-2">
        <PlaceAutocompleteClassic onPlaceSelect={onPlaceSelect} />
      </div>
    </MapControl>
  );
};
