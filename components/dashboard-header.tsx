"use client"

import { Button } from "@/components/ui/button"
import { LogOut, Archive, AlertCircle, Sun, Moon, LayoutDashboard, Settings2, Menu } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { logout } from "@/lib/auth"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

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
  const [isOpen, setIsOpen] = useState(false)

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

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {!isDashboard && !isSelectProduct && (
        <Button
          variant="ghost"
          size={mobile ? "default" : "sm"}
          onClick={() => {
            router.push("/dashboard")
            if (mobile) setIsOpen(false)
          }}
          className={cn("text-muted-foreground hover:text-foreground", mobile && "justify-start w-full")}
        >
          <LayoutDashboard className="w-4 h-4 mr-2" />
          Dashboard
        </Button>
      )}
      {!isArchive && !isSelectProduct && (
        <Button
          variant="ghost"
          size={mobile ? "default" : "sm"}
          onClick={() => {
            router.push("/archive")
            if (mobile) setIsOpen(false)
          }}
          className={cn("text-muted-foreground hover:text-foreground", mobile && "justify-start w-full")}
        >
          <Archive className="w-4 h-4 mr-2" />
          Archive
        </Button>
      )}
      {!isSelectProduct && (
        <Button
          variant="ghost"
          size={mobile ? "default" : "sm"}
          onClick={() => {
            router.push("/select-product")
            if (mobile) setIsOpen(false)
          }}
          className={cn("text-muted-foreground hover:text-foreground", mobile && "justify-start w-full")}
        >
          <Settings2 className="w-4 h-4 mr-2" />
          Select Product
        </Button>
      )}
    </>
  )

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm transition-all duration-200">
      <div className="w-full px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            {/* Mobile Menu Trigger */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                  <div className="flex flex-col gap-6 py-4">
                    <div className="flex items-center gap-3 px-2">
                      <div className="relative w-8 h-8">
                        <Image
                          src="/logo.png"
                          alt="Logo"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="font-bold">Granulo Vision</span>
                    </div>
                    <nav className="flex flex-col gap-2">
                      <NavLinks mobile />
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

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
                className="relative drop-shadow-lg transition-transform group-hover:scale-105 w-8 h-8 md:w-10 md:h-10"
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

          <div className="flex items-center gap-2 md:gap-3">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 mr-2">
              <NavLinks />
            </nav>

            {/* Alerts History */}
            <AlertHistory alerts={alerts} />

            <div className="h-6 w-px bg-border hidden sm:block mx-1" />

            {/* Theme Toggle */}
            {mounted && (
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9 text-muted-foreground hover:text-primary hidden sm:flex">
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
