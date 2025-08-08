"use client";

import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

export default function MyMap() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        version: "weekly",
        libraries: ["visualization"],
      });

      // Import Map and HeatmapLayer from separate libraries
      const { Map } = await loader.importLibrary("maps");
      const { HeatmapLayer } = await loader.importLibrary("visualization");


      const position = { lat: 43.642693, lng: -79.3871189 };

      const mapOptions: google.maps.MapOptions = {
        center: position,
        zoom: 17,
      };

      if (mapRef.current) {
        const map = new Map(mapRef.current, mapOptions);

        const heatmapData = [
          new google.maps.LatLng(43.6425, -79.3871),
          new google.maps.LatLng(43.643, -79.3865),
          new google.maps.LatLng(43.6427, -79.3875),
        ];

        const heatmap = new HeatmapLayer({
          data: heatmapData,
          radius: 30,
          opacity: 0.7,
        });

        heatmap.setMap(map);
      }
    };

    initMap();
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
}
