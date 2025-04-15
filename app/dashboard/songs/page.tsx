"use client"

import { useState, useEffect } from "react"
import { SongList } from "@/components/dashboard/songs/song-list"
import { Button } from "@/components/ui/button"
import { RefreshCw, Loader2 } from "lucide-react"
import { songsClient } from "@/lib/api-client"
import type { Song } from "@/lib/types"

export default function SongsPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const fetchSongs = async () => {
    try {
      setIsLoading(true)
      setError(null)
      // console.log("Fetching songs data...")
      const data = await songsClient.getSongs()
      // console.log("Songs data received:", data)
      setSongs(data)
    } catch (err) {
      console.error("Error fetching songs:", err)
      setError("Failed to load songs. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // console.log("Songs page mounted, fetching data...")
    fetchSongs().catch((err) => {
      console.error("Unhandled error in fetchSongs:", err)
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
        <h1 className="text-2xl font-bold tracking-tight">Songs Library</h1>
        <p className="text-muted-foreground">Browse and manage all songs in the platform.</p>
        <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading songs...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Songs Library</h1>
        <p className="text-muted-foreground">Browse and manage all songs in the platform.</p>
        <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
          <p className="text-destructive mb-4">{error}</p>
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
      <h1 className="text-2xl font-bold tracking-tight">Songs Library</h1>
      <p className="text-muted-foreground">Browse and manage all songs in the platform.</p>
      <SongList initialSongs={songs} />
    </div>
  )
}
