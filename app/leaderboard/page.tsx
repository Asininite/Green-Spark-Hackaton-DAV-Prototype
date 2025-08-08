"use client"

import { Trophy, Medal, Award, Crown, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { mockUsers } from "@/lib/mock-data"
import { createClient } from "@/lib/supabase/client"

export default function LeaderboardPage() {
  const sortedUsers = [...mockUsers].sort((a, b) => b.points - a.points)
  const supabase = createClient();
  
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <Star className="h-4 w-4 text-gray-400" />
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600"
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500"
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600"
      default:
        return "bg-gray-100"
    }
  }

  const getBadgeText = (rank: number) => {
    switch (rank) {
      case 1:
        return "Champion"
      case 2:
        return "Runner-up"
      case 3:
        return "Third Place"
      default:
        return `#${rank}`
    }
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <h1 className="text-xl font-bold text-gray-900 flex items-center">
          <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
          Leaderboard
        </h1>
        <p className="text-sm text-gray-600 mt-1">Top community cleaners this month</p>
      </div>

      {/* Top 3 Podium */}
      <div className="p-4">
        <Card className="mb-6 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <CardTitle className="text-center">🏆 Top Performers</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex items-end justify-center py-6 bg-gradient-to-b from-green-50 to-white">
              {/* Second Place */}
              {sortedUsers[1] && (
                <div className="flex flex-col items-center mx-2">
                  <Avatar className="h-16 w-16 mb-2 ring-4 ring-gray-300">
                    <AvatarImage src={sortedUsers[1].avatar || "/placeholder.svg"} alt={sortedUsers[1].name} />
                    <AvatarFallback>{sortedUsers[1].name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-300 text-gray-800 px-3 py-1 rounded-full text-sm font-bold mb-1">2nd</div>
                  <div className="text-center">
                    <p className="font-semibold text-sm">{sortedUsers[1].name}</p>
                    <p className="text-xs text-gray-600">{sortedUsers[1].points} pts</p>
                  </div>
                  <div className="w-16 h-12 bg-gray-300 mt-2 rounded-t"></div>
                </div>
              )}

              {/* First Place */}
              {sortedUsers[0] && (
                <div className="flex flex-col items-center mx-2">
                  <Avatar className="h-20 w-20 mb-2 ring-4 ring-yellow-400">
                    <AvatarImage src={sortedUsers[0].avatar || "/placeholder.svg"} alt={sortedUsers[0].name} />
                    <AvatarFallback>{sortedUsers[0].name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold mb-1">1st</div>
                  <div className="text-center">
                    <p className="font-semibold text-sm">{sortedUsers[0].name}</p>
                    <p className="text-xs text-gray-600">{sortedUsers[0].points} pts</p>
                  </div>
                  <div className="w-16 h-16 bg-yellow-400 mt-2 rounded-t"></div>
                </div>
              )}

              {/* Third Place */}
              {sortedUsers[2] && (
                <div className="flex flex-col items-center mx-2">
                  <Avatar className="h-16 w-16 mb-2 ring-4 ring-amber-500">
                    <AvatarImage src={sortedUsers[2].avatar || "/placeholder.svg"} alt={sortedUsers[2].name} />
                    <AvatarFallback>{sortedUsers[2].name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="bg-amber-500 text-amber-900 px-3 py-1 rounded-full text-sm font-bold mb-1">3rd</div>
                  <div className="text-center">
                    <p className="font-semibold text-sm">{sortedUsers[2].name}</p>
                    <p className="text-xs text-gray-600">{sortedUsers[2].points} pts</p>
                  </div>
                  <div className="w-16 h-8 bg-amber-500 mt-2 rounded-t"></div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Full Rankings */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">All Rankings</h2>
          {sortedUsers.map((user, index) => {
            const rank = index + 1
            return (
              <Card
                key={user.name}
                className={`transition-all duration-200 hover:shadow-md ${rank <= 3 ? "ring-2 ring-opacity-50" : ""} ${rank === 1 ? "ring-yellow-400" : rank === 2 ? "ring-gray-400" : rank === 3 ? "ring-amber-400" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8">{getRankIcon(rank)}</div>

                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        {rank <= 3 && (
                          <Badge className={getRankColor(rank)} variant="secondary">
                            {getBadgeText(rank)}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{user.points} points</p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">#{rank}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Achievement Badges */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">🏅 Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl mb-1">🌱</div>
                <p className="text-xs font-medium">Eco Starter</p>
                <p className="text-xs text-gray-600">First report</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl mb-1">🔥</div>
                <p className="text-xs font-medium">On Fire</p>
                <p className="text-xs text-gray-600">5 reports in a day</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl mb-1">👑</div>
                <p className="text-xs font-medium">Community Hero</p>
                <p className="text-xs text-gray-600">100+ upvotes</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl mb-1">✨</div>
                <p className="text-xs font-medium">Clean Sweep</p>
                <p className="text-xs text-gray-600">10 cleanups</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
