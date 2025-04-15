"use client"

import { useState } from "react"
import { toast } from "@/hooks/use-toast"
import { saveGeneralSettings, saveNotificationSettings, saveSecuritySettings, saveApiSettings } from "@/lib/actions"

export function useSettingsForm() {
  const [isSubmitting, setIsSubmitting] = useState<Record<string, boolean>>({
    general: false,
    notifications: false,
    security: false,
    api: false,
  })

  const handleSubmitGeneral = async (formData: FormData) => {
    setIsSubmitting((prev) => ({ ...prev, general: true }))

    try {
      const result = await saveGeneralSettings(formData)

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
      setIsSubmitting((prev) => ({ ...prev, general: false }))
    }
  }

  const handleSubmitNotifications = async (formData: FormData) => {
    setIsSubmitting((prev) => ({ ...prev, notifications: true }))

    try {
      const result = await saveNotificationSettings(formData)

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
      setIsSubmitting((prev) => ({ ...prev, notifications: false }))
    }
  }

  const handleSubmitSecurity = async (formData: FormData) => {
    setIsSubmitting((prev) => ({ ...prev, security: true }))

    try {
      const result = await saveSecuritySettings(formData)

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
      setIsSubmitting((prev) => ({ ...prev, security: false }))
    }
  }

  const handleSubmitApi = async (formData: FormData) => {
    setIsSubmitting((prev) => ({ ...prev, api: true }))

    try {
      const result = await saveApiSettings(formData)

      if (result.success) {
        toast({
          title: "Settings saved",
          description: "API settings have been saved successfully.",
        })
      } else {
        throw new Error("Failed to save API settings")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "An error occurred while saving settings.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting((prev) => ({ ...prev, api: false }))
    }
  }

  return {
    isSubmitting,
    handleSubmitGeneral,
    handleSubmitNotifications,
    handleSubmitSecurity,
    handleSubmitApi,
  }
}
