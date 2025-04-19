"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, Users, Music, UserCheck, Settings, Menu, X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

const navItems = [
  {
    title: "Analytics",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Artist Approvals",
    href: "/dashboard/artist-approvals",
    icon: UserCheck,
  },
  {
    title: "Song Reviews",
    href: "/dashboard/song-reviews",
    icon: Music,
  },
  {
    title: "Upload Song",
    href: "/dashboard/upload-song",
    icon: Upload,
  },
  {
    title: "User Management",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Đảm bảo rằng component chỉ render ở phía client
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-3 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-all md:hidden",
          isOpen ? "block" : "hidden",
        )}
        onClick={() => setIsOpen(false)}
      />
      <nav
        className={cn(
          "w-64 border-r bg-background p-4 transition-all md:block",
          isOpen ? "fixed inset-y-0 left-0 z-40 w-64 animate-in slide-in-from-left" : "hidden md:block",
        )}
      >
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold">Dashboard</h2>
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                  <span
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
