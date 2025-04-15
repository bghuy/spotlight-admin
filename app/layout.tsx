"use client"
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { store } from "@/lib/store/store"
import { Provider } from "react-redux"
const inter = Inter({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "Music Admin Dashboard",
//   description: "Admin dashboard for music streaming platform",
//     generator: 'v0.dev'
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              {children}
            </ThemeProvider>
          </AuthProvider>
        </Provider>
      </body>
    </html>
  )
}



