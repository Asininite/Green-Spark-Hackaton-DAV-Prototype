import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { ProfileBar } from "@/components/profile-bar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EcoSnap - Gamified Community Cleanup",
  description: "Report, upvote, and clean up your community"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {/* These components will now only be shown to authenticated users */}
          <Navigation />
          <div className="absolute top-4 right-4 z-50">
             <ProfileBar />
          </div>
          <main className="pb-16 md:pb-0 md:ml-64">{children}</main>
        </div>
      </body>
    </html>
  )
}