"use client"

import { useState, useEffect } from "react"
import { analyticsClient } from "@/lib/api-client"
import type { AnalyticsData } from "@/lib/types"
import { StatsCards } from "@/components/dashboard/analytics/stats-cards"
import { AnalyticsCharts } from "@/components/dashboard/analytics/analytics-charts"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw } from "lucide-react"
import axiosInstance from "@/constants/axios-instance"
import { useAppDispatch } from "@/lib/store/hooks"
import { setUser } from "@/lib/store/user-slice"

export default function DashboardPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const dispatch = useAppDispatch()

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      // console.log("Fetching analytics data...")
      const analyticsData = await analyticsClient.getAnalyticsData()
      // console.log("Analytics data received:", analyticsData)
      setData(analyticsData)
    } catch (err) {
      console.error("Error fetching analytics data:", err)
      setError("Failed to load analytics data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // console.log("Dashboard page mounted, fetching data...")
    fetchData().catch((err) => {
      console.error("Unhandled error in fetchData:", err)
      setIsLoading(false)
      setError("An unexpected error occurred. Please try again.")
    })
  }, [retryCount])


  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
        <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
        <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
          <p className="text-destructive mb-4">{error || "Failed to load data"}</p>
          <Button onClick={handleRetry} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
      {/* <Button onClick={fetchUser}>fetch user</Button> */}
      <StatsCards data={data} />
      <AnalyticsCharts data={data} />
    </div>
  )
}
