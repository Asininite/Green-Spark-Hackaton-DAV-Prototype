"use client"

import { useState } from "react"
import { MapPin, Layers } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { mockReports, categories } from "@/lib/mock-data"
import Image from "next/image";

export default function MapPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const filteredReports = mockReports.filter((report) => {
    const categoryMatch = selectedCategory === "all" || report.category === selectedCategory
    const statusMatch = selectedStatus === "all" || report.status === selectedStatus
    return categoryMatch && statusMatch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "cleaned":
        return "bg-green-500"
      case "in_progress":
        return "bg-yellow-500"
      default:
        return "bg-red-500"
    }
  }

  const getIntensityColor = (upvotes: number) => {
    if (upvotes > 100) return "bg-red-600"
    if (upvotes > 50) return "bg-orange-500"
    return "bg-yellow-500"
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <h1 className="text-xl font-bold text-gray-900 flex items-center mb-3">
          <MapPin className="h-5 w-5 text-green-600 mr-2" />
          Cleanup Heatmap
        </h1>

        <div className="grid grid-cols-2 gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="reported">Reported</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="cleaned">Cleaned</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="relative h-96 bg-gray-100 mx-4 mt-4 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Image src="/map.png" alt="Interactive Map" width={800} height={800} className="mx-auto mb-2" />
              <p className="text-gray-600 font-medium">Interactive Map</p>
              <p className="text-sm text-gray-500">Kochi, Kerala</p>
            </div>
          </div>

          {/* Mock map pins */}
          {filteredReports.map((report, index) => (
            <div
              key={report.id}
              className={`absolute w-4 h-4 rounded-full border-2 border-white shadow-lg ${getStatusColor(report.status)}`}
              style={{
                left: `${20 + index * 15}%`,
                top: `${30 + (index % 3) * 20}%`,
              }}
              title={report.description}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <Card className="mx-4 mt-4">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Layers className="h-5 w-5 mr-2" />
            Legend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Reported</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>In Progress</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Cleaned</span>
              </div>
            </div>

            <div className="pt-2 border-t">
              <span className="text-sm font-medium">Priority (by upvotes)</span>
              <div className="grid grid-cols-3 gap-2 text-xs mt-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>Low (&lt;50)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span>Medium (50-100)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-600"></div>
                  <span>High (100+)</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location List */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-3">Locations ({filteredReports.length})</h2>
        <div className="space-y-3">
          {filteredReports.map((report) => (
            <Card key={report.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(report.status)}`}></div>
                      <span className="font-medium text-sm">{report.location.address}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{report.description}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {report.category}
                      </Badge>
                      <span className="text-xs text-gray-500">{report.upvotes} upvotes</span>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full ${getIntensityColor(report.upvotes)} opacity-60`}></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
