"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated, getUsername } from "@/lib/auth"
import { getSelectedProduct, getProductById } from "@/lib/products"
import { generateMockData, subscribeToLiveData, type QualityDataPoint } from "@/lib/mock-data"
import { DashboardHeader } from "@/components/dashboard-header"
import { GranulometryChart } from "@/components/granulometry-chart"
import { ColorDetectionCard } from "@/components/color-detection-card"
import { TrendChart } from "@/components/trend-chart"
import { CameraFeedPanel } from "@/components/camera-feed-panel"
import { ActiveNotifications } from "@/components/active-notifications"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [currentData, setCurrentData] = useState<QualityDataPoint | null>(null)
  const [historicalData, setHistoricalData] = useState<QualityDataPoint[]>([])
  const [productId, setProductId] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/")
      return
    }

    const selectedProduct = getSelectedProduct()
    if (!selectedProduct) {
      router.push("/select-product")
      return
    }

    setUsername(getUsername())
    setProductId(selectedProduct)

    // Load initial historical data
    const initialData = generateMockData(selectedProduct, 60)
    setHistoricalData(initialData)
    setCurrentData(initialData[initialData.length - 1])

    // Subscribe to live updates
    const unsubscribe = subscribeToLiveData(selectedProduct, (newData) => {
      setCurrentData(newData)
      setHistoricalData((prev) => [...prev.slice(-59), newData])
    })

    return () => unsubscribe()
  }, [router])

  if (!currentData || !productId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    )
  }

  const product = getProductById(productId)
  if (!product) {
    router.push("/select-product")
    return null
  }

  const alertCount =
    (currentData.lt_1mm_percent > product.thresholds.lt_1mm_max ? 1 : 0) +
    (currentData.gt_4mm_percent > product.thresholds.gt_4mm_max ? 1 : 0) +
    (currentData.color_score < product.thresholds.color_score_min ? 1 : 0)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader username={username} productName={product.name} alertCount={alertCount} />

      <main className="container mx-auto px-4 py-4">
        <div className="space-y-4">
          {/* Top row - Camera, Charts, and Notifications */}
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Camera Feed */}
            <CameraFeedPanel />

            {/* Granulometry and Color Detection - Compact Combined */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle>Quality Metrics</CardTitle>
                <CardDescription>Current production analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <GranulometryChart
                  compact
                  data={{
                    lt_1mm: currentData.lt_1mm_percent,
                    gt_2_5mm: currentData.gt_2_5mm_percent,
                    gt_3_5mm: currentData.gt_3_5mm_percent,
                    gt_4mm: currentData.gt_4mm_percent,
                  }}
                />
                <div className="border-t pt-6">
                  <ColorDetectionCard 
                    compact 
                    colorScore={currentData.color_score} 
                    threshold={product.thresholds.color_score_min} 
                  />
                </div>
              </CardContent>
            </Card>

            {/* Active Notifications */}
            <ActiveNotifications currentData={currentData} product={product} />
          </div>

          {/* Bottom row - Trend Charts */}
          <div className="space-y-2">
            <h2 className="text-base font-semibold">Trend Monitoring</h2>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <TrendChart
                data={historicalData}
                metric="lt_1mm_percent"
                title="Fines < 1mm"
                color="#E8A87C"
                threshold={product.thresholds.lt_1mm_max}
                thresholdType="max"
              />
              <TrendChart
                data={historicalData}
                metric="gt_2_5mm_percent"
                title="Target > 2.5mm"
                color="#5FB3A1"
                threshold={product.thresholds.gt_2_5mm_min}
                thresholdType="min"
              />
              <TrendChart
                data={historicalData}
                metric="gt_3_5mm_percent"
                title="Oversize > 3.5mm"
                color="#95B8D1"
                threshold={product.thresholds.gt_3_5mm_max}
                thresholdType="max"
              />
              <TrendChart
                data={historicalData}
                metric="gt_4mm_percent"
                title="Critical > 4mm"
                color="#D97B8F"
                threshold={product.thresholds.gt_4mm_max}
                thresholdType="max"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
