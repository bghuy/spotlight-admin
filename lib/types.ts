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
  color: string
  duration: number
  url?: string
  release_date: string
  is_public?: boolean
  liked?: boolean
  uid?: string
  status?: string
  title_version?: string
  views?: number
  added_at?: string

  // Relationships
  album?: {
    id: string
    name: string
    title: string
  }
  artists?: {
    id: string
    name: string
    title: string
  }[]
  creator?: {
    id: string
    name: string
    title: string
  }
  genre?: {
    id: string
    name: string
    title: string
  }
  image?: {
    id: string
    name: string
    url: string
  }

  // Các trường cũ giữ lại để tương thích
  artist?: string
  audioUrl?: string
  coverArt?: string
  lyrics?: string
  albumId?: string
  artistId?: string
  uploadDate?: string
}

export interface CreateSongRequest {
  album_id: string
  artist_ids: string[]
  audio_id: string
  color: string
  cover_image_id: string
  release_date: string
  title: string
}

// Update the Album interface to match the new API response format
export interface Album {
  id: string
  title: string
  title_version?: string
  description: string
  type: string
  color: string
  image?: {
    id: string
    name: string
    url: string
  }
  artists?: {
    id: string
    name: string
    title: string
  }[]
  categories?: {
    id: string
    name: string
    items: {
      id: string
      name: string
      title: string
      type: string
      image?: {
        id: string
        name: string
        url: string
      }
      song?: {
        id: string
        name: string
        url: string
      }
    }[]
  }[]
  in_library?: boolean
  is_owned?: boolean
  is_public?: boolean

  // Keep these for backward compatibility
  alias?: string
  coverArt?: string
  artistId?: string
  artistName?: string
  releaseDate?: string
  songCount?: number
  song_ids?: string[]
  creator?: {
    id: string
    name: string
    title: string
  }
  cover_image?: {
    id: string
    name: string
    url: string
  }
}

// Update the CreateAlbumRequest interface to match the new API request format
export interface CreateAlbumRequest {
  title: string
  title_version?: string
  description: string
  type: string
  color: string
  image_id?: string
  artist_ids?: string[]
  is_public?: boolean

  // Keep these for backward compatibility
  alias?: string
  cover_image_id?: string
  song_ids?: string[]
}

// Update the UpdateAlbumRequest interface to match the new API request format
export interface UpdateAlbumRequest {
  title?: string
  title_version?: string
  description?: string
  type?: string
  color?: string
  image_id?: string
  artist_ids?: string[]
  is_public?: boolean

  // Keep these for backward compatibility
  alias?: string
  cover_image_id?: string
}

// Pagination metadata
export interface PaginationMeta {
  count: number
  current_page: number
  per_page: number
  total: number
  total_pages: number
}

// Paginated response
export interface PaginatedResponse<T> {
  items: T[]
  meta: PaginationMeta
}

export interface Artist {
  id: string
  name: string
  color: string
  avatar?: {
    id: string
    name: string
    title: string
    url: string
  }

  // Các trường cũ giữ lại để tương thích
  image?: string
  genre?: string
  bio?: string
  albumCount?: number
  songCount?: number
}

export interface CreateArtistRequest {
  avatar_id: string
  color: string
  name: string
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

// Analytics interfaces
export interface UserStats {
  month: string
  users: number
}

export interface SongStats {
  month: string
  totalSongs: number
  likes: number
  dislikes: number
}

// Redux state interfaces
export interface UsersState {
  items: User[]
  loading: boolean
  error: string | null
  filter: string
  searchQuery: string
}

export interface ArtistsState {
  items: Artist[]
  loading: boolean
  error: string | null
  searchQuery: string
}

export interface AlbumsState {
  items: Album[]
  loading: boolean
  error: string | null
  pagination: PaginationMeta | null
  searchQuery: string
}

export interface SongsState {
  items: Song[]
  loading: boolean
  error: string | null
  filter: string
  searchQuery: string
}


export interface CreatedFile {
  id: string,
  name: string,
  url: string
}
