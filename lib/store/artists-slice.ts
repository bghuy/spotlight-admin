import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Artist, ArtistsState } from "@/lib/types"
import { artistService } from "@/lib/api-service"

const initialState: ArtistsState = {
  items: [],
  loading: false,
  error: null,
  searchQuery: "",
}

// Async thunks
export const fetchArtists = createAsyncThunk("artists/fetchArtists", async (_, { rejectWithValue }) => {
  try {
    return await artistService.getArtists()
  } catch (error) {
    return rejectWithValue((error as Error).message)
  }
})

export const searchArtists = createAsyncThunk("artists/searchArtists", async (query: string, { rejectWithValue }) => {
  try {
    return await artistService.searchArtists(query)
  } catch (error) {
    return rejectWithValue((error as Error).message)
  }
})

export const createArtist = createAsyncThunk(
  "artists/createArtist",
  async (artist: Omit<Artist, "id">, { rejectWithValue }) => {
    try {
      return await artistService.createArtist(artist)
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  },
)

const artistsSlice = createSlice({
  name: "artists",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch artists
      .addCase(fetchArtists.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchArtists.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items;
      })
      .addCase(fetchArtists.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Search artists
      .addCase(searchArtists.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchArtists.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(searchArtists.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Create artist
      .addCase(createArtist.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
  },
})

export const { setSearchQuery } = artistsSlice.actions
export default artistsSlice.reducer
