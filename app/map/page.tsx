"use client";

import React from "react";
import MyMap from "@/components/MyMap";

export default function MapPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cleanup Heatmap</h1>
      <MyMap />

      {/* Filters and Locations */}
      <div className="mt-10">
        {/* Filters */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-4">
            <select className="border rounded px-4 py-2">
              <option>All Categories</option>
              <option>Plastic Waste</option>
              <option>Cigarette Butts</option>
              <option>Construction Waste</option>
              <option>Organic Waste</option>
            </select>
            <select className="border rounded px-4 py-2">
              <option>All Status</option>
              <option>Pending</option>
              <option>Cleaned</option>
            </select>
          </div>
        </div>

        {/* Locations */}
        <h2 className="text-lg font-semibold mb-2">Locations (7)</h2>
        <div className="space-y-4">
          {[
            {
              location: "Palarivattom, Kochi",
              description:
                "Huge pile of plastic bags dumped near the service road. This has been here for weeks and is attracting stray animals.",
              category: "Plastic Waste",
              upvotes: 127,
              statusColor: "bg-red-500",
            },
            {
              location: "Marine Drive, Kochi",
              description:
                "Cigarette butts scattered all over the waterfront. Cleaned up during morning jog!",
              category: "Cigarette Butts",
              upvotes: 89,
              statusColor: "bg-green-500",
            },
            {
              location: "Kakkanad, Kochi",
              description:
                "Construction waste dumped illegally in residential area. Blocking drainage system.",
              category: "Construction Waste",
              upvotes: 156,
              statusColor: "bg-yellow-500",
            },
            {
              location: "Infopark, Kochi",
              description:
                "Food waste from nearby restaurants dumped behind office complex. Strong odor and flies.",
              category: "Organic Waste",
              upvotes: 73,
              statusColor: "bg-orange-500",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${item.statusColor}`}
                  ></span>
                  <h3 className="font-semibold">{item.location}</h3>
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                {item.description}
              </p>
              <div className="flex gap-4 items-center text-sm">
                <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                  {item.category}
                </span>
                <span className="text-gray-500">{item.upvotes} upvotes</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
