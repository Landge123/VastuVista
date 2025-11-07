"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Eye } from "lucide-react"

interface AnalysisHistoryProps {
  analyses: Array<{
    id: string
    roomType: string
    orientation: string
    score: number
    date: string
    user: string
  }>
}

export function AnalysisHistory({ analyses }: AnalysisHistoryProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-700"
    if (score >= 60) return "bg-amber-100 text-amber-700"
    return "bg-red-100 text-red-700"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Analyses</CardTitle>
        <CardDescription>Latest space analyses performed by users</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2 px-2">Analysis ID</th>
                  <th className="text-left py-2 px-2">User</th>
                  <th className="text-left py-2 px-2">Room Type</th>
                  <th className="text-left py-2 px-2">Orientation</th>
                  <th className="text-left py-2 px-2">Score</th>
                  <th className="text-left py-2 px-2">Date</th>
                  <th className="text-left py-2 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {analyses.map((analysis) => (
                  <tr key={analysis.id} className="border-b hover:bg-muted/50 transition">
                    <td className="py-3 px-2 font-medium">{analysis.id}</td>
                    <td className="py-3 px-2">{analysis.user}</td>
                    <td className="py-3 px-2 capitalize">{analysis.roomType.replace(/-/g, " ")}</td>
                    <td className="py-3 px-2 capitalize">{analysis.orientation}</td>
                    <td className="py-3 px-2">
                      <Badge className={`${getScoreColor(analysis.score)}`}>{analysis.score}</Badge>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">{analysis.date}</td>
                    <td className="py-3 px-2">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
