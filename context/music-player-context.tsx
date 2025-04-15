"use client"

import type React from "react"
import { createContext, useContext, useState, useRef } from "react"
import type { Song, MusicPlayerState } from "@/lib/types"

interface MusicPlayerContextType {
  state: MusicPlayerState
  playSong: (song: Song) => void
  pauseSong: () => void
  togglePlay: () => void
  toggleRepeat: () => void
  toggleLyrics: () => void
  closeMusicPlayer: () => void
}

const initialState: MusicPlayerState = {
  currentSong: null,
  isPlaying: false,
  isRepeat: false,
  showLyrics: false,
  isVisible: false,
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined)

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<MusicPlayerState>(initialState)

  // Use a ref to track the current state without triggering re-renders
  const stateRef = useRef(state)
  stateRef.current = state

  // Function to play a song
  const playSong = (song: Song) => {
    console.log("MusicPlayerContext: playSong called with", song.title)

    // If we're trying to play the same song that's already playing, just toggle play state
    if (stateRef.current.currentSong?.id === song.id) {
      setState((prev) => ({
        ...prev,
        isPlaying: !prev.isPlaying,
      }))
    } else {
      // It's a new song, set it as current and start playing
      setState({
        currentSong: song,
        isPlaying: true,
        isRepeat: stateRef.current.isRepeat,
        showLyrics: false,
        isVisible: true,
      })
    }
  }

  // Function to pause the current song
  const pauseSong = () => {
    console.log("MusicPlayerContext: pauseSong called")
    setState((prev) => {
      // Only update if currently playing
      if (prev.isPlaying) {
        return { ...prev, isPlaying: false }
      }
      return prev
    })
  }

  // Function to toggle play/pause
  const togglePlay = () => {
    console.log("MusicPlayerContext: togglePlay called")
    setState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))
  }

  // Function to toggle lyrics display - FIXED to preserve other state
  const toggleLyrics = () => {
    console.log("MusicPlayerContext: toggleLyrics called")
    setState((prev) => {
      // Only update the showLyrics property, preserve all other state
      return { ...prev, showLyrics: !prev.showLyrics }
    })
  }

  // Function to toggle repeat mode - FIXED to preserve other state
  const toggleRepeat = () => {
    console.log("MusicPlayerContext: toggleRepeat called")
    setState((prev) => {
      // Only update the isRepeat property, preserve all other state
      return { ...prev, isRepeat: !prev.isRepeat }
    })
  }

  // Function to close the music player
  const closeMusicPlayer = () => {
    console.log("MusicPlayerContext: closeMusicPlayer called")
    setState((prev) => ({ ...prev, isVisible: false, isPlaying: false }))
  }

  return (
    <MusicPlayerContext.Provider
      value={{
        state,
        playSong,
        pauseSong,
        togglePlay,
        toggleRepeat,
        toggleLyrics,
        closeMusicPlayer,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  )
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext)
  if (context === undefined) {
    throw new Error("useMusicPlayer must be used within a MusicPlayerProvider")
  }
  return context
}
