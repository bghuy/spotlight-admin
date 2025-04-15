"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { settingsClient } from "@/lib/api-client"
import { toast } from "@/hooks/use-toast"

export function NotificationSettingsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      const data = Object.fromEntries(formData.entries())

      const result = await settingsClient.saveNotificationSettings(data)

      if (result.success) {
        toast({
          title: "Settings saved",
          description: "Notification settings have been saved successfully.",
        })
      } else {
        throw new Error("Failed to save notification settings")
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
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Configure how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <div className="text-sm text-muted-foreground">Receive notifications via email</div>
            </div>
            <Switch id="email-notifications" name="email-notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="artist-requests">Artist Requests</Label>
              <div className="text-sm text-muted-foreground">Notify when new artist requests are submitted</div>
            </div>
            <Switch id="artist-requests" name="artist-requests" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="song-uploads">Song Uploads</Label>
              <div className="text-sm text-muted-foreground">Notify when new songs are uploaded for review</div>
            </div>
            <Switch id="song-uploads" name="song-uploads" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="user-reports">User Reports</Label>
              <div className="text-sm text-muted-foreground">Notify when users report content</div>
            </div>
            <Switch id="user-reports" name="user-reports" defaultChecked />
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
