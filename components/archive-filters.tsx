"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Download, RefreshCw } from "lucide-react"
import { PRODUCTS } from "@/lib/products"

interface ArchiveFiltersProps {
  filters: {
    startDate: string
    endDate: string
    product: string
    status: string
    searchTerm: string
  }
  onFilterChange: (key: string, value: string) => void
  onExport: () => void
  onReset: () => void
  recordCount: number
  filteredCount: number
}

export function ArchiveFilters({
  filters,
  onFilterChange,
  onExport,
  onReset,
  recordCount,
  filteredCount,
}: ArchiveFiltersProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold">Filter Records</h3>
              <p className="text-xs text-muted-foreground">
                Showing {filteredCount.toLocaleString()} of {recordCount.toLocaleString()} records
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onReset}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button variant="default" size="sm" onClick={onExport}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-xs">
                Search
              </Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search records..."
                  value={filters.searchTerm}
                  onChange={(e) => onFilterChange("searchTerm", e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-xs">
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => onFilterChange("startDate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-xs">
                End Date
              </Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => onFilterChange("endDate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product" className="text-xs">
                Product
              </Label>
              <Select value={filters.product} onValueChange={(value) => onFilterChange("product", value)}>
                <SelectTrigger id="product">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  {PRODUCTS.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-xs">
                Status
              </Label>
              <Select value={filters.status} onValueChange={(value) => onFilterChange("status", value)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
