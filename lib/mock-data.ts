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

// Simple seeded random number generator
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Generate a data point for a specific timestamp
export function generateDataPoint(product: string, timestamp: number): QualityDataPoint {
  // Use timestamp (minutes) as seed base to ensure deterministic output for same time
  const minuteSeed = Math.floor(timestamp / 60000)

  // Define a 15-minute cycle for the scenario (faster feedback for demo)
  const cycleDuration = 15
  const cyclePosition = minuteSeed % cycleDuration

  // Base values (Normal)
  let lt_1mm = 4 + seededRandom(minuteSeed + 1) * 2 // 4-6
  let gt_2_5mm = 65 + seededRandom(minuteSeed + 2) * 5 // 65-70
  let gt_3_5mm = 15 + seededRandom(minuteSeed + 3) * 3 // 15-18
  let gt_4mm = 5 + seededRandom(minuteSeed + 4) * 2 // 5-7
  let color_score = 90 + seededRandom(minuteSeed + 5) * 5 // 90-95

  let status: "normal" | "warning" | "critical" = "normal"

  // Scenario Logic (15 min cycle)
  // 0-10: Normal
  // 10-12: Warning (Drift)
  // 12-14: Critical (Incident)
  // 14-15: Recovery (Warning)

  if (cyclePosition >= 10 && cyclePosition < 12) {
    // Phase 1: Drift (Warning) - Fines increasing
    lt_1mm = 8.5 + seededRandom(minuteSeed) * 1 // 8.5-9.5 (Warning > 8)
    status = "warning"
  } else if (cyclePosition >= 12 && cyclePosition < 14) {
    // Phase 2: Incident (Critical) - Fines high, Color drops
    lt_1mm = 10.5 + seededRandom(minuteSeed) * 2 // 10.5-12.5 (Critical > 10)
    color_score = 80 + seededRandom(minuteSeed) * 2 // 80-82 (Critical < 82)
    status = "critical"
  } else if (cyclePosition >= 14 && cyclePosition < 15) {
    // Phase 3: Recovery (Warning) - Color improving, Fines dropping
    lt_1mm = 8.2 + seededRandom(minuteSeed) * 1 // 8.2-9.2 (Warning)
    color_score = 84 + seededRandom(minuteSeed) * 1 // 84-85 (Warning)
    status = "warning"
  }

  return {
    timestamp: new Date(timestamp).toISOString(),
    product,
    lt_1mm_percent: Number.parseFloat(lt_1mm.toFixed(2)),
    gt_2_5mm_percent: Number.parseFloat(gt_2_5mm.toFixed(2)),
    gt_3_5mm_percent: Number.parseFloat(gt_3_5mm.toFixed(2)),
    gt_4mm_percent: Number.parseFloat(gt_4mm.toFixed(2)),
    color_score: Number.parseFloat(color_score.toFixed(2)),
    status,
  }
}

// Generate mock CSV-like data
export function generateMockData(product: string, count = 60): QualityDataPoint[] {
  const data: QualityDataPoint[] = []
  const now = Date.now()

  for (let i = count - 1; i >= 0; i--) {
    const timestamp = now - i * 60000 // 1 minute intervals
    data.push(generateDataPoint(product, timestamp))
  }

  return data
}

// Get current/latest data point
export function getCurrentData(product: string): QualityDataPoint {
  return generateDataPoint(product, Date.now())
}

// Simulate live data stream
export function subscribeToLiveData(product: string, callback: (data: QualityDataPoint) => void): () => void {
  const interval = setInterval(() => {
    const data = getCurrentData(product)
    callback(data)
  }, 5000)

  return () => clearInterval(interval)
}
