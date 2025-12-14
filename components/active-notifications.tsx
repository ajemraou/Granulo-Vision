"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, AlertTriangle, CheckCircle } from "lucide-react"
import type { QualityDataPoint } from "@/lib/mock-data"
import type { ProductProfile } from "@/lib/products"

interface ActiveNotificationsProps {
  currentData: QualityDataPoint
  product: ProductProfile
}

export function ActiveNotifications({ currentData, product }: ActiveNotificationsProps) {
  const notifications = []

  // Check fines
  if (currentData.lt_1mm_percent > product.thresholds.lt_1mm_max) {
    notifications.push({
      id: "fines",
      severity: "critical" as const,
      metric: "Fines (< 1mm)",
      message: `${currentData.lt_1mm_percent.toFixed(2)}% exceeds threshold of ${product.thresholds.lt_1mm_max}%`,
    })
  }

  // Check oversize
  if (currentData.gt_4mm_percent > product.thresholds.gt_4mm_max) {
    notifications.push({
      id: "oversize",
      severity: "critical" as const,
      metric: "Critical Oversize (> 4mm)",
      message: `${currentData.gt_4mm_percent.toFixed(2)}% exceeds threshold of ${product.thresholds.gt_4mm_max}%`,
    })
  }

  // Check color
  if (currentData.color_score < product.thresholds.color_score_min) {
    notifications.push({
      id: "color",
      severity:
        currentData.color_score < product.thresholds.color_score_min - 3 ? ("critical" as const) : ("warning" as const),
      metric: "Color Consistency",
      message: `${currentData.color_score.toFixed(2)}% below threshold of ${product.thresholds.color_score_min}%`,
    })
  }

  return (
    <Card className="border-border">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-base">Active Notifications</CardTitle>
        <CardDescription className="text-xs">Quality alerts</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        {notifications.length === 0 ? (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-success/10 border border-success/20">
            <CheckCircle className="w-5 h-5 text-success" />
            <div>
              <p className="text-sm font-medium text-foreground">All Parameters Normal</p>
              <p className="text-xs text-muted-foreground">No active alerts or warnings</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-2 p-2 rounded-lg border ${notification.severity === "critical"
                  ? "bg-destructive/10 border-destructive/20"
                  : "bg-warning/10 border-warning/20"
                  }`}
              >
                {notification.severity === "critical" ? (
                  <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium">{notification.metric}</p>
                    <Badge
                      variant={notification.severity === "critical" ? "destructive" : "secondary"}
                      className="text-[10px] px-1.5 py-0 h-4"
                    >
                      {notification.severity}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-tight">{notification.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
