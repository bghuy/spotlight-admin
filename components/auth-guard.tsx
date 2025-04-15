"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: string
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Giả lập kiểm tra xác thực - trong môi trường thực tế, bạn sẽ kiểm tra xác thực thực sự
    const checkAuth = async () => {
      try {
        // Giả lập delay để mô phỏng kiểm tra xác thực
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Luôn cho phép truy cập trong môi trường demo này
        setIsLoading(false)
      } catch (error) {
        console.error("Auth check failed:", error)
        setIsLoading(false)
        // router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}
