"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SiteHeader } from "@/components/site-header"
import { useState } from "react"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(isLogin ? "Login" : "Sign Up", { email, password, name })
  }

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader currentPage="login" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-24 min-h-[calc(100vh-64px)] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl">{isLogin ? "Welcome Back" : "Create Account"}</CardTitle>
            <CardDescription>
              {isLogin
                ? "Sign in to your VastuVista account to continue"
                : "Join VastuVista to design harmonious spaces"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <p className="text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button onClick={() => setIsLogin(!isLogin)} className="ml-1 text-primary hover:underline font-medium">
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-center text-muted-foreground mb-3">Or continue with</p>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="text-xs bg-transparent">
                  Google
                </Button>
                <Button variant="outline" className="text-xs bg-transparent">
                  GitHub
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
