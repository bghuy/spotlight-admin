"use client"

import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"

const TOKEN_NAME = "auth_token"

// Save token to cookie with expiration
export function saveTokenToCookie(token: string, expiresAt: Date) {
  const expiresInDays = Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  Cookies.set(TOKEN_NAME, token, {
    expires: expiresInDays,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  })
}

// Get token from cookie (client-side)
export function getTokenFromCookie(): string | null {
  return Cookies.get(TOKEN_NAME) || null
}

// Remove token from cookie
export function removeTokenFromCookie() {
  Cookies.remove(TOKEN_NAME)
}

// Check if token is expired
export function isTokenExpired(token: string | null): boolean {
  if (!token) return true

  try {
    const decoded = jwtDecode<{ exp: number }>(token)
    const currentTime = Date.now() / 1000

    return decoded.exp < currentTime
  } catch (error) {
    console.error("Error decoding token:", error)
    return true
  }
}

// Get token expiration date
export function getTokenExpirationDate(token: string | null): Date | null {
  if (!token) return null

  try {
    const decoded = jwtDecode<{ exp: number }>(token)
    return new Date(decoded.exp * 1000)
  } catch (error) {
    console.error("Error decoding token:", error)
    return null
  }
}
