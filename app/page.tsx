"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const router = useRouter();
  useEffect(()=>{
    router.push("/login")
  },[])
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16 text-center md:py-24">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Admin Dashboard</h1>
        <p className="max-w-[600px] text-lg text-slate-600 dark:text-slate-400 md:text-xl">
          Manage artists, songs, users, and analytics in one place
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/login">Đăng nhập</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
