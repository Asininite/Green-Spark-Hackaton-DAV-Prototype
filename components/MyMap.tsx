"use client";

import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

// The component now accepts a 'locations' prop
export default function MyMap({ locations }: { locations: any[] }) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_Maps_API_KEY || "",
        version: "weekly",
        libraries: ["visualization"],
      });

      const { Map } = await loader.importLibrary("maps");
      const { HeatmapLayer } = await loader.importLibrary("visualization");

      // Center the map on Kochi, Kerala
      const position = { lat: 9.9312, lng: 76.2673 };

      const mapOptions: google.maps.MapOptions = {
        center: position,
        zoom: 12, // Zoom out a bit to see the whole city
      };

      if (mapRef.current) {
        const map = new Map(mapRef.current, mapOptions);

        // Convert your report locations into Google Maps LatLng objects
        // THIS IS A PLACEHOLDER - you need to convert your text locations to lat/lng
        // A real app would use a Geocoding service for this.
        const heatmapData = [
          new google.maps.LatLng(9.9312, 76.2673),
          new google.maps.LatLng(10.00, 76.30),
          // locations.map(loc => new google.maps.LatLng(loc.latitude, loc.longitude))
        ];

        const heatmap = new HeatmapLayer({
          data: heatmapData,
          radius: 30,
        });

        heatmap.setMap(map);
      }
    };

    initMap();
  }, [locations]); // Re-run the effect if locations change

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
}