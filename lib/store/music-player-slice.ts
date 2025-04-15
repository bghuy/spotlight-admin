import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Song } from "@/lib/types"

export interface MusicPlayerState {
  currentSong: Song | null
  isPlaying: boolean
  isRepeat: boolean
  showLyrics: boolean
  isVisible: boolean
}

const initialState: MusicPlayerState = {
  currentSong: null,
  isPlaying: false,
  isRepeat: false,
  showLyrics: false,
  isVisible: false,
}

export const musicPlayerSlice = createSlice({
  name: "musicPlayer",
  initialState,
  reducers: {
    playSong: (state, action: PayloadAction<Song>) => {
      const song = action.payload

      // If we're trying to play the same song that's already playing, just toggle play state
      if (state.currentSong?.id === song.id) {
        state.isPlaying = !state.isPlaying
        // Đảm bảo player luôn hiển thị khi phát nhạc
        state.isVisible = true
      } else {
        // It's a new song, set it as current and start playing
        state.currentSong = song
        state.isPlaying = true
        state.showLyrics = false
        state.isVisible = true
      }
    },
    pauseSong: (state) => {
      if (state.isPlaying) {
        state.isPlaying = false
      }
    },
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying
      // Đảm bảo player luôn hiển thị khi toggle play
      state.isVisible = true
    },
    toggleRepeat: (state) => {
      state.isRepeat = !state.isRepeat
    },
    toggleLyrics: (state) => {
      state.showLyrics = !state.showLyrics
    },
    closeMusicPlayer: (state) => {
      state.isVisible = false
      state.isPlaying = false
      // Không reset currentSong để có thể mở lại player với bài hát hiện tại
    },
    setPlayState: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload
    },
    resetMusicPlayer: (state) => {
      return { ...initialState }
    },
  },
})

export const {
  playSong,
  pauseSong,
  togglePlay,
  toggleRepeat,
  toggleLyrics,
  closeMusicPlayer,
  setPlayState,
  resetMusicPlayer,
} = musicPlayerSlice.actions

export default musicPlayerSlice.reducer
