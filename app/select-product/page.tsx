"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { isAuthenticated, logout, getUsername } from "@/lib/auth"
import { PRODUCTS, saveSelectedProduct } from "@/lib/products"
import { LogOut, ChevronRight } from "lucide-react"
import Image from "next/image"

export default function SelectProductPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/")
      return
    }
    setUsername(getUsername())
  }, [router])

  const handleProductSelect = (productId: string) => {
    saveSelectedProduct(productId)
    router.push("/dashboard")
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const groupedProducts = PRODUCTS.reduce(
    (acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = []
      }
      acc[product.category].push(product)
      return acc
    },
    {} as Record<string, typeof PRODUCTS>,
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="drop-shadow-lg"
            />
            <div>
              <h1 className="text-xl font-bold text-foreground">Granulo Vision</h1>
              <p className="text-xs text-muted-foreground">Product Selection</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {username}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-balance">Select Product Profile</h2>
            <p className="text-muted-foreground text-pretty">
              Choose the fertilizer product to monitor. Each profile has predefined quality thresholds for granulometry
              and color consistency.
            </p>
          </div>

          {Object.entries(groupedProducts).map(([category, products]) => (
            <div key={category} className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">{category}</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {products.map((product) => (
                  <Card
                    key={product.id}
                    className="border-border hover:border-primary hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => handleProductSelect(product.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {product.name}
                          </CardTitle>
                          <CardDescription className="text-xs">Quality thresholds configured</CardDescription>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="space-y-1">
                          <p className="text-muted-foreground">Fines {"<"} 1mm</p>
                          <p className="font-mono text-foreground">Max {product.thresholds.lt_1mm_max}%</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground">Target 2.5mm+</p>
                          <p className="font-mono text-foreground">
                            {product.thresholds.gt_2_5mm_min}-{product.thresholds.gt_2_5mm_max}%
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground">Oversize {">"} 3.5mm</p>
                          <p className="font-mono text-foreground">Max {product.thresholds.gt_3_5mm_max}%</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground">Color Score</p>
                          <p className="font-mono text-foreground">Min {product.thresholds.color_score_min}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
