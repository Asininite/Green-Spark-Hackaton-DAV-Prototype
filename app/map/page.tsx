"use client";

import React, { useState, useEffect } from "react";
import MyMap from "@/components/MyMap";
import { createClient } from "@/lib/supabase/client";

export default function MapPage() {
  const supabase = createClient();
  const [locations, setLocations] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]); // To display the list below the map
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMapData = async () => {
      // For the map, we only need location data and maybe upvote count for weighting
      const { data, error } = await supabase
        .from('reports')
        .select('id, location, description, status, upvote_count, categories ( name )');
      
      if (error) {
        console.error("Error fetching map data:", error);
      } else {
        setLocations(data); // This data will be for the map heatmap/markers
        setReports(data); // This data will be for the list view
      }
      setLoading(false);
    };
    
    fetchMapData();
  }, []);

  if (loading) return <div className="p-6">Loading map data...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cleanup Heatmap</h1>
      {/* Pass the fetched locations to the map component */}
      <MyMap locations={locations} />

      {/* The rest of your page JSX can now map over the `reports` state */}
      <div className="mt-10">
        {/* ... (Filters can be wired up similar to the dashboard) ... */}
        <h2 className="text-lg font-semibold mb-2">Locations ({reports.length})</h2>
        <div className="space-y-4">
          {reports.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 shadow-sm">
              {/* ... (render item details using live data like item.location, item.description, etc.) ... */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}