"use client"

import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, AlertTriangle, Bell, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export interface AlertItem {
    id: string
    timestamp: string
    severity: "warning" | "critical"
    message: string
    metric: string
}

interface AlertHistoryProps {
    alerts: AlertItem[]
}

export function AlertHistory({ alerts }: AlertHistoryProps) {
    const [open, setOpen] = useState(false)

    // Sort alerts by timestamp descending (newest first)
    const sortedAlerts = [...alerts].sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    const criticalCount = alerts.filter(a => a.severity === "critical").length
    const warningCount = alerts.filter(a => a.severity === "warning").length
    const totalCount = alerts.length

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0 md:w-auto md:px-3 md:h-9">
                    <div className="relative">
                        <Bell className="w-5 h-5 text-muted-foreground" />
                        {totalCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
                            </span>
                        )}
                    </div>
                    <span className="hidden md:inline-block ml-2 text-muted-foreground font-medium">
                        Alerts
                    </span>
                    {totalCount > 0 && (
                        <Badge variant="secondary" className="hidden md:flex ml-2 h-5 px-1.5 min-w-[20px] justify-center">
                            {totalCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                    <div className="flex gap-2 text-[10px]">
                        {criticalCount > 0 && (
                            <Badge variant="destructive" className="px-1.5 h-5">
                                {criticalCount} Critical
                            </Badge>
                        )}
                        {warningCount > 0 && (
                            <Badge variant="outline" className="px-1.5 h-5 border-warning text-warning bg-warning/10">
                                {warningCount} Warning
                            </Badge>
                        )}
                    </div>
                </div>
                <ScrollArea className="h-[300px]">
                    {sortedAlerts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground p-4 text-center">
                            <CheckCircle2 className="w-8 h-8 mb-2 opacity-20" />
                            <p className="text-sm font-medium">No alerts recorded</p>
                            <p className="text-xs">System is running normally</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {sortedAlerts.map((alert) => (
                                <div key={alert.id} className="p-4 hover:bg-muted/50 transition-colors">
                                    <div className="flex items-start gap-3">
                                        {alert.severity === "critical" ? (
                                            <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                                        ) : (
                                            <AlertTriangle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
                                        )}
                                        <div className="space-y-1 flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs font-semibold">{alert.metric}</p>
                                                <span className="text-[10px] text-muted-foreground">
                                                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground leading-tight">
                                                {alert.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
                <div className="p-2 border-t bg-muted/30 text-center">
                    <Button variant="ghost" size="sm" className="w-full h-7 text-xs text-muted-foreground" onClick={() => setOpen(false)}>
                        Close
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}
