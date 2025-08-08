"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, LogOut, Calendar, MapPin, Trophy, Heart, MessageCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { mockReports, mockUsers } from "@/lib/mock-data"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  // Mock current user data
  const currentUser = mockUsers[0] // EcoWarrior22
  const userPosts = mockReports.filter(report => report.user.name === currentUser.name)

  const handleLogout = () => {
    // In a real app, this would clear auth tokens, etc.
    alert("Logged out successfully!")
    router.push("/")
    setShowLogoutConfirm(false)
  }

  const userStats = {
    totalPosts: userPosts.length,
    totalUpvotes: userPosts.reduce((sum, post) => sum + post.upvotes, 0),
    cleanedPosts: userPosts.filter(post => post.status === "cleaned").length,
    joinDate: "March 2024"
  }

  return (
    <div className="max-w-md mx-auto md:max-w-4xl p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <User className="h-6 w-6 md:h-8 md:w-8 text-green-600 mr-3" />
          My Profile
        </h1>
        <p className="text-gray-600">Manage your CleanSweep account and view your impact</p>
      </div>

      <div className="space-y-6 md:grid md:grid-cols-3 md:gap-8 md:space-y-0">
        {/* Profile Info */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                  <AvatarFallback className="text-2xl">{currentUser.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold text-gray-900 mb-1">{currentUser.name}</h2>
                <div className="flex items-center justify-center text-green-600 mb-4">
                  <Trophy className="h-4 w-4 mr-1" />
                  <span className="font-semibold">{currentUser.points} points</span>
                </div>
                <div className="flex items-center justify-center text-sm text-gray-600 mb-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Joined {userStats.joinDate}</span>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Eco Warrior
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{userStats.totalPosts}</div>
                  <div className="text-sm text-gray-600">Reports</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{userStats.cleanedPosts}</div>
                  <div className="text-sm text-gray-600">Cleaned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{userStats.totalUpvotes}</div>
                  <div className="text-sm text-gray-600">Upvotes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">#{mockUsers.findIndex(u => u.name === currentUser.name) + 1}</div>
                  <div className="text-sm text-gray-600">Rank</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logout Section */}
          <Card className="border-red-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Actions</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Need to switch accounts or take a break?
                </p>
                {!showLogoutConfirm ? (
                  <Button
                    variant="destructive"
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-red-600 font-medium">Are you sure you want to log out?</p>
                    <div className="flex space-x-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleLogout}
                        className="flex-1"
                      >
                        Yes, Log Out
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowLogoutConfirm(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts Section */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>My Reports ({userPosts.length})</span>
                <Button variant="outline" size="sm" onClick={() => router.push("/report")}>
                  Create New Report
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userPosts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">You haven't posted anything!</h3>
                  <p className="text-gray-600 mb-4">
                    Start making a difference by reporting garbage in your community.
                  </p>
                  <Button onClick={() => router.push("/report")} className="bg-green-600 hover:bg-green-700">
                    Create Your First Report
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userPosts.map((post) => (
                    <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex space-x-4">
                          <Image
                            src={post.photo_url || "/placeholder.svg"}
                            alt="Report"
                            width={80}
                            height={80}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <Badge
                                className={
                                  post.status === "cleaned"
                                    ? "bg-green-100 text-green-800"
                                    : post.status === "in_progress"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }
                              >
                                {post.status === "cleaned" ? "✅ Cleaned" : 
                                 post.status === "in_progress" ? "🔄 In Progress" : "📍 Reported"}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(post.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span className="truncate">{post.location.address}</span>
                            </div>
                            <p className="text-sm text-gray-900 line-clamp-2 mb-3">{post.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <Heart className="h-4 w-4 mr-1" />
                                  <span>{post.upvotes}</span>
                                </div>
                                <div className="flex items-center">
                                  <MessageCircle className="h-4 w-4 mr-1" />
                                  <span>{post.comments.length}</span>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {post.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
