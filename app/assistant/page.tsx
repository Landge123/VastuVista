"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send, Loader2, Upload, X, ImageIcon } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  image?: string
  timestamp: Date
}

const VASTU_SYSTEM_PROMPT = `You are VastuVista AI Assistant, an expert in Vastu Shastra (ancient Indian architectural science). Your role is to help users understand and apply Vastu principles to their spaces.

You provide guidance on:
- Room placement and orientation based on directions
- Color schemes for different areas
- Element balance (Fire, Water, Earth, Air, Space)
- Furniture placement and positioning
- Space optimization techniques
- Entrance placement and flow
- Energy enhancement methods
- Remedies for existing spaces

Always provide practical, actionable advice. Keep responses concise but informative. Ask clarifying questions if needed to better assist the user.`

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your Vastu assistant. I'm here to help you understand and apply Vastu principles to your spaces. You can ask me about room placements, colors, energy flow, and any Vastu-related questions. You can also upload floor plans or space images for analysis. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setUploadedImage(result)
        setImagePreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setUploadedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const generateResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI response with Vastu-specific guidance
    // In a production app, this would call an API with actual AI model
    const responses: { [key: string]: string } = {
      bedroom:
        "According to Vastu, the master bedroom should ideally be in the Southwest direction. The bed should face South or West. Keep the room well-ventilated and avoid mirrors facing the bed. Use warm, calming colors like cream or soft yellow.",
      kitchen:
        "The kitchen is best positioned in the Southeast direction (fire element). The stove should ideally face East. Ensure proper ventilation and avoid placing the kitchen directly below or above a bedroom. Use warm colors like yellow or orange.",
      entrance:
        "The main entrance should ideally face East or North for positive energy flow. Avoid a main entrance facing Southwest. The entrance should be well-lit and clutter-free to allow prosperity to enter.",
      "living room":
        "The living room works well in the North or East direction. Use bright, energizing colors. Arrange furniture to encourage conversation and positive flow. Avoid cluttering this space as it represents abundance.",
      bathroom:
        "Bathrooms are best in the Northwest direction. Ensure proper drainage and ventilation. Use white, light blue, or gray colors. Keep the bathroom clean and well-maintained as it relates to health and wellness.",
      color:
        "Colors have significant impact in Vastu. North: Blue/Green (water), East: Green/Red (growth), South: Red/Orange (fire), West: White/Gray (air), Northeast: Light colors (purity), Southeast: Orange/Red (fire), Southwest: Brown/Red (stability), Northwest: Gray/White (wind).",
      direction:
        "The 8 directions in Vastu each have unique qualities: North (water/career), Northeast (spiritual), East (health), Southeast (prosperity), South (fame), Southwest (relationships), West (creativity), Northwest (helpful people).",
      image:
        "I've reviewed the image you've uploaded. For a more detailed Vastu analysis of this space, please describe: the room's purpose, current dimensions, orientation/direction it faces, what you'd like to improve, and any specific concerns. I can then provide targeted recommendations based on Vastu principles.",
    }

    const lowerMessage = userMessage.toLowerCase()
    if (
      uploadedImage &&
      (lowerMessage.includes("image") ||
        lowerMessage.includes("floor") ||
        lowerMessage.includes("space") ||
        lowerMessage.includes("room"))
    ) {
      return responses["image"]
    }

    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        return response
      }
    }

    // Default response for general questions
    return `That's a great question about Vastu! Vastu Shastra is an ancient Indian science that focuses on creating harmony between our living spaces and natural elements. 

Key principles include:
- Orientation: Using cardinal directions for specific purposes
- Elements: Balancing Fire, Water, Earth, Air, and Space
- Symmetry: Creating balance and harmony in design
- Flow: Ensuring positive energy circulation

For your specific situation, I'd recommend considering the room's purpose, its direction, and how it relates to the other areas of your space. Feel free to ask me more specific questions about your space!`
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      image: uploadedImage || undefined,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    // Clear image after sending
    removeImage()
    setIsLoading(true)

    // Simulate API delay
    setTimeout(async () => {
      const response = await generateResponse(input)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <SiteHeader currentPage="assistant" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Vastu AI Assistant</h1>
            <p className="text-muted-foreground">
              Ask any questions about Vastu principles and upload space images for analysis
            </p>
          </div>

          {/* Chat Container */}
          <Card className="h-[500px] sm:h-[600px] flex flex-col bg-card border border-border shadow-lg">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs sm:max-w-md lg:max-w-lg ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-lg rounded-br-none"
                        : "bg-muted text-foreground rounded-lg rounded-bl-none border border-border"
                    }`}
                  >
                    {message.image && (
                      <div className="mb-2">
                        <img
                          src={message.image || "/placeholder.svg"}
                          alt="Uploaded space"
                          className="w-full rounded max-h-48 object-cover"
                        />
                      </div>
                    )}
                    <p className="px-4 py-2 text-sm sm:text-base leading-relaxed">{message.content}</p>
                    <span className="text-xs opacity-70 px-4 pb-2 block">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground px-4 py-2 rounded-lg rounded-bl-none border border-border flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-border p-4 sm:p-6 bg-background/50 space-y-3">
              {imagePreview && (
                <div className="relative inline-block">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="max-h-32 rounded border border-border"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <form onSubmit={handleSendMessage} className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about Vastu principles or describe your space..."
                    disabled={isLoading}
                    className="flex-1 bg-background border-border text-foreground placeholder:text-muted-foreground"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload space image"
                    className="border-border hover:bg-muted"
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    size="icon"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
              <p className="text-xs text-muted-foreground">
                Try asking about: bedroom, kitchen, entrance, colors, or upload floor plan images for analysis
              </p>
            </div>
          </Card>

          {/* Tips Section */}
          <Card className="p-4 sm:p-6 bg-card border border-border">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              How to Use
            </h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Click the upload button to share floor plans or space images</li>
              <li>• Ask about specific rooms like bedroom, kitchen, or living room</li>
              <li>• Inquire about directions and their Vastu significance</li>
              <li>• Get advice on colors, elements, and furniture placement</li>
              <li>• Request remedies for existing space challenges</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
