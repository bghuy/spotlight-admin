"use client"

import { useState, useEffect, useCallback } from "react"
import { songsClient } from "@/lib/api-client"
import type { Song } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

export function useSongs() {
  const [songs, setSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSongs = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      console.log("Fetching songs in useSongs hook...")
      const data = await songsClient.getSongs()
      console.log("Songs data received in hook:", data)
      setSongs(data)
    } catch (err) {
      console.error("Error fetching songs in hook:", err)
      setError("Failed to load songs")
      toast({
        title: "Error",
        description: "Failed to load songs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      try {
        await fetchSongs()
      } catch (err) {
        console.error("Error in fetchSongs effect:", err)
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [fetchSongs])

  const approveSong = useCallback(async (id: string) => {
    try {
      const updatedSong = await songsClient.approveSong(id)
      setSongs((prevSongs) => prevSongs.map((song) => (song.id === id ? { ...song, status: "approved" } : song)))
      toast({
        title: "Success",
        description: "Song approved successfully",
      })
      return updatedSong
    } catch (err) {
      console.error("Error approving song:", err)
      toast({
        title: "Error",
        description: "Failed to approve song",
        variant: "destructive",
      })
      throw err
    }
  }, [])

  const rejectSong = useCallback(async (id: string) => {
    try {
      const updatedSong = await songsClient.rejectSong(id)
      setSongs((prevSongs) => prevSongs.map((song) => (song.id === id ? { ...song, status: "rejected" } : song)))
      toast({
        title: "Success",
        description: "Song rejected successfully",
      })
      return updatedSong
    } catch (err) {
      console.error("Error rejecting song:", err)
      toast({
        title: "Error",
        description: "Failed to reject song",
        variant: "destructive",
      })
      throw err
    }
  }, [])

  return {
    songs,
    isLoading,
    error,
    approveSong,
    rejectSong,
    refetch: fetchSongs,
  }
}
