"use client"

import { useState } from "react"
import { BarChart3, Filter, CheckCircle, Clock, AlertTriangle, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { mockReports, categories } from "@/lib/mock-data"

export default function DashboardPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const filteredReports = mockReports.filter((report) => {
    const categoryMatch = selectedCategory === "all" || report.category === selectedCategory
    const statusMatch = selectedStatus === "all" || report.status === selectedStatus
    return categoryMatch && statusMatch
  })

  const stats = {
    total: mockReports.length,
    reported: mockReports.filter((r) => r.status === "reported").length,
    inProgress: mockReports.filter((r) => r.status === "in_progress").length,
    cleaned: mockReports.filter((r) => r.status === "cleaned").length,
  }

  const handleMarkCleaned = (reportId: string) => {
    // In a real app, this would update the database
    alert(`Report ${reportId} marked as cleaned!`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "cleaned":
        return "text-green-600 bg-green-100"
      case "in_progress":
        return "text-yellow-600 bg-yellow-100"
      default:
        return "text-red-600 bg-red-100"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "cleaned":
        return <CheckCircle className="h-4 w-4" />
      case "in_progress":
        return <Clock className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getPriorityLevel = (upvotes: number) => {
    if (upvotes > 100) return { level: "High", color: "bg-red-100 text-red-800" }
    if (upvotes > 50) return { level: "Medium", color: "bg-yellow-100 text-yellow-800" }
    return { level: "Low", color: "bg-green-100 text-green-800" }
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <h1 className="text-xl font-bold text-gray-900 flex items-center">
          <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
          Authority Dashboard
        </h1>
        <p className="text-sm text-gray-600 mt-1">Kochi Municipal Corporation</p>
      </div>

      {/* Stats Overview */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Reports</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.reported}</div>
              <div className="text-sm text-gray-600">Needs Action</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.cleaned}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
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
          </CardContent>
        </Card>

        {/* Reports List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Reports ({filteredReports.length})</h2>

          {filteredReports.map((report) => {
            const priority = getPriorityLevel(report.upvotes)

            return (
              <Card key={report.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={report.user.avatar || "/placeholder.svg"} alt={report.user.name} />
                      <AvatarFallback>{report.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(report.status)}>
                            {getStatusIcon(report.status)}
                            <span className="ml-1 capitalize">{report.status.replace("_", " ")}</span>
                          </Badge>
                          <Badge className={priority.color}>{priority.level} Priority</Badge>
                        </div>
                        <span className="text-xs text-gray-500">{report.upvotes} upvotes</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="truncate">{report.location.address}</span>
                      </div>

                      <p className="text-sm text-gray-900 mb-2">{report.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">
                            {report.category}
                          </Badge>
                          {report.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {report.status === "reported" && (
                          <Button size="sm" onClick={() => handleMarkCleaned(report.id)} className="ml-2">
                            Mark Cleaned
                          </Button>
                        )}
                      </div>

                      {report.comments.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="text-sm">
                            <span className="font-medium">{report.comments[0].user}:</span>
                            <span className="text-gray-700 ml-1">{report.comments[0].text}</span>
                          </div>
                          {report.comments.length > 1 && (
                            <button className="text-xs text-blue-600 mt-1">
                              View all {report.comments.length} comments
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-12 bg-transparent">
                <AlertTriangle className="h-4 w-4 mr-2" />
                High Priority
              </Button>
              <Button variant="outline" className="h-12 bg-transparent">
                <MapPin className="h-4 w-4 mr-2" />
                View Map
              </Button>
              <Button variant="outline" className="h-12 bg-transparent">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              <Button variant="outline" className="h-12 bg-transparent">
                <CheckCircle className="h-4 w-4 mr-2" />
                Bulk Actions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
