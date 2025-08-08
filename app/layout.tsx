import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { ProfileBar } from "@/components/profile-bar" // new client component

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
          <Navigation />
          <ProfileBar /> {/* handles auth + buttons */}
          <main className="pb-16 md:pb-0 md:ml-64">{children}</main>
        </div>
      </body>
    </html>
  )
}
