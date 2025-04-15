"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth0 } from "@auth0/auth0-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { saveTokenToCookie } from "@/lib/auth-cookies"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { setUser } from "@/lib/store/user-slice"
import axiosInstance from "@/constants/axios-instance"
export default function Callback() {
  const { isLoading, isAuthenticated, getAccessTokenSilently, getIdTokenClaims } = useAuth0()
  const [processingToken, setProcessingToken] = useState(false)
  const router = useRouter()
  const { user} = useAppSelector((state) => state.userStore)
  const dispatch = useAppDispatch()

  useEffect(() => {
    async function handleAuthentication() {
      if (!isLoading && isAuthenticated) {
        setProcessingToken(true)
        try {
          // Get the access token
          const accessToken = await getAccessTokenSilently()

          // Get token claims to extract expiration
          const claims = await getIdTokenClaims()
          dispatch(setUser(claims))
          const expiresAt = claims?.exp ? new Date(claims.exp * 1000) : new Date(Date.now() + 7200 * 1000) // Default 2 hours

          // Save token to cookie with the same expiration as the token
          saveTokenToCookie(accessToken, expiresAt)
          // saveTokenToCookie(claims?.__raw as string, expiresAt)

          // Redirect to dashboard

          const user = await axiosInstance.get("/api/v1/auth/session-user")
          console.log(user,"user from api")
          router.push("/dashboard")
        } catch (error) {
          console.error("Error processing authentication:", error)
          router.push("/login?error=authentication_failed")
        } finally {
          setProcessingToken(false)
        }
      } else if (!isLoading && !isAuthenticated) {
        router.push("/login")
      }
    }

    handleAuthentication()
  }, [isLoading, isAuthenticated, getAccessTokenSilently, getIdTokenClaims, router])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Processing your login</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    </main>
  )
}
