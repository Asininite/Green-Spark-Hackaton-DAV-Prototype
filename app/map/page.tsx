"use client";

import React, { useState, useEffect } from "react";
import MyMap from "@/components/MyMap";
import { createClient } from "@/lib/supabase/client";

export default function MapPage() {
  const supabase = createClient();
  const [locations, setLocations] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]); // For list below the map
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMapData = async () => {
      const { data, error } = await supabase
        .from("reports")
        .select("id, location, description, status, upvote_count, categories ( name )");

      if (error) {
        console.error("Error fetching map data:", error);
      }

      let finalData = data || [];

      // ✅ Add dummy data if nothing fetched
      if (!finalData.length) {
        finalData = [
          {
            id: "dummy1",
            location: { lat: 12.9716, lng: 77.5946 },
            description: "Garbage pile near park entrance",
            status: "pending",
            upvote_count: 5,
            categories: { name: "Public Area" },
          },
          {
            id: "dummy2",
            location: { lat: 12.9352, lng: 77.6245 },
            description: "Overflowing dustbin",
            status: "resolved",
            upvote_count: 3,
            categories: { name: "Dustbin Issue" },
          },
          {
            id: "dummy3",
            location: { lat: 12.9155, lng: 77.6101 },
            description: "Plastic waste near lake",
            status: "in-progress",
            upvote_count: 8,
            categories: { name: "Water Pollution" },
          },
        ];
      }

      setLocations(finalData);
      setReports(finalData);
      setLoading(false);
    };

    fetchMapData();
  }, []);

  if (loading) return <div className="p-6">Loading map data...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cleanup Heatmap</h1>

      {/* Map with markers/heatmap */}
      <MyMap locations={locations} />

      {/* Reports list */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-2">
          Locations ({reports.length})
        </h2>
        <div className="space-y-4">
          {reports.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 shadow-sm">
              <p className="font-medium">{item.description}</p>
              <p className="text-sm text-gray-600">
                Category: {item.categories?.name || "Uncategorized"}
              </p>
              <p className="text-sm text-gray-500">
                Status: {item.status} • Upvotes: {item.upvote_count}
              </p>
              <p className="text-xs text-gray-400">
                Lat: {item.location.lat}, Lng: {item.location.lng}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
