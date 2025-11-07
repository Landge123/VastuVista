"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { SpaceParameters } from "@/lib/vastu-calculator"

interface VastuDiagramVisualizationProps {
  parameters: SpaceParameters
}

const VASTU_ZONES = {
  northeast: { label: "Northeast", color: "#FFD700", element: "Water & Wisdom" },
  north: { label: "North", color: "#87CEEB", element: "Water" },
  northwest: { label: "Northwest", color: "#DEB887", element: "Air" },
  east: { label: "East", color: "#90EE90", element: "Sun/Energy" },
  center: { label: "Brahmasthan (Center)", color: "#E6D5B8", element: "Space" },
  west: { label: "West", color: "#FFB6C1", element: "Air" },
  southeast: { label: "Southeast", color: "#FF6347", element: "Fire" },
  south: { label: "South", color: "#CD5C5C", element: "Fire" },
  southwest: { label: "Southwest", color: "#8B4513", element: "Earth" },
}

const ZONE_RECOMMENDATIONS: Record<string, Record<string, string[]>> = {
  northeast: {
    bedroom: ["Ideal for prayer/meditation", "Guest bedroom", "Study room"],
    "living-room": ["Avoid", "Not recommended"],
    kitchen: ["Avoid", "Causes expenses"],
    office: ["Best for concentration", "Perfect for learning"],
    meditation: ["Excellent location", "Highest spiritual energy"],
    entrance: ["Excellent entrance", "Brings positive energy"],
  },
  north: {
    bedroom: ["Good for wealth", "Money-related work"],
    "living-room": ["Ideal location", "Brings prosperity"],
    kitchen: ["Acceptable", "Moderate position"],
    office: ["Good for business", "Financial growth"],
    meditation: ["Peaceful location", "Good energy flow"],
    entrance: ["Auspicious entrance", "Brings opportunities"],
  },
  northwest: {
    bedroom: ["Suitable", "Secondary bedroom"],
    "living-room": ["Good", "Comfortable location"],
    kitchen: ["Avoid if possible", "Not ideal"],
    office: ["Acceptable for support staff"],
    meditation: ["Moderate energy"],
    entrance: ["Secondary entrance", "Acceptable"],
  },
  east: {
    bedroom: ["Good for health", "Energizing position"],
    "living-room": ["Good for family", "Social space"],
    kitchen: ["Good location", "Cooking area"],
    office: ["Excellent", "Success and growth"],
    meditation: ["Very good", "Rising sun energy"],
    entrance: ["Auspicious", "Main entrance"],
  },
  center: {
    bedroom: ["Keep open", "Avoid cluttering"],
    "living-room": ["Keep free", "Central circulation"],
    kitchen: ["Must avoid", "Very inauspicious"],
    office: ["Keep open", "Central space"],
    meditation: ["Must be open", "Heart of the space"],
    entrance: ["Pathway area", "Keep clear"],
  },
  west: {
    bedroom: ["Secondary bedroom", "Moderate position"],
    "living-room": ["Acceptable", "Guest seating"],
    kitchen: ["Not ideal", "Heat issues"],
    office: ["Acceptable", "Support area"],
    meditation: ["Not ideal"],
    entrance: ["Secondary entrance"],
  },
  southeast: {
    bedroom: ["Not recommended", "Avoid"],
    "living-room": ["Acceptable", "Social area"],
    kitchen: ["Best location", "Fire element"],
    office: ["Moderate", "Active area"],
    meditation: ["Not suitable"],
    entrance: ["Avoid as main"],
  },
  south: {
    bedroom: ["Best for parents", "Master bedroom"],
    "living-room": ["Good", "Family area"],
    kitchen: ["Avoid", "Not ideal"],
    office: ["Good authority", "Leadership"],
    meditation: ["Not ideal"],
    entrance: ["Secondary entrance", "Avoid main"],
  },
  southwest: {
    bedroom: ["Excellent", "Master bedroom"],
    "living-room": ["Suitable", "Storage area"],
    kitchen: ["Avoid", "Not recommended"],
    office: ["Support area", "Storage"],
    meditation: ["Not suitable"],
    entrance: ["Avoid", "Not auspicious"],
  },
}

