"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Compass, Home, Lightbulb, Zap } from "lucide-react"
import { SiteHeader } from "@/components/site-header"

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false)

  const vastuPrinciples = [
    {
      icon: Compass,
      title: "Directional Harmony",
      description: "Optimize room placement and orientation based on cardinal directions and energy flow principles.",
    },
    {
      icon: Home,
      title: "Space Optimization",
      description: "Balance dimensions and proportions to create harmonious living and working environments.",
    },
    {
      icon: Lightbulb,
      title: "Elemental Balance",
      description: "Integrate earth, water, fire, air, and space elements in perfect equilibrium.",
    },
    {
      icon: Zap,
      title: "Energy Flow",
      description: "Ensure positive energy circulation throughout your architectural design.",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader currentPage="home" />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 sm:py-20 lg:py-32 geometric-pattern">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
              Design Spaces with
              <br className="hidden sm:inline" />
              <span className="text-primary">Ancient Wisdom</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8">
              Harness Vastu principles with modern technology to create harmonious, perfectly balanced architectural
              spaces that enhance well-being and prosperity.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/analyzer">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-sm sm:text-base">
                  Start Analysis
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-sm sm:text-base bg-transparent">
                Learn More
              </Button>
            </div>
          </div>

          <div className="relative h-48 sm:h-64 lg:h-80 rounded-lg sm:rounded-xl overflow-hidden border border-border shadow-lg">
            <img
              src="/ancient-indian-architecture-vastu-mandala-sacred-g.jpg"
              alt="Vastu architecture design with sacred geometry and traditional Indian patterns"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Principles Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-muted/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Vastu Design Principles
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Our AI integrates five core Vastu principles to optimize every aspect of your architectural design
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {vastuPrinciples.map((principle, idx) => {
              const Icon = principle.icon
              return (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-base sm:text-lg">{principle.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-xs sm:text-sm">{principle.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground text-center mb-8 sm:mb-12 lg:mb-16">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                step: "1",
                title: "Input Space Details",
                desc: "Enter your room dimensions, orientation, and intended use.",
              },
              {
                step: "2",
                title: "AI Analysis",
                desc: "Our system analyzes against Vastu principles and generates insights.",
              },
              {
                step: "3",
                title: "Get Recommendations",
                desc: "Receive specific, actionable recommendations for optimal design.",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg mb-2 text-foreground">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">Ready to Optimize Your Space?</h2>
          <p className="text-base sm:text-lg mb-6 sm:mb-8 opacity-90">
            Join architects and designers worldwide who use VastuVista to create harmonious, balanced spaces.
          </p>
          <Link href="/analyzer">
            <Button size="lg" variant="secondary" className="text-sm sm:text-base">
              Start Your Analysis Now
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/40 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">VastuVista</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Designing spaces with ancient wisdom and modern technology.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-xs sm:text-sm">Product</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li>
                  <Link href="/analyzer" className="hover:text-foreground transition">
                    Analyzer
                  </Link>
                </li>
                <li>
                  <Link href="/floorplan" className="hover:text-foreground transition">
                    Floor Plan
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-foreground transition">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-xs sm:text-sm">Resources</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Guides
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-xs sm:text-sm">Company</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-6 sm:pt-8 text-center text-xs sm:text-sm text-muted-foreground">
            <p>&copy; 2025 VastuVista. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
