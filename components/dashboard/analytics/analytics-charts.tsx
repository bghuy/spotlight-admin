"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart, LineChart } from "@/components/ui/chart"
import type { UserStats, SongStats } from "@/lib/types"

interface AnalyticsChartsProps {
  userStats: UserStats[] | null
  songStats: SongStats[] | null
  isLoadingUserStats: boolean
  isLoadingSongStats: boolean
}

export function AnalyticsCharts({
  userStats,
  songStats,
  isLoadingUserStats,
  isLoadingSongStats,
}: AnalyticsChartsProps) {
  return (
    <Tabs defaultValue="users" className="space-y-4">
      <TabsList>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="songs">Songs</TabsTrigger>
      </TabsList>

      <TabsContent value="users" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Monthly user statistics</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            {isLoadingUserStats ? (
              <div className="h-full w-full flex items-center justify-center">
                <Skeleton className="h-[350px] w-full" />
              </div>
            ) : userStats && userStats.length > 0 ? (
              <BarChart
                data={userStats}
                index="month"
                categories={["users"]}
                colors={["#2563eb"]}
                valueFormatter={(value) => `${value.toLocaleString()}`}
                className="h-[350px]"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <p className="text-muted-foreground">No user data available for the selected period</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="songs" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Song Activity</CardTitle>
            <CardDescription>Monthly song statistics</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            {isLoadingSongStats ? (
              <div className="h-full w-full flex items-center justify-center">
                <Skeleton className="h-[350px] w-full" />
              </div>
            ) : songStats && songStats.length > 0 ? (
              <LineChart
                data={songStats}
                index="month"
                categories={["totalSongs", "likes", "dislikes"]}
                colors={["#06b6d4", "#16a34a", "#ef4444"]}
                valueFormatter={(value) => `${value.toLocaleString()}`}
                className="h-[350px]"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <p className="text-muted-foreground">No song data available for the selected period</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
