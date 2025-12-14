"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { Cell, Pie, PieChart, ResponsiveContainer, Label } from "recharts"

interface GranulometryChartProps {
  data: {
    lt_1mm: number
    gt_2_5mm: number
    gt_3_5mm: number
    gt_4mm: number
  }
  compact?: boolean
}

export function GranulometryChart({ data, compact = false }: GranulometryChartProps) {
  // Professional muted colors optimized for dark backgrounds with high contrast
  const chartData = [
    { 
      name: "< 1mm", 
      label: "Fines",
      value: data.lt_1mm, 
      fill: "#E8A87C" // Muted orange - warning
    },
    { 
      name: "> 2.5mm", 
      label: "Target",
      value: data.gt_2_5mm, 
      fill: "#5FB3A1" // Muted teal - success/target
    },
    { 
      name: "> 3.5mm", 
      label: "Oversize",
      value: data.gt_3_5mm, 
      fill: "#95B8D1" // Muted blue - neutral
    },
    { 
      name: "> 4mm", 
      label: "Critical",
      value: data.gt_4mm, 
      fill: "#D97B8F" // Muted red - critical
    },
  ]

  const chartConfig = {
    value: {
      label: "Percentage",
    },
  }

  // Calculate the key KPI - percentage > 2.5mm
  const targetKPI = data.gt_2_5mm

  if (compact) {
    return (
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold">Granulometry</h3>
          <p className="text-xs text-muted-foreground">60s average</p>
        </div>
        <div className="flex items-center gap-4">
          <ChartContainer config={chartConfig} className="h-[140px] w-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={chartData} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={40} 
                  outerRadius={65}
                  strokeWidth={2}
                  stroke="hsl(var(--background))"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) - 6}
                              className="fill-foreground text-2xl font-bold font-mono"
                            >
                              {targetKPI.toFixed(1)}%
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 12}
                              className="fill-muted-foreground text-xs"
                            >
                              {'>'}2.5mm
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="flex-1 space-y-1.5">
            {chartData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <div 
                    className="w-2.5 h-2.5 rounded-sm flex-shrink-0" 
                    style={{ backgroundColor: item.fill }} 
                  />
                  <p className="text-xs text-muted-foreground">{item.name}</p>
                </div>
                <p className="text-xs font-mono font-semibold">{item.value.toFixed(1)}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Granulometry Distribution</CardTitle>
        <CardDescription>Rolling 60-second average</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={chartData} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                innerRadius={70} 
                outerRadius={110}
                strokeWidth={2}
                stroke="hsl(var(--background))"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 10}
                            className="fill-foreground text-4xl font-bold font-mono"
                          >
                            {targetKPI.toFixed(1)}%
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 20}
                            className="fill-muted-foreground text-sm"
                          >
                            {'>'}2.5 mm
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="grid grid-cols-2 gap-3 mt-4">
          {chartData.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2.5 p-2 rounded-lg bg-secondary/30">
              <div 
                className="w-4 h-4 rounded flex-shrink-0" 
                style={{ backgroundColor: item.fill }} 
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground truncate">{item.name}</p>
                <div className="flex items-baseline gap-1.5">
                  <p className="text-base font-mono font-bold">{item.value.toFixed(1)}%</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
