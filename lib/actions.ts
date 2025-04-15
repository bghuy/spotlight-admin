"use server"

import { revalidatePath } from "next/cache"
import { artistRequestService, songService, userService } from "@/lib/api-service"
import type { User } from "@/lib/types"

// Artist request actions
export async function approveArtistRequest(id: string) {
  try {
    await artistRequestService.approveArtistRequest(id)
    revalidatePath("/dashboard/artist-approvals")
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function rejectArtistRequest(id: string) {
  try {
    await artistRequestService.rejectArtistRequest(id)
    revalidatePath("/dashboard/artist-approvals")
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

// Song actions
export async function approveSong(id: string) {
  try {
    await songService.approveSong(id)
    revalidatePath("/dashboard/song-reviews")
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function rejectSong(id: string) {
  try {
    await songService.rejectSong(id)
    revalidatePath("/dashboard/song-reviews")
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

// User actions
export async function updateUserRole(id: string, role: User["role"]) {
  try {
    await userService.updateUserRole(id, role)
    revalidatePath("/dashboard/users")
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function updateUserStatus(id: string, status: User["status"]) {
  try {
    await userService.updateUserStatus(id, status)
    revalidatePath("/dashboard/users")
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

// Settings actions
export async function saveGeneralSettings(formData: FormData) {
  // Simulate saving settings
  await new Promise((resolve) => setTimeout(resolve, 1000))
  revalidatePath("/dashboard/settings")
  return { success: true }
}

export async function saveNotificationSettings(formData: FormData) {
  // Simulate saving settings
  await new Promise((resolve) => setTimeout(resolve, 1000))
  revalidatePath("/dashboard/settings")
  return { success: true }
}

export async function saveSecuritySettings(formData: FormData) {
  // Simulate saving settings
  await new Promise((resolve) => setTimeout(resolve, 1000))
  revalidatePath("/dashboard/settings")
  return { success: true }
}

export async function saveApiSettings(formData: FormData) {
  // Simulate saving settings
  await new Promise((resolve) => setTimeout(resolve, 1000))
  revalidatePath("/dashboard/settings")
  return { success: true }
}
