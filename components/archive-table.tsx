"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Eye } from "lucide-react"
import type { ArchivedRecord } from "@/lib/archive"

interface ArchiveTableProps {
  data: ArchivedRecord[]
  onViewRecord: (record: ArchivedRecord) => void
}

export function ArchiveTable({ data, onViewRecord }: ArchiveTableProps) {
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

  if (data.length === 0) {
    return (
      <Card className="border-border">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No records found matching the current filters</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">{"< 1mm"}</TableHead>
                <TableHead className="text-right">{"> 2.5mm"}</TableHead>
                <TableHead className="text-right">{"> 3.5mm"}</TableHead>
                <TableHead className="text-right">{"> 4mm"}</TableHead>
                <TableHead className="text-right">Color</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.slice(0, 100).map((record) => (
                <TableRow key={record.id} className="border-border">
                  <TableCell className="font-mono text-xs">
                    {new Date(record.timestamp).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className="text-sm">{record.product.toUpperCase()}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{record.lt_1mm_percent.toFixed(1)}%</TableCell>
                  <TableCell className="text-right font-mono text-sm">{record.gt_2_5mm_percent.toFixed(1)}%</TableCell>
                  <TableCell className="text-right font-mono text-sm">{record.gt_3_5mm_percent.toFixed(1)}%</TableCell>
                  <TableCell className="text-right font-mono text-sm">{record.gt_4mm_percent.toFixed(1)}%</TableCell>
                  <TableCell className="text-right font-mono text-sm">{record.color_score.toFixed(1)}%</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(record.status)} className="capitalize">
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => onViewRecord(record)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
