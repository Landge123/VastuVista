"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { SpaceParameters } from "@/lib/vastu-calculator"

interface SpaceParameterFormProps {
  onParametersChange: (params: SpaceParameters) => void
}

const ROOM_TYPES = [
  { value: "bedroom", label: "Bedroom" },
  { value: "living-room", label: "Living Room" },
  { value: "kitchen", label: "Kitchen" },
  { value: "office", label: "Office" },
  { value: "meditation", label: "Meditation Room" },
  { value: "entrance", label: "Entrance" },
]

const ORIENTATIONS = [
  { value: "north", label: "North" },
  { value: "south", label: "South" },
  { value: "east", label: "East" },
  { value: "west", label: "West" },
  { value: "northeast", label: "Northeast" },
  { value: "northwest", label: "Northwest" },
  { value: "southeast", label: "Southeast" },
  { value: "southwest", label: "Southwest" },
]

export function SpaceParameterForm({ onParametersChange }: SpaceParameterFormProps) {
  const [length, setLength] = useState<string>("20")
  const [width, setWidth] = useState<string>("15")
  const [height, setCeiling] = useState<string>("10")
  const [roomType, setRoomType] = useState<string>("bedroom")
  const [orientation, setOrientation] = useState<string>("north")
  const [windows, setWindows] = useState<string>("2")
  const [doors, setDoors] = useState<string>("1")

  const handleUpdate = () => {
    const params: SpaceParameters = {
      length: Number.parseFloat(length) || 20,
      width: Number.parseFloat(width) || 15,
      height: Number.parseFloat(height) || 10,
      roomType: roomType as any,
      orientation: orientation as any,
      windows: Number.parseInt(windows) || 0,
      doors: Number.parseInt(doors) || 1,
    }
    onParametersChange(params)
  }

  return (
    <Card className="sticky top-20 md:top-24">
      <CardHeader>
        <CardTitle>Space Parameters</CardTitle>
        <CardDescription>Fill in your room details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Dimensions (in feet)</h3>

          <div className="space-y-2">
            <Label htmlFor="length">Length (ft)</Label>
            <Input
              id="length"
              type="number"
              min={10}
              max={50}
              step={1}
              value={length}
              onChange={(e) => setLength(e.target.value)}
              placeholder="20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="width">Width (ft)</Label>
            <Input
              id="width"
              type="number"
              min={10}
              max={50}
              step={1}
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              placeholder="15"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="height">Ceiling Height (ft)</Label>
            <Input
              id="height"
              type="number"
              min={8}
              max={15}
              step={0.5}
              value={height}
              onChange={(e) => setCeiling(e.target.value)}
              placeholder="10"
            />
          </div>
        </div>

        {/* Room Configuration */}
        <div className="space-y-4 border-t pt-4">
          <h3 className="font-semibold text-sm">Room Configuration</h3>

          <div className="space-y-2">
            <Label htmlFor="room-type">Room Type</Label>
            <Select value={roomType} onValueChange={setRoomType}>
              <SelectTrigger id="room-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROOM_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="orientation">Primary Orientation (Door Facing)</Label>
            <Select value={orientation} onValueChange={setOrientation}>
              <SelectTrigger id="orientation">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORIENTATIONS.map((orient) => (
                  <SelectItem key={orient.value} value={orient.value}>
                    {orient.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Openings */}
        <div className="space-y-4 border-t pt-4">
          <h3 className="font-semibold text-sm">Openings</h3>

          <div className="space-y-2">
            <Label htmlFor="windows">Number of Windows</Label>
            <Input
              id="windows"
              type="number"
              min={0}
              max={8}
              step={1}
              value={windows}
              onChange={(e) => setWindows(e.target.value)}
              placeholder="2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="doors">Number of Doors</Label>
            <Input
              id="doors"
              type="number"
              min={1}
              max={4}
              step={1}
              value={doors}
              onChange={(e) => setDoors(e.target.value)}
              placeholder="1"
            />
          </div>
        </div>

        <Button onClick={handleUpdate} className="w-full bg-primary hover:bg-primary/90">
          Analyze Space
        </Button>
      </CardContent>
    </Card>
  )
}
