"use client"

import { Button } from "@/components/ui/button"
import { Eye, LogOut, Archive, AlertCircle, Sun, Moon } from "lucide-react"
import { useRouter } from "next/navigation"
import { logout } from "@/lib/auth"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface DashboardHeaderProps {
  username: string
  productName: string
  alertCount?: number
}

export function DashboardHeader({ username, productName, alertCount = 0 }: DashboardHeaderProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="drop-shadow-lg"
            />
            <div>
              <h1 className="text-lg font-bold text-foreground">Granulo Vision</h1>
              <p className="text-xs text-muted-foreground">{productName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {alertCount > 0 && (
              <Badge variant="destructive" className="flex items-center gap-1 shadow-sm">
                <AlertCircle className="w-3 h-3" />
                {alertCount} Active Alert{alertCount !== 1 ? "s" : ""}
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={() => router.push("/archive")}>
              <Archive className="w-4 h-4 mr-2" />
              Archive
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")}>
              <Eye className="w-4 h-4 mr-2" />
              View Dashboard
            </Button>
            {mounted && (
              <Button variant="outline" size="sm" onClick={toggleTheme}>
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            )}
            <div className="h-6 w-px bg-border" />
            <span className="text-sm text-muted-foreground hidden sm:inline">{username}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
