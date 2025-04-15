"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Repeat, Music, Volume2, VolumeX, X, AlertCircle } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { setPlayState, togglePlay, toggleRepeat, toggleLyrics, closeMusicPlayer } from "@/lib/store/music-player-slice"
import { AudioManager } from "@/lib/audio-manager"
import { toast } from "@/hooks/use-toast"

export function MusicPlayer() {
  const dispatch = useAppDispatch()
  const { currentSong, isPlaying, isRepeat, showLyrics, isVisible } = useAppSelector((state) => state.musicPlayer)

  // Thay đổi phần khai báo state để quản lý trạng thái loading tốt hơn
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [audioError, setAudioError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Sử dụng ref để theo dõi trạng thái loading thực tế
  const audioLoadedRef = useRef(false)
  const seekingRef = useRef(false)
  const lastVisibleStateRef = useRef(isVisible)
  const playerClosedRef = useRef(false)
  const volumeChangeRef = useRef(false)

  // Get the singleton audio manager
  const audioManager = useRef(AudioManager.getInstance())

  // Theo dõi sự thay đổi của isVisible để xử lý khi đóng/mở player
  useEffect(() => {
    // Khi isVisible thay đổi từ true sang false (đóng player)
    if (lastVisibleStateRef.current && !isVisible) {
      console.log("Player closed, performing hard stop")
      playerClosedRef.current = true

      // Thực hiện hard stop để dừng hoàn toàn audio
      audioManager.current.hardStop()

      // Reset các trạng thái
      setIsLoading(false)
    }

    // Khi isVisible thay đổi từ false sang true (mở lại player)
    if (!lastVisibleStateRef.current && isVisible) {
      console.log("Player reopened")
      playerClosedRef.current = false

      // Reset trạng thái loading để chuẩn bị tải lại
      setIsLoading(false)
    }

    lastVisibleStateRef.current = isVisible
  }, [isVisible])

  // Set up event listeners for the audio manager
  useEffect(() => {
    const manager = audioManager.current

    // Set up event listeners
    const removeTimeUpdateListener = manager.onTimeUpdate((time, duration) => {
      if (!seekingRef.current) {
        setCurrentTime(time)
      }
    })

    // Thay đổi phần xử lý sự kiện loaded để đảm bảo reset trạng thái loading
    const removeLoadedListener = manager.onLoaded((duration) => {
      console.log("Audio loaded with duration:", duration)
      setDuration(duration)
      setAudioError(null) // Clear any previous errors when audio loads successfully
      setIsLoading(false)
      audioLoadedRef.current = true
    })

    const removeErrorListener = manager.onError((error) => {
      console.error("Audio error in component:", error)
      setAudioError(error)
      setIsLoading(false)
      toast({
        title: "Audio Error",
        description: "Could not play the audio file. Please try another song.",
        variant: "destructive",
      })
    })

    const removePlayStateChangeListener = manager.onPlayStateChange((isPlayingState) => {
      // Only update the Redux state if it's different from the current state
      if (isPlayingState !== isPlaying) {
        dispatch(setPlayState(isPlayingState))
      }
      // Always reset loading state when play state changes
      setIsLoading(false)
    })

    // Clean up event listeners
    return () => {
      removeTimeUpdateListener()
      removeLoadedListener()
      removeErrorListener()
      removePlayStateChangeListener()
    }
  }, [dispatch, isPlaying])

  // Handle song changes
  useEffect(() => {
    if (!currentSong || !currentSong.audioUrl || !isVisible) {
      return
    }

    const manager = audioManager.current
    let isMounted = true

    const loadAndPlay = async () => {
      try {
        // Reset error state when trying to load a new song
        setAudioError(null)
        setIsLoading(true)

        // Load the new song
        console.log("Loading song:", currentSong.title, "URL:", currentSong.audioUrl)
        await manager.loadSong(currentSong.audioUrl)

        if (!isMounted) return

        // Set volume
        manager.setVolume(volume)

        // Set repeat state
        manager.setRepeat(isRepeat)

        // Auto-play if needed
        if (isPlaying) {
          await manager.play().catch((err) => {
            console.error("Error auto-playing:", err)
            if (isMounted) {
              setIsLoading(false)
            }
          })
        } else {
          // If not playing, we should still reset loading state
          if (isMounted) {
            setIsLoading(false)
          }
        }
      } catch (error) {
        console.error("Error in loadAndPlay:", error)
        if (isMounted) {
          setAudioError("Failed to load audio file")
          setIsLoading(false)
        }
      }
    }

    // Nếu player vừa được mở lại sau khi đóng, luôn tải lại bài hát
    if (playerClosedRef.current) {
      playerClosedRef.current = false
      loadAndPlay()
    } else {
      loadAndPlay()
    }

    return () => {
      isMounted = false
    }
  }, [currentSong, isVisible, volume, isPlaying, isRepeat])

  // Handle play/pause changes
  useEffect(() => {
    if (!currentSong || !isVisible) return

    const manager = audioManager.current
    let isMounted = true

    // Thêm một timeout để tránh các lệnh play/pause quá gần nhau
    const timeoutId = setTimeout(async () => {
      try {
        if (isPlaying) {
          if (isMounted) setIsLoading(true)
          await manager.play().catch((err) => {
            console.error("Error playing in effect:", err)
            if (isMounted) setIsLoading(false)
          })
        } else {
          manager.pause()
          // Make sure loading is reset when pausing
          if (isMounted) setIsLoading(false)
        }
      } catch (error) {
        console.error("Error in play/pause effect:", error)
        if (isMounted) setIsLoading(false)
      }
    }, 300)

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
  }, [isPlaying, currentSong, isVisible])

  // Handle repeat setting
  useEffect(() => {
    if (currentSong && isVisible) {
      audioManager.current.setRepeat(isRepeat)
    }
  }, [isRepeat, currentSong, isVisible])

  // Handle volume changes
  useEffect(() => {
    if (currentSong && isVisible) {
      audioManager.current.setVolume(volume)
    }
  }, [volume, currentSong, isVisible])

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const handleSeekChange = useCallback((value: number[]) => {
    seekingRef.current = true
    setCurrentTime(value[0])
  }, [])

  const handleSeekCommit = useCallback((value: number[]) => {
    audioManager.current.setCurrentTime(value[0])
    setTimeout(() => {
      seekingRef.current = false
    }, 100)
  }, [])

  // Cập nhật hàm xử lý volume để không ảnh hưởng đến trạng thái loading
  const handleVolumeChange = useCallback((value: number[]) => {
    // Đánh dấu đang thay đổi âm lượng để tránh xung đột với các trạng thái khác
    volumeChangeRef.current = true

    const newVolume = value[0]
    setVolume(newVolume)
    setIsMuted(newVolume === 0)

    try {
      audioManager.current.setVolume(newVolume)
    } catch (error) {
      console.error("Error setting volume:", error)
    }

    // Reset trạng thái sau khi thay đổi
    setTimeout(() => {
      volumeChangeRef.current = false
    }, 100)
  }, [])

  // Cập nhật hàm xử lý volume để không ảnh hưởng đến trạng thái loading
  const toggleMute = useCallback(() => {
    const newVolume = isMuted ? 0.7 : 0
    setVolume(newVolume)
    setIsMuted(!isMuted)
    audioManager.current.setVolume(newVolume)
  }, [isMuted])

  // Cập nhật hàm handleTogglePlay để xử lý tốt hơn trạng thái loading
  const handleTogglePlay = useCallback(() => {
    if (audioError) {
      // If there's an error, try reloading the song
      if (currentSong && currentSong.audioUrl) {
        setAudioError(null)
        setIsLoading(true)
        audioManager.current
          .loadSong(currentSong.audioUrl)
          .then(() => {
            audioManager.current.play().catch(() => {})
            dispatch(setPlayState(true))
          })
          .catch(() => {
            setIsLoading(false)
          })
      }
    } else {
      // Normal toggle play behavior
      dispatch(togglePlay())
    }
  }, [dispatch, audioError, currentSong])

  const handleToggleRepeat = useCallback(() => {
    dispatch(toggleRepeat())
  }, [dispatch])

  const handleToggleLyrics = useCallback(() => {
    dispatch(toggleLyrics())
  }, [dispatch])

  const handleCloseMusicPlayer = useCallback(() => {
    // Đánh dấu player đang được đóng
    playerClosedRef.current = true

    // Thực hiện hard stop để dừng hoàn toàn audio
    audioManager.current.hardStop()

    // Reset các trạng thái
    setIsLoading(false)

    // Đóng player trong Redux
    dispatch(closeMusicPlayer())
  }, [dispatch])

  // Don't render anything if no song or player is hidden
  if (!currentSong || !isVisible) {
    return null
  }

  // Cập nhật phần xác định trạng thái disabled cho các controls
  const controlsDisabled = !!audioError
  const playButtonDisabled = isLoading && !audioLoadedRef.current

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
      <Card className="rounded-none border-0">
        <CardContent className="p-4">
          {audioError && (
            <div className="mb-2 p-2 bg-destructive/10 text-destructive text-sm rounded flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span>
                {audioError}
                {currentSong.audioUrl && (
                  <span className="ml-1">
                    URL: <code className="text-xs bg-muted p-1 rounded">{currentSong.audioUrl}</code>
                  </span>
                )}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={currentSong.coverArt || "/placeholder.svg?height=48&width=48"}
                alt={currentSong.title}
                className="h-12 w-12 rounded-md object-cover"
              />
              <div>
                <h3 className="font-medium">{currentSong.title}</h3>
                <p className="text-sm text-muted-foreground">{currentSong.artist}</p>
              </div>
            </div>

            <div className="flex-1 mx-8">
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleToggleRepeat}
                  className={isRepeat ? "text-primary" : ""}
                  disabled={controlsDisabled}
                >
                  <Repeat className="h-5 w-5" />
                </Button>

                <Button variant="ghost" size="icon" onClick={handleTogglePlay} disabled={playButtonDisabled}>
                  {isLoading && !audioLoadedRef.current ? (
                    <span className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin"></span>
                  ) : isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleToggleLyrics}
                  className={showLyrics ? "text-primary" : ""}
                  disabled={controlsDisabled}
                >
                  <Music className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center space-x-2 mt-2">
                <span className="text-xs w-10 text-right">{formatTime(currentTime)}</span>
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={0.1}
                  onValueChange={handleSeekChange}
                  onValueCommit={handleSeekCommit}
                  className="flex-1"
                  disabled={controlsDisabled || duration === 0}
                />
                <span className="text-xs w-10">{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 w-32">
                <Button variant="ghost" size="icon" onClick={toggleMute} disabled={controlsDisabled}>
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <div className="flex-1">
                  <Slider
                    value={[volume]}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    disabled={controlsDisabled}
                  />
                </div>
              </div>

              <Button variant="ghost" size="icon" onClick={handleCloseMusicPlayer}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {showLyrics && (
            <div className="mt-4 p-4 bg-muted rounded-md max-h-48 overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap font-sans">{currentSong.lyrics || "No lyrics available"}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default MusicPlayer
