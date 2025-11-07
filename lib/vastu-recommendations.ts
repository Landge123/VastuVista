import type { SpaceParameters } from "./vastu-calculator"

export interface Recommendation {
  id: string
  title: string
  category: "furniture" | "color" | "elements" | "placement" | "remedies" | "structural"
  priority: "high" | "medium" | "low"
  description: string
  implementation: string
  benefits: string[]
}

export function generateDetailedRecommendations(
  params: SpaceParameters,
  scores: Record<string, number>,
): Recommendation[] {
  const recommendations: Recommendation[] = []

  // 1. Orientation-based recommendations
  recommendations.push(...getOrientationRecommendations(params))

  // 2. Dimension-based recommendations
  recommendations.push(...getDimensionRecommendations(params, scores))

  // 3. Room-type-specific recommendations
  recommendations.push(...getRoomTypeRecommendations(params, scores))

  // 4. Element balance recommendations
  recommendations.push(...getElementRecommendations(params))

  // 5. Furniture placement recommendations
  recommendations.push(...getFurnitureRecommendations(params))

  // 6. Color recommendations
  recommendations.push(...getColorRecommendations(params))

  // Sort by priority
  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}

function getOrientationRecommendations(params: SpaceParameters): Recommendation[] {
  const recommendations: Recommendation[] = []
  const orientationMap: Record<string, Recommendation[]> = {
    northeast: [
      {
        id: "northeast-1",
        title: "Maximize North-East Light",
        category: "placement",
        priority: "high",
        description:
          "The North-East is the gateway of wisdom and abundance. Ensure maximum visibility and light from this direction.",
        implementation:
          "Keep North-East corner clear and bright. Install windows or skylights if possible. Place a water element (fountain or aquarium) here.",
        benefits: ["Enhanced wisdom and clarity", "Improved prosperity", "Better health and positivity"],
      },
      {
        id: "northeast-2",
        title: "North-East Prayer Corner",
        category: "placement",
        priority: "medium",
        description: "Create a sacred corner in the North-East for meditation or prayer.",
        implementation:
          "Set up a small altar or meditation cushion in the North-East corner. Use light colors like white or light blue.",
        benefits: ["Spiritual growth", "Mental peace", "Enhanced intuition"],
      },
    ],
    north: [
      {
        id: "north-1",
        title: "Activate Wealth Corner",
        category: "elements",
        priority: "high",
        description:
          "North is the direction of Mercury and wealth accumulation. Activate this zone for financial growth.",
        implementation:
          "Place water features (fountain, aquarium) in the North. Use blues and blacks. Avoid heavy storage here.",
        benefits: ["Financial prosperity", "Career advancement", "Business success"],
      },
      {
        id: "north-2",
        title: "North-Facing Main Door",
        category: "placement",
        priority: "medium",
        description: "A North-facing entrance brings wealth and positive opportunities.",
        implementation: "Ensure the main door opens freely towards North. Place an auspicious symbol above the door.",
        benefits: ["Positive energy flow", "Guest attraction", "Opportunity manifestation"],
      },
    ],
    east: [
      {
        id: "east-1",
        title: "Harness Sun Energy",
        category: "placement",
        priority: "high",
        description: "East is ruled by the Sun. Maximize morning sunlight for health and vitality.",
        implementation:
          "Keep East windows and openings unobstructed. Use warm yellows and oranges. Place exercise or work area here.",
        benefits: ["Enhanced health", "Increased energy", "Career growth"],
      },
    ],
    south: [
      {
        id: "south-1",
        title: "Authority and Protection Zone",
        category: "placement",
        priority: "high",
        description: "South is associated with strength and protection. Use this zone wisely.",
        implementation:
          "Keep South wall solid and strong. Place heavy furniture (bed for master, storage) in South. Avoid cutting South walls.",
        benefits: ["Enhanced authority", "Better stability", "Family protection"],
      },
    ],
    southwest: [
      {
        id: "sw-1",
        title: "Master Bedroom Location",
        category: "placement",
        priority: "high",
        description: "South-West is ideal for master bedrooms and storage areas.",
        implementation: "Place master bed with head towards South or West. Use earth tones. Avoid mirrors in bedroom.",
        benefits: ["Better sleep", "Improved relationships", "Stability and grounding"],
      },
    ],
    southeast: [
      {
        id: "se-1",
        title: "Kitchen Placement",
        category: "placement",
        priority: "high",
        description: "South-East is the ideal location for kitchens (Fire element).",
        implementation:
          "Place cooking stove in South-East corner. Face East while cooking if possible. Use reds and oranges.",
        benefits: ["Better health", "Improved digestion", "Enhanced family bonding"],
      },
    ],
    west: [
      {
        id: "west-1",
        title: "Guest and Entertainment Zone",
        category: "placement",
        priority: "medium",
        description: "West is suitable for guest rooms and entertainment areas.",
        implementation:
          "Place guest bedroom or entertainment space in West. Use light colors and maintain good ventilation.",
        benefits: ["Happy guests", "Social harmony", "Balanced entertainment"],
      },
    ],
    northwest: [
      {
        id: "nw-1",
        title: "Secondary Living Spaces",
        category: "placement",
        priority: "medium",
        description: "North-West is suitable for guest rooms and storage.",
        implementation:
          "Place guest bedroom, store room, or children's room in North-West. Use metal accents and light colors.",
        benefits: ["Good for guests", "Organized storage", "Helpful relationships"],
      },
    ],
  }

  const dirRecs = orientationMap[params.orientation] || []
  return dirRecs.slice(0, 2) // Return top 2 recommendations
}

