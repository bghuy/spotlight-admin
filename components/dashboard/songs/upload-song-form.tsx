"use client"

import { useState, useRef, type ChangeEvent, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Music, Upload, ImageIcon, Play } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { closeMusicPlayer, playSong, resetMusicPlayer } from "@/lib/store/music-player-slice"
import type { Song } from "@/lib/types"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store/store"

const GENRES = [
  "Pop",
  "Rock",
  "Hip-hop",
  "R&B",
  "Country",
  "Electronic",
  "Jazz",
  "Classical",
  "Folk",
  "Indie",
  "Metal",
  "Blues",
  "Reggae",
  "Punk",
  "K-pop",
  "Other",
]

export function UploadSongForm() {
  const dispatch = useAppDispatch()
  const { currentSong, isPlaying, isRepeat, showLyrics, isVisible } = useAppSelector((state: RootState) => state.musicPlayer)
  // Form data
  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [genre, setGenre] = useState("")
  const [lyrics, setLyrics] = useState("")

  // File uploads
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)

  // Refs
  const audioInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

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
    if (!audioUrl) {
      toast({
        title: "No audio file",
        description: "Please upload an audio file first.",
        variant: "destructive",
      })
      return
    }

    console.log("Review button clicked, audio URL:", audioUrl)

    // Create a temporary Song object for the music player
    const tempSong: Song = {
      id: "temp-" + Date.now(),
      title: title || (audioFile?.name || "Unknown Song"),
      artist: artist || "Unknown Artist",
      genre: genre || "Unknown Genre",
      duration: "0:00", // This will be determined by the audio player
      uploadDate: new Date().toISOString(),
      status: "pending",
      audioUrl: audioUrl,
      coverArt: coverUrl || "/placeholder.svg?height=80&width=80",
      lyrics: lyrics || "No lyrics available",
    }

    console.log("Dispatching playSong with:", tempSong)

    // Dispatch the playSong action to play the song in the music player
    dispatch(playSong(tempSong))

    // Thông báo để người dùng biết rằng hệ thống đang cố gắng phát nhạc
    toast({
      title: "Loading audio",
      description: "Đang tải bài hát để phát...",
    })
  }

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log(audioFile, "audioFile")
    console.log(coverFile, "coverFile")
    console.log(title, "title")
    console.log(artist, "artist")
    console.log(genre, "genre")
    console.log(lyrics, "lyrics")
    console.log(audioUrl, "audioUrl")
    console.log(coverUrl, "cover")
    console.log(audioInputRef.current, "audioInputRef")
    console.log(coverInputRef.current, "coverInputRef")


    if (!title || !artist || !genre || !audioFile) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and upload an audio file.",
        variant: "destructive",
      })
      return
    }

    // Here you would normally send the data to your API
    // For this example, we'll just show a success message

    toast({
      title: "Song submitted",
      description: "Your song has been submitted for review.",
    })

    // Reset form
    setTitle("")
    setArtist("")
    setGenre("")
    setLyrics("")

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
    const isReviewSong = currentSong?.id?.toString().startsWith("temp-") || false;
    if(isReviewSong){
      dispatch(resetMusicPlayer())
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
          <CardDescription>Fill in the details and upload your audio file.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Song Information */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Song Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter song title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="artist">Artist Name *</Label>
              <Input
                id="artist"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Enter artist name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre">Genre *</Label>
            <Select value={genre} onValueChange={setGenre} required>
              <SelectTrigger id="genre">
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                {GENRES.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

          {/* Lyrics */}
          <div className="space-y-2">
            <Label htmlFor="lyrics">Lyrics (Optional)</Label>
            <Textarea
              id="lyrics"
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder="Enter song lyrics"
              rows={6}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={cleanUpUrls}>
            Cancel
          </Button>
          <Button type="submit">
            <Upload className="h-4 w-4 mr-2" />
            Submit Song
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
