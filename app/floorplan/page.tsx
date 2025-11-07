"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SiteHeader } from "@/components/site-header"
import { Compass, Upload, MessageCircle, X } from "lucide-react"

export default function FloorPlanPage() {
  const [floorPlanData, setFloorPlanData] = useState({
    width: "30",
    length: "40",
    roomCount: "4",
    mainEntrance: "north",
    masterBedroom: "southwest",
    kitchen: "southeast",
    livingArea: "northeast",
  })

  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [aiMessages, setAiMessages] = useState<Array<{ role: string; content: string }>>([])
  const [aiInput, setAiInput] = useState("")

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setUploadedImage(null)
  }

  const handleAnalyze = () => {
    // Simulated floor plan analysis
    const vastuScore = Math.floor(Math.random() * 40) + 60 // 60-100
    setAnalysis({
      score: vastuScore,
      mainPoints: [
        {
          zone: "Entrance",
          current: floorPlanData.mainEntrance,
          recommendation: "North is excellent for attracting positive energy",
          quality: vastuScore > 80 ? "Excellent" : "Good",
        },
        {
          zone: "Master Bedroom",
          current: floorPlanData.masterBedroom,
          recommendation: "Southwest is ideal for peaceful sleep and stability",
          quality: vastuScore > 80 ? "Excellent" : "Good",
        },
        {
          zone: "Kitchen",
          current: floorPlanData.kitchen,
          recommendation: "Southeast aligns with fire element for cooking",
          quality: vastuScore > 80 ? "Excellent" : "Good",
        },
        {
          zone: "Living Area",
          current: floorPlanData.livingArea,
          recommendation: "Northeast welcomes positive energies for gathering",
          quality: vastuScore > 80 ? "Excellent" : "Good",
        },
      ],
      improvements: [
        "Ensure Brahmasthan (center) is open and uncluttered",
        "Avoid placing toilets in the northeast corner",
        "Keep the kitchen separate from prayer rooms",
        "Ensure proper ventilation in all rooms",
      ],
    })
  }

  const handleAIMessage = () => {
    if (!aiInput.trim()) return

    const newMessages = [
      ...aiMessages,
      { role: "user", content: aiInput },
      {
        role: "assistant",
        content: generateAIResponse(aiInput, floorPlanData, analysis),
      },
    ]
    setAiMessages(newMessages)
    setAiInput("")
  }

  const generateAIResponse = (input: string, data: any, analysisData: any) => {
    const lowerInput = input.toLowerCase()

    if (lowerInput.includes("door") || lowerInput.includes("entrance")) {
      const entranceGuide: Record<string, string> = {
        north: "North entrance attracts prosperity and positive energy. Excellent for welcoming wealth.",
        northeast: "Northeast entrance brings learning and spiritual growth. Ideal for enlightenment.",
        east: "East entrance welcomes health and energy. Great for morning sunlight benefits.",
        southeast: "Southeast entrance brings dynamic energy and enthusiasm. Good for entrepreneurial ventures.",
        south: "South entrance requires careful placement. Can be used but needs protection symbols.",
        southwest: "Southwest entrance provides stability and grounding energy. Suitable for established homes.",
        west: "West entrance connects with sunset energy. Can attract relaxation and evening peace.",
        northwest: "Northwest entrance brings adaptability and networking energy. Good for social connections.",
      }
      return `For the ${data.mainEntrance.toUpperCase()} entrance: ${entranceGuide[data.mainEntrance] || "Consult Vastu guidelines for optimal placement."}`
    }
    if (lowerInput.includes("bedroom")) {
      return `The ${data.masterBedroom.toUpperCase()} bedroom placement aligns with Vastu principles for rest and stability. Ensure windows face east or north for morning sunlight. Avoid keeping heavy furniture or mirrors directly facing the bed.`
    }
    if (lowerInput.includes("kitchen")) {
      return `Your ${data.kitchen.toUpperCase()} kitchen location is positioned according to Vastu. Keep the kitchen clean and organized. Ensure the cooking area has proper ventilation for positive energy flow during meal preparation.`
    }
    if (lowerInput.includes("improve") || lowerInput.includes("suggestion")) {
      return `Based on your floor plan, focus on: 1) Keeping the center (Brahmasthan) open and clutter-free, 2) Ensuring proper ventilation in all rooms, 3) Avoiding toilets in sacred zones, 4) Using appropriate colors for each zone.`
    }
    if (lowerInput.includes("color") || lowerInput.includes("painting")) {
      return `For color selection by direction: North/Northeast - light blue/green, East - white/light yellow, Southeast - red/orange, South - red/pink, Southwest - brown/earth tones, West - grey/white, Northwest - grey/silver. These colors align with elemental energies in each zone.`
    }

    return `Thank you for your question about Vastu principles. Based on your floor plan analysis (Score: ${analysisData?.score || "pending"}%), I recommend consulting our detailed recommendations. How else can I assist you with your space design?`
  }

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader currentPage="floorplan" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Floor Plan Analyzer</h1>
        <p className="text-muted-foreground mb-8">
          Analyze your complete floor plan using Vastu principles to ensure optimal spatial harmony
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Floor Plan Details</CardTitle>
                <CardDescription>Enter your floor plan configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3 border-b pb-4">
                  <h3 className="font-semibold text-sm">Floor Plan Image</h3>
                  {uploadedImage ? (
                    <div className="relative w-full">
                      <img
                        src={uploadedImage || "/placeholder.svg"}
                        alt="Uploaded floor plan"
                        className="w-full h-48 object-cover rounded-lg border border-primary/30"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-primary/30 rounded-lg p-4">
                      <label className="flex flex-col items-center justify-center cursor-pointer">
                        <Upload className="w-8 h-8 text-primary/60 mb-2" />
                        <span className="text-sm text-muted-foreground text-center">
                          Click to upload floor plan image (JPG, PNG)
                        </span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    </div>
                  )}
                </div>

                {/* Dimensions */}
                <div className="space-y-4 border-b pb-4">
                  <h3 className="font-semibold text-sm">Building Dimensions</h3>
                  <div className="space-y-2">
                    <Label htmlFor="width">Width (feet)</Label>
                    <Input
                      id="width"
                      type="number"
                      value={floorPlanData.width}
                      onChange={(e) => setFloorPlanData({ ...floorPlanData, width: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="length">Length (feet)</Label>
                    <Input
                      id="length"
                      type="number"
                      value={floorPlanData.length}
                      onChange={(e) => setFloorPlanData({ ...floorPlanData, length: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rooms">Number of Rooms</Label>
                    <Input
                      id="rooms"
                      type="number"
                      value={floorPlanData.roomCount}
                      onChange={(e) => setFloorPlanData({ ...floorPlanData, roomCount: e.target.value })}
                    />
                  </div>
                </div>

                {/* Room Placements */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Room Placements</h3>

                  <div className="space-y-2">
                    <Label htmlFor="entrance">Main Entrance Direction</Label>
                    <Select
                      value={floorPlanData.mainEntrance}
                      onValueChange={(val) => setFloorPlanData({ ...floorPlanData, mainEntrance: val })}
                    >
                      <SelectTrigger id="entrance">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="north">North</SelectItem>
                        <SelectItem value="northeast">Northeast</SelectItem>
                        <SelectItem value="east">East</SelectItem>
                        <SelectItem value="southeast">Southeast</SelectItem>
                        <SelectItem value="south">South</SelectItem>
                        <SelectItem value="southwest">Southwest</SelectItem>
                        <SelectItem value="west">West</SelectItem>
                        <SelectItem value="northwest">Northwest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="master">Master Bedroom</Label>
                    <Select
                      value={floorPlanData.masterBedroom}
                      onValueChange={(val) => setFloorPlanData({ ...floorPlanData, masterBedroom: val })}
                    >
                      <SelectTrigger id="master">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="north">North</SelectItem>
                        <SelectItem value="northeast">Northeast</SelectItem>
                        <SelectItem value="east">East</SelectItem>
                        <SelectItem value="southeast">Southeast</SelectItem>
                        <SelectItem value="south">South</SelectItem>
                        <SelectItem value="southwest">Southwest</SelectItem>
                        <SelectItem value="west">West</SelectItem>
                        <SelectItem value="northwest">Northwest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kitchen">Kitchen</Label>
                    <Select
                      value={floorPlanData.kitchen}
                      onValueChange={(val) => setFloorPlanData({ ...floorPlanData, kitchen: val })}
                    >
                      <SelectTrigger id="kitchen">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="north">North</SelectItem>
                        <SelectItem value="northeast">Northeast</SelectItem>
                        <SelectItem value="east">East</SelectItem>
                        <SelectItem value="southeast">Southeast</SelectItem>
                        <SelectItem value="south">South</SelectItem>
                        <SelectItem value="southwest">Southwest</SelectItem>
                        <SelectItem value="west">West</SelectItem>
                        <SelectItem value="northwest">Northwest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="living">Living Area</Label>
                    <Select
                      value={floorPlanData.livingArea}
                      onValueChange={(val) => setFloorPlanData({ ...floorPlanData, livingArea: val })}
                    >
                      <SelectTrigger id="living">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="north">North</SelectItem>
                        <SelectItem value="northeast">Northeast</SelectItem>
                        <SelectItem value="east">East</SelectItem>
                        <SelectItem value="southeast">Southeast</SelectItem>
                        <SelectItem value="south">South</SelectItem>
                        <SelectItem value="southwest">Southwest</SelectItem>
                        <SelectItem value="west">West</SelectItem>
                        <SelectItem value="northwest">Northwest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleAnalyze} className="w-full bg-primary hover:bg-primary/90">
                  Analyze Floor Plan
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Results */}
          <div>
            {analysis ? (
              <div className="space-y-6">
                {/* Score Card */}
                <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
                  <CardHeader>
                    <CardTitle>Vastu Compatibility Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-5xl sm:text-6xl font-bold text-primary">{analysis.score}%</p>
                        <p className="text-muted-foreground mt-2">
                          {analysis.score >= 80
                            ? "Excellent Vastu alignment"
                            : analysis.score >= 60
                              ? "Good Vastu alignment"
                              : "Needs improvement"}
                        </p>
                      </div>
                      <Compass className="w-16 h-16 text-primary/50" />
                    </div>
                  </CardContent>
                </Card>

                {/* Zone Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Zone Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {analysis.mainPoints.map((point: any, idx: number) => (
                      <div key={idx} className="border-b last:border-0 pb-3 last:pb-0">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-semibold text-sm">{point.zone}</h4>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              point.quality === "Excellent"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {point.quality}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{point.recommendation}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Improvements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recommended Improvements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.improvements.map((improvement: string, idx: number) => (
                        <li key={idx} className="flex gap-2 text-sm">
                          <span className="text-primary font-bold">•</span>
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Button onClick={() => setShowAIAssistant(!showAIAssistant)} variant="outline" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {showAIAssistant ? "Hide AI Assistant" : "Ask AI Assistant"}
                </Button>
              </div>
            ) : (
              <Card className="border-dashed h-full flex items-center justify-center">
                <CardContent className="text-center">
                  <Compass className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">
                    Fill in your floor plan details and click analyze to see results
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {showAIAssistant && analysis && (
          <Card className="mt-8 border-primary/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>AI Vastu Assistant</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowAIAssistant(false)}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Chat Messages */}
              <div className="bg-muted/30 rounded-lg p-4 h-64 overflow-y-auto space-y-3">
                {aiMessages.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center mt-28">
                    Ask me anything about Vastu principles, room placements, colors, or improvements!
                  </p>
                )}
                {aiMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about Vastu principles..."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAIMessage()}
                />
                <Button onClick={handleAIMessage} size="sm">
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