function getDimensionRecommendations(params: SpaceParameters, scores: Record<string, number>): Recommendation[] {
  const recommendations: Recommendation[] = []

  if (scores.dimensions < 70) {
    recommendations.push({
      id: "dim-1",
      title: "Optimize Room Proportions",
      category: "structural",
      priority: "high",
      description: "Your room dimensions deviate from ideal Vastu proportions. Adjust if structurally possible.",
      implementation: `Current dimensions: ${params.length}' × ${params.width}'. Aim for aspect ratios closer to 1:1.33, 1:1.5, or 1:1.618 (Golden Ratio).`,
      benefits: ["Better energy flow", "Improved harmony", "Enhanced well-being"],
    })
  }

  const heightRatio = params.height / ((params.length + params.width) / 2)
  if (heightRatio < 0.5 || heightRatio > 0.75) {
    recommendations.push({
      id: "dim-2",
      title: "Adjust Ceiling Height Perception",
      category: "remedies",
      priority: "medium",
      description: "Your ceiling height is not in ideal proportion to floor dimensions.",
      implementation:
        heightRatio < 0.5
          ? "Use light colors and vertical stripes to make ceiling appear higher. Add tall mirrors."
          : "Use darker colors on ceiling. Add horizontal elements to make space feel more balanced.",
      benefits: ["Better spatial harmony", "Improved comfort", "Visual balance"],
    })
  }

  return recommendations
}

function getRoomTypeRecommendations(params: SpaceParameters, scores: Record<string, number>): Recommendation[] {
  const recommendations: Recommendation[] = []

  const roomRecs: Record<string, Recommendation[]> = {
    bedroom: [
      {
        id: "bed-1",
        title: "Optimal Bed Placement",
        category: "placement",
        priority: "high",
        description: "Bed position significantly affects sleep quality and relationships.",
        implementation:
          params.orientation === "southwest" || params.orientation === "south"
            ? "Place bed with head towards South or West. Avoid head towards North. Place bed away from direct door view."
            : "Place bed diagonally from the door for privacy. Head towards South is ideal.",
        benefits: ["Better sleep quality", "Improved relationships", "Enhanced peace"],
      },
      {
        id: "bed-2",
        title: "Bedroom Window Placement",
        category: "placement",
        priority: "medium",
        description: "Windows affect air flow and energy in bedroom.",
        implementation:
          "Keep windows on East and North walls. Avoid windows on South and West if possible. Use window treatments for privacy.",
        benefits: ["Better ventilation", "Improved privacy", "Regulated light"],
      },
    ],
    kitchen: [
      {
        id: "kit-1",
        title: "Stove Position and Direction",
        category: "placement",
        priority: "high",
        description: "Cook facing East for health benefits and proper energy alignment.",
        implementation:
          "Position cooking stove in South-East corner. Ensure cook faces East while cooking. Avoid stove in North or center.",
        benefits: ["Better digestion", "Improved health", "Positive food energy"],
      },
      {
        id: "kit-2",
        title: "Kitchen Element Balance",
        category: "elements",
        priority: "medium",
        description: "Balance fire (stove) with water (sink) in kitchen.",
        implementation:
          "Place sink in North or East. Maintain distance between stove and sink. Use water colors (blues) with fire colors (reds/oranges).",
        benefits: ["Elemental harmony", "Better cooking energy", "Family health"],
      },
    ],
    office: [
      {
        id: "off-1",
        title: "Desk Orientation",
        category: "placement",
        priority: "high",
        description: "Desk position affects focus, productivity, and success.",
        implementation:
          "Place desk facing North or East for better concentration. Avoid facing South or back to door. Wall behind desk for support.",
        benefits: ["Enhanced focus", "Increased productivity", "Career success"],
      },
      {
        id: "off-2",
        title: "Office Lighting",
        category: "elements",
        priority: "medium",
        description: "Proper lighting improves work performance.",
        implementation:
          "Maximize natural light from East. Use full-spectrum lighting. Avoid harsh shadows on work area.",
        benefits: ["Better focus", "Reduced eye strain", "Improved mood"],
      },
    ],
    meditation: [
      {
        id: "med-1",
        title: "Meditation Corner Setup",
        category: "placement",
        priority: "high",
        description: "Create an optimal meditation space in North-East corner.",
        implementation:
          "Set up in North-East if possible. Use light colors, natural materials. Keep space clutter-free and peaceful.",
        benefits: ["Deeper meditation", "Spiritual growth", "Mental clarity"],
      },
      {
        id: "med-2",
        title: "Meditation Room Acoustics",
        category: "elements",
        priority: "medium",
        description: "Sound affects meditation quality.",
        implementation:
          "Use soft furnishings to absorb sound. Add water sound or wind chimes gently. Avoid harsh noise sources.",
        benefits: ["Better focus", "Peaceful atmosphere", "Spiritual connection"],
      },
    ],
  }

  return roomRecs[params.roomType] || []
}

