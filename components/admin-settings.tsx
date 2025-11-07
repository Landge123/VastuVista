"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Settings, Bell, Lock, Zap } from "lucide-react"

export function AdminSettings() {
  const [settings, setSettings] = useState({
    analyticsEnabled: true,
    emailNotifications: true,
    maintenanceMode: false,
    autoBackup: true,
    apiLimiter: 1000,
  })

  const handleToggle = (key: keyof typeof settings) => {
    setSettings({
      ...settings,
      [key]: !settings[key],
    })
  }

  const handleSave = () => {
    console.log("Settings saved:", settings)
  }

  return (
    <div className="space-y-6">
      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            System Settings
          </CardTitle>
          <CardDescription>Configure system-wide options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/40 transition">
            <div>
              <Label className="cursor-pointer">Analytics</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Track user behavior and platform metrics</p>
            </div>
            <Switch checked={settings.analyticsEnabled} onCheckedChange={() => handleToggle("analyticsEnabled")} />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/40 transition">
            <div>
              <Label className="cursor-pointer">Email Notifications</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Send system alerts and updates via email</p>
            </div>
            <Switch checked={settings.emailNotifications} onCheckedChange={() => handleToggle("emailNotifications")} />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/40 transition">
            <div>
              <Label className="cursor-pointer">Auto Backup</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Automatically backup data daily</p>
            </div>
            <Switch checked={settings.autoBackup} onCheckedChange={() => handleToggle("autoBackup")} />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/40 transition">
            <div>
              <Label className="cursor-pointer">Maintenance Mode</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Restrict public access during maintenance</p>
            </div>
            <Switch checked={settings.maintenanceMode} onCheckedChange={() => handleToggle("maintenanceMode")} />
          </div>
        </CardContent>
      </Card>

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            API Configuration
          </CardTitle>
          <CardDescription>Manage API limits and access</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="api-limit">API Request Limit (per hour)</Label>
            <Input
              id="api-limit"
              type="number"
              value={settings.apiLimiter}
              onChange={(e) => setSettings({ ...settings, apiLimiter: Number.parseInt(e.target.value) })}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">Maximum requests allowed per hour</p>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>Configure alert settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/40 transition">
            <div>
              <Label className="cursor-pointer">High Volume Alerts</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Alert when analysis volume exceeds threshold</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/40 transition">
            <div>
              <Label className="cursor-pointer">Error Notifications</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Notify on system errors and failures</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Security
          </CardTitle>
          <CardDescription>Manage security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full bg-transparent">
            Change Admin Password
          </Button>
          <Button variant="outline" className="w-full bg-transparent">
            View Activity Log
          </Button>
          <Button variant="outline" className="w-full bg-transparent">
            Manage API Keys
          </Button>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
          Save Settings
        </Button>
        <Button variant="outline">Reset to Defaults</Button>
      </div>
    </div>
  )
}
