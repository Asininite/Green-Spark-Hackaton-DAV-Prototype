"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export function ProfileBar() {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = useState<any>(null) // null means signed out by default
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push("/")
  }

  // Show login button if signed out
  if (!user) {
    return (
      <Button
        onClick={() => router.push("/auth")}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        Login / Signup
      </Button>
    )
  }

  // Show avatar if signed in
  const displayName =
    user.user_metadata?.username ||
    user.email?.split("@")[0] ||
    "User"

  const firstLetter = displayName.charAt(0).toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer border border-green-500">
          <AvatarImage
            src={user.user_metadata?.avatar_url || ""}
            alt={displayName}
          />
          <AvatarFallback className="bg-green-600 text-white font-bold">
            {firstLetter}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleLogout}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
