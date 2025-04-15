"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { exchangeCodeForToken } from "@/lib/auth"

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code and state from URL
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get("code")
        const state = urlParams.get("state")
        const storedState = sessionStorage.getItem("auth_state")

        // Validate state to prevent CSRF attacks
        if (!state || state !== storedState) {
          throw new Error("Invalid state parameter")
        }

        // Clear the stored state
        sessionStorage.removeItem("auth_state")

        if (!code) {
          throw new Error("No authorization code found")
        }

        // Exchange code for token
        await exchangeCodeForToken(code)

        // Redirect to dashboard
        router.push("/dashboard")
      } catch (error) {
        console.error("Authentication error:", error)
        setError(error instanceof Error ? error.message : "An unknown error occurred")
      }
    }

    handleCallback()
  }, [router])

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg border border-destructive bg-destructive/10 p-4 text-center text-destructive">
          <h2 className="mb-2 text-lg font-semibold">Đăng nhập thất bại</h2>
          <p>{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground"
          >
            Quay lại trang đăng nhập
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        <h2 className="mt-4 text-xl font-semibold">Đang xử lý đăng nhập...</h2>
        <p className="mt-2 text-muted-foreground">Vui lòng đợi trong giây lát.</p>
      </div>
    </div>
  )
}
