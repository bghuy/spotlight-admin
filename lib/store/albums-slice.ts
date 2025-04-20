import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Album, AlbumsState, CreateAlbumRequest, UpdateAlbumRequest, PaginatedResponse } from "@/lib/types"
import { albumService } from "@/lib/api-service"

const initialState: AlbumsState = {
  items: [],
  loading: false,
  error: null,
  pagination: null,
  searchQuery: "",
}

// Async thunks
export const fetchAlbums = createAsyncThunk("albums/fetchAlbums", async (_, { rejectWithValue }) => {
  try {
    const response = await albumService.getAlbums()
    return response
  } catch (error) {
    return rejectWithValue((error as Error).message)
  }
})

export const searchAlbums = createAsyncThunk("albums/searchAlbums", async (query: string, { rejectWithValue }) => {
  try {
    return await albumService.searchAlbums(query)
  } catch (error) {
    return rejectWithValue((error as Error).message)
  }
})

export const createAlbum = createAsyncThunk(
  "albums/createAlbum",
  async (album: CreateAlbumRequest, { rejectWithValue }) => {
    try {
      return await albumService.createAlbum(album)
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  },
)

export const updateAlbum = createAsyncThunk(
  "albums/updateAlbum",
  async ({ id, data }: { id: string; data: UpdateAlbumRequest }, { rejectWithValue }) => {
    try {
      return await albumService.updateAlbum(id, data)
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  },
)

export const deleteAlbum = createAsyncThunk("albums/deleteAlbum", async (id: string, { rejectWithValue }) => {
  try {
    await albumService.deleteAlbum(id)
    return id
  } catch (error) {
    return rejectWithValue((error as Error).message)
  }
})

const albumsSlice = createSlice({
  name: "albums",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch albums
      .addCase(fetchAlbums.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAlbums.fulfilled, (state, action: PayloadAction<PaginatedResponse<Album>>) => {
        state.loading = false
        state.items = action.payload.items
        state.pagination = action.payload.meta
      })
      .addCase(fetchAlbums.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Search albums
      .addCase(searchAlbums.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchAlbums.fulfilled, (state, action: PayloadAction<Album[]>) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(searchAlbums.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Create album
      .addCase(createAlbum.fulfilled, (state, action: PayloadAction<Album>) => {
        console.log("Album created:", action.payload)
        state.items.push(action.payload)
        console.log("Album state:", [...state.items])
      })
      // Update album
      .addCase(updateAlbum.fulfilled, (state, action: PayloadAction<Album>) => {
        const index = state.items.findIndex((album) => album.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      // Delete album
      .addCase(deleteAlbum.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((album) => album.id !== action.payload)
      })
  },
})

export const { setSearchQuery } = albumsSlice.actions
export default albumsSlice.reducer
