"use client"

import { useState, useEffect } from "react"
import type { DateRange } from "react-day-picker"
import { subMonths } from "date-fns"
import { analyticsClient } from "@/lib/api-client"
import { StatsCards } from "@/components/dashboard/analytics/stats-cards"
import { AnalyticsCharts } from "@/components/dashboard/analytics/analytics-charts"
import { DateRangePicker } from "@/components/dashboard/analytics/date-range-picker"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import type { UserStats, SongStats } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

export default function DashboardPage() {
  // Tổng quan
  const [summaryData, setSummaryData] = useState<{
    totalUsers: number
    totalSongs: number
    totalArtists: number
  } | null>(null)
  const [isLoadingSummary, setIsLoadingSummary] = useState(true)

  // Thống kê theo thời gian
  const [userStats, setUserStats] = useState<UserStats[] | null>(null)
  const [songStats, setSongStats] = useState<SongStats[] | null>(null)
  const [isLoadingUserStats, setIsLoadingUserStats] = useState(false)
  const [isLoadingSongStats, setIsLoadingSongStats] = useState(false)

  // Lỗi
  const [error, setError] = useState<string | null>(null)

  // Date range
  // const [dateRange, setDateRange] = useState<DateRange | undefined>({
  //   from: subMonths(new Date(), 12),
  //   to: new Date(),
  // })
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 1), // 1 tháng 0 = Tháng 1
    to: new Date(), // ngày hiện tại
  });

  // Fetch tổng quan sử dụng Promise.all
  const fetchSummaryData = async () => {
    try {
      setIsLoadingSummary(true)
      setError(null)
      console.log("Fetching analytics summary using Promise.all...")

      const data = await analyticsClient.getAnalyticsSummary()
      console.log("Analytics summary received:", data)
      setSummaryData(data)
    } catch (err) {
      console.error("Error fetching analytics summary:", err)
      setError("Failed to load analytics summary. Please try again.")
    } finally {
      setIsLoadingSummary(false)
    }
  }

  // Fetch thống kê user
  const fetchUserStats = async () => {
    if (!dateRange?.from || !dateRange?.to) return

    try {
      setIsLoadingUserStats(true)
      console.log("Fetching user stats...", dateRange.from, dateRange.to)
      const data = await analyticsClient.getUserStats(dateRange.from, dateRange.to)
      console.log("User stats received:", data)
      setUserStats(data)
    } catch (err) {
      console.error("Error fetching user stats:", err)
      toast({
        title: "Error",
        description: "Failed to load user statistics. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingUserStats(false)
    }
  }

  // Fetch thống kê song
  const fetchSongStats = async () => {
    if (!dateRange?.from || !dateRange?.to) return

    try {
      setIsLoadingSongStats(true)
      console.log("Fetching song stats...", dateRange.from, dateRange.to)
      const data = await analyticsClient.getSongStats(dateRange.from, dateRange.to)
      console.log("Song stats received:", data)
      setSongStats(data)
    } catch (err) {
      console.error("Error fetching song stats:", err)
      toast({
        title: "Error",
        description: "Failed to load song statistics. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingSongStats(false)
    }
  }

  // Fetch tất cả dữ liệu
  const fetchAllData = () => {
    fetchSummaryData()
    fetchUserStats()
    fetchSongStats()
  }

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    fetchAllData()
  }, [])

  // Fetch dữ liệu thống kê khi date range thay đổi
  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      fetchUserStats()
      fetchSongStats()
    }
  }, [dateRange])

  // Xử lý thay đổi date range
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)
  }

  // Xử lý refresh
  const handleRefresh = () => {
    fetchAllData()
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
        <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground">View statistics and trends for your music platform.</p>
      </div>

      {/* Stats Cards */}
      <StatsCards data={summaryData} isLoading={isLoadingSummary} />

      {/* Date Range Picker and Refresh Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <DateRangePicker dateRange={dateRange} onDateRangeChange={handleDateRangeChange} />
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Charts */}
      <AnalyticsCharts
        userStats={userStats}
        songStats={songStats}
        isLoadingUserStats={isLoadingUserStats}
        isLoadingSongStats={isLoadingSongStats}
      />
    </div>
  )
}
