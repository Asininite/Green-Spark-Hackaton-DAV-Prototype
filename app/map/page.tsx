"use client";

import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

export default function MyMap() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: "YOUR_API_KEY_HERE", // hardcode for testing only!
        version: "weekly",
      });

      const { Map } = await loader.importLibrary("maps");

      const position = { lat: 43.642693, lng: -79.3871189 };

      const mapOptions: google.maps.MapOptions = {
        center: position,
        zoom: 17,
      };

      if (mapRef.current) {
        new Map(mapRef.current, mapOptions);
      }
    };

    initMap();
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }}></div>;
}
