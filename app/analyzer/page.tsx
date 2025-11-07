"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Compass } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SpaceParameterForm } from "@/components/space-parameter-form"
import { VastuScoreDisplay } from "@/components/vastu-score-display"
import { calculateVastuScore } from "@/lib/vastu-calculator"
import type { SpaceParameters } from "@/lib/vastu-calculator"
import { VastuDiagramVisualization } from "@/components/vastu-diagram-visualization"
import { generateDetailedRecommendations } from "@/lib/vastu-recommendations"
import { RecommendationsDisplay } from "@/components/recommendations-display"

export default function AnalyzerPage() {
  const [parameters, setParameters] = useState<SpaceParameters | null>(null)
  const [score, setScore] = useState<any>(null)
  const [recommendations, setRecommendations] = useState<any[]>([])

  useEffect(() => {
    if (parameters) {
      const calculatedScore = calculateVastuScore(parameters)
      setScore(calculatedScore)
      const detailedRecs = generateDetailedRecommendations(parameters, calculatedScore.components)
      setRecommendations(detailedRecs)
    }
  }, [parameters])

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader currentPage="analyzer" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Form Section */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Enter Space Details</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6">
              Provide your room dimensions and orientation for Vastu analysis
            </p>
            <SpaceParameterForm onParametersChange={setParameters} />
          </div>

          {/* Results Section */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Real-time Analysis</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6">
              {score ? "Your Vastu compatibility assessment" : "Fill the form to see real-time analysis"}
            </p>
            {score ? (
              <VastuScoreDisplay score={score} parameters={parameters} />
            ) : (
              <Card className="border-dashed">
                <CardContent className="pt-12 text-center">
                  <Compass className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-sm text-muted-foreground">Enter your space details to see real-time analysis</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Diagram Visualization Section */}
        {parameters && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Space Visualization</h2>
            <VastuDiagramVisualization parameters={parameters} />
          </div>
        )}

        {/* Recommendations Section */}
        {recommendations && recommendations.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Personalized Recommendations</h2>
            <RecommendationsDisplay recommendations={recommendations} />
          </div>
        )}
      </div>
    </main>
  )
}
