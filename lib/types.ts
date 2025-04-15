"use client"
export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "artist" | "user"
  status: "active" | "inactive"
  lastActive: string
  picture?: string
}

export interface ArtistRequest {
  id: string
  name: string
  email: string
  genre: string
  bio: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

export interface Song {
  id: string
  title: string
  artist: string
  genre: string
  duration: string
  uploadDate: string
  status: "pending" | "approved" | "rejected"
  audioUrl?: string
  coverArt?: string
  lyrics?: string
}

export interface AnalyticsData {
  totalUsers: number
  totalArtists: number
  totalSongs: number
  pendingReviews: number
  userGrowth: { name: string; value: number }[]
  contentDistribution: { name: string; value: number }[]
}

export interface MusicPlayerState {
  currentSong: Song | null
  isPlaying: boolean
  isRepeat: boolean
  showLyrics: boolean
  isVisible: boolean
}
