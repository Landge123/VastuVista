"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertTriangle, AlertCircle, Zap } from "lucide-react"
import type { SpaceParameters } from "@/lib/vastu-calculator"

interface VastuScoreDisplayProps {
  score: any
  parameters: SpaceParameters | null
}

export function VastuScoreDisplay({ score, parameters }: VastuScoreDisplayProps) {
  const getScoreColor = (value: number) => {
    if (value >= 80) return "text-green-600"
    if (value >= 60) return "text-amber-600"
    return "text-red-600"
  }

  const getScoreBg = (value: number) => {
    if (value >= 80) return "bg-green-50 border-green-200"
    if (value >= 60) return "bg-amber-50 border-amber-200"
    return "bg-red-50 border-red-200"
  }

  const getScoreIcon = (value: number) => {
    if (value >= 80) return <CheckCircle className="w-6 h-6 text-green-600" />
    if (value >= 60) return <AlertTriangle className="w-6 h-6 text-amber-600" />
    return <AlertCircle className="w-6 h-6 text-red-600" />
  }

  return (
    <div className="space-y-4">
      {/* Overall Score */}
      <Card className={`border-2 ${getScoreBg(score.overall)}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            {getScoreIcon(score.overall)}
            Overall Vastu Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className={`text-5xl font-bold ${getScoreColor(score.overall)}`}>{score.overall}</span>
            <span className="text-muted-foreground">/100</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {score.overall >= 80
              ? "Excellent Vastu alignment"
              : score.overall >= 60
                ? "Good, with some recommendations"
                : "Needs significant adjustments"}
          </p>
        </CardContent>
      </Card>

      {/* Component Scores */}
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(score.components).map(([key, value]: [string, any]) => (
          <Card key={key} className="p-4">
            <div className="text-xs font-semibold text-muted-foreground uppercase mb-2 capitalize">
              {key.replace(/_/g, " ")}
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(value)}`}>{value}</div>
            <div className="w-full bg-muted rounded-full h-1.5 mt-2">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  value >= 80 ? "bg-green-600" : value >= 60 ? "bg-amber-600" : "bg-red-600"
                }`}
                style={{ width: `${value}%` }}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Recommendations */}
      {score.recommendations && score.recommendations.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {score.recommendations.map((rec: string, idx: number) => (
                <li key={idx} className="text-sm flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span className="text-muted-foreground">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Space Info Summary */}
      {parameters && (
        <Card className="bg-muted/40">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Dimensions:</span>
                <div className="font-semibold">
                  {parameters.length}' × {parameters.width}' × {parameters.height}'
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Area:</span>
                <div className="font-semibold">{(parameters.length * parameters.width).toFixed(0)} sq ft</div>
              </div>
              <div>
                <span className="text-muted-foreground">Room Type:</span>
                <div className="font-semibold capitalize">{parameters.roomType.replace(/-/g, " ")}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Orientation:</span>
                <div className="font-semibold capitalize">{parameters.orientation}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
