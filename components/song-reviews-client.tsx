"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, Play, Pause, Loader2 } from "lucide-react"
import type { Song } from "@/lib/types"
import { songsClient } from "@/lib/api-client"
import { toast } from "@/hooks/use-toast"
import { playSong } from "@/lib/store/music-player-slice"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"

interface SongReviewsClientProps {
  initialSongs: Song[]
}

export function SongReviewsClient({ initialSongs }: SongReviewsClientProps) {
  const [songs, setSongs] = useState<Song[]>(initialSongs)
  const dispatch = useAppDispatch()
  const { currentSong, isPlaying, isVisible } = useAppSelector((state) => state.musicPlayer)
  const [expandedSong, setExpandedSong] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({})

  const toggleExpand = (id: string) => {
    setExpandedSong(expandedSong === id ? null : id)
  }

  // Cập nhật hàm handlePlaySong để luôn dispatch playSong
  const handlePlaySong = (song: Song) => {
    // Luôn dispatch playSong để đảm bảo player được mở lại nếu đã đóng
    dispatch(playSong(song))
  }

  const handleApproveSong = async (id: string) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }))
    try {
      const updatedSong = await songsClient.approveSong(id)
      setSongs((prev) => prev.map((song) => (song.id === id ? updatedSong : song)))
      toast({
        title: "Success",
        description: "Song approved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve song",
        variant: "destructive",
      })
      console.error("Error approving song:", error)
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }))
    }
  }

  const handleRejectSong = async (id: string) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }))
    try {
      const updatedSong = await songsClient.rejectSong(id)
      setSongs((prev) => prev.map((song) => (song.id === id ? updatedSong : song)))
      toast({
        title: "Success",
        description: "Song rejected successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject song",
        variant: "destructive",
      })
      console.error("Error rejecting song:", error)
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }))
    }
  }

  const formatDuration = (duration: string) => {
    const [minutes, seconds] = duration.split(":").map(Number)
    return `${minutes}m ${seconds}s`
  }

  if (songs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground">No songs pending review</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {songs.map((song) => (
        <Card key={song.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{song.title}</CardTitle>
                <CardDescription>{song.artist}</CardDescription>
              </div>
              <Badge
                variant={song.status === "pending" ? "outline" : song.status === "approved" ? "success" : "destructive"}
              >
                {song.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative h-20 w-20 rounded-md overflow-hidden">
                <img
                  src={song.coverArt || "/placeholder.svg?height=80&width=80"}
                  alt={song.title}
                  className="object-cover h-full w-full"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute inset-0 m-auto h-8 w-8 rounded-full bg-background/80 hover:bg-background/90"
                  onClick={() => handlePlaySong(song)}
                >
                  {currentSong?.id === song.id && isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">Genre:</span>
                  <span className="text-xs">{song.genre}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">Duration:</span>
                  <span className="text-xs">{formatDuration(song.duration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">Uploaded:</span>
                  <span className="text-xs">{new Date(song.uploadDate).toLocaleDateString()}</span>
                </div>
                <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => toggleExpand(song.id)}>
                  {expandedSong === song.id ? "Hide details" : "Show details"}
                </Button>
              </div>
            </div>

            {expandedSong === song.id && (
              <div className="mt-2 space-y-2 text-sm">
                <div>
                  <h4 className="font-medium text-xs mb-1">Lyrics:</h4>
                  <div className="max-h-24 overflow-y-auto text-xs bg-muted p-2 rounded-md">
                    <pre className="whitespace-pre-wrap font-sans">{song.lyrics || "No lyrics available"}</pre>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <div className="flex justify-between w-full">
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => handleRejectSong(song.id)}
                disabled={actionLoading[song.id] || song.status !== "pending"}
              >
                {actionLoading[song.id] ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <X className="mr-2 h-4 w-4" />
                )}
                Reject
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-primary hover:text-primary"
                onClick={() => handleApproveSong(song.id)}
                disabled={actionLoading[song.id] || song.status !== "pending"}
              >
                {actionLoading[song.id] ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Check className="mr-2 h-4 w-4" />
                )}
                Approve
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
