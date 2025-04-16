"use client"

import type React from "react"

import { Auth0Provider } from "@auth0/auth0-react"
import { useEffect, useState } from "react"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a placeholder or loading state
    return <>{children}</>
  }
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN || ""}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || ""}
      authorizationParams={{
        redirect_uri: typeof window !== "undefined" ? window.location.origin + "/callback" : "/callback",
        audience: "spotlight",
        scope: "openid profile email",
      }}
    >
      {children}
    </Auth0Provider>
  )
}
