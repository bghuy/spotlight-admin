import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { User, UsersState } from "@/lib/types"
import { userService } from "@/lib/api-service"

const initialState: UsersState = {
  items: [],
  loading: false,
  error: null,
  filter: "all",
  searchQuery: "",
}

// Async thunks
export const fetchUsers = createAsyncThunk("users/fetchUsers", async (filter: string | undefined, { rejectWithValue }) => {
  try {
    return await userService.getUsers(filter)
  } catch (error) {
    return rejectWithValue((error as Error).message)
  }
})
export const updateUserRole = createAsyncThunk(
  "users/updateUserRole",
  async ({ id, role }: { id: string; role: User["role"] }, { rejectWithValue }) => {
    try {
      return await userService.updateUserRole(id, role)
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  },
)

export const updateUserStatus = createAsyncThunk(
  "users/updateUserStatus",
  async ({ id, status }: { id: string; status: User["status"] }, { rejectWithValue }) => {
    try {
      return await userService.updateUserStatus(id, status)
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  },
)

const usersSlice = createSlice({
  name: "users",
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
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Update user role
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const updatedUser = action.payload
        const index = state.items.findIndex((user) => user.id === updatedUser.id)
        if (index !== -1) {
          state.items[index] = updatedUser
        }
      })
      // Update user status
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const updatedUser = action.payload
        const index = state.items.findIndex((user) => user.id === updatedUser.id)
        if (index !== -1) {
          state.items[index] = updatedUser
        }
      })
  },
})

export const { setFilter, setSearchQuery } = usersSlice.actions
export default usersSlice.reducer
