"use client"
import { configureStore } from "@reduxjs/toolkit"
import musicPlayerReducer from "./music-player-slice"
import userSlice  from "./user-slice"
export const store = configureStore({
  reducer: {
    musicPlayer: musicPlayerReducer,
    userStore: userSlice
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
