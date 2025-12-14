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
import type { AlertItem } from "@/components/alert-history"

export default function DashboardPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [currentData, setCurrentData] = useState<QualityDataPoint | null>(null)
  const [historicalData, setHistoricalData] = useState<QualityDataPoint[]>([])
  const [productId, setProductId] = useState<string | null>(null)
  const [alerts, setAlerts] = useState<AlertItem[]>([])

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

    // Process initial data for alerts
    const initialAlerts: AlertItem[] = []
    const product = getProductById(selectedProduct)

    if (product) {
      initialData.forEach((point, index) => {
        if (point.status !== "normal") {
          // Create a unique ID based on timestamp
          const id = `alert-${new Date(point.timestamp).getTime()}`

          // Determine metric and message
          let metric = "Unknown Issue"
          let message = "Quality deviation detected"

          if (point.lt_1mm_percent > product.thresholds.lt_1mm_max) {
            metric = "Fines (< 1mm)"
            message = `${point.lt_1mm_percent.toFixed(2)}% exceeds threshold`
          } else if (point.gt_4mm_percent > product.thresholds.gt_4mm_max) {
            metric = "Oversize (> 4mm)"
            message = `${point.gt_4mm_percent.toFixed(2)}% exceeds threshold`
          } else if (point.color_score < product.thresholds.color_score_min) {
            metric = "Color Consistency"
            message = `${point.color_score.toFixed(2)}% below threshold`
          }

          initialAlerts.push({
            id,
            timestamp: point.timestamp,
            severity: point.status as "warning" | "critical",
            metric,
            message
          })
        }
      })
      setAlerts(initialAlerts)
    }

    // Subscribe to live updates
    const unsubscribe = subscribeToLiveData(selectedProduct, (newData) => {
      setCurrentData(newData)
      setHistoricalData((prev) => [...prev.slice(-59), newData])

      // Check for new alerts
      if (newData.status !== "normal" && product) {
        const id = `alert-${new Date(newData.timestamp).getTime()}`
        let metric = "Unknown Issue"
        let message = "Quality deviation detected"

        if (newData.lt_1mm_percent > product.thresholds.lt_1mm_max) {
          metric = "Fines (< 1mm)"
          message = `${newData.lt_1mm_percent.toFixed(2)}% exceeds threshold`
        } else if (newData.gt_4mm_percent > product.thresholds.gt_4mm_max) {
          metric = "Oversize (> 4mm)"
          message = `${newData.gt_4mm_percent.toFixed(2)}% exceeds threshold`
        } else if (newData.color_score < product.thresholds.color_score_min) {
          metric = "Color Consistency"
          message = `${newData.color_score.toFixed(2)}% below threshold`
        }

        setAlerts(prev => {
          // Avoid duplicates
          if (prev.some(a => a.id === id)) return prev
          return [...prev, {
            id,
            timestamp: newData.timestamp,
            severity: newData.status as "warning" | "critical",
            metric,
            message
          }]
        })
      }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-background relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <DashboardHeader username={username} productName={product.name} alerts={alerts} />

      <main className="w-full px-6 py-4 relative z-10">
        <div className="space-y-4">
          {/* Top row - Camera, Charts, and Notifications */}
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Camera Feed */}
            <CameraFeedPanel />

            {/* Granulometry and Color Detection - Compact Combined */}
            <Card className="border-border shadow-md hover:shadow-lg transition-shadow bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary rounded-full" />
                  <div>
                    <CardTitle className="text-base">Quality Metrics</CardTitle>
                    <CardDescription className="text-xs">Real-time production analysis</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-5">
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
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-primary rounded-full" />
              <h2 className="text-lg font-bold text-foreground">Trend Monitoring</h2>
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">Last 30 minutes</span>
            </div>
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
