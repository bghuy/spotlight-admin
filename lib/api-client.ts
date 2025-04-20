"use client"

import {
  userService,
  artistRequestService,
  songService,
  analyticsService,
  albumService,
  artistService,
} from "@/lib/api-service"
import { saveGeneralSettings, saveNotificationSettings, saveSecuritySettings, saveApiSettings } from "@/lib/actions"

export const userClient = {
  getUsers: userService.getUsers,
  getUserById: userService.getUserById,
  updateUserRole: userService.updateUserRole,
  updateUserStatus: userService.updateUserStatus,
}

export const artistRequestClient = {
  getArtistRequests: artistRequestService.getArtistRequests,
  approveArtistRequest: artistRequestService.approveArtistRequest,
  rejectArtistRequest: artistRequestService.rejectArtistRequest,
}

export const songsClient = {
  getSongs: songService.getSongs,
  approveSong: songService.approveSong,
  rejectSong: songService.rejectSong,
}

export const analyticsClient = {
  getAnalyticsData: analyticsService.getAnalyticsData,
  getAnalyticsSummary: analyticsService.getAnalyticsSummary,
  getUserStats: analyticsService.getUserStats,
  getSongStats: analyticsService.getSongStats,
}

export const settingsClient = {
  saveGeneralSettings: saveGeneralSettings,
  saveNotificationSettings: saveNotificationSettings,
  saveSecuritySettings: saveSecuritySettings,
  saveApiSettings: saveApiSettings,
}

export const albumClient = {
  getAlbums: albumService.getAlbums,
  getAlbumById: albumService.getAlbumById,
  searchAlbums: albumService.searchAlbums,
  createAlbum: albumService.createAlbum,
}

export const artistClient = {
  getArtists: artistService.getArtists,
  getArtistById: artistService.getArtistById,
  searchArtists: artistService.searchArtists,
  createArtist: artistService.createArtist,
}
