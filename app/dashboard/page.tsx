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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, is_verified_authority')
        .eq('id', user.id)
        .single();

      if (profileError || !profile || !profile.is_verified_authority) {
        alert("Access Denied: You are not a verified authority.");
        router.push('/');
        return;
      }

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
        setReports(reportsData || []);
        setFilteredReports(reportsData || []);
        setCategories(categoriesData || []);
        
        const total = reportsData?.length || 0;
        const reported = reportsData?.filter((r) => r.status === 'reported').length || 0;
        const inProgress = reportsData?.filter((r) => r.status === 'in_progress').length || 0;
        const cleaned = reportsData?.filter((r) => r.status === 'cleaned').length || 0;

        setStats({ total, reported, inProgress, cleaned });
      }
      setLoading(false);
    };

    initializeDashboard();
  }, [router, supabase]);

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
    const { error } = await supabase
      .from('reports')
      .update({ status: 'cleaned' })
      .eq('id', reportId);

    if (error) {
      alert("Error updating report status.");
      console.error(error);
    } else {
      const updatedReports = reports.map(r => r.id === reportId ? { ...r, status: 'cleaned' } : r);
      setReports(updatedReports);
      alert("Report marked as cleaned!");
    }
  };

  if (loading) {
    return <div>Loading Dashboard...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center"><BarChart3 className="mr-2"/>Authority Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Action</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reported}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cleaned}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center"><Filter className="mr-2"/>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex space-x-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="reported">Reported</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="cleaned">Cleaned</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Reports ({filteredReports.length})</h2>
        <div className="space-y-4">
          {filteredReports.map(report => (
            <Card key={report.id}>
              <CardContent className="p-4 flex items-start space-x-4">
                <Avatar>
                  <AvatarImage src={report.profiles.avatar_url} />
                  <AvatarFallback>{report.profiles.username.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">{report.location}</p>
                    <Badge variant={report.status === 'cleaned' ? 'default' : 'destructive'}>{report.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{report.description}</p>
                  <div className="flex space-x-2 mt-2">
                    <Badge variant="secondary">{report.categories.name}</Badge>
                  </div>
                </div>
                <Button 
                  onClick={() => handleMarkCleaned(report.id)} 
                  disabled={report.status === 'cleaned'}
                >
                  Mark Cleaned
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}