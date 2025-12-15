"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { isAuthenticated, logout, getUsername } from "@/lib/auth"
import { PRODUCTS, saveSessionConfig, type ProductProfile } from "@/lib/products"
import { LogOut, Search, Settings2, Play, Check, AlertCircle } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { DashboardHeader } from "@/components/dashboard-header"

export default function SelectProductPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<ProductProfile | null>(null)
  const [batchId, setBatchId] = useState("")
  const [customThresholds, setCustomThresholds] = useState<ProductProfile["thresholds"] | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/")
      return
    }
    setUsername(getUsername())
  }, [router])

  // Reset custom thresholds when product changes
  useEffect(() => {
    if (selectedProduct) {
      setCustomThresholds({ ...selectedProduct.thresholds })
    }
  }, [selectedProduct])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleStartSession = () => {
    if (!selectedProduct || !customThresholds) return

    saveSessionConfig({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      batchId: batchId || undefined,
      thresholds: customThresholds,
      startedAt: new Date().toISOString(),
    })
    router.push("/dashboard")
  }

  const filteredProducts = PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const groupedProducts = filteredProducts.reduce(
    (acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = []
      }
      acc[product.category].push(product)
      return acc
    },
    {} as Record<string, typeof PRODUCTS>,
  )

  const updateThreshold = (key: keyof ProductProfile["thresholds"], value: string) => {
    if (!customThresholds) return
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return
    setCustomThresholds({ ...customThresholds, [key]: numValue })
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <DashboardHeader username={username} />

      {/* Main Content - Split View */}
      <main className="flex-1 overflow-hidden">
        {/* Mobile Layout (Stacked) */}
        <div className="flex flex-col h-full md:hidden overflow-y-auto">
          {/* Product Selection */}
          <div className={cn("flex-1 flex flex-col min-h-[50vh]", selectedProduct ? "hidden" : "flex")}>
            <div className="px-6 py-4 border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-10 space-y-3">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Select Product</h2>
                <p className="text-sm text-muted-foreground">Choose a product profile to begin monitoring.</p>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-9 bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <ScrollArea className="flex-1 px-6 py-4">
              <div className="space-y-6 pb-8">
                {Object.entries(groupedProducts).length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No products found matching "{searchQuery}"</p>
                  </div>
                ) : (
                  Object.entries(groupedProducts).map(([category, products]) => (
                    <div key={category} className="space-y-3">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
                        {category}
                      </h3>
                      <div className="grid gap-2">
                        {products.map((product) => (
                          <div
                            key={product.id}
                            onClick={() => setSelectedProduct(product)}
                            className={cn(
                              "group relative flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all duration-200",
                              selectedProduct?.id === product.id
                                ? "bg-primary/5 border-primary shadow-sm ring-1 ring-primary/20"
                                : "bg-card border-border hover:border-primary/50 hover:shadow-sm"
                            )}
                          >
                            <div className="space-y-1">
                              <p className={cn(
                                "font-medium transition-colors",
                                selectedProduct?.id === product.id ? "text-primary" : "text-foreground"
                              )}>
                                {product.name}
                              </p>
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                Default: {product.thresholds.gt_2_5mm_min}-{product.thresholds.gt_2_5mm_max}% target
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Configuration (Mobile) */}
          {selectedProduct && (
            <div className="flex-1 flex flex-col bg-background min-h-screen">
              <div className="p-4 border-b border-border flex items-center gap-2 sticky top-0 bg-background z-10">
                <Button variant="ghost" size="sm" onClick={() => setSelectedProduct(null)} className="-ml-2">
                  ← Back
                </Button>
                <h2 className="font-semibold truncate">{selectedProduct.name}</h2>
              </div>
              {customThresholds && (
                <>
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-6 pb-20">
                      {/* Batch Info */}
                      <div className="space-y-4 p-4 rounded-lg border border-border bg-card/50">
                        <h3 className="font-semibold flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-xs">1</span>
                          Session Details
                        </h3>
                        <div className="grid gap-2">
                          <Label htmlFor="batchId-mobile">Batch ID / Lot Number</Label>
                          <Input
                            id="batchId-mobile"
                            placeholder="e.g. B-2024-001"
                            value={batchId}
                            onChange={(e) => setBatchId(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Thresholds */}
                      <div className="space-y-4 p-4 rounded-lg border border-border bg-card/50">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-xs">2</span>
                            Thresholds
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-8"
                            onClick={() => setCustomThresholds({ ...selectedProduct.thresholds })}
                          >
                            Reset
                          </Button>
                        </div>

                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground uppercase">Fines {"<"} 1mm (Max %)</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={customThresholds.lt_1mm_max}
                                onChange={(e) => updateThreshold("lt_1mm_max", e.target.value)}
                                className="font-mono"
                              />
                            </div>
                          </div>
                          {/* Add other thresholds here similarly if needed, keeping it brief for mobile */}
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground uppercase">Target 2.5mm+ (Min %)</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={customThresholds.gt_2_5mm_min}
                                onChange={(e) => updateThreshold("gt_2_5mm_min", e.target.value)}
                                className="font-mono"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground uppercase">Target 2.5mm+ (Max %)</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={customThresholds.gt_2_5mm_max}
                                onChange={(e) => updateThreshold("gt_2_5mm_max", e.target.value)}
                                className="font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                  <div className="p-4 border-t border-border bg-card/30 backdrop-blur-sm sticky bottom-0">
                    <Button size="lg" onClick={handleStartSession} className="w-full gap-2 shadow-lg shadow-primary/20">
                      <Play className="w-4 h-4 fill-current" />
                      Start Monitoring
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Desktop Layout (Resizable) */}
        <ResizablePanelGroup direction="horizontal" className="hidden md:flex h-full items-stretch">

          {/* Left Panel: Product Selection */}
          <ResizablePanel defaultSize={40} minSize={30} maxSize={50} className="bg-secondary/30 flex flex-col">
            <div className="px-6 py-4 border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-10 space-y-3">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Select Product</h2>
                <p className="text-sm text-muted-foreground">Choose a product profile to begin monitoring.</p>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-9 bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <ScrollArea className="flex-1 px-6 py-4">
              <div className="space-y-6 pb-8">
                {Object.entries(groupedProducts).length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No products found matching "{searchQuery}"</p>
                  </div>
                ) : (
                  Object.entries(groupedProducts).map(([category, products]) => (
                    <div key={category} className="space-y-3">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
                        {category}
                      </h3>
                      <div className="grid gap-2">
                        {products.map((product) => (
                          <div
                            key={product.id}
                            onClick={() => setSelectedProduct(product)}
                            className={cn(
                              "group relative flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all duration-200",
                              selectedProduct?.id === product.id
                                ? "bg-primary/5 border-primary shadow-sm ring-1 ring-primary/20"
                                : "bg-card border-border hover:border-primary/50 hover:shadow-sm"
                            )}
                          >
                            <div className="space-y-1">
                              <p className={cn(
                                "font-medium transition-colors",
                                selectedProduct?.id === product.id ? "text-primary" : "text-foreground"
                              )}>
                                {product.name}
                              </p>
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                Default: {product.thresholds.gt_2_5mm_min}-{product.thresholds.gt_2_5mm_max}% target
                              </p>
                            </div>
                            {selectedProduct?.id === product.id && (
                              <div className="h-2 w-2 rounded-full bg-primary animate-in zoom-in duration-300" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Panel: Configuration */}
          <ResizablePanel defaultSize={60} className="bg-background flex flex-col">
            {selectedProduct && customThresholds ? (
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-border space-y-1">
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <Settings2 className="w-5 h-5" />
                    <span className="text-sm font-medium uppercase tracking-wider">Configuration</span>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">{selectedProduct.name}</h2>
                  <p className="text-muted-foreground">Configure session parameters and quality thresholds.</p>
                </div>

                <ScrollArea className="flex-1 p-6">
                  <div className="max-w-2xl mx-auto space-y-8">

                    {/* Batch Info */}
                    <div className="space-y-4 p-5 rounded-lg border border-border bg-card/50">
                      <h3 className="font-semibold flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-xs">1</span>
                        Session Details
                      </h3>
                      <div className="grid gap-2">
                        <Label htmlFor="batchId">Batch ID / Lot Number (Optional)</Label>
                        <Input
                          id="batchId"
                          placeholder="e.g. B-2024-001"
                          value={batchId}
                          onChange={(e) => setBatchId(e.target.value)}
                          className="max-w-md"
                        />
                        <p className="text-xs text-muted-foreground">Used for reporting and traceability.</p>
                      </div>
                    </div>

                    {/* Thresholds */}
                    <div className="space-y-4 p-5 rounded-lg border border-border bg-card/50">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-xs">2</span>
                          Quality Thresholds
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-8"
                          onClick={() => setCustomThresholds({ ...selectedProduct.thresholds })}
                        >
                          Reset to Defaults
                        </Button>
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground uppercase">Fines {"<"} 1mm (Max %)</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={customThresholds.lt_1mm_max}
                              onChange={(e) => updateThreshold("lt_1mm_max", e.target.value)}
                              className="font-mono"
                            />
                            <span className="text-sm text-muted-foreground">%</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground uppercase">Oversize {">"} 3.5mm (Max %)</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={customThresholds.gt_3_5mm_max}
                              onChange={(e) => updateThreshold("gt_3_5mm_max", e.target.value)}
                              className="font-mono"
                            />
                            <span className="text-sm text-muted-foreground">%</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground uppercase">Target 2.5mm+ (Min %)</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={customThresholds.gt_2_5mm_min}
                              onChange={(e) => updateThreshold("gt_2_5mm_min", e.target.value)}
                              className="font-mono"
                            />
                            <span className="text-sm text-muted-foreground">%</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground uppercase">Target 2.5mm+ (Max %)</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={customThresholds.gt_2_5mm_max}
                              onChange={(e) => updateThreshold("gt_2_5mm_max", e.target.value)}
                              className="font-mono"
                            />
                            <span className="text-sm text-muted-foreground">%</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground uppercase">Color Score (Min)</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={customThresholds.color_score_min}
                              onChange={(e) => updateThreshold("color_score_min", e.target.value)}
                              className="font-mono"
                            />
                            <span className="text-sm text-muted-foreground">/100</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </ScrollArea>

                <div className="p-6 border-t border-border bg-card/30 backdrop-blur-sm">
                  <div className="max-w-2xl mx-auto flex items-center justify-end gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-medium">Ready to start?</p>
                      <p className="text-xs text-muted-foreground">Configuration will be saved for this session.</p>
                    </div>
                    <Button size="lg" onClick={handleStartSession} className="gap-2 shadow-lg shadow-primary/20">
                      <Play className="w-4 h-4 fill-current" />
                      Start Monitoring
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-muted-foreground space-y-4">
                <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center">
                  <Settings2 className="w-8 h-8 opacity-50" />
                </div>
                <div className="max-w-xs">
                  <h3 className="text-lg font-semibold text-foreground">No Product Selected</h3>
                  <p className="text-sm mt-1">Select a product from the list on the left to configure thresholds and start a session.</p>
                </div>
              </div>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  )
}
