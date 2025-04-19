export class AudioManager {
  private static instance: AudioManager
  private audio: HTMLAudioElement
  private isPlayingState = false
  private isRepeatState = false
  private currentSongUrl: string | null = null
  private onTimeUpdateCallbacks: ((time: number, duration: number) => void)[] = []
  private onPlayStateChangeCallbacks: ((isPlaying: boolean) => void)[] = []
  private onLoadedCallbacks: ((duration: number) => void)[] = []
  private onErrorCallbacks: ((error: string) => void)[] = []
  private loadPromise: Promise<void> | null = null
  private isLoading = false
  private lastActionTime = 0
  private resetInProgress = false

  private constructor() {
    this.audio = new Audio()
    this.audio.crossOrigin = "anonymous"

    // Set up event listeners
    this.audio.addEventListener("timeupdate", () => {
      this.onTimeUpdateCallbacks.forEach((callback) => callback(this.audio.currentTime, this.audio.duration))
    })

    this.audio.addEventListener("play", () => {
      this.isPlayingState = true
      this.onPlayStateChangeCallbacks.forEach((callback) => callback(true))
    })

    this.audio.addEventListener("pause", () => {
      this.isPlayingState = false
      this.onPlayStateChangeCallbacks.forEach((callback) => callback(false))
    })

    this.audio.addEventListener("ended", () => {
      if (this.isRepeatState) {
        this.audio.currentTime = 0
        this.play().catch((e) => {
          console.error("Error replaying audio:", e)
          this.onErrorCallbacks.forEach((callback) => callback("Failed to replay audio: " + e.message))
        })
      } else {
        // When the song ends and repeat is not enabled, update the play state
        this.isPlayingState = false
        this.onPlayStateChangeCallbacks.forEach((callback) => callback(false))
      }
    })

    this.audio.addEventListener("loadedmetadata", () => {
      console.log("Audio loaded metadata, duration:", this.audio.duration)
      this.onLoadedCallbacks.forEach((callback) => callback(this.audio.duration))
    })

    this.audio.addEventListener("error", (e) => {
      console.error("Audio error:", e, this.audio.error)
      let errorMessage = "Error loading audio."

      if (this.audio.error) {
        switch (this.audio.error.code) {
          case 1:
            errorMessage = "Audio loading aborted."
            break
          case 2:
            errorMessage = "Network error while loading audio. The audio file might be blocked by CORS policy."
            break
          case 3:
            errorMessage = "Audio decoding failed. Format may not be supported."
            break
          case 4:
            errorMessage = "Audio source not found or access denied."
            break
          default:
            errorMessage = `Error loading audio: ${this.audio.error.message || "Unknown error"}`
        }
      }

      this.isLoading = false
      this.onErrorCallbacks.forEach((callback) => callback(errorMessage))
    })

    // Add canplaythrough event to detect when audio is ready to play
    this.audio.addEventListener("canplaythrough", () => {
      console.log("Audio can play through without buffering")
      this.isLoading = false
    })
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager()
    }
    return AudioManager.instance
  }

  // Thêm hàm để đảm bảo không có hành động nào được thực hiện quá nhanh
  private throttleAction(): boolean {
    const now = Date.now()
    if (now - this.lastActionTime < 300) {
      // 300ms throttle
      return false
    }
    this.lastActionTime = now
    return true
  }

  // Phương thức hoàn toàn mới để xử lý khi đóng player
  public hardStop(): void {
    console.log("AudioManager: Hard stop called")

    // Dừng phát nhạc
    this.audio.pause()

    // Reset trạng thái phát
    this.isPlayingState = false

    // Thông báo cho các callback về trạng thái phát
    this.onPlayStateChangeCallbacks.forEach((callback) => callback(false))

    // Reset trạng thái loading
    this.isLoading = false
    this.loadPromise = null

    // Xóa nguồn audio để đảm bảo nó không tiếp tục tải
    try {
      // Lưu URL hiện tại để có thể tải lại sau nếu cần
      const currentUrl = this.currentSongUrl

      // Xóa nguồn audio
      this.audio.removeAttribute("src")
      this.audio.load()

      // Đặt lại URL hiện tại
      this.currentSongUrl = currentUrl
    } catch (error) {
      console.error("Error during hard stop:", error)
    }
  }

  // Cập nhật phương thức loadSong để xử lý lỗi tốt hơn
  public async loadSong(url: string): Promise<void> {
    if (!url) {
      console.error("AudioManager: No URL provided")
      this.onErrorCallbacks.forEach((callback) => callback("No audio URL provided"))
      return Promise.reject(new Error("No audio URL provided"))
    }

    console.log("AudioManager: Starting to load song URL:", url)

    // Nếu đang reset, đợi cho đến khi hoàn thành
    if (this.resetInProgress) {
      console.log("AudioManager: Reset in progress, waiting...")
      await new Promise((resolve) => setTimeout(resolve, 300))
    }

    // Nếu đang tải, hãy đợi
    if (this.isLoading) {
      console.log("AudioManager: Already loading, waiting...")
      if (this.loadPromise) {
        try {
          await this.loadPromise
        } catch (error) {
          console.error("AudioManager: Error waiting for previous load:", error)
        }
      }
    }

    // Nếu URL giống nhau và đã tải, không cần tải lại
    // Nhưng nếu audio đã bị dừng hoặc reset, vẫn cần tải lại
    if (url === this.currentSongUrl && this.audio.readyState > 1 && this.audio.src && !this.resetInProgress) {
      console.log("AudioManager: Same URL, already loaded")
      return Promise.resolve()
    }

    try {
      console.log("AudioManager: Loading song URL:", url)
      this.currentSongUrl = url
      this.isLoading = true

      // Tạo promise mới để theo dõi quá trình tải
      this.loadPromise = new Promise<void>((resolve, reject) => {
        // Reset the audio element completely
        this.audio.pause()
        this.audio.currentTime = 0

        // Xóa tất cả các sự kiện cũ
        const onCanPlay = () => {
          console.log("AudioManager: Audio can play through")
          this.isLoading = false
          resolve()
          this.audio.removeEventListener("canplaythrough", onCanPlay)
          this.audio.removeEventListener("error", onError)
        }

        const onError = (e: Event) => {
          console.error("AudioManager: Audio loading error", e, this.audio.error)
          this.isLoading = false

          let errorMessage = "Failed to load audio"
          if (this.audio.error) {
            switch (this.audio.error.code) {
              case 1:
                errorMessage = "Audio loading aborted."
                break
              case 2:
                errorMessage = "Network error while loading audio. The audio file might be blocked by CORS policy."
                break
              case 3:
                errorMessage = "Audio decoding failed. Format may not be supported."
                break
              case 4:
                errorMessage = "Audio source not found or access denied."
                break
              default:
                errorMessage = `Error loading audio: ${this.audio.error.message || "Unknown error"}`
            }
          }

          reject(new Error(errorMessage))
          this.audio.removeEventListener("canplaythrough", onCanPlay)
          this.audio.removeEventListener("error", onError)
        }

        // Thêm sự kiện mới
        this.audio.addEventListener("canplaythrough", onCanPlay, { once: true })
        this.audio.addEventListener("error", onError, { once: true })

        // Set new source and load
        console.log("AudioManager: Setting audio source to:", url)
        this.audio.src = url
        this.audio.load()
      })

      return this.loadPromise
    } catch (error) {
      this.isLoading = false
      console.error("AudioManager: Error setting audio source:", error)
      this.onErrorCallbacks.forEach((callback) =>
        callback(`Failed to load audio: ${error instanceof Error ? error.message : String(error)}`),
      )
      return Promise.reject(error)
    }
  }

  public async play(): Promise<void> {
    if (!this.currentSongUrl) {
      const error = new Error("No audio loaded")
      this.onErrorCallbacks.forEach((callback) => callback("No audio loaded"))
      return Promise.reject(error)
    }

    // Nếu đang reset, đợi cho đến khi hoàn thành
    if (this.resetInProgress) {
      await new Promise((resolve) => setTimeout(resolve, 300))
    }

    // Nếu không có nguồn audio, tải lại
    if (!this.audio.src && this.currentSongUrl) {
      try {
        await this.loadSong(this.currentSongUrl)
      } catch (error) {
        return Promise.reject(error)
      }
    }

    // Nếu đang tải, đợi cho đến khi tải xong
    if (this.isLoading && this.loadPromise) {
      try {
        await this.loadPromise
      } catch (error) {
        return Promise.reject(error)
      }
    }

    // Nếu đã phát, không cần phát lại
    if (this.isPlayingState && !this.audio.paused) {
      return Promise.resolve()
    }

    // Đảm bảo không có hành động nào được thực hiện quá nhanh
    if (!this.throttleAction()) {
      console.log("Play action throttled")
      return Promise.resolve()
    }

    console.log("AudioManager: Attempting to play audio")

    try {
      const playPromise = this.audio.play()
      // Đảm bảo xử lý lỗi đúng cách
      return playPromise.catch((e) => {
        console.error("Error playing audio:", e)
        this.isPlayingState = false
        this.onPlayStateChangeCallbacks.forEach((callback) => callback(false))
        this.onErrorCallbacks.forEach((callback) => callback("Failed to play audio: " + (e.message || "Unknown error")))
        return Promise.reject(e)
      })
    } catch (e) {
      console.error("Error playing audio:", e)
      this.isPlayingState = false
      this.onPlayStateChangeCallbacks.forEach((callback) => callback(false))
      this.onErrorCallbacks.forEach((callback) => callback("Failed to play audio: " + (e as Error).message))
      return Promise.reject(e)
    }
  }

  public pause(): void {
    // Đảm bảo không có hành động nào được thực hiện quá nhanh
    if (!this.throttleAction()) {
      console.log("Pause action throttled")
      return
    }

    if (!this.audio.paused) {
      this.audio.pause()
    }
  }

  public togglePlay(): void {
    if (this.isPlayingState) {
      this.pause()
    } else {
      this.play()
    }
  }

  // Cải thiện phương thức setVolume để xử lý lỗi tốt hơn
  public setVolume(volume: number): void {
    try {
      // Ensure volume is between 0 and 1
      const safeVolume = Math.max(0, Math.min(1, volume))

      // Only update if there's an actual change to avoid unnecessary events
      if (this.audio.volume !== safeVolume) {
        this.audio.volume = safeVolume
      }
    } catch (error) {
      console.error("Error setting volume:", error)
      // Không throw lỗi để tránh làm gián đoạn luồng xử lý
    }
  }

  public setCurrentTime(time: number): void {
    if (this.audio.readyState > 0) {
      this.audio.currentTime = time
    }
  }

  public setRepeat(repeat: boolean): void {
    this.isRepeatState = repeat
    this.audio.loop = repeat
  }

  public getCurrentTime(): number {
    return this.audio.currentTime
  }

  public getDuration(): number {
    return this.audio.duration || 0
  }

  public isPlaying(): boolean {
    return this.isPlayingState
  }

  public isRepeat(): boolean {
    return this.isRepeatState
  }

  public onTimeUpdate(callback: (time: number, duration: number) => void): () => void {
    this.onTimeUpdateCallbacks.push(callback)
    return () => {
      this.onTimeUpdateCallbacks = this.onTimeUpdateCallbacks.filter((cb) => cb !== callback)
    }
  }

  public onPlayStateChange(callback: (isPlaying: boolean) => void): () => void {
    this.onPlayStateChangeCallbacks.push(callback)
    return () => {
      this.onPlayStateChangeCallbacks = this.onPlayStateChangeCallbacks.filter((cb) => cb !== callback)
    }
  }

  public onLoaded(callback: (duration: number) => void): () => void {
    this.onLoadedCallbacks.push(callback)
    return () => {
      this.onLoadedCallbacks = this.onLoadedCallbacks.filter((cb) => cb !== callback)
    }
  }

  public onError(callback: (error: string) => void): () => void {
    this.onErrorCallbacks.push(callback)
    return () => {
      this.onErrorCallbacks = this.onErrorCallbacks.filter((cb) => cb !== callback)
    }
  }
}
