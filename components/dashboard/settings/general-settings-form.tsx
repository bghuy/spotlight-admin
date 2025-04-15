"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { settingsClient } from "@/lib/api-client"
import { toast } from "@/hooks/use-toast"

export function GeneralSettingsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      const data = Object.fromEntries(formData.entries())

      const result = await settingsClient.saveGeneralSettings(data)

      if (result.success) {
        toast({
          title: "Settings saved",
          description: "General settings have been saved successfully.",
        })
      } else {
        throw new Error("Failed to save general settings")
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
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Manage your dashboard preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site-name">Site Name</Label>
            <Input id="site-name" name="site-name" defaultValue="Music Platform Admin" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="site-description">Site Description</Label>
            <Textarea
              id="site-description"
              name="site-description"
              defaultValue="Admin dashboard for managing artists, songs, and users"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select defaultValue="utc+7" name="timezone">
              <SelectTrigger id="timezone">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utc+7">UTC+7 (Vietnam)</SelectItem>
                <SelectItem value="utc+8">UTC+8 (Singapore/China)</SelectItem>
                <SelectItem value="utc+9">UTC+9 (Japan/Korea)</SelectItem>
                <SelectItem value="utc+0">UTC+0 (London)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <div className="text-sm text-muted-foreground">Enable dark mode for the dashboard</div>
            </div>
            <Switch id="dark-mode" name="dark-mode" />
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
