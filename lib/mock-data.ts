// Mock data generator for quality metrics
export interface QualityDataPoint {
  timestamp: string
  product: string
  lt_1mm_percent: number
  gt_2_5mm_percent: number
  gt_3_5mm_percent: number
  gt_4mm_percent: number
  color_score: number
  status: "normal" | "warning" | "critical"
}

// Generate mock CSV-like data
export function generateMockData(product: string, count = 60): QualityDataPoint[] {
  const data: QualityDataPoint[] = []
  const now = Date.now()

  for (let i = count - 1; i >= 0; i--) {
    const timestamp = new Date(now - i * 60000).toISOString() // 1 minute intervals

    // Base values with some variation
    const lt_1mm = 4 + Math.random() * 6 + (Math.random() > 0.9 ? 3 : 0)
    const gt_2_5mm = 55 + Math.random() * 15
    const gt_3_5mm = 15 + Math.random() * 10
    const gt_4mm = 5 + Math.random() * 10 + (Math.random() > 0.95 ? 5 : 0)
    const color_score = 80 + Math.random() * 15

    let status: "normal" | "warning" | "critical" = "normal"
    if (lt_1mm > 10 || gt_4mm > 12 || color_score < 82) {
      status = "critical"
    } else if (lt_1mm > 8 || gt_4mm > 10 || color_score < 85) {
      status = "warning"
    }

    data.push({
      timestamp,
      product,
      lt_1mm_percent: Number.parseFloat(lt_1mm.toFixed(2)),
      gt_2_5mm_percent: Number.parseFloat(gt_2_5mm.toFixed(2)),
      gt_3_5mm_percent: Number.parseFloat(gt_3_5mm.toFixed(2)),
      gt_4mm_percent: Number.parseFloat(gt_4mm.toFixed(2)),
      color_score: Number.parseFloat(color_score.toFixed(2)),
      status,
    })
  }

  return data
}

// Get current/latest data point (rolling 60s average)
export function getCurrentData(product: string): QualityDataPoint {
  const data = generateMockData(product, 1)
  return data[0]
}

// Simulate live data stream
export function subscribeToLiveData(product: string, callback: (data: QualityDataPoint) => void): () => void {
  const interval = setInterval(() => {
    const data = getCurrentData(product)
    callback(data)
  }, 5000) // Update every 5 seconds to match camera frame rate

  return () => clearInterval(interval)
}
