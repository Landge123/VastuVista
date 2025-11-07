"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Lightbulb, Palette, Armchair, Droplets, Home } from "lucide-react"
import type { Recommendation } from "@/lib/vastu-recommendations"

interface RecommendationsDisplayProps {
  recommendations: Recommendation[]
}

const categoryIcons: Record<string, React.ReactNode> = {
  placement: <Armchair className="w-4 h-4" />,
  color: <Palette className="w-4 h-4" />,
  elements: <Droplets className="w-4 h-4" />,
  furniture: <Home className="w-4 h-4" />,
  remedies: <Lightbulb className="w-4 h-4" />,
  structural: <AlertCircle className="w-4 h-4" />,
}

const categoryLabels: Record<string, string> = {
  placement: "Placement",
  color: "Color",
  elements: "Elements",
  furniture: "Furniture",
  remedies: "Remedies",
  structural: "Structural",
}

const categoryColors: Record<string, string> = {
  placement: "bg-blue-50 border-blue-200 text-blue-700",
  color: "bg-purple-50 border-purple-200 text-purple-700",
  elements: "bg-green-50 border-green-200 text-green-700",
  furniture: "bg-orange-50 border-orange-200 text-orange-700",
  remedies: "bg-amber-50 border-amber-200 text-amber-700",
  structural: "bg-red-50 border-red-200 text-red-700",
}

export function RecommendationsDisplay({ recommendations }: RecommendationsDisplayProps) {
  if (recommendations.length === 0) {
    return (
      <Card>
        <CardContent className="pt-12 text-center">
          <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">No recommendations available yet</p>
        </CardContent>
      </Card>
    )
  }

  // Group recommendations by priority
  const highPriority = recommendations.filter((r) => r.priority === "high")
  const mediumPriority = recommendations.filter((r) => r.priority === "medium")
  const lowPriority = recommendations.filter((r) => r.priority === "low")

  const renderRecommendationGroup = (recs: Recommendation[], priorityLabel: string) => {
    if (recs.length === 0) return null

    return (
      <div key={priorityLabel} className="space-y-3">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              priorityLabel === "High" ? "bg-red-500" : priorityLabel === "Medium" ? "bg-amber-500" : "bg-green-500"
            }`}
          />
          {priorityLabel} Priority ({recs.length})
        </h3>

        <div className="space-y-3">
          {recs.map((rec) => (
            <Card key={rec.id} className={`border ${categoryColors[rec.category]}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">{categoryIcons[rec.category]}</div>
                    <div className="flex-1">
                      <CardTitle className="text-sm">{rec.title}</CardTitle>
                      <CardDescription className="text-xs mt-1">{rec.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {categoryLabels[rec.category]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="text-xs font-semibold mb-2 text-muted-foreground">How to Implement:</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{rec.implementation}</p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold mb-2 text-muted-foreground">Expected Benefits:</h4>
                  <ul className="text-sm space-y-1">
                    {rec.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex gap-2 text-muted-foreground">
                        <span className="text-primary">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        {renderRecommendationGroup(highPriority, "High")}
        {renderRecommendationGroup(mediumPriority, "Medium")}
        {renderRecommendationGroup(lowPriority, "Low")}
      </div>

      {/* Summary Stats */}
      <Card className="bg-muted/40">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Recommendations Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{highPriority.length}</div>
              <div className="text-xs text-muted-foreground mt-1">High Priority</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{mediumPriority.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Medium Priority</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{lowPriority.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Low Priority</div>
            </div>
            <div className="text-center md:col-span-1">
              <div className="text-2xl font-bold text-primary">{recommendations.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {new Set(recommendations.map((r) => r.category)).size}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Categories</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
