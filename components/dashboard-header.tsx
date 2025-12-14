"use client"

import { Button } from "@/components/ui/button"
import { LogOut, Archive, AlertCircle, Sun, Moon, LayoutDashboard, Settings2 } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { logout } from "@/lib/auth"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

import { AlertHistory, type AlertItem } from "@/components/alert-history"

interface DashboardHeaderProps {
  username: string
  productName?: string
  alerts?: AlertItem[]
}

export function DashboardHeader({ username, productName, alerts = [] }: DashboardHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
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

  const isDashboard = pathname === "/dashboard"
  const isArchive = pathname === "/archive"
  const isSelectProduct = pathname === "/select-product"

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm transition-all duration-200">
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="relative cursor-pointer group"
              onClick={() => !isDashboard && router.push("/dashboard")}
            >
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-md group-hover:bg-primary/30 transition-all" />
              <Image
                src="/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="relative drop-shadow-lg transition-transform group-hover:scale-105"
              />
            </div>

            <div className="hidden md:block">
              <h1 className="text-lg font-bold text-foreground leading-tight">Granulo Vision</h1>
              {productName ? (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 font-normal bg-secondary/50 border-secondary-foreground/20">
                    Active Session
                  </Badge>
                  <p className="text-xs text-muted-foreground font-medium truncate max-w-[200px]">{productName}</p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground font-medium">Quality Control System</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 mr-2">
              {!isDashboard && !isSelectProduct && (
                <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="text-muted-foreground hover:text-foreground">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              )}
              {!isArchive && !isSelectProduct && (
                <Button variant="ghost" size="sm" onClick={() => router.push("/archive")} className="text-muted-foreground hover:text-foreground">
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </Button>
              )}
              {!isSelectProduct && (
                <Button variant="ghost" size="sm" onClick={() => router.push("/select-product")} className="text-muted-foreground hover:text-foreground">
                  <Settings2 className="w-4 h-4 mr-2" />
                  Select Product
                </Button>
              )}
            </nav>

            {/* Alerts History */}
            <AlertHistory alerts={alerts} />

            <div className="h-6 w-px bg-border hidden sm:block mx-1" />

            {/* Theme Toggle */}
            {mounted && (
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9 text-muted-foreground hover:text-primary">
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            )}

            {/* User Profile & Logout */}
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Operator</p>
                <p className="text-sm font-semibold text-foreground leading-none">{username}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="h-9 border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors"
              >
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
