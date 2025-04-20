"use client"

import { useState, useRef, useEffect, type ChangeEvent, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Music, Upload, ImageIcon, Play, Search, X } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { playSong } from "@/lib/store/music-player-slice"
import { fetchAlbums } from "@/lib/store/albums-slice"
import type { Song, Album, Artist } from "@/lib/types"
import { artistClient } from "@/lib/api-client"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Thêm hook useDebounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

export function UploadSongForm() {
  const dispatch = useAppDispatch()

  // Selected items
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)

  // Search states
  const [albumSearchQuery, setAlbumSearchQuery] = useState("")
  const [artistSearchQuery, setArtistSearchQuery] = useState("")
  const [albumResults, setAlbumResults] = useState<Album[]>([])
  const [artistResults, setArtistResults] = useState<Artist[]>([])

  // Get albums from Redux store
  const { items: storeAlbums, loading: albumsLoading } = useAppSelector((state) => state.albums)

  // Debounce search queries
  const [isSearchingAlbums, setIsSearchingAlbums] = useState(false)
  const [isSearchingArtists, setIsSearchingArtists] = useState(false)
  const debouncedAlbumQuery = useDebounce(albumSearchQuery, 300)
  const debouncedArtistQuery = useDebounce(artistSearchQuery, 300)

  // Popover states
  const [albumPopoverOpen, setAlbumPopoverOpen] = useState(false)
  const [artistPopoverOpen, setArtistPopoverOpen] = useState(false)

  // File uploads
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)

  // Loading state
  const [isLoading, setIsLoading] = useState(false)

  // Refs
  const audioInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  // Fetch albums and artists on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Dispatch action to fetch albums from Redux store
        dispatch(fetchAlbums())

        // Still fetch artists from API for now
        const artists = await artistClient.getArtists()
        setArtistResults(artists)
      } catch (error) {
        console.error("Error fetching initial data:", error)
      }
    }

    fetchInitialData()
  }, [dispatch])

  // Set initial album results from store when they load
  useEffect(() => {
    if (storeAlbums.length > 0 && albumResults.length === 0) {
      setAlbumResults(storeAlbums)
    }
  }, [storeAlbums, albumResults.length])

  // Update the album search effect to filter from store instead of API
  useEffect(() => {
    if (!debouncedAlbumQuery) {
      // If query is empty, use all albums from store
      setAlbumResults(storeAlbums)
      return
    }

    setIsSearchingAlbums(true)
    try {
      // Filter albums from store based on search query
      const lowerQuery = debouncedAlbumQuery.toLowerCase()
      const filteredAlbums = storeAlbums.filter(
        (album) =>
          album.title.toLowerCase().includes(lowerQuery) ||
          (album.artists?.[0]?.name || album.artistName || "").toLowerCase().includes(lowerQuery),
      )

      setAlbumResults(filteredAlbums)
    } catch (error) {
      console.error("Error filtering albums:", error)
    } finally {
      setIsSearchingAlbums(false)
    }
  }, [debouncedAlbumQuery, storeAlbums])

  // Search artists with debounce
  useEffect(() => {
    const searchArtists = async () => {
      if (!debouncedArtistQuery) {
        // Nếu query rỗng, lấy tất cả artist
        try {
          const allArtists = await artistClient.getArtists()
          setArtistResults(allArtists)
        } catch (error) {
          console.error("Error fetching all artists:", error)
        }
        return
      }

      setIsSearchingArtists(true)
      try {
        const results = await artistClient.searchArtists(debouncedArtistQuery)
        console.log("Artist search results:", results)
        setArtistResults(results)
      } catch (error) {
        console.error("Error searching artists:", error)
      } finally {
        setIsSearchingArtists(false)
      }
    }

    searchArtists()
  }, [debouncedArtistQuery])

  // Handle audio file upload
  const handleAudioUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("audio/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an audio file.",
        variant: "destructive",
      })
      return
    }

    // Create object URL for the audio file
    const url = URL.createObjectURL(file)

    // Clean up previous URL if exists
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }

    setAudioFile(file)
    setAudioUrl(url)

    toast({
      title: "Audio uploaded",
      description: `${file.name} has been uploaded.`,
    })
  }

  // Handle cover image upload
  const handleCoverUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      })
      return
    }

    // Create object URL for the image file
    const url = URL.createObjectURL(file)

    // Clean up previous URL if exists
    if (coverUrl) {
      URL.revokeObjectURL(coverUrl)
    }

    setCoverFile(file)
    setCoverUrl(url)

    toast({
      title: "Cover image uploaded",
      description: `${file.name} has been uploaded.`,
    })
  }

  // Handle review - play the song using the music player component
  const handleReview = () => {
    if (!audioFile || !audioUrl) {
      toast({
        title: "No audio file",
        description: "Please upload an audio file first.",
        variant: "destructive",
      })
      return
    }

    // Get the file name without extension to use as title
    const fileName = audioFile.name.replace(/\.[^/.]+$/, "")

    // Create a temporary Song object for the music player
    const tempSong: Song = {
      id: "temp-" + Date.now(),
      title: fileName,
      artist: selectedArtist?.name || "Unknown Artist",
      genre: "Unknown",
      duration: "0:00", // This will be determined by the audio player
      uploadDate: new Date().toISOString(),
      status: "pending",
      audioUrl: audioUrl,
      coverArt:
        coverUrl || selectedAlbum?.image?.url || selectedAlbum?.coverArt || "/placeholder.svg?height=80&width=80",
      albumId: selectedAlbum?.id,
      artistId: selectedArtist?.id,
    }

    // Dispatch the playSong action to play the song in the music player
    dispatch(playSong(tempSong))

    toast({
      title: "Loading audio",
      description: "Đang tải bài hát để phát...",
    })
  }

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!audioFile || !selectedArtist) {
      toast({
        title: "Missing information",
        description: "Please upload an audio file and select an artist.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Here you would normally send the data to your API
      // For this example, we'll just show a success message

      toast({
        title: "Song submitted",
        description: "Your song has been submitted for review.",
      })

      // Reset form
      setSelectedAlbum(null)
      setSelectedArtist(null)

      // Clean up URLs
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
        setAudioUrl(null)
        setAudioFile(null)
      }

      if (coverUrl) {
        URL.revokeObjectURL(coverUrl)
        setCoverUrl(null)
        setCoverFile(null)
      }

      // Reset file inputs
      if (audioInputRef.current) audioInputRef.current.value = ""
      if (coverInputRef.current) coverInputRef.current.value = ""
    } catch (error) {
      console.error("Error submitting song:", error)
      toast({
        title: "Error",
        description: "Failed to submit song. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Clean up URLs when component unmounts
  const cleanUpUrls = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    if (coverUrl) URL.revokeObjectURL(coverUrl)
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Upload New Song</CardTitle>
          <CardDescription>Select an album and artist, then upload your audio file.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Album Selection */}
          <div className="space-y-2">
            <Label htmlFor="album">Album</Label>
            <div className="flex items-center gap-2">
              <Popover open={albumPopoverOpen} onOpenChange={setAlbumPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={albumPopoverOpen}
                    className="w-full justify-between"
                  >
                    {selectedAlbum ? selectedAlbum.title : "Select album..."}
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search albums..."
                      value={albumSearchQuery}
                      onValueChange={setAlbumSearchQuery}
                    />
                    <CommandList>
                      {isSearchingAlbums || albumsLoading ? (
                        <div className="py-6 text-center text-sm">
                          <svg
                            className="mx-auto h-5 w-5 animate-spin text-muted-foreground"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <p className="mt-2">{albumsLoading ? "Loading albums..." : "Searching albums..."}</p>
                        </div>
                      ) : (
                        <>
                          <CommandEmpty>No albums found.</CommandEmpty>
                          <CommandGroup>
                            {albumResults?.map((album) => (
                              <CommandItem
                                key={album.id}
                                value={album.title}
                                onSelect={() => {
                                  setSelectedAlbum(album)
                                  setAlbumPopoverOpen(false)
                                }}
                                className="flex items-center gap-2"
                              >
                                {(album.image?.url || album.coverArt) && (
                                  <img
                                    src={album.image?.url || album.coverArt || "/placeholder.svg"}
                                    alt={album.title}
                                    className="h-6 w-6 rounded object-cover"
                                  />
                                )}
                                <span>{album.title}</span>
                                {(album.artists?.[0]?.name || album.artistName) && (
                                  <span className="text-xs text-muted-foreground">
                                    by {album.artists?.[0]?.name || album.artistName}
                                  </span>
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {selectedAlbum && (
                <Button type="button" variant="ghost" size="icon" onClick={() => setSelectedAlbum(null)}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear album selection</span>
                </Button>
              )}
            </div>

            {selectedAlbum && (
              <div className="flex items-center gap-2 mt-2">
                {(selectedAlbum.image?.url || selectedAlbum.coverArt) && (
                  <img
                    src={selectedAlbum.image?.url || selectedAlbum.coverArt || "/placeholder.svg"}
                    alt={selectedAlbum.title}
                    className="h-10 w-10 rounded object-cover"
                  />
                )}
                <div>
                  <p className="text-sm font-medium">{selectedAlbum.title}</p>
                  {(selectedAlbum.artists?.[0]?.name || selectedAlbum.artistName) && (
                    <p className="text-xs text-muted-foreground">
                      by {selectedAlbum.artists?.[0]?.name || selectedAlbum.artistName}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Artist Selection */}
          <div className="space-y-2">
            <Label htmlFor="artist">Artist *</Label>
            <div className="flex items-center gap-2">
              <Popover open={artistPopoverOpen} onOpenChange={setArtistPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={artistPopoverOpen}
                    className="w-full justify-between"
                  >
                    {selectedArtist ? selectedArtist.name : "Select artist..."}
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search artists..."
                      value={artistSearchQuery}
                      onValueChange={setArtistSearchQuery}
                    />
                    <CommandList>
                      {isSearchingArtists ? (
                        <div className="py-6 text-center text-sm">
                          <svg
                            className="mx-auto h-5 w-5 animate-spin text-muted-foreground"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <p className="mt-2">Searching artists...</p>
                        </div>
                      ) : (
                        <>
                          <CommandEmpty>No artists found.</CommandEmpty>
                          <CommandGroup>
                            {artistResults.map((artist) => (
                              <CommandItem
                                key={artist.id}
                                value={artist.name}
                                onSelect={() => {
                                  setSelectedArtist(artist)
                                  setArtistPopoverOpen(false)
                                }}
                                className="flex items-center gap-2"
                              >
                                {artist.image && (
                                  <img
                                    src={artist.image || "/placeholder.svg"}
                                    alt={artist.name}
                                    className="h-6 w-6 rounded-full object-cover"
                                  />
                                )}
                                <span>{artist.name}</span>
                                {artist.genre && <span className="text-xs text-muted-foreground">{artist.genre}</span>}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {selectedArtist && (
                <Button type="button" variant="ghost" size="icon" onClick={() => setSelectedArtist(null)}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear artist selection</span>
                </Button>
              )}
            </div>

            {selectedArtist && (
              <div className="flex items-center gap-2 mt-2">
                {selectedArtist.image && (
                  <img
                    src={selectedArtist.image || "/placeholder.svg"}
                    alt={selectedArtist.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="text-sm font-medium">{selectedArtist.name}</p>
                  {selectedArtist.genre && <p className="text-xs text-muted-foreground">{selectedArtist.genre}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Audio Upload */}
          <div className="space-y-2">
            <Label htmlFor="audio">Audio File *</Label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div
                  className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors ${
                    audioFile ? "border-primary" : "border-border"
                  }`}
                  onClick={() => audioInputRef.current?.click()}
                >
                  <input
                    ref={audioInputRef}
                    type="file"
                    id="audio"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                    className="hidden"
                    required={!audioFile}
                  />
                  <Music className="h-10 w-10 text-muted-foreground mb-2" />
                  <div className="text-center">
                    {audioFile ? (
                      <div>
                        <p className="font-medium text-sm">{audioFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium">Click to upload audio</p>
                        <p className="text-xs text-muted-foreground">MP3, WAV, OGG, FLAC (max 20MB)</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {audioFile && (
                <Button type="button" variant="outline" onClick={handleReview}>
                  <Play className="h-4 w-4 mr-2" />
                  Review
                </Button>
              )}
            </div>
          </div>

          {/* Cover Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="cover">Cover Image (Optional)</Label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div
                  className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => coverInputRef.current?.click()}
                >
                  <input
                    ref={coverInputRef}
                    type="file"
                    id="cover"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                  <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                  <div className="text-center">
                    {coverFile ? (
                      <div>
                        <p className="font-medium text-sm">{coverFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(coverFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium">Click to upload cover image</p>
                        <p className="text-xs text-muted-foreground">JPG, PNG, GIF (max 5MB)</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {coverUrl && (
                <div className="h-32 w-32 rounded-md overflow-hidden border">
                  <img
                    src={coverUrl || "/placeholder.svg"}
                    alt="Cover preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={cleanUpUrls}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Uploading...
              </span>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Song
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
