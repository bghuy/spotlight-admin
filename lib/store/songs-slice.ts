import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Song, SongsState } from "@/lib/types"
import { songService } from "@/lib/api-service"

const initialState: SongsState = {
  items: [],
  loading: false,
  error: null,
  filter: "all",
  searchQuery: "",
}

// Async thunks
export const fetchSongs = createAsyncThunk("songs/fetchSongs", async (status?: Song["status"], { rejectWithValue }) => {
  try {
    return await songService.getSongs(status)
  } catch (error) {
    return rejectWithValue((error as Error).message)
  }
})

export const approveSong = createAsyncThunk("songs/approveSong", async (id: string, { rejectWithValue }) => {
  try {
    return await songService.approveSong(id)
  } catch (error) {
    return rejectWithValue((error as Error).message)
  }
})

export const rejectSong = createAsyncThunk("songs/rejectSong", async (id: string, { rejectWithValue }) => {
  try {
    return await songService.rejectSong(id)
  } catch (error) {
    return rejectWithValue((error as Error).message)
  }
})

const songsSlice = createSlice({
  name: "songs",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch songs
      .addCase(fetchSongs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSongs.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchSongs.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Approve song
      .addCase(approveSong.fulfilled, (state, action) => {
        const updatedSong = action.payload
        const index = state.items.findIndex((song) => song.id === updatedSong.id)
        if (index !== -1) {
          state.items[index] = updatedSong
        }
      })
      // Reject song
      .addCase(rejectSong.fulfilled, (state, action) => {
        const updatedSong = action.payload
        const index = state.items.findIndex((song) => song.id === updatedSong.id)
        if (index !== -1) {
          state.items[index] = updatedSong
        }
      })
  },
})

export const { setFilter, setSearchQuery } = songsSlice.actions
export default songsSlice.reducer
