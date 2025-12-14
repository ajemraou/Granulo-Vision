"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"

interface ColorDetectionCardProps {
  colorScore: number
  threshold: number
  compact?: boolean
}

const DETECTED_COLORS = [
  { name: "Light Beige", hex: "#D4C5A9", percentage: 45 },
  { name: "Tan", hex: "#C9B697", percentage: 30 },
  { name: "Off-White", hex: "#F5F3ED", percentage: 15 },
  { name: "Sandy Brown", hex: "#BFA888", percentage: 10 },
]

// Reference color for comparison
const REFERENCE_COLOR = "#D4C5A9" // Light Beige as standard

export function ColorDetectionCard({ colorScore, threshold, compact = false }: ColorDetectionCardProps) {
  const [currentColorIndex, setCurrentColorIndex] = useState(0)

  // Rotate through detected colors to simulate analysis
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentColorIndex((prev) => (prev + 1) % DETECTED_COLORS.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatus = () => {
    if (colorScore >= threshold) return { label: "Normal", variant: "default" as const, color: "#5FB3A1" }
    if (colorScore >= threshold - 3)
      return { label: "Warning", variant: "secondary" as const, color: "#E8A87C" }
    return { label: "Critical", variant: "destructive" as const, color: "#D97B8F" }
  }

  const status = getStatus()
  const currentColor = DETECTED_COLORS[currentColorIndex]

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Color Consistency</h3>
            <p className="text-xs text-muted-foreground">Real-time analysis</p>
          </div>
          <Badge variant={status.variant} className="text-xs">{status.label}</Badge>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-2">
              <div className="text-3xl font-mono font-bold" style={{ color: status.color }}>
                {colorScore.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">
                / {threshold}%
              </div>
            </div>
            <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
              <div
                className="h-2.5 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(colorScore, 100)}%`,
                  backgroundColor: status.color,
                }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {DETECTED_COLORS.map((color, index) => (
            <div key={color.name} className="space-y-1">
              <div
                className={`w-full h-10 rounded border transition-all ${
                  index === currentColorIndex ? "ring-1 ring-primary" : ""
                }`}
                style={{
                  backgroundColor: color.hex,
                  borderColor: "hsl(var(--border))",
                }}
              />
              <div className="text-[10px] text-center font-mono font-semibold">
                {color.percentage}%
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Color Consistency</CardTitle>
            <CardDescription>Real-time color analysis</CardDescription>
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main KPI - Consistency Score */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Consistency Score</div>
            <div className="text-3xl font-mono font-bold" style={{ color: status.color }}>
              {colorScore.toFixed(1)}%
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground mb-1">Threshold</div>
            <div className="text-lg font-mono font-semibold text-muted-foreground">
              {threshold}%
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(colorScore, 100)}%`,
                backgroundColor: status.color,
              }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className={colorScore >= threshold ? "text-success font-medium" : "text-destructive font-medium"}>
              {colorScore >= threshold
                ? `✓ Within spec (+${(colorScore - threshold).toFixed(1)}%)`
                : `✗ Below spec (${(colorScore - threshold).toFixed(1)}%)`}
            </span>
          </div>
        </div>

        {/* Reference vs Detected */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t">
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">Reference</div>
            <div
              className="w-full h-20 rounded-lg border-2"
              style={{
                backgroundColor: REFERENCE_COLOR,
                borderColor: "hsl(var(--border))",
              }}
            />
            <div className="text-xs text-center text-muted-foreground font-mono">Standard</div>
          </div>
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">Current Sample</div>
            <div
              className="w-full h-20 rounded-lg border-2 transition-colors duration-500 ring-2 ring-primary"
              style={{
                backgroundColor: currentColor.hex,
                borderColor: "hsl(var(--border))",
              }}
            />
            <div className="text-xs text-center font-medium">{currentColor.name}</div>
          </div>
        </div>

        {/* Color Distribution */}
        <div className="space-y-2 pt-2 border-t">
          <div className="text-xs font-medium text-muted-foreground">Distribution</div>
          <div className="grid grid-cols-4 gap-2">
            {DETECTED_COLORS.map((color, index) => (
              <div key={color.name} className="space-y-1.5">
                <div
                  className={`w-full h-12 rounded border-2 transition-all ${
                    index === currentColorIndex ? "ring-2 ring-primary scale-105" : "opacity-60"
                  }`}
                  style={{
                    backgroundColor: color.hex,
                    borderColor: "hsl(var(--border))",
                  }}
                />
                <div className="text-xs text-center">
                  <div className="font-mono font-semibold">{color.percentage}%</div>
                  <div className="text-muted-foreground text-[10px] truncate">{color.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
