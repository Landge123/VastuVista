"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Info, Lightbulb } from "lucide-react"

interface Recommendation {
  category: string
  priority: "high" | "medium" | "low"
  suggestion: string
  vastuReason: string
}

export default function RecommendationsList({ recommendations }: { recommendations: Recommendation[] }) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50 border-red-200 text-red-900"
      case "medium":
        return "bg-yellow-50 border-yellow-200 text-yellow-900"
      case "low":
        return "bg-green-50 border-green-200 text-green-900"
      default:
        return "bg-blue-50 border-blue-200 text-blue-900"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="w-5 h-5" />
      case "medium":
        return <Lightbulb className="w-5 h-5" />
      case "low":
        return <Info className="w-5 h-5" />
      default:
        return <Info className="w-5 h-5" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vastu Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec, idx) => (
            <div key={idx} className={`p-4 rounded-lg border-2 ${getPriorityColor(rec.priority)}`}>
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-0.5">{getPriorityIcon(rec.priority)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{rec.category}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded font-medium uppercase ${
                        rec.priority === "high"
                          ? "bg-red-200"
                          : rec.priority === "medium"
                            ? "bg-yellow-200"
                            : "bg-green-200"
                      }`}
                    >
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-sm mb-2">{rec.suggestion}</p>
                  <p className="text-xs opacity-75 italic">Vastu principle: {rec.vastuReason}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
