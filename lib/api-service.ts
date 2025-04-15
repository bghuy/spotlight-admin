import type { ArtistRequest, Song, User, AnalyticsData } from "@/lib/types"

// Simulate API delay
const simulateDelay = () => new Promise((resolve) => setTimeout(resolve, 300))

// Mock data for users
const mockUsers: User[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    role: "admin",
    status: "active",
    lastActive: "2023-04-01",
  },
  {
    id: "2",
    name: "Trần Thị B",
    email: "tranthib@example.com",
    role: "artist",
    status: "active",
    lastActive: "2023-04-02",
  },
  {
    id: "3",
    name: "Lê Văn C",
    email: "levanc@example.com",
    role: "user",
    status: "active",
    lastActive: "2023-04-03",
  },
  {
    id: "4",
    name: "Phạm Thị D",
    email: "phamthid@example.com",
    role: "user",
    status: "inactive",
    lastActive: "2023-03-15",
  },
  {
    id: "5",
    name: "Hoàng Văn E",
    email: "hoangvane@example.com",
    role: "artist",
    status: "active",
    lastActive: "2023-04-04",
  },
]

// Mock data for artist approval requests
const mockArtistRequests: ArtistRequest[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    genre: "Pop",
    bio: "Professional singer with 5 years of experience",
    status: "pending",
    createdAt: "2023-04-01",
  },
  {
    id: "2",
    name: "Trần Thị B",
    email: "tranthib@example.com",
    genre: "Rock",
    bio: "Independent artist with 2 albums",
    status: "pending",
    createdAt: "2023-04-02",
  },
  {
    id: "3",
    name: "Lê Văn C",
    email: "levanc@example.com",
    genre: "Hip-hop",
    bio: "Emerging artist with a growing fanbase",
    status: "pending",
    createdAt: "2023-04-03",
  },
]

// Mock data for song review requests with audio URLs - using reliable audio samples
const mockSongs: Song[] = [
  {
    id: "1",
    title: "Summer Vibes",
    artist: "Nguyễn Văn A",
    genre: "Pop",
    duration: "3:45",
    uploadDate: "2023-04-01",
    status: "pending",
    // Using a reliable audio sample
    audioUrl: "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg",
    coverArt: "/placeholder.svg?height=80&width=80",
    lyrics: `[Verse 1]
Summer vibes, feeling alive
Under the sun, having some fun
Days are long, nights are warm
This is where I belong

[Chorus]
Summer vibes, summer vibes
Feeling the heat, dancing to the beat
Summer vibes, summer vibes
Life is sweet, this moment's complete

[Verse 2]
Ocean waves, lazy days
Sipping cool drinks, not overthinking
Friends around, music sound
Happiness all around`,
  },
  {
    id: "2",
    title: "City Lights",
    artist: "Trần Thị B",
    genre: "Rock",
    duration: "4:12",
    uploadDate: "2023-04-02",
    status: "pending",
    // Using a reliable audio sample
    audioUrl: "https://actions.google.com/sounds/v1/alarms/assorted_computer_sounds.ogg",
    coverArt: "/placeholder.svg?height=80&width=80",
    lyrics: `[Verse 1]
City lights shine so bright
Guiding me through the night
Concrete jungle, steel and glass
Moving fast, time will pass

[Chorus]
City lights, city lights
Illuminate my life
City lights, city lights
Through darkness and strife

[Verse 2]
Busy streets, endless beats
Strangers pass, nobody greets
But I find my way somehow
Living in the here and now`,
  },
  {
    id: "3",
    title: "Midnight Dreams",
    artist: "Lê Văn C",
    genre: "Hip-hop",
    duration: "3:28",
    uploadDate: "2023-04-03",
    status: "pending",
    // Using a reliable audio sample
    audioUrl: "https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg",
    coverArt: "/placeholder.svg?height=80&width=80",
    lyrics: `[Verse 1]
Midnight dreams, nothing is as it seems
Chasing goals, searching for my soul
Stars above, guide me with your love
In this world, my story unfolds

[Chorus]
Midnight dreams, midnight dreams
Reality tears at the seams
Midnight dreams, midnight dreams
Life's not always what it seems

[Verse 2]
Silent night, internal fight
Seeking peace, looking for release
Time goes by, wondering why
Finding strength, reaching new heights`,
  },
  {
    id: "4",
    title: "Ocean Waves",
    artist: "Phạm Thị D",
    genre: "Ambient",
    duration: "5:16",
    uploadDate: "2023-04-04",
    status: "pending",
    // Using a reliable audio sample
    audioUrl: "https://actions.google.com/sounds/v1/alarms/dosimeter_alarm.ogg",
    coverArt: "/placeholder.svg?height=80&width=80",
    lyrics: `[Verse 1]
Ocean waves crashing on the shore
Peaceful sounds I've been longing for
Salty breeze, touching my face
Finding calm in this special place

[Chorus]
Ocean waves, ocean waves
Washing away all my pain
Ocean waves, ocean waves
Again and again

[Verse 2]
Endless blue meets the sky above
Nature's beauty, filled with love
Time stands still, worries fade
Perfect moments that won't degrade`,
  },
]

