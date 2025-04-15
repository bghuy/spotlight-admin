"use client"

import type React from "react"

import { Auth0Provider as Provider } from "@auth0/auth0-react"
import { useRouter } from "next/navigation"

export function Auth0Provider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN || ""
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || ""
  const redirectUri = typeof window !== "undefined" ? window.location.origin : ""

  if (!domain || !clientId) {
    return <>{children}</>
  }

  const onRedirectCallback = (appState: any) => {
    router.push(appState?.returnTo || "/dashboard")
  }

  return (
    <Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Provider>
  )
}
