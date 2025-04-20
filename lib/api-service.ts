import axiosInstance from "@/constants/axios-instance"
import type {
  ArtistRequest,
  Song,
  User,
  AnalyticsData,
  Album,
  Artist,
  UserStats,
  SongStats,
  PaginatedResponse,
  CreateAlbumRequest,
  UpdateAlbumRequest,
  CreatedFile,
  CreateSongRequest,
} from "@/lib/types"

// Simulate API delay
const simulateDelay = (min = 300, max = 1200) => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise((resolve) => setTimeout(resolve, delay))
}

// Mock data for users - Thêm trường createdAt
const mockUsers: (User & { createdAt: string })[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    role: "admin",
    status: "active",
    lastActive: "2023-04-01",
    createdAt: "2023-01-15",
  },
  {
    id: "2",
    name: "Trần Thị B",
    email: "tranthib@example.com",
    role: "artist",
    status: "active",
    lastActive: "2023-04-02",
    createdAt: "2023-02-10",
  },
  {
    id: "3",
    name: "Lê Văn C",
    email: "levanc@example.com",
    role: "user",
    status: "active",
    lastActive: "2023-04-03",
    createdAt: "2023-03-05",
  },
  {
    id: "4",
    name: "Phạm Thị D",
    email: "phamthid@example.com",
    role: "user",
    status: "inactive",
    lastActive: "2023-03-15",
    createdAt: "2023-03-20",
  },
  {
    id: "5",
    name: "Hoàng Văn E",
    email: "hoangvane@example.com",
    role: "artist",
    status: "active",
    lastActive: "2023-04-04",
    createdAt: "2023-04-01",
  },
  {
    id: "6",
    name: "Ngô Thị F",
    email: "ngothif@example.com",
    role: "user",
    status: "active",
    lastActive: "2023-04-05",
    createdAt: "2023-04-15",
  },
  {
    id: "7",
    name: "Đỗ Văn G",
    email: "dovang@example.com",
    role: "user",
    status: "active",
    lastActive: "2023-05-01",
    createdAt: "2023-05-05",
  },
  {
    id: "8",
    name: "Vũ Thị H",
    email: "vuthih@example.com",
    role: "user",
    status: "active",
    lastActive: "2023-05-10",
    createdAt: "2023-05-20",
  },
  {
    id: "9",
    name: "Bùi Văn I",
    email: "buivani@example.com",
    role: "artist",
    status: "active",
    lastActive: "2023-06-01",
    createdAt: "2023-06-10",
  },
  {
    id: "10",
    name: "Dương Thị K",
    email: "duongthik@example.com",
    role: "user",
    status: "active",
    lastActive: "2023-06-15",
    createdAt: "2023-06-25",
  },
  {
    id: "11",
    name: "Lý Văn L",
    email: "lyvanl@example.com",
    role: "user",
    status: "active",
    lastActive: "2023-07-01",
    createdAt: "2023-07-05",
  },
  {
    id: "12",
    name: "Trịnh Thị M",
    email: "trinhthim@example.com",
    role: "user",
    status: "active",
    lastActive: "2023-07-10",
    createdAt: "2023-07-20",
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

// Mock data for artists - Thêm trường createdAt
const mockArtists: (Artist & { createdAt: string })[] = [
  {
    id: "1",
    name: "Sơn Tùng M-TP",
    image: "/placeholder.svg?height=200&width=200",
    genre: "Pop",
    bio: "Vietnamese singer, songwriter, and actor",
    albumCount: 3,
    songCount: 15,
    createdAt: "2023-01-10",
  },
  {
    id: "2",
    name: "Đen Vâu",
    image: "/placeholder.svg?height=200&width=200",
    genre: "Hip-hop",
    bio: "Vietnamese rapper and songwriter",
    albumCount: 2,
    songCount: 12,
    createdAt: "2023-02-15",
  },
  {
    id: "3",
    name: "Hoàng Thùy Linh",
    image: "/placeholder.svg?height=200&width=200",
    genre: "Pop",
    bio: "Vietnamese singer and actress",
    albumCount: 4,
    songCount: 20,
    createdAt: "2023-03-20",
  },
  {
    id: "4",
    name: "Bích Phương",
    image: "/placeholder.svg?height=200&width=200",
    genre: "Pop",
    bio: "Vietnamese singer",
    albumCount: 3,
    songCount: 18,
    createdAt: "2023-04-25",
  },
  {
    id: "5",
    name: "Vũ Cát Tường",
    image: "/placeholder.svg?height=200&width=200",
    genre: "Pop",
    bio: "Vietnamese singer-songwriter",
    albumCount: 2,
    songCount: 10,
    createdAt: "2023-05-30",
  },
  {
    id: "6",
    name: "Mỹ Tâm",
    image: "/placeholder.svg?height=200&width=200",
    genre: "Pop",
    bio: "Vietnamese singer and actress",
    albumCount: 5,
    songCount: 25,
    createdAt: "2023-06-15",
  },
  {
    id: "7",
    name: "Trúc Nhân",
    image: "/placeholder.svg?height=200&width=200",
    genre: "Pop",
    bio: "Vietnamese singer",
    albumCount: 2,
    songCount: 12,
    createdAt: "2023-07-20",
  },
]

// Updated mock data for albums to match the new API response format
const mockAlbums: Album[] = [
  {
    id: "1",
    title: "Chúng Ta Của Hiện Tại",
    title_version: "Original",
    description: "Album mới nhất của Sơn Tùng M-TP",
    type: "album",
    color: "#3b82f6",
    image: {
      id: "cover-1",
      name: "chung-ta-cua-hien-tai.jpg",
      url: "/placeholder.svg?height=200&width=200",
    },
    artists: [
      {
        id: "1",
        name: "Sơn Tùng M-TP",
        title: "Ca sĩ",
      },
    ],
    categories: [
      {
        id: "pop",
        name: "Pop",
        items: [
          {
            id: "song-1",
            name: "Chúng Ta Của Hiện Tại",
            title: "Chúng Ta Của Hiện Tại",
            type: "song",
            image: {
              id: "song-cover-1",
              name: "chung-ta-cua-hien-tai-song.jpg",
              url: "/placeholder.svg?height=80&width=80",
            },
            song: {
              id: "song-file-1",
              name: "chung-ta-cua-hien-tai.mp3",
              url: "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg",
            },
          },
        ],
      },
    ],
    in_library: true,
    is_owned: true,
    is_public: true,
    // Keep for backward compatibility
    alias: "chung-ta-cua-hien-tai",
    coverArt: "/placeholder.svg?height=200&width=200",
    artistId: "1",
    artistName: "Sơn Tùng M-TP",
    releaseDate: "2021-07-05",
    songCount: 5,
  },
  {
    id: "2",
    title: "Trạm Dừng Chân",
    title_version: "Original",
    description: "Album của Đen Vâu",
    type: "album",
    color: "#4f46e5",
    image: {
      id: "cover-2",
      name: "tram-dung-chan.jpg",
      url: "/placeholder.svg?height=200&width=200",
    },
    artists: [
      {
        id: "2",
        name: "Đen Vâu",
        title: "Rapper",
      },
    ],
    categories: [
      {
        id: "hiphop",
        name: "Hip Hop",
        items: [
          {
            id: "song-2",
            name: "Trạm Dừng Chân",
            title: "Trạm Dừng Chân",
            type: "song",
            image: {
              id: "song-cover-2",
              name: "tram-dung-chan-song.jpg",
              url: "/placeholder.svg?height=80&width=80",
            },
            song: {
              id: "song-file-2",
              name: "tram-dung-chan.mp3",
              url: "https://actions.google.com/sounds/v1/alarms/assorted_computer_sounds.ogg",
            },
          },
        ],
      },
    ],
    in_library: true,
    is_owned: true,
    is_public: true,
    // Keep for backward compatibility
    alias: "tram-dung-chan",
    coverArt: "/placeholder.svg?height=200&width=200",
    artistId: "2",
    artistName: "Đen Vâu",
    releaseDate: "2022-01-15",
    songCount: 6,
  },
  {
    id: "3",
    title: "Hoàng",
    title_version: "Deluxe Edition",
    description: "Album của Hoàng Thùy Linh",
    type: "album",
    color: "#ec4899",
    image: {
      id: "cover-3",
      name: "hoang.jpg",
      url: "/placeholder.svg?height=200&width=200",
    },
    artists: [
      {
        id: "3",
        name: "Hoàng Thùy Linh",
        title: "Ca sĩ",
      },
    ],
    categories: [
      {
        id: "pop",
        name: "Pop",
        items: [
          {
            id: "song-3",
            name: "Hoàng",
            title: "Hoàng",
            type: "song",
            image: {
              id: "song-cover-3",
              name: "hoang-song.jpg",
              url: "/placeholder.svg?height=80&width=80",
            },
            song: {
              id: "song-file-3",
              name: "hoang.mp3",
              url: "https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg",
            },
          },
        ],
      },
    ],
    in_library: true,
    is_owned: true,
    is_public: true,
    // Keep for backward compatibility
    alias: "hoang",
    coverArt: "/placeholder.svg?height=200&width=200",
    artistId: "3",
    artistName: "Hoàng Thùy Linh",
    releaseDate: "2019-10-20",
    songCount: 8,
  },
  {
    id: "4",
    title: "Hiếm Có Khó Tìm",
    title_version: "Original",
    description: "Album của Bích Phương",
    type: "album",
    color: "#f97316",
    image: {
      id: "cover-4",
      name: "hiem-co-kho-tim.jpg",
      url: "/placeholder.svg?height=200&width=200",
    },
    artists: [
      {
        id: "4",
        name: "Bích Phương",
        title: "Ca sĩ",
      },
    ],
    categories: [
      {
        id: "pop",
        name: "Pop",
        items: [
          {
            id: "song-4",
            name: "Hiếm Có Khó Tìm",
            title: "Hiếm Có Khó Tìm",
            type: "song",
            image: {
              id: "song-cover-4",
              name: "hiem-co-kho-tim-song.jpg",
              url: "/placeholder.svg?height=80&width=80",
            },
            song: {
              id: "song-file-4",
              name: "hiem-co-kho-tim.mp3",
              url: "https://actions.google.com/sounds/v1/alarms/dosimeter_alarm.ogg",
            },
          },
        ],
      },
    ],
    in_library: true,
    is_owned: true,
    is_public: true,
    // Keep for backward compatibility
    alias: "hiem-co-kho-tim",
    coverArt: "/placeholder.svg?height=200&width=200",
    artistId: "4",
    artistName: "Bích Phương",
    releaseDate: "2020-05-10",
    songCount: 7,
  },
  {
    id: "5",
    title: "Vũ Trụ Trong Mắt Em",
    title_version: "Original",
    description: "Album của Vũ Cát Tường",
    type: "album",
    color: "#10b981",
    image: {
      id: "cover-5",
      name: "vu-tru-trong-mat-em.jpg",
      url: "/placeholder.svg?height=200&width=200",
    },
    artists: [
      {
        id: "5",
        name: "Vũ Cát Tường",
        title: "Ca sĩ",
      },
    ],
    categories: [
      {
        id: "pop",
        name: "Pop",
        items: [
          {
            id: "song-5",
            name: "Vũ Trụ Trong Mắt Em",
            title: "Vũ Trụ Trong Mắt Em",
            type: "song",
            image: {
              id: "song-cover-5",
              name: "vu-tru-trong-mat-em-song.jpg",
              url: "/placeholder.svg?height=80&width=80",
            },
            song: {
              id: "song-file-5",
              name: "vu-tru-trong-mat-em.mp3",
              url: "https://actions.google.com/sounds/v1/alarms/beep_short.ogg",
            },
          },
        ],
      },
    ],
    in_library: true,
    is_owned: true,
    is_public: true,
    // Keep for backward compatibility
    alias: "vu-tru-trong-mat-em",
    coverArt: "/placeholder.svg?height=200&width=200",
    artistId: "5",
    artistName: "Vũ Cát Tường",
    releaseDate: "2019-08-30",
    songCount: 5,
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
    uploadDate: "2023-01-15",
    status: "approved",
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
    albumId: "1",
    artistId: "1",
  },
  {
    id: "2",
    title: "City Lights",
    artist: "Trần Thị B",
    genre: "Rock",
    duration: "4:12",
    uploadDate: "2023-02-20",
    status: "approved",
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
    albumId: "2",
    artistId: "2",
  },
  {
    id: "3",
    title: "Midnight Dreams",
    artist: "Lê Văn C",
    genre: "Hip-hop",
    duration: "3:28",
    uploadDate: "2023-03-10",
    status: "approved",
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
    albumId: "3",
    artistId: "3",
  },
  {
    id: "4",
    title: "Ocean Waves",
    artist: "Phạm Thị D",
    genre: "Ambient",
    duration: "5:16",
    uploadDate: "2023-04-05",
    status: "approved",
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
    albumId: "4",
    artistId: "4",
  },
  {
    id: "5",
    title: "Mountain High",
    artist: "Hoàng Văn E",
    genre: "Folk",
    duration: "4:30",
    uploadDate: "2023-05-12",
    status: "approved",
    audioUrl: "https://actions.google.com/sounds/v1/alarms/beep_short.ogg",
    coverArt: "/placeholder.svg?height=80&width=80",
    lyrics: `Mountain high, reaching for the sky
Freedom calls, standing tall
Nature's gift, spirits lift
Finding peace, worries cease`,
    albumId: "5",
    artistId: "5",
  },
  {
    id: "6",
    title: "Urban Jungle",
    artist: "Ngô Thị F",
    genre: "Electronic",
    duration: "3:55",
    uploadDate: "2023-06-18",
    status: "approved",
    audioUrl: "https://actions.google.com/sounds/v1/alarms/beep_short_pleasant.ogg",
    coverArt: "/placeholder.svg?height=80&width=80",
    lyrics: `Urban jungle, concrete and steel
City rhythm, how does it feel
Neon lights, sleepless nights
Finding my way through the haze`,
    albumId: "1",
    artistId: "6",
  },
  {
    id: "7",
    title: "Desert Wind",
    artist: "Đỗ Văn G",
    genre: "World",
    duration: "4:45",
    uploadDate: "2023-07-22",
    status: "approved",
    audioUrl: "https://actions.google.com/sounds/v1/alarms/bugle_tune.ogg",
    coverArt: "/placeholder.svg?height=80&width=80",
    lyrics: `Desert wind, sand in motion
Endless dunes, like an ocean
Ancient tales, whispered by the breeze
Finding strength in the mysteries`,
    albumId: "2",
    artistId: "7",
  },
  {
    id: "8",
    title: "Rainy Day",
    artist: "Vũ Thị H",
    genre: "Jazz",
    duration: "5:10",
    uploadDate: "2023-07-30",
    status: "pending",
    audioUrl: "https://actions.google.com/sounds/v1/alarms/carbon_monoxide_detector.ogg",
    coverArt: "/placeholder.svg?height=80&width=80",
    lyrics: `Rainy day, drops on my window
Cozy inside, watching the show
Jazz playing soft, coffee in hand
Perfect moment, unplanned`,
    albumId: "3",
    artistId: "1",
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

  // Thêm phương thức để lấy tổng số người dùng
  getTotalUsers: async (): Promise<number> => {
    await simulateDelay(200, 500)
    return mockUsers.length
  },

  // Thêm phương thức để lấy người dùng theo tháng
  getUsersByMonth: async (startDate: Date, endDate: Date): Promise<UserStats[]> => {
    await simulateDelay(500, 1000)

    // Tạo map để lưu trữ số lượng người dùng theo tháng
    const usersByMonth = new Map<string, { users: number }>()

    // Tạo danh sách các tháng trong khoảng thời gian
    const months: string[] = []
    const currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
    const endMonthDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0)

    while (currentDate <= endMonthDate) {
      const month = currentDate.getMonth()
      const year = currentDate.getFullYear()
      const monthName = new Date(year, month, 1).toLocaleString("default", { month: "short" })
      const monthKey = `${monthName} ${year}`

      months.push(monthKey)
      usersByMonth.set(monthKey, { users: 0 })

      currentDate.setMonth(currentDate.getMonth() + 1)
    }

    // Đếm số lượng người dùng theo tháng
    for (const user of mockUsers) {
      const createdAt = new Date(user.createdAt)

      if (createdAt >= startDate && createdAt <= endDate) {
        const month = createdAt.getMonth()
        const year = createdAt.getFullYear()
        const monthName = new Date(year, month, 1).toLocaleString("default", { month: "short" })
        const monthKey = `${monthName} ${year}`

        if (usersByMonth.has(monthKey)) {
          const monthData = usersByMonth.get(monthKey)!
          monthData.users += 1
        }
      }
    }

    // Chuyển đổi map thành mảng kết quả
    const result: UserStats[] = months.map((month) => ({
      month,
      users: usersByMonth.get(month)?.users || 0,
    }))

    console.log("Generated user stats from real data:", result)
    return result
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
  createSong: async (songData: CreateSongRequest): Promise<Song> => {
    const res = await axiosInstance.post("api/v1/songs/admin", songData)
    return res.data;
  },

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

  // Thêm phương thức để lấy tổng số bài hát
  getTotalSongs: async (): Promise<number> => {
    await simulateDelay(200, 500)
    return mockSongs.length
  },

  // Thêm phương thức để lấy bài hát theo tháng
  getSongsByMonth: async (startDate: Date, endDate: Date): Promise<SongStats[]> => {
    await simulateDelay(500, 1000)

    // Tạo map để lưu trữ số lượng bài hát theo tháng
    const songsByMonth = new Map<string, { totalSongs: number; likes: number; dislikes: number }>()

    // Tạo danh sách các tháng trong khoảng thời gian
    const months: string[] = []
    const currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
    const endMonthDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0)

    while (currentDate <= endMonthDate) {
      const month = currentDate.getMonth()
      const year = currentDate.getFullYear()
      const monthName = new Date(year, month, 1).toLocaleString("default", { month: "short" })
      const monthKey = `${monthName} ${year}`

      months.push(monthKey)
      songsByMonth.set(monthKey, { totalSongs: 0, likes: 0, dislikes: 0 })

      currentDate.setMonth(currentDate.getMonth() + 1)
    }

    // Đếm số lượng bài hát theo tháng
    for (const song of mockSongs) {
      const uploadDate = new Date(song.uploadDate)

      if (uploadDate >= startDate && uploadDate <= endDate) {
        const month = uploadDate.getMonth()
        const year = uploadDate.getFullYear()
        const monthName = new Date(year, month, 1).toLocaleString("default", { month: "short" })
        const monthKey = `${monthName} ${year}`

        if (songsByMonth.has(monthKey)) {
          const monthData = songsByMonth.get(monthKey)!
          monthData.totalSongs += 1

          // Giả định số lượt like và dislike
          monthData.likes += Math.floor(Math.random() * 100) + 20
          monthData.dislikes += Math.floor(Math.random() * 20) + 5
        }
      }
    }

    // Chuyển đổi map thành mảng kết quả
    const result: SongStats[] = months.map((month) => ({
      month,
      totalSongs: songsByMonth.get(month)?.totalSongs || 0,
      likes: songsByMonth.get(month)?.likes || 0,
      dislikes: songsByMonth.get(month)?.dislikes || 0,
    }))

    console.log("Generated song stats from real data:", result)
    return result
  },
}

// API service for analytics
export const analyticsService = {
  // API lấy tổng quan từ dữ liệu thực tế
  getAnalyticsSummary: async (): Promise<{
    totalUsers: number
    totalSongs: number
    totalArtists: number
  }> => {
    // Sử dụng Promise.all để gọi nhiều API cùng lúc
    const [totalUsers, totalSongs, totalArtists] = await Promise.all([
      userService.getTotalUsers(),
      songService.getTotalSongs(),
      artistService.getTotalArtists(),
    ])

    return {
      totalUsers: 17,
      totalSongs: 20,
      totalArtists: 15,
    }
  },

  // API lấy thống kê user theo khoảng thời gian từ dữ liệu thực tế
  getUserStats: async (startDate: Date, endDate: Date): Promise<UserStats[]> => {
    return userService.getUsersByMonth(startDate, endDate)
  },

  // API lấy thống kê song theo khoảng thời gian từ dữ liệu thực tế
  getSongStats: async (startDate: Date, endDate: Date): Promise<SongStats[]> => {
    return songService.getSongsByMonth(startDate, endDate)
  },

  // Giữ lại API cũ để tương thích
  getAnalyticsData: async (): Promise<AnalyticsData> => {
    await simulateDelay()
    return { ...mockAnalyticsData }
  },
}

// Updated API service for albums to match the new API response format
export const albumService = {
  getAlbums: async (): Promise<PaginatedResponse<Album>> => {
    const res = await axiosInstance.get("api/v1/albums/admin")
    return res.data;
    // await simulateDelay()
    // return {
    //   items: [...mockAlbums],
    //   meta: {
    //     count: mockAlbums.length,
    //     current_page: 1,
    //     per_page: 10,
    //     total: mockAlbums.length,
    //     total_pages: 1,
    //   },
    // }
  },

  getAlbumById: async (id: string): Promise<Album | undefined> => {
    await simulateDelay()
    return mockAlbums.find((album) => album.id === id)
  },

  // Update the searchAlbums method to return an array of albums
  searchAlbums: async (query: string): Promise<Album[]> => {
    await simulateDelay()
    if (!query) {
      // Return just the items array from the full response
      const response = await albumService.getAlbums()
      return response.items
    }

    const lowerQuery = query.toLowerCase()
    const results = mockAlbums.filter(
      (album) =>
        album.title.toLowerCase().includes(lowerQuery) ||
        (album.creator?.name && album.creator.name.toLowerCase().includes(lowerQuery)),
    )

    console.log(`Searching albums with query "${query}":`, results)
    return results
  },

  // Updated createAlbum method to match the new API request format
  createAlbum: async (albumData: CreateAlbumRequest): Promise<Album> => {
    const res = await axiosInstance.post("api/v1/albums/admin", albumData)
    return res.data;
  },

  // Update the updateAlbum method to match the new API response format
  updateAlbum: async (id: string, albumData: UpdateAlbumRequest): Promise<Album> => {
    await simulateDelay()
    const albumIndex = mockAlbums.findIndex((album) => album.id === id)
    if (albumIndex === -1) throw new Error("Album not found")

    const currentAlbum = mockAlbums[albumIndex]

    const updatedAlbum: Album = {
      ...currentAlbum,
      title: albumData.title || currentAlbum.title,
      title_version: albumData.title_version || currentAlbum.title_version,
      description: albumData.description || currentAlbum.description,
      type: albumData.type || currentAlbum.type,
      color: albumData.color || currentAlbum.color,
      image: albumData.image_id
        ? {
            id: albumData.image_id,
            name: `album-image-${Date.now()}.jpg`,
            url: "/placeholder.svg?height=200&width=200",
          }
        : currentAlbum.image,
      artists: albumData.artist_ids
        ? albumData.artist_ids.map((id) => {
            const artist = mockArtists.find((a) => a.id === id)
            return {
              id,
              name: artist?.name || "Unknown Artist",
              title: "Artist",
            }
          })
        : currentAlbum.artists,
      is_public: albumData.is_public !== undefined ? albumData.is_public : currentAlbum.is_public,

      // For backward compatibility
      alias: albumData.alias || currentAlbum.alias,
      coverArt: "/placeholder.svg?height=200&width=200",
    }

    mockAlbums[albumIndex] = updatedAlbum
    return updatedAlbum
  },

  // Added deleteAlbum method
  deleteAlbum: async (id: string): Promise<void> => {
    await simulateDelay()
    const albumIndex = mockAlbums.findIndex((album) => album.id === id)
    if (albumIndex === -1) throw new Error("Album not found")

    mockAlbums.splice(albumIndex, 1)
  },
}

// API service for artists
export const artistService = {
  getArtists: async (): Promise<PaginatedResponse<Artist>> => {
    const res = await axiosInstance.get("api/v1/artists")
    console.log("res ar", res)
    return res.data
    // await simulateDelay()
    // return [...mockArtists]
  },

  getArtistById: async (id: string): Promise<Artist | undefined> => {
    await simulateDelay()
    return mockArtists.find((artist) => artist.id === id)
  },

  searchArtists: async (query: string): Promise<Artist[]> => {
    await simulateDelay()
    if (!query) return [...mockArtists]

    const lowerQuery = query.toLowerCase()
    return mockArtists.filter(
      (artist) =>
        artist.name.toLowerCase().includes(lowerQuery) ||
        (artist.genre && artist.genre.toLowerCase().includes(lowerQuery)),
    )
  },

  createArtist: async (artist: Omit<Artist, "id">): Promise<Artist> => {
    const res = await axiosInstance.post("api/v1/artists", artist)
    return res.data;
  },

  // Thêm phương thức để lấy tổng số nghệ sĩ
  getTotalArtists: async (): Promise<number> => {
    await simulateDelay(200, 500)
    return mockArtists.length
  },
}





export const uploadService = {
  uploadFile: async (file: File | null): Promise<CreatedFile> => {
    if (!file) {
      throw new Error("File is required");
    }

    console.log("Uploading file:", file);

    const formData = new FormData();
    formData.append("file", file); // key "file" phải trùng với tên mà backend mong đợi

    const response = await axiosInstance.post("/media/api/v1/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }
}
