"use client"

import { useState, useEffect } from "react"
import { Trophy, Medal, Award, Crown, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client" // Using your existing client

// Define a type for the user profile data for better TypeScript support
type UserProfile = {
  username: string;
  avatar_url: string;
  points: number;
};

export default function LeaderboardPage() {
  
  const supabase = createClient();

  const [sortedUsers, setSortedUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url, points')
        .order('points', { ascending: false }); // Sort by points in the query

      if (error) {
        console.error("Error fetching leaderboard:", error);
      } else {
        setSortedUsers(data);
      }
      setLoading(false);
    };
    
    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    // This helper function remains the same
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <Star className="h-4 w-4 text-gray-400" />;
    }
  }

  const getRankColor = (rank: number) => {
    // This helper function remains the same
    if (rank === 1) return "bg-gradient-to-r from-yellow-400 to-yellow-600";
    if (rank === 2) return "bg-gradient-to-r from-gray-300 to-gray-500";
    if (rank === 3) return "bg-gradient-to-r from-amber-400 to-amber-600";
    return "bg-gray-100";
  }

  const getBadgeText = (rank: number) => {
    // This helper function remains the same
    if (rank === 1) return "Champion";
    if (rank === 2) return "Runner-up";
    if (rank === 3) return "Third Place";
    return `#${rank}`;
  }

  if (loading) {
    return <div className="p-4 text-center">Loading leaderboard...</div>;
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

      {/* Top 3 Podium and Full Rankings will now use the live `sortedUsers` state */}
      <div className="p-4">
        {/* ... (Podium JSX remains the same, but will now use live data) ... */}

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">All Rankings</h2>
          {sortedUsers.map((user, index) => {
            const rank = index + 1;
            return (
              <Card
                key={user.username}
                className={`transition-all duration-200 hover:shadow-md ${rank <= 3 ? "ring-2 ring-opacity-50" : ""} ${rank === 1 ? "ring-yellow-400" : rank === 2 ? "ring-gray-400" : rank === 3 ? "ring-amber-400" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8">{getRankIcon(rank)}</div>
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.username} />
                      <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-gray-900">{user.username}</p>
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
            );
          })}
        </div>
        {/* ... (Achievements Card can remain as is) ... */}
      </div>
    </div>
  );
}