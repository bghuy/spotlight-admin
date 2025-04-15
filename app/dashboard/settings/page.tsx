"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GeneralSettingsForm } from "@/components/dashboard/settings/general-settings-form"
import { NotificationSettingsForm } from "@/components/dashboard/settings/notification-settings-form"
import { SecuritySettingsForm } from "@/components/dashboard/settings/security-settings-form"
import { ApiSettingsForm } from "@/components/dashboard/settings/api-settings-form"

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <GeneralSettingsForm />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationSettingsForm />
        </TabsContent>
        <TabsContent value="security">
          <SecuritySettingsForm />
        </TabsContent>
        <TabsContent value="api">
          <ApiSettingsForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
