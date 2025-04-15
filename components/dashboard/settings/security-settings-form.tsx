"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { settingsClient } from "@/lib/api-client"
import { toast } from "@/hooks/use-toast"

export function SecuritySettingsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      const data = Object.fromEntries(formData.entries())

      const result = await settingsClient.saveSecuritySettings(data)

      if (result.success) {
        toast({
          title: "Settings saved",
          description: "Security settings have been saved successfully.",
        })
      } else {
        throw new Error("Failed to save security settings")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "An error occurred while saving settings.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Manage your security preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="two-factor">Two-Factor Authentication</Label>
            <div className="flex items-center gap-4">
              <Switch id="two-factor" name="two-factor" />
              <span className="text-sm text-muted-foreground">Not enabled</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="session-timeout">Session Timeout</Label>
            <Select defaultValue="60" name="session-timeout">
              <SelectTrigger id="session-timeout">
                <SelectValue placeholder="Select timeout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
                <SelectItem value="240">4 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-history">Login History</Label>
            <div className="rounded-md border p-4">
              <div className="text-sm">
                <div className="font-medium">Last login: Today, 10:24 AM</div>
                <div className="text-muted-foreground">IP: 192.168.1.1</div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