function getElementRecommendations(params: SpaceParameters): Recommendation[] {
  const recommendations: Recommendation[] = []

  recommendations.push(
    {
      id: "elem-1",
      title: "Five Element Balance",
      category: "elements",
      priority: "high",
      description: "Ensure all five elements (Earth, Water, Fire, Air, Space) are represented.",
      implementation:
        "Earth: plants, rocks | Water: fountain, aquarium | Fire: candles, lamps | Air: wind chimes, fans | Space: keep areas open.",
      benefits: ["Holistic energy balance", "Enhanced harmony", "Improved well-being"],
    },
    {
      id: "elem-2",
      title: "Water Element Enhancement",
      category: "elements",
      priority: "medium",
      description: "Water element promotes prosperity and calm.",
      implementation:
        "Place water fountain or aquarium in North or North-East corner. Use blues and blacks. Keep water clean and moving.",
      benefits: ["Increased prosperity", "Better sleep", "Emotional calm"],
    },
  )

  return recommendations
}

function getFurnitureRecommendations(params: SpaceParameters): Recommendation[] {
  const recommendations: Recommendation[] = []

  recommendations.push({
    id: "furn-1",
    title: "Furniture Arrangement",
    category: "placement",
    priority: "medium",
    description: "Proper furniture placement ensures smooth energy flow.",
    implementation:
      "Arrange furniture away from center of room. Create clear pathways. Avoid cluttering corners. Leave breathing space.",
    benefits: ["Smooth energy flow", "Better movement", "Spacious feel"],
  })

  return recommendations
}

function getColorRecommendations(params: SpaceParameters): Recommendation[] {
  const recommendations: Recommendation[] = []

  const colorMap: Record<string, string[]> = {
    bedroom: ["Light blues", "soft greens", "pale yellows"],
    kitchen: ["Reds", "oranges", "warm yellows"],
    office: ["Whites", "light greens", "soft blues"],
    meditation: ["Light purples", "whites", "pale blues"],
    "living-room": ["Warm neutrals", "light greens", "soft oranges"],
    entrance: ["Bright whites", "light yellows", "warm creams"],
  }

  const colors = colorMap[params.roomType] || ["neutral tones"]

  recommendations.push({
    id: "col-1",
    title: "Optimal Color Scheme",
    category: "color",
    priority: "medium",
    description: `For a ${params.roomType}, specific colors enhance Vastu alignment.`,
    implementation: `Use primary colors: ${colors.join(", ")}. Avoid dark colors on walls. Use darker shades for accents only.`,
    benefits: ["Better mood", "Enhanced energy", "Visual harmony"],
  })

  return recommendations
}
