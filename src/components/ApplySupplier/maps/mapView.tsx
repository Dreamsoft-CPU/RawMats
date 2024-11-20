"use client";

import React, { useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  ControlPosition,
} from "@vis.gl/react-google-maps";
import MapHandler from "./mapHandler";
import { CustomMapControl } from "./mapControl";

const MapView = ({
  apiKey,
  mapId,
  setAddress,
}: {
  apiKey: string;
  mapId: string;
  setAddress: (location: null | google.maps.LatLngLiteral) => void;
}) => {
  const [markerKey, setMarkerKey] = useState(0);
  const [clickedPosition, setClickedPosition] =
    useState<null | google.maps.LatLngLiteral>(null);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        mapId={mapId}
        reuseMaps={true}
        style={{
          width: "100%",
          height: "100%",
          border: "1px solid black",
          borderRadius: "15px",
          overflow: "hidden",
        }}
        defaultCenter={{
          lat: 10.730833,
          lng: 122.548056,
        }}
        defaultZoom={15}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        onClick={(event) => {
          setClickedPosition(event.detail.latLng);
          setMarkerKey((prevKey) => prevKey + 1);
          setAddress(event.detail.latLng);
        }}
      >
        {/* this is for the search bar */}
        <CustomMapControl
          controlPosition={ControlPosition.TOP_CENTER}
          onPlaceSelect={setSelectedPlace}
        />

        {/* responsible for panning the map after selecting
        something from the search bar */}
        <MapHandler place={selectedPlace} />
      </Map>

      {clickedPosition && (
        <AdvancedMarker
          key={markerKey}
          className="drop"
          position={clickedPosition}
          zIndex={50}
        />
      )}
    </APIProvider>
  );
};
export default MapView;
