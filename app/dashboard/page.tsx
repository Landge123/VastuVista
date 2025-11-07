"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Users, FileText, Settings } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { DashboardStats } from "@/components/dashboard-stats"
import { AnalysisHistory } from "@/components/analysis-history"
import { AdminSettings } from "@/components/admin-settings"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [dashboardData, setDashboardData] = useState({
    totalAnalyses: 1247,
    averageScore: 72.4,
    totalUsers: 389,
    topRoomType: "bedroom",
    popularOrientation: "northeast",
    recentAnalyses: generateMockAnalyses(10),
  })

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader currentPage="dashboard" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Dashboard</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage and monitor Vastu analyses, user activities, and system performance
          </p>
        </div>

        {/* Key Stats */}
        <DashboardStats data={dashboardData} />

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            <TabsTrigger value="overview" className="text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
              <BarChart3 className="w-4 h-4 hidden sm:inline" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="analyses" className="text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
              <FileText className="w-4 h-4 hidden sm:inline" />
              <span>Analyses</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
              <Users className="w-4 h-4 hidden sm:inline" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
              <Settings className="w-4 h-4 hidden sm:inline" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Analysis Trends */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {[
                      { day: "Mon", count: 142, trend: "+5%" },
                      { day: "Tue", count: 156, trend: "+10%" },
                      { day: "Wed", count: 168, trend: "+8%" },
                      { day: "Thu", count: 145, trend: "-5%" },
                      { day: "Fri", count: 189, trend: "+30%" },
                      { day: "Sat", count: 172, trend: "-9%" },
                      { day: "Sun", count: 158, trend: "-8%" },
                    ].map((item) => (
                      <div key={item.day} className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.day}</span>
                        <div className="flex items-center gap-2 flex-1 ml-4">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${(item.count / 200) * 100}%` }} />
                          </div>
                          <span className="text-muted-foreground w-10 text-right">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Room Type Distribution */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {[
                      { type: "Bedroom", count: 387, percent: 31 },
                      { type: "Living Room", count: 298, percent: 24 },
                      { type: "Kitchen", count: 247, percent: 20 },
                      { type: "Office", count: 186, percent: 15 },
                      { type: "Meditation", count: 93, percent: 7 },
                      { type: "Entrance", count: 36, percent: 3 },
                    ].map((item) => (
                      <div key={item.type} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{item.type}</span>
                          <span className="text-muted-foreground">{item.count}</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${item.percent}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Score Distribution */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {[
                    { range: "80-100 (Excellent)", count: 298, percent: 24, color: "bg-green-600" },
                    { range: "60-79 (Good)", count: 623, percent: 50, color: "bg-amber-600" },
                    { range: "40-59 (Fair)", count: 267, percent: 21, color: "bg-orange-600" },
                    { range: "0-39 (Needs Work)", count: 59, percent: 5, color: "bg-red-600" },
                  ].map((item) => (
                    <div key={item.range} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.range}</span>
                        <span className="text-muted-foreground">
                          {item.count} ({item.percent}%)
                        </span>
                      </div>
                      <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: `${item.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analyses Tab */}
          <TabsContent value="analyses" className="mt-6">
            <AnalysisHistory analyses={dashboardData.recentAnalyses} />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6 mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b">
                        <tr>
                          <th className="text-left py-2 px-2 text-xs">User ID</th>
                          <th className="text-left py-2 px-2 text-xs">Analyses</th>
                          <th className="text-left py-2 px-2 text-xs">Avg Score</th>
                          <th className="text-left py-2 px-2 text-xs hidden sm:table-cell">Last Active</th>
                          <th className="text-left py-2 px-2 text-xs">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: "USR-001", analyses: 45, score: 78.2, active: "2 hours ago", status: "Active" },
                          { id: "USR-002", analyses: 32, score: 68.5, active: "1 day ago", status: "Active" },
                          { id: "USR-003", analyses: 28, score: 75.1, active: "3 days ago", status: "Inactive" },
                          { id: "USR-004", analyses: 51, score: 82.3, active: "1 hour ago", status: "Active" },
                          { id: "USR-005", analyses: 19, score: 71.4, active: "1 week ago", status: "Inactive" },
                        ].map((user) => (
                          <tr key={user.id} className="border-b hover:bg-muted/50 transition">
                            <td className="py-3 px-2 font-medium text-xs sm:text-sm">{user.id}</td>
                            <td className="py-3 px-2 text-xs sm:text-sm">{user.analyses}</td>
                            <td className="py-3 px-2 text-xs sm:text-sm">{user.score.toFixed(1)}</td>
                            <td className="py-3 px-2 text-muted-foreground text-xs hidden sm:table-cell">
                              {user.active}
                            </td>
                            <td className="py-3 px-2">
                              <span
                                className={`text-xs font-medium px-2 py-1 rounded-full ${
                                  user.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {user.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-6">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

function generateMockAnalyses(count: number) {
  const roomTypes = ["bedroom", "living-room", "kitchen", "office", "meditation", "entrance"]
  const orientations = ["north", "south", "east", "west", "northeast", "northwest", "southeast", "southwest"]

  return Array.from({ length: count }, (_, i) => ({
    id: `ANL-${String(i + 1).padStart(5, "0")}`,
    roomType: roomTypes[Math.floor(Math.random() * roomTypes.length)],
    orientation: orientations[Math.floor(Math.random() * orientations.length)],
    score: Math.floor(Math.random() * 40 + 50),
    date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    user: `User-${String(Math.floor(Math.random() * 389) + 1).padStart(3, "0")}`,
  }))
}
