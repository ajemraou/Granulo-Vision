"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { ArchivedRecord } from "@/lib/archive"

interface RecordDetailDialogProps {
  record: ArchivedRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RecordDetailDialog({ record, open, onOpenChange }: RecordDetailDialogProps) {
  if (!record) return null

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "normal":
        return "default"
      case "warning":
        return "secondary"
      case "critical":
        return "destructive"
      default:
        return "default"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle>Quality Record Details</DialogTitle>
          <DialogDescription>Immutable archived record from 60-second evaluation window</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Record ID</p>
              <p className="font-mono text-sm">{record.id}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Timestamp</p>
              <p className="font-mono text-sm">{new Date(record.timestamp).toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Product</p>
              <p className="text-sm font-medium">{record.product.toUpperCase()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Configuration Version</p>
              <p className="font-mono text-sm">{record.configVersion}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Granulometry Measurements</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-border p-3 space-y-1">
                <p className="text-xs text-muted-foreground">Fines {"<"} 1mm</p>
                <p className="text-2xl font-mono font-bold">{record.lt_1mm_percent.toFixed(2)}%</p>
              </div>
              <div className="rounded-lg border border-border p-3 space-y-1">
                <p className="text-xs text-muted-foreground">Target {">"} 2.5mm</p>
                <p className="text-2xl font-mono font-bold">{record.gt_2_5mm_percent.toFixed(2)}%</p>
              </div>
              <div className="rounded-lg border border-border p-3 space-y-1">
                <p className="text-xs text-muted-foreground">Oversize {">"} 3.5mm</p>
                <p className="text-2xl font-mono font-bold">{record.gt_3_5mm_percent.toFixed(2)}%</p>
              </div>
              <div className="rounded-lg border border-border p-3 space-y-1">
                <p className="text-xs text-muted-foreground">Critical {">"} 4mm</p>
                <p className="text-2xl font-mono font-bold">{record.gt_4mm_percent.toFixed(2)}%</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Color Detection</h3>
            <div className="rounded-lg border border-border p-3 space-y-1">
              <p className="text-xs text-muted-foreground">Color Consistency Score</p>
              <p className="text-2xl font-mono font-bold">{record.color_score.toFixed(2)}%</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Quality Status</h3>
            <div className="flex items-center gap-2">
              <Badge variant={getStatusVariant(record.status)} className="capitalize">
                {record.status}
              </Badge>
              <p className="text-xs text-muted-foreground">Based on product-specific thresholds</p>
            </div>
          </div>

          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              This record represents a 60-second evaluation window and is immutable for auditability. All measurements
              are rolling averages to avoid false alarms from small or non-representative samples.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
