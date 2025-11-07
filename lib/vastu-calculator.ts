export interface SpaceParameters {
  length: number
  width: number
  height: number
  roomType: "bedroom" | "living-room" | "kitchen" | "office" | "meditation" | "entrance"
  orientation: "north" | "south" | "east" | "west" | "northeast" | "northwest" | "southeast" | "southwest"
  windows: number
  doors: number
}

export interface VastuScore {
  overall: number
  components: {
    dimensions: number
    orientation: number
    proportions: number
    lighting_ventilation: number
    energy_flow: number
  }
  recommendations: string[]
}

export function calculateVastuScore(params: SpaceParameters): VastuScore {
  const scores: Record<string, number> = {}

  // 1. Dimensions Score (South & West should be larger for strength)
  scores.dimensions = calculateDimensionScore(params)

  // 2. Orientation Score
  scores.orientation = calculateOrientationScore(params)

  // 3. Proportions Score (Golden ratio preference)
  scores.proportions = calculateProportionScore(params)

  // 4. Lighting & Ventilation Score
  scores.lighting_ventilation = calculateLightingScore(params)

  // 5. Energy Flow Score (based on doors and windows)
  scores.energy_flow = calculateEnergyFlowScore(params)

  // Calculate overall score
  const overall = Math.round(
    (scores.dimensions * 0.2 +
      scores.orientation * 0.25 +
      scores.proportions * 0.2 +
      scores.lighting_ventilation * 0.2 +
      scores.energy_flow * 0.15) /
      100,
  )

  // Generate recommendations
  const recommendations = generateRecommendations(params, scores)

  return {
    overall: Math.max(0, Math.min(100, overall)),
    components: {
      dimensions: Math.max(0, Math.min(100, scores.dimensions)),
      orientation: Math.max(0, Math.min(100, scores.orientation)),
      proportions: Math.max(0, Math.min(100, scores.proportions)),
      lighting_ventilation: Math.max(0, Math.min(100, scores.lighting_ventilation)),
      energy_flow: Math.max(0, Math.min(100, scores.energy_flow)),
    },
    recommendations,
  }
}

function calculateDimensionScore(params: SpaceParameters): number {
  const { length, width, height, roomType } = params
  let score = 70

  // Ideal dimensions vary by room type
  const idealRatios: Record<string, [number, number]> = {
    bedroom: [15, 12],
    "living-room": [20, 15],
    kitchen: [12, 10],
    office: [16, 14],
    meditation: [12, 12],
    entrance: [10, 8],
  }

  const [idealLength, idealWidth] = idealRatios[roomType] || [16, 12]

  // Penalize if dimensions deviate significantly from ideal
  const lengthDev = Math.abs(length - idealLength) / idealLength
  const widthDev = Math.abs(width - idealWidth) / idealWidth

  score -= lengthDev * 15
  score -= widthDev * 15

  // Ceiling height should be proportional
  const minHeight = (length + width) / 2 / 2.5
  const maxHeight = (length + width) / 2 / 1.8
  if (height < minHeight || height > maxHeight) {
    score -= 10
  }

  return score
}

function calculateOrientationScore(params: SpaceParameters): number {
  const { orientation, roomType } = params
  const orientationScores: Record<string, Record<string, number>> = {
    bedroom: {
      southwest: 90,
      west: 80,
      south: 75,
      southeast: 70,
      northwest: 65,
      north: 60,
      east: 55,
      northeast: 50,
    },
    "living-room": {
      north: 85,
      northeast: 80,
      northwest: 75,
      east: 70,
      west: 65,
      southeast: 60,
      south: 55,
      southwest: 50,
    },
    kitchen: {
      southeast: 90,
      east: 85,
      south: 75,
      southwest: 70,
      northwest: 65,
      north: 60,
      northeast: 55,
      west: 50,
    },
    office: {
      north: 90,
      northeast: 85,
      east: 80,
      northwest: 70,
      west: 60,
      south: 55,
      southwest: 50,
      southeast: 45,
    },
    meditation: {
      northeast: 95,
      north: 90,
      east: 85,
      northwest: 75,
      southeast: 70,
      west: 60,
      south: 55,
      southwest: 45,
    },
    entrance: {
      north: 85,
      east: 80,
      northeast: 90,
      northwest: 75,
      southeast: 70,
      west: 65,
      south: 60,
      southwest: 55,
    },
  }

  return orientationScores[roomType]?.[orientation] || 60
}

