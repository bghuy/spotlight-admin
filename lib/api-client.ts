"use client"

import { userService, artistRequestService, songService, analyticsService } from "@/lib/api-service"
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
}

export const settingsClient = {
  saveGeneralSettings: saveGeneralSettings,
  saveNotificationSettings: saveNotificationSettings,
  saveSecuritySettings: saveSecuritySettings,
  saveApiSettings: saveApiSettings,
}
