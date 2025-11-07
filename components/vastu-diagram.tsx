"use client"

interface SpaceData {
  length: string
  width: string
  orientation: string
}

export default function VastuDiagram({ spaceData }: { spaceData: SpaceData }) {
  const length = Number.parseFloat(spaceData.length) || 20
  const width = Number.parseFloat(spaceData.width) || 15

  // Normalize dimensions for SVG
  const scale = 200 / Math.max(length, width)
  const svgLength = length * scale
  const svgWidth = width * scale

  const getOrientationColor = (position: string) => {
    const colors: Record<string, string> = {
      north: "#228B22",
      south: "#8B5A2B",
      east: "#FFD700",
      west: "#87CEEB",
    }
    return colors[spaceData.orientation] || "#228B22"
  }

  const orientationLabel: Record<string, string> = {
    north: "N",
    south: "S",
    east: "E",
    west: "W",
  }

  return (
    <div className="w-full h-full min-h-96 flex items-center justify-center">
      <svg viewBox={`0 0 400 350`} className="w-full h-auto">
        {/* Background */}
        <rect width="400" height="350" fill="#fafaf8" />

        {/* Orientation indicator */}
        <g>
          <circle cx="350" cy="30" r="20" fill={getOrientationColor("orient")} opacity="0.2" />
          <text x="350" y="36" textAnchor="middle" fontSize="18" fontWeight="bold" fill={getOrientationColor("orient")}>
            {orientationLabel[spaceData.orientation]}
          </text>
        </g>

        {/* Central room */}
        <g>
          <rect
            x={(400 - svgLength) / 2}
            y={(350 - svgWidth) / 2}
            width={svgLength}
            height={svgWidth}
            fill="white"
            stroke={getOrientationColor("orient")}
            strokeWidth="3"
          />

          {/* Quadrants with Vastu zones */}
          <g opacity="0.15">
            {/* Northeast */}
            <polygon
              points={`${(400 - svgLength) / 2},${(350 - svgWidth) / 2} ${(400 - svgLength) / 2 + svgLength / 2},${(350 - svgWidth) / 2} ${(400 - svgLength) / 2 + svgLength / 2},${(350 - svgWidth) / 2 + svgWidth / 2} ${(400 - svgLength) / 2},${(350 - svgWidth) / 2 + svgWidth / 2}`}
              fill="#228B22"
            />
            {/* Southeast */}
            <polygon
              points={`${(400 - svgLength) / 2 + svgLength / 2},${(350 - svgWidth) / 2} ${(400 - svgLength) / 2 + svgLength},${(350 - svgWidth) / 2} ${(400 - svgLength) / 2 + svgLength},${(350 - svgWidth) / 2 + svgWidth / 2} ${(400 - svgLength) / 2 + svgLength / 2},${(350 - svgWidth) / 2 + svgWidth / 2}`}
              fill="#FFD700"
            />
            {/* Southwest */}
            <polygon
              points={`${(400 - svgLength) / 2 + svgLength / 2},${(350 - svgWidth) / 2 + svgWidth / 2} ${(400 - svgLength) / 2 + svgLength},${(350 - svgWidth) / 2 + svgWidth / 2} ${(400 - svgLength) / 2 + svgLength},${(350 - svgWidth) / 2 + svgWidth} ${(400 - svgLength) / 2 + svgLength / 2},${(350 - svgWidth) / 2 + svgWidth}`}
              fill="#8B5A2B"
            />
            {/* Northwest */}
            <polygon
              points={`${(400 - svgLength) / 2},${(350 - svgWidth) / 2 + svgWidth / 2} ${(400 - svgLength) / 2 + svgLength / 2},${(350 - svgWidth) / 2 + svgWidth / 2} ${(400 - svgLength) / 2 + svgLength / 2},${(350 - svgWidth) / 2 + svgWidth} ${(400 - svgLength) / 2},${(350 - svgWidth) / 2 + svgWidth}`}
              fill="#87CEEB"
            />
          </g>

          {/* Center point */}
          <circle cx="200" cy="175" r="4" fill={getOrientationColor("orient")} />

          {/* Dimensions */}
          <text x="200" y={(350 - svgWidth) / 2 - 10} textAnchor="middle" fontSize="12" fill="#666" fontWeight="500">
            {length} ft
          </text>
          <text x={(400 - svgLength) / 2 - 20} y="175" textAnchor="middle" fontSize="12" fill="#666" fontWeight="500">
            {width} ft
          </text>
        </g>

        {/* Vastu zone labels */}
        <text x={40} y={25} fontSize="11" fill="#666" fontWeight="600">
          Vastu Zones
        </text>
        <text x={40} y={45} fontSize="10" fill="#228B22">
          ● Northeast: Spiritual
        </text>
        <text x={40} y={60} fontSize="10" fill="#FFD700">
          ● Southeast: Fire
        </text>
        <text x={40} y={75} fontSize="10" fill="#8B5A2B">
          ● Southwest: Stability
        </text>
        <text x={40} y={90} fontSize="10" fill="#87CEEB">
          ● Northwest: Air
        </text>
      </svg>
    </div>
  )
}
