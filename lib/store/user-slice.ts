import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

const initialState:any  = {
    user: {}
}

export const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<any>) => {
            state.user = action.payload
        },
    },
})

export const {
    setUser
} = userSlice.actions

export default userSlice.reducer
