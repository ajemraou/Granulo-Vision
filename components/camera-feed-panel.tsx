"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Maximize2, ZoomIn, ZoomOut, RotateCcw, Move } from "lucide-react"

const TOTAL_FRAMES = 80
const FRAME_RATE = 5000 // milliseconds between frames
const FRAME_SKIP = 5

export function CameraFeedPanel() {
  const [currentFrame, setCurrentFrame] = useState(1)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLDivElement>(null)

  // Cycle through frames
  useEffect(() => {
    const frameInterval = setInterval(() => {
      setCurrentFrame((prev) => {
        const nextFrame = prev + FRAME_SKIP
        return nextFrame > TOTAL_FRAMES ? 1 : nextFrame
      })
    }, FRAME_RATE)

    return () => clearInterval(frameInterval)
  }, [])

  // Update time every second
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timeInterval)
  }, [])

  const frameNumber = currentFrame.toString().padStart(3, '0')
  const framePath = `/frames/ezgif-frame-${frameNumber}.jpg`

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 4))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => {
      const newZoom = Math.max(prev - 0.5, 1)
      if (newZoom === 1) setPosition({ x: 0, y: 0 })
      return newZoom
    })
  }

  const handleReset = () => {
    setZoomLevel(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      e.preventDefault()
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const OverlayInfo = () => (
    <>
      {/* Time and date overlay */}
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-2 rounded-md text-sm font-mono border border-white/10 shadow-lg">
        <div className="text-xs opacity-70">{formatDate(currentTime)}</div>
        <div className="font-bold tracking-wider">{formatTime(currentTime)}</div>
      </div>
      {/* Camera label */}
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-md text-xs font-mono border border-white/10 shadow-lg">
        CAM 01 • LIVE
      </div>
      {/* Recording indicator */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-red-500/90 text-white px-3 py-1.5 rounded-md text-xs font-bold shadow-lg animate-pulse">
        <div className="w-2 h-2 bg-white rounded-full" />
        REC
      </div>
    </>
  )

  return (
    <Dialog>
      <Card className="border-border shadow-md hover:shadow-lg transition-shadow bg-card/80 backdrop-blur-sm h-full flex flex-col">
        <CardHeader className="pb-3 border-b flex flex-row items-center justify-between space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              Camera Reference
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </CardTitle>
            <CardDescription className="text-xs">Production line feed</CardDescription>
          </div>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </DialogTrigger>
        </CardHeader>
        <CardContent className="p-0 flex-1 relative group cursor-pointer">
          <DialogTrigger asChild>
            <div className="relative w-full h-full min-h-[200px] bg-black/5">
              <Image
                src={framePath}
                alt={`Camera frame ${currentFrame}`}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
              <OverlayInfo />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                <div className="bg-background/90 text-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <Maximize2 className="w-4 h-4" />
                  Click to Expand
                </div>
              </div>
            </div>
          </DialogTrigger>
        </CardContent>
      </Card>

      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 gap-0 bg-black/95 border-white/10 overflow-hidden flex flex-col">
        <DialogHeader className="p-4 bg-black/50 backdrop-blur-md border-b border-white/10 absolute top-0 left-0 right-0 z-50 flex flex-row items-center justify-between">
          <DialogTitle className="text-white flex items-center gap-3">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live Feed - Camera 01
          </DialogTitle>
          <div className="flex items-center gap-2 mr-8">
            <div className="bg-white/10 rounded-lg flex items-center p-1 border border-white/10">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 1}
                className="h-8 w-8 text-white hover:bg-white/20"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <div className="w-px h-4 bg-white/20 mx-1" />
              <span className="text-xs font-mono text-white w-12 text-center">{Math.round(zoomLevel * 100)}%</span>
              <div className="w-px h-4 bg-white/20 mx-1" />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 4}
                className="h-8 w-8 text-white hover:bg-white/20"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-10 bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </DialogHeader>

        <div
          className="flex-1 relative overflow-hidden bg-black flex items-center justify-center cursor-move"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            ref={imageRef}
            className="relative w-full h-full transition-transform duration-100 ease-out"
            style={{
              transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
              cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
            }}
          >
            <Image
              src={framePath}
              alt={`Camera frame ${currentFrame}`}
              fill
              className="object-contain"
              priority
              draggable={false}
            />
          </div>

          {/* Static Overlay in Full Screen */}
          <div className="absolute top-20 left-6 pointer-events-none">
            <div className="bg-black/60 backdrop-blur-md text-white px-4 py-3 rounded-lg border border-white/10 shadow-xl">
              <div className="text-xs text-white/70 mb-1">TIMESTAMP</div>
              <div className="text-xl font-mono font-bold tracking-widest">{formatTime(currentTime)}</div>
              <div className="text-sm font-mono text-white/90">{formatDate(currentTime)}</div>
            </div>
          </div>

          {zoomLevel > 1 && (
            <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md text-white px-3 py-2 rounded-lg border border-white/10 text-xs flex items-center gap-2 pointer-events-none animate-in fade-in">
              <Move className="w-3 h-3" />
              Drag to pan
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
