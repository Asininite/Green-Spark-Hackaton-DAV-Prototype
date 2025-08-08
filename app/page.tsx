"use client"

import { useState, useEffect } from "react"
import { PostCard } from "@/components/post-card"
import { Report } from "@/lib/mock-data" // We can still use this type
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, TrendingUp, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/client" // 👈 Import Supabase client

export default function FeedPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [sortBy, setSortBy] = useState<"upvotes" | "recent" | "cleaned">("upvotes")
  const [loading, setLoading] = useState(true)

  // 👇 This useEffect now fetches live data from Supabase
  useEffect(() => {
  const fetchReports = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('reports')
      .select(`
        id,
        created_at,
        is_anonymous,
        location,
        photo_url,
        description,
        tags,
        upvote_count,
        status,
        comments,
        profiles ( username, avatar_url ),
        categories ( name )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching reports:", error);
      setReports([]);
    } else {
      const formattedReports = data.map(report => {
        // Ensure profiles and categories exist and are not empty arrays
        const profile = Array.isArray(report.profiles) ? report.profiles[0] : report.profiles;
        const category = Array.isArray(report.categories) ? report.categories[0] : report.categories;

        return {
          ...report,
          upvotes: report.upvote_count,
          category: category?.name || 'Uncategorized', // Get name from category object
          user: {
            name: report.is_anonymous ? "Anonymous" : profile?.username || 'Unknown User',
            avatar: report.is_anonymous ? "/placeholder-user.jpg" : profile?.avatar_url,
            points: 0
          }
        };
      });
      setReports(formattedReports as unknown as Report[]);
    }
    setLoading(false);
  };

  fetchReports();
}, []);

  const handleUpvote = (id: string) => {
    // This function will need to be updated to interact with the 'upvotes' table in Supabase.
    // For now, it will optimistically update the local state.
    setReports((prev) => prev.map((report) => (report.id === id ? { ...report, upvotes: report.upvotes + 1 } : report)))
  }

  const sortedReports = [...reports].sort((a, b) => {
    switch (sortBy) {
      case "upvotes":
        return b.upvotes - a.upvotes
      case "recent":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case "cleaned":
        if (a.status === "cleaned" && b.status !== "cleaned") return -1
        if (b.status === "cleaned" && a.status !== "cleaned") return 1
        return b.upvotes - a.upvotes
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <div className="max-w-md mx-auto md:max-w-4xl p-4">
        <div className="space-y-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:space-y-0">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="w-full h-64 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto md:max-w-6xl">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40 md:px-6 md:py-4">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center">
            <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-green-600 mr-2" />
            EcoSnap Feed
          </h1>
          <div className="text-sm md:text-base text-gray-500">
            {reports.filter((r) => r.status === "cleaned").length} cleaned today
          </div>
        </div>

        <div className="flex items-center space-x-2 md:max-w-md">
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upvotes">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Most Upvoted
                </div>
              </SelectItem>
              <SelectItem value="recent">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Most Recent
                </div>
              </SelectItem>
              <SelectItem value="cleaned">
                <div className="flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Recently Cleaned
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Feed */}
      <div className="p-4 md:p-6">
        {sortedReports.length === 0 ? (
          <div className="text-center py-12">
            <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports yet</h3>
            <p className="text-gray-500 mb-4">Be the first to report garbage in your area!</p>
            <Button>Create First Report</Button>
          </div>
        ) : (
          <div className="space-y-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6 md:space-y-0">
            {sortedReports.map((report) => (
              <PostCard key={report.id} report={report} onUpvote={handleUpvote} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}