"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, ReferenceLine } from "recharts"
import type { QualityDataPoint } from "@/lib/mock-data"

interface TrendChartProps {
  data: QualityDataPoint[]
  metric: "lt_1mm_percent" | "gt_2_5mm_percent" | "gt_3_5mm_percent" | "gt_4mm_percent"
  title: string
  color: string
  threshold?: number
  thresholdType?: "max" | "min"
}

export function TrendChart({ data, metric, title, color, threshold, thresholdType = "max" }: TrendChartProps) {
  const chartData = data.slice(-30).map((d) => ({
    time: new Date(d.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    value: d[metric],
  }))

  // Get current value for status determination
  const currentValue = chartData[chartData.length - 1]?.value || 0
  
  // Determine status and color based on threshold
  let statusColor = color
  let isWarning = false
  let isCritical = false

  if (threshold !== undefined) {
    if (thresholdType === "max") {
      // For maximum thresholds (fines, oversize, critical)
      if (currentValue > threshold) {
        isCritical = true
        statusColor = "#D97B8F" // Muted red
      } else if (currentValue > threshold * 0.85) {
        isWarning = true
        statusColor = "#E8A87C" // Muted orange
      } else {
        statusColor = "#5FB3A1" // Muted teal - good
      }
    } else {
      // For minimum thresholds (target range)
      if (currentValue < threshold) {
        isCritical = true
        statusColor = "#D97B8F" // Muted red
      } else if (currentValue < threshold * 1.1) {
        isWarning = true
        statusColor = "#E8A87C" // Muted orange
      } else {
        statusColor = "#5FB3A1" // Muted teal - good
      }
    }
  }

  const chartConfig = {
    value: {
      label: title,
      color: statusColor,
    },
  }

  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-sm">{title}</CardTitle>
            <CardDescription className="text-xs">30 min</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-xl font-mono font-bold" style={{ color: statusColor }}>
              {currentValue.toFixed(1)}%
            </div>
            {threshold !== undefined && (
              <div className="text-[10px] text-muted-foreground mt-0.5">
                {thresholdType === "max" ? "Max" : "Min"}: {threshold}%
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <ChartContainer config={chartConfig} className="h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                vertical={false}
                opacity={0.3}
              />
              <XAxis
                dataKey="time"
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={40}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={[0, 'auto']}
                tickFormatter={(value) => `${value}%`}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1, strokeDasharray: "3 3" }}
              />
              
              {/* Threshold line */}
              {threshold !== undefined && (
                <ReferenceLine
                  y={threshold}
                  stroke={isCritical ? "#D97B8F" : isWarning ? "#E8A87C" : "#95B8D1"}
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  label={{
                    value: `${threshold}%`,
                    position: "right",
                    fill: "hsl(var(--muted-foreground))",
                    fontSize: 10,
                  }}
                />
              )}
              
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={statusColor}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, fill: statusColor, stroke: "hsl(var(--background))", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
