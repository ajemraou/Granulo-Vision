"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated, getUsername } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard-header"
import { ArchiveFilters } from "@/components/archive-filters"
import { ArchiveTable } from "@/components/archive-table"
import { RecordDetailDialog } from "@/components/record-detail-dialog"
import { generateArchiveData, filterArchiveData, exportToCSV, type ArchivedRecord } from "@/lib/archive"
import { getSelectedProduct, getProductById } from "@/lib/products"

export default function ArchivePage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [productId, setProductId] = useState<string | null>(null)
  const [allRecords, setAllRecords] = useState<ArchivedRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<ArchivedRecord[]>([])
  const [selectedRecord, setSelectedRecord] = useState<ArchivedRecord | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const today = new Date().toISOString().split("T")[0]
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  const [filters, setFilters] = useState({
    startDate: weekAgo,
    endDate: today,
    product: "all",
    status: "all",
    searchTerm: "",
  })

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

    // Load archive data
    const records = generateArchiveData(7)
    setAllRecords(records)
    setFilteredRecords(records)
  }, [router])

  useEffect(() => {
    const filtered = filterArchiveData(allRecords, {
      startDate: filters.startDate ? new Date(filters.startDate) : undefined,
      endDate: filters.endDate ? new Date(filters.endDate + "T23:59:59") : undefined,
      product: filters.product,
      status: filters.status as "normal" | "warning" | "critical" | "all",
      searchTerm: filters.searchTerm,
    })
    setFilteredRecords(filtered)
  }, [allRecords, filters])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleReset = () => {
    setFilters({
      startDate: weekAgo,
      endDate: today,
      product: "all",
      status: "all",
      searchTerm: "",
    })
  }

  const handleExport = () => {
    const csv = exportToCSV(filteredRecords)
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `quality-archive-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleViewRecord = (record: ArchivedRecord) => {
    setSelectedRecord(record)
    setDialogOpen(true)
  }

  if (!productId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading archive...</p>
      </div>
    )
  }

  const product = getProductById(productId)
  if (!product) {
    router.push("/select-product")
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader username={username} productName={product.name} />

      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-balance">Historical Archive</h1>
            <p className="text-muted-foreground text-pretty">
              Browse and analyze archived quality records. All data is immutable and traceable for auditability.
            </p>
          </div>

          <ArchiveFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onExport={handleExport}
            onReset={handleReset}
            recordCount={allRecords.length}
            filteredCount={filteredRecords.length}
          />

          <ArchiveTable data={filteredRecords} onViewRecord={handleViewRecord} />
        </div>
      </main>

      <RecordDetailDialog record={selectedRecord} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
