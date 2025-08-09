"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BarChart3, Filter, CheckCircle, Clock, AlertTriangle, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"

export default function DashboardPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [reports, setReports] = useState<any[]>([]);
  const [filteredReports, setFilteredReports] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, reported: 0, inProgress: 0, cleaned: 0 });
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    const initializeDashboard = async () => {
      // Step 1: Verify user is an authority
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push('/auth');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, is_verified_authority')
        .eq('id', user.id)
        .single();

      if (profileError || !profile || !profile.is_verified_authority) {
        // If not a verified authority, redirect away
        alert("Access Denied: You are not a verified authority.");
        return router.push('/');
      }

      // Step 2: Fetch reports and categories
      const { data: reportsData, error: reportsError } = await supabase
  .from('reports')
  .select(`
    *,
    profiles:user_id ( username, avatar_url ),
    categories:category_id ( name )
  `)
  .order('created_at', { ascending: false }); 

      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*');

      if (reportsError || categoriesError) {
        console.error(reportsError || categoriesError);
      } else {
        setReports(reportsData);
        setFilteredReports(reportsData); // Initially show all reports
        setCategories(categoriesData);
        
        // Calculate stats
        setStats({
          total: reportsData.length,
          reported: reportsData.filter((r) => r.status === 'reported').length,
          inProgress: reportsData.filter((r) => r.status === 'in_progress').length,
          cleaned: reportsData.filter((r) => r.status === 'cleaned').length,
        });
      }
      setLoading(false);
    };

    initializeDashboard();
  }, [router]);
  
  // Effect for filtering reports when dropdowns change
  useEffect(() => {
    let result = reports;
    if (selectedCategory !== "all") {
      result = result.filter(r => r.categories.name === selectedCategory);
    }
    if (selectedStatus !== "all") {
      result = result.filter(r => r.status === selectedStatus);
    }
    setFilteredReports(result);
  }, [selectedCategory, selectedStatus, reports]);

  const handleMarkCleaned = async (reportId: string) => {
    // Update the report status in the database
    const { error } = await supabase
      .from('reports')
      .update({ status: 'cleaned' })
      .eq('id', reportId);

    if (error) {
      alert("Error updating report status.");
      console.error(error);
    } else {
      // Update the local state to reflect the change immediately
      const updatedReports = reports.map(r => r.id === reportId ? { ...r, status: 'cleaned' } : r);
      setReports(updatedReports);
      alert("Report marked as cleaned!");
    }
  };
  
  // ... (rest of the component, like getStatusColor, getPriorityLevel, etc.)
  // ... (The JSX part of your component can remain largely the same)
}