function calculateProportionScore(params: SpaceParameters): number {
  const { length, width, height } = params
  const goldenRatio = 1.618
  const lengthWidthRatio = length / width

  let score = 75

  // Check if length:width ratio is close to golden ratio or simple ratios
  const ratioDeviation = Math.abs(lengthWidthRatio - goldenRatio)
  const simpleRatios = [1, 1.33, 1.5, 1.618, 2]

  const closestRatio = simpleRatios.reduce((prev, curr) =>
    Math.abs(curr - lengthWidthRatio) < Math.abs(prev - lengthWidthRatio) ? curr : prev,
  )

  const deviationFromClosest = Math.abs(lengthWidthRatio - closestRatio)
  score -= deviationFromClosest * 20

  // Height should be between 50-75% of average of length and width
  const avgBase = (length + width) / 2
  const heightRatio = height / avgBase
  if (heightRatio < 0.5 || heightRatio > 0.75) {
    score -= 15
  }

  return score
}

function calculateLightingScore(params: SpaceParameters): number {
  const { windows, doors, length, width } = params
  const area = length * width
  let score = 70

  // Ideal: 1 window per 30-40 sq ft
  const idealWindows = area / 35
  const windowDeviation = Math.abs(windows - idealWindows)

  if (windowDeviation > 3) {
    score -= Math.min(20, windowDeviation * 3)
  }

  // Doors should allow proper circulation
  if (doors < 1) {
    score -= 20
  } else if (doors > 3) {
    score -= 10
  }

  // Light distribution bonus
  if (windows >= 2 && doors >= 1) {
    score += 10
  }

  return score
}

function calculateEnergyFlowScore(params: SpaceParameters): number {
  const { doors, windows, orientation } = params
  let score = 75

  // Main opening directions matter for energy flow
  const positiveOrientations = ["north", "northeast", "east", "northwest"]
  const mainDoorBonus = positiveOrientations.includes(orientation) ? 10 : 0

  score += mainDoorBonus

  // Multiple doors can disrupt energy if not balanced
  if (doors > 2) {
    score -= 10
  }

  // Windows should balance with doors
  const openingBalance = Math.abs(windows - doors)
  if (openingBalance > 4) {
    score -= 10
  }

  return score
}

function generateRecommendations(params: SpaceParameters, scores: Record<string, number>): string[] {
  const recommendations: string[] = []

  if (scores.dimensions < 70) {
    recommendations.push("Consider adjusting room dimensions closer to ideal ratios for your room type")
  }

  if (scores.orientation < 70) {
    recommendations.push(
      `For a ${params.roomType}, ${params.orientation}-facing entrance is suboptimal. Consider interior layout adjustments`,
    )
  }

  if (scores.proportions < 70) {
    recommendations.push("Adjust ceiling height or base dimensions to achieve better proportional harmony")
  }

  if (scores.lighting_ventilation < 70) {
    const area = params.length * params.width
    const idealWindows = Math.round(area / 35)
    recommendations.push(`Increase windows to ${idealWindows} for optimal natural light and ventilation`)
  }

  if (scores.energy_flow < 70) {
    recommendations.push("Balance door and window placement to ensure smooth energy circulation throughout the space")
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Your space has excellent Vastu alignment! Maintain the current layout and consider adding plants in the north-east corner",
    )
  }

  return recommendations
}