export function VastuDiagramVisualization({ parameters }: VastuDiagramVisualizationProps) {
  const scale = 4 // pixels per foot
  const width = parameters.width * scale
  const height = parameters.length * scale
  const centerX = width / 2
  const centerY = height / 2
  const zoneSize = Math.min(width, height) / 5

  // Get door position based on orientation
  const getDoorPosition = () => {
    const doorSize = 8
    const positions: Record<string, { x: number; y: number; angle: number }> = {
      north: { x: centerX, y: -5, angle: 0 },
      south: { x: centerX, y: height + 5, angle: 180 },
      east: { x: width + 5, y: centerY, angle: 90 },
      west: { x: -5, y: centerY, angle: 270 },
      northeast: { x: width, y: 0, angle: 45 },
      southeast: { x: width, y: height, angle: 135 },
      southwest: { x: 0, y: height, angle: 225 },
      northwest: { x: 0, y: 0, angle: 315 },
    }
    return positions[parameters.orientation] || positions.north
  }

  const getZonePositions = () => {
    return {
      northeast: { x: width - zoneSize / 2, y: zoneSize / 2 },
      north: { x: centerX, y: zoneSize / 3 },
      northwest: { x: zoneSize / 2, y: zoneSize / 2 },
      east: { x: width - zoneSize / 3, y: centerY },
      center: { x: centerX, y: centerY },
      west: { x: zoneSize / 3, y: centerY },
      southeast: { x: width - zoneSize / 2, y: height - zoneSize / 2 },
      south: { x: centerX, y: height - zoneSize / 3 },
      southwest: { x: zoneSize / 2, y: height - zoneSize / 2 },
    }
  }

  const doorPos = getDoorPosition()
  const zonePositions = getZonePositions()

  const getZoneQuality = (zone: string): "excellent" | "good" | "moderate" | "poor" => {
    const recommendations = ZONE_RECOMMENDATIONS[zone as keyof typeof ZONE_RECOMMENDATIONS]?.[parameters.roomType] || []
    const text = recommendations.join(" ").toLowerCase()

    if (text.includes("best") || text.includes("excellent") || text.includes("ideal")) return "excellent"
    if (text.includes("good")) return "good"
    if (text.includes("avoid") || text.includes("not recommended")) return "poor"
    return "moderate"
  }

  const zoneQualityColors: Record<string, string> = {
    excellent: "#90EE90",
    good: "#FFD700",
    moderate: "#FFB6C1",
    poor: "#FF6347",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vastu Space Diagram</CardTitle>
        <CardDescription>
          Visual representation of Vastu zones for your {parameters.roomType.replace(/-/g, " ")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* SVG Diagram */}
        <div className="flex justify-center overflow-x-auto">
          <svg
            width={width + 40}
            height={height + 40}
            className="border border-border rounded-lg bg-muted/30"
            viewBox={`${-20} ${-20} ${width + 40} ${height + 40}`}
          >
            {/* Background grid */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width={width} height={height} fill="url(#grid)" />

            {/* Outer border */}
            <rect x="0" y="0" width={width} height={height} fill="none" stroke="#8B5A2B" strokeWidth="2" />

            {/* Vastu Zone overlays */}
            {Object.entries(zonePositions).map(([zone, pos]) => {
              const quality = getZoneQuality(zone)
              const color = zoneQualityColors[quality]

              if (zone === "center") {
                return (
                  <circle
                    key={zone}
                    cx={pos.x}
                    cy={pos.y}
                    r={zoneSize / 3}
                    fill={color}
                    opacity="0.3"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeDasharray="4"
                  />
                )
              }

              return (
                <g key={zone}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={zoneSize / 2.5}
                    fill={color}
                    opacity="0.15"
                    stroke={color}
                    strokeWidth="1"
                  />
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs font-semibold"
                    fill="currentColor"
                    opacity="0.7"
                  >
                    {zone.split(/(?=[A-Z])/).join(" ")}
                  </text>
                </g>
              )
            })}

            {/* Windows (represented as small squares) */}
            {Array.from({ length: parameters.windows }).map((_, idx) => {
              const spacing = width / (parameters.windows + 1)
              const windowX = spacing * (idx + 1)
              return (
                <rect
                  key={`window-${idx}`}
                  x={windowX - 4}
                  y={-2}
                  width="8"
                  height="2"
                  fill="#87CEEB"
                  stroke="#4682B4"
                  strokeWidth="1"
                />
              )
            })}

            {/* Door (with orientation arrow) */}
            <g>
              <circle cx={doorPos.x} cy={doorPos.y} r="6" fill="#8B4513" stroke="#654321" strokeWidth="1.5" />
              <text
                x={doorPos.x}
                y={doorPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-bold"
                fill="white"
              >
                D
              </text>
            </g>

            {/* Center point marker */}
            <circle cx={centerX} cy={centerY} r="2" fill="#E6D5B8" stroke="#8B5A2B" strokeWidth="1" />
          </svg>
        </div>

        {/* Zone Legend and Recommendations */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Zone Analysis for {parameters.roomType.replace(/-/g, " ")}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(ZONE_RECOMMENDATIONS).map(([zone, recommendations]) => {
              const quality = getZoneQuality(zone)
              const color = zoneQualityColors[quality]
              const roomRecs = recommendations[parameters.roomType] || ["Not specified"]

              return (
                <div
                  key={zone}
                  className="p-3 rounded-lg border"
                  style={{ borderColor: color, backgroundColor: `${color}15` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm capitalize">{zone}</span>
                    <Badge variant="outline" className="text-xs" style={{ borderColor: color, color: color }}>
                      {quality}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{roomRecs[0]}</p>
                  <div className="text-xs text-muted-foreground italic">
                    Element: {VASTU_ZONES[zone as keyof typeof VASTU_ZONES].element}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Key Legend */}
        <div className="bg-muted/40 p-4 rounded-lg space-y-2 text-sm">
          <h4 className="font-semibold mb-3">Diagram Key</h4>
          <div className="flex gap-2">
            <div className="w-4 h-4 bg-blue-400" />
            <span>Windows</span>
          </div>
          <div className="flex gap-2">
            <div className="w-4 h-4 bg-amber-700 rounded-full" />
            <span>Door (oriented {parameters.orientation})</span>
          </div>
          <div className="flex gap-2">
            <div className="w-4 h-4 border-2 border-dashed border-yellow-600" />
            <span>Brahmasthan (Center - Keep open)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
