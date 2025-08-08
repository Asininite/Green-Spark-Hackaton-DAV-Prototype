"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Map, Plus, Trophy, BarChart3, User } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", icon: Home, label: "Feed" },
    { href: "/map", icon: Map, label: "Map" },
    { href: "/report", icon: Plus, label: "Report" },
    { href: "/leaderboard", icon: Trophy, label: "Leaderboard" },
    { href: "/dashboard", icon: BarChart3, label: "Dashboard" },
  ]

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-lg transition-colors",
                  isActive ? "text-green-600 bg-green-50" : "text-gray-500 hover:text-green-600 hover:bg-green-50",
                )}
              >
                <Icon className={cn("h-5 w-5", item.href === "/report" && "h-6 w-6")} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Desktop/Tablet Side Navigation */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-green-600 flex items-center">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            CleanSweep
          </h1>
          <p className="text-sm text-gray-600 mt-1">Gamified Community Cleanup</p>
        </div>

        <div className="flex-1 py-6">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-6 py-3 mx-3 rounded-lg transition-colors",
                  isActive
                    ? "text-green-600 bg-green-50 border-r-2 border-green-600"
                    : "text-gray-700 hover:text-green-600 hover:bg-green-50",
                )}
              >
                <Icon className={cn("h-5 w-5", item.href === "/report" && "h-6 w-6")} />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>

        <div className="mt-auto">
          <Link
            href="/profile"
            className="flex items-center space-x-3 px-6 py-3 mx-3 rounded-lg transition-colors hover:bg-green-50 border border-gray-200"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg?height=40&width=40&text=👨‍🌾" alt="EcoWarrior22" />
              <AvatarFallback>EW</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900 truncate">EcoWarrior22</p>
              <p className="text-xs text-gray-600">1,250 points</p>
            </div>
          </Link>
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            <p className="font-medium">Community Impact</p>
            <p className="text-xs mt-1">12 areas cleaned today</p>
          </div>
        </div>
      </nav>
    </>
  )
}
