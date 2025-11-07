"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, Lightbulb } from "lucide-react"

interface DashboardStatsProps {
  data: {
    totalAnalyses: number
    averageScore: number
    totalUsers: number
    topRoomType: string
    popularOrientation: string
    recentAnalyses: any[]
  }
}

export function DashboardStats({ data }: DashboardStatsProps) {
  const stats = [
    {
      icon: BarChart3,
      label: "Total Analyses",
      value: data.totalAnalyses.toLocaleString(),
      change: "+12.5%",
      color: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: TrendingUp,
      label: "Average Score",
      value: data.averageScore.toFixed(1),
      change: "+2.3%",
      color: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      icon: Users,
      label: "Active Users",
      value: data.totalUsers.toLocaleString(),
      change: "+8.1%",
      color: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      icon: Lightbulb,
      label: "Top Room Type",
      value: data.topRoomType.replace(/-/g, " "),
      change: "Most Analyzed",
      color: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon
        return (
          <Card key={idx} className={stat.color}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                <span className="text-xs font-semibold text-green-600">{stat.change}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-bold capitalize">{stat.value}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
