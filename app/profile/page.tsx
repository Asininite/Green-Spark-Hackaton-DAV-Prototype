"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { User, LogOut, Calendar, MapPin, Trophy, Heart, MessageCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"

// Define types for the data we expect from Supabase
type UserProfile = {
  id: string;
  username: string;
  avatar_url: string;
  points: number;
  created_at: string;
};
type UserReport = {
  id: string;
  photo_url: string;
  status: 'reported' | 'in_progress' | 'cleaned';
  created_at: string;
  location: string;
  description: string;
  upvote_count: number;
  comments: any[]; // You can define a stricter type for comments later
  category: string; // Assuming you will join to get category name
};

export default function ProfilePage() {
  const supabase = createClient();
  const router = useRouter()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)
  const [userPosts, setUserPosts] = useState<UserReport[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      // 1. Get the current user session
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // 2. Fetch their specific profile from the 'profiles' table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single(); // Use .single() as we expect only one record

        // 3. Fetch only the reports created by this user
        const { data: reports, error: reportsError } = await supabase
          .from('reports')
          .select('*, categories(name)') // Join with categories to get the name
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (profileError || reportsError) {
          console.error(profileError || reportsError);
        } else {
          setCurrentUser(profile);
          // Map category object to a simple string
          const formattedReports = reports.map(r => ({ ...r, category: r.categories.name }));
          setUserPosts(formattedReports);
        }
      } else {
        router.push('/auth'); // If no user is logged in, redirect to auth page
      }
      setLoading(false);
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };
  
  if (loading || !currentUser) {
    return <div className="p-6 text-center">Loading your profile...</div>;
  }

  const userStats = {
    totalPosts: userPosts.length,
    totalUpvotes: userPosts.reduce((sum, post) => sum + post.upvote_count, 0),
    cleanedPosts: userPosts.filter(post => post.status === "cleaned").length,
    joinDate: new Date(currentUser.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  };

  return (
    <div className="max-w-md mx-auto md:max-w-4xl p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <User className="h-6 w-6 md:h-8 md:w-8 text-green-600 mr-3" />
          My Profile
        </h1>
        <p className="text-gray-600">Manage your CleanSweep account and view your impact</p>
      </div>

      <div className="space-y-6 md:grid md:grid-cols-3 md:gap-8 md:space-y-0">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={currentUser.avatar_url || "/placeholder.svg"} alt={currentUser.username} />
                  <AvatarFallback className="text-2xl">{currentUser.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold text-gray-900 mb-1">{currentUser.username}</h2>
                <div className="flex items-center justify-center text-green-600 mb-4">
                  <Trophy className="h-4 w-4 mr-1" />
                  <span className="font-semibold">{currentUser.points} points</span>
                </div>
                {/* ... (The rest of your JSX can now use the `currentUser` and `userPosts` states) ... */}
              </div>
            </CardContent>
          </Card>
          {/* ... (Continue updating the rest of the page to use live data) ... */}
        </div>
        
        <div className="md:col-span-2">
          {/* ... Map over `userPosts` state here to render the list of reports ... */}
        </div>
      </div>
    </div>
  )
}