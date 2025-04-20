"use client"
import { configureStore } from "@reduxjs/toolkit"
import musicPlayerReducer from "./music-player-slice"
import userSlice  from "./user-slice"
import usersReducer from "./user-slice"
import artistsReducer from "./artists-slice"
import albumsReducer from "./albums-slice"
import songsReducer from "./songs-slice"

export const store = configureStore({
  reducer: {
    musicPlayer: musicPlayerReducer,
    userStore: userSlice,
    users: usersReducer,
    artists: artistsReducer,
    albums: albumsReducer,
    songs: songsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
