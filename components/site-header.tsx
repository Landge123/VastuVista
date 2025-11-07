"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Compass } from "lucide-react"

interface SiteHeaderProps {
  currentPage?: "home" | "analyzer" | "floorplan" | "dashboard" | "login" | "pricing" | "assistant"
}

export function SiteHeader({ currentPage = "home" }: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Home", id: "home" },
    { href: "/analyzer", label: "Analyzer", id: "analyzer" },
    { href: "/floorplan", label: "Floor Plan", id: "floorplan" },
    { href: "/assistant", label: "AI Assistant", id: "assistant" },
    { href: "/dashboard", label: "Admin", id: "dashboard" },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Compass className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground hidden sm:inline">VastuVista</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.id} href={item.href}>
                <Button
                  variant={currentPage === item.id ? "default" : "ghost"}
                  size="sm"
                  className={currentPage === item.id ? "bg-primary hover:bg-primary/90" : ""}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            <Link href="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Pricing
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-muted rounded-lg transition"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-2">
            {navItems.map((item) => (
              <Link key={item.id} href={item.href} onClick={() => setIsOpen(false)}>
                <Button variant={currentPage === item.id ? "default" : "ghost"} className="w-full justify-start">
                  {item.label}
                </Button>
              </Link>
            ))}
            <Link href="/login" className="block" onClick={() => setIsOpen(false)}>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Login
              </Button>
            </Link>
            <Link href="/pricing" className="block" onClick={() => setIsOpen(false)}>
              <Button className="w-full justify-start bg-primary hover:bg-primary/90">Pricing</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
