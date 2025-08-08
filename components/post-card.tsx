"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, MessageCircle, MapPin, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Report } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface PostCardProps {
  report: Report
  onUpvote?: (id: string) => void
}

export function PostCard({ report, onUpvote }: PostCardProps) {
  const [isUpvoted, setIsUpvoted] = useState(false)
  const [showAfterPhoto, setShowAfterPhoto] = useState(false)

  const handleUpvote = () => {
    setIsUpvoted(!isUpvoted)
    onUpvote?.(report.id)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "cleaned":
        return "bg-green-100 text-green-800 border-green-200"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-red-100 text-red-800 border-red-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "cleaned":
        return <CheckCircle className="h-3 w-3" />
      case "in_progress":
        return <Clock className="h-3 w-3" />
      default:
        return <AlertTriangle className="h-3 w-3" />
    }
  }

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  return (
    <Card
      className={cn(
        "mb-4 md:mb-0 overflow-hidden transition-all duration-300 h-fit",
        report.status === "cleaned" && "ring-2 ring-green-200 bg-green-50/30",
        report.status === "in_progress" && "ring-2 ring-yellow-200 bg-yellow-50/30",
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8 md:h-10 md:w-10">
              <AvatarImage src={report.user.avatar || "/placeholder.svg"} alt={report.user.name} />
              <AvatarFallback>{report.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm truncate">{report.user.name}</p>
              <div className="flex items-center text-xs text-gray-500 space-x-1 flex-wrap">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span>{report.location.address}</span>
                <span>•</span>
                <span>{timeAgo(report.created_at)}</span>
              </div>
            </div>
          </div>
          {/* <Badge className={cn("text-xs flex-shrink-0", getStatusColor(report.status))}>
            {getStatusIcon(report.status)}
            <span className="ml-1 capitalize">{report.status.replace("_", " ")}</span>
          </Badge> */}
        </div>
      </CardHeader>

      <CardContent className="px-0 py-0">
        <div className="relative">
          {report.status === "cleaned" && report.after_photo_url ? (
            <div className="relative">
              <Image
                src={showAfterPhoto ? report.after_photo_url : report.photo_url}
                alt="Report photo"
                width={600}
                height={400}
                className="w-full h-48 md:h-56 object-cover"
              />
              <div className="absolute top-2 right-2">
                <Button
                  size="sm"
                  variant={showAfterPhoto ? "default" : "secondary"}
                  onClick={() => setShowAfterPhoto(!showAfterPhoto)}
                  className="text-xs"
                >
                  {showAfterPhoto ? "Before" : "After"}
                </Button>
              </div>
              {showAfterPhoto && (
                <div className="absolute bottom-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                  ✨ Cleaned!
                </div>
              )}
            </div>
          ) : (
            <Image
              src={report.photo_url || "/placeholder.svg"}
              alt="Report photo"
              width={600}
              height={400}
              className="w-full h-48 md:h-56 object-cover"
            />
          )}
        </div>

        <div className="px-4 py-3">
          <div className="flex flex-wrap gap-1 mb-2">
            <Badge variant="outline" className="text-xs">
              {report.category}
            </Badge>
            {report.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {report.tags.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{report.tags.length - 2}
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{report.description}</p>
        </div>
      </CardContent>

      <CardFooter className="flex-col items-start pt-0 pb-3 px-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUpvote}
              className={cn("flex items-center space-x-1 hover:bg-red-50", isUpvoted && "text-red-600")}
            >
              <Heart className={cn("h-4 w-4", isUpvoted && "fill-current")} />
              <span className="text-sm font-medium">{report.upvotes + (isUpvoted ? 1 : 0)}</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center space-x-1 hover:bg-blue-50">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">{report.comments.length}</span>
            </Button>
          </div>
        </div>

        {report.comments.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100 w-full">
            <div className="space-y-2">
              {report.comments.slice(0, 1).map((comment, index) => (
                <div key={index} className="text-sm">
                  <span className="font-medium text-gray-900">{comment.user}</span>
                  <span className="text-gray-700 ml-2 line-clamp-2">{comment.text}</span>
                  <span className="text-gray-400 ml-2 text-xs">{comment.timestamp}</span>
                </div>
              ))}
              {report.comments.length > 1 && (
                <button className="text-gray-500 text-sm hover:text-gray-700">
                  View all {report.comments.length} comments
                </button>
              )}
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
