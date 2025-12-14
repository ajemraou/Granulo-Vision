// Historical data archiving and retrieval
import type { QualityDataPoint } from "./mock-data"
import { generateDataPoint } from "./mock-data"

export interface ArchivedRecord extends QualityDataPoint {
  id: string
  configVersion: string
}

// Generate historical archive data (simulating immutable records)
export function generateArchiveData(days = 7): ArchivedRecord[] {
  const records: ArchivedRecord[] = []
  const products = ["dap", "map", "tsp", "soluble", "ocp-dap", "ocp-map"]
  const now = Date.now()

  // Generate data for past days (1 record per minute)
  for (let day = days - 1; day >= 0; day--) {
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute++) {
        // Deterministically select product based on time to ensure consistency
        // or just pick one randomly if we don't care about product consistency across reloads
        // For "one source of truth", let's make product selection deterministic too
        const timestamp = now - day * 24 * 60 * 60 * 1000 - hour * 60 * 60 * 1000 - minute * 60 * 1000
        const productIndex = Math.floor(timestamp / (1000 * 60 * 60)) % products.length // Change product every hour
        const product = products[productIndex]

        const mockData = generateDataPoint(product, timestamp)

        records.push({
          ...mockData,
          id: `${timestamp}-${product}`,
          timestamp: mockData.timestamp,
          configVersion: "v1.0",
        })
      }
    }
  }

  return records.reverse()
}

// Filter archive data
export function filterArchiveData(
  data: ArchivedRecord[],
  filters: {
    startDate?: Date
    endDate?: Date
    product?: string
    status?: "normal" | "warning" | "critical" | "all"
    searchTerm?: string
  },
): ArchivedRecord[] {
  return data.filter((record) => {
    const recordDate = new Date(record.timestamp)

    if (filters.startDate && recordDate < filters.startDate) return false
    if (filters.endDate && recordDate > filters.endDate) return false
    if (filters.product && filters.product !== "all" && record.product !== filters.product) return false
    if (filters.status && filters.status !== "all" && record.status !== filters.status) return false
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      return (
        record.product.toLowerCase().includes(searchLower) ||
        record.status.toLowerCase().includes(searchLower) ||
        record.id.toLowerCase().includes(searchLower)
      )
    }

    return true
  })
}

// Export data as CSV
export function exportToCSV(data: ArchivedRecord[]): string {
  const headers = [
    "ID",
    "Timestamp",
    "Product",
    "< 1mm (%)",
    "> 2.5mm (%)",
    "> 3.5mm (%)",
    "> 4mm (%)",
    "Color Score",
    "Status",
    "Config Version",
  ]

  const rows = data.map((record) => [
    record.id,
    record.timestamp,
    record.product,
    record.lt_1mm_percent,
    record.gt_2_5mm_percent,
    record.gt_3_5mm_percent,
    record.gt_4mm_percent,
    record.color_score,
    record.status,
    record.configVersion,
  ])

  const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
  return csv
}