// Mock analytics data
const mockAnalyticsData: AnalyticsData = {
  totalUsers: 1248,
  totalArtists: 324,
  totalSongs: 3782,
  pendingReviews: 24,
  userGrowth: [
    { name: "Jan", value: 800 },
    { name: "Feb", value: 900 },
    { name: "Mar", value: 950 },
    { name: "Apr", value: 1100 },
    { name: "May", value: 1050 },
    { name: "Jun", value: 1150 },
    { name: "Jul", value: 1250 },
  ],
  contentDistribution: [
    { name: "Songs", value: 3782 },
    { name: "Albums", value: 420 },
    { name: "Playlists", value: 1248 },
  ],
}

// API service for users
export const userService = {
  getUsers: async (filter?: string): Promise<User[]> => {
    await simulateDelay()
    if (filter && filter !== "all") {
      return mockUsers.filter((user) => user.role === filter)
    }
    return [...mockUsers]
  },

  getUserById: async (id: string): Promise<User | undefined> => {
    await simulateDelay()
    return mockUsers.find((user) => user.id === id)
  },

  updateUserRole: async (id: string, role: User["role"]): Promise<User> => {
    await simulateDelay()
    const userIndex = mockUsers.findIndex((user) => user.id === id)
    if (userIndex === -1) throw new Error("User not found")

    mockUsers[userIndex] = { ...mockUsers[userIndex], role }
    return { ...mockUsers[userIndex] }
  },

  updateUserStatus: async (id: string, status: User["status"]): Promise<User> => {
    await simulateDelay()
    const userIndex = mockUsers.findIndex((user) => user.id === id)
    if (userIndex === -1) throw new Error("User not found")

    mockUsers[userIndex] = { ...mockUsers[userIndex], status }
    return { ...mockUsers[userIndex] }
  },
}

// API service for artist requests
export const artistRequestService = {
  getArtistRequests: async (status?: ArtistRequest["status"]): Promise<ArtistRequest[]> => {
    await simulateDelay()
    if (status) {
      return mockArtistRequests.filter((request) => request.status === status)
    }
    return [...mockArtistRequests]
  },

  approveArtistRequest: async (id: string): Promise<ArtistRequest> => {
    await simulateDelay()
    const requestIndex = mockArtistRequests.findIndex((request) => request.id === id)
    if (requestIndex === -1) throw new Error("Artist request not found")

    mockArtistRequests[requestIndex] = { ...mockArtistRequests[requestIndex], status: "approved" }
    return { ...mockArtistRequests[requestIndex] }
  },

  rejectArtistRequest: async (id: string): Promise<ArtistRequest> => {
    await simulateDelay()
    const requestIndex = mockArtistRequests.findIndex((request) => request.id === id)
    if (requestIndex === -1) throw new Error("Artist request not found")

    mockArtistRequests[requestIndex] = { ...mockArtistRequests[requestIndex], status: "rejected" }
    return { ...mockArtistRequests[requestIndex] }
  },
}

// API service for songs
export const songService = {
  getSongs: async (status?: Song["status"]): Promise<Song[]> => {
    await simulateDelay()
    if (status) {
      return mockSongs.filter((song) => song.status === status)
    }
    return [...mockSongs]
  },

  approveSong: async (id: string): Promise<Song> => {
    await simulateDelay()
    const songIndex = mockSongs.findIndex((song) => song.id === id)
    if (songIndex === -1) throw new Error("Song not found")

    mockSongs[songIndex] = { ...mockSongs[songIndex], status: "approved" }
    return { ...mockSongs[songIndex] }
  },

  rejectSong: async (id: string): Promise<Song> => {
    await simulateDelay()
    const songIndex = mockSongs.findIndex((song) => song.id === id)
    if (songIndex === -1) throw new Error("Song not found")

    mockSongs[songIndex] = { ...mockSongs[songIndex], status: "rejected" }
    return { ...mockSongs[songIndex] }
  },
}

// API service for analytics
export const analyticsService = {
  getAnalyticsData: async (): Promise<AnalyticsData> => {
    await simulateDelay()
    return { ...mockAnalyticsData }
  },
}
