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
  albumId?: string
  artistId?: string
}

export interface Album {
  id: string
  title: string
  coverArt?: string
  artistId?: string
  artistName?: string
  releaseDate: string
  songCount?: number
}

export interface Artist {
  id: string
  name: string
  image?: string
  genre?: string
  bio?: string
  albumCount?: number
  songCount?: number
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

// Thêm các interface mới cho analytics
// Cập nhật interface UserStats để chỉ có một trường users
export interface UserStats {
  month: string
  users: number
}

// Cập nhật interface SongStats để có các trường tổng bài hát, like, dislike
export interface SongStats {
  month: string
  totalSongs: number
  likes: number
  dislikes: number
}
