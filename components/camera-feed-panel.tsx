"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import Image from "next/image"

const TOTAL_FRAMES = 80
const FRAME_RATE = 5000 // milliseconds between frames (1 frame every 60 seconds / 1 minute)
const FRAME_SKIP = 5 // Skip frames to slow down the sequence

export function CameraFeedPanel() {
  const [currentFrame, setCurrentFrame] = useState(1)
  const [currentTime, setCurrentTime] = useState(new Date())

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

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Camera Reference</CardTitle>
        <CardDescription className="text-xs">Production line</CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="relative aspect-video bg-secondary rounded-lg overflow-hidden">
          <Image
            src={framePath}
            alt={`Camera frame ${currentFrame}`}
            fill
            className="object-cover"
            priority
          />
          {/* Time and date overlay */}
          <div className="absolute top-2 left-2 bg-black/70 text-white px-3 py-1.5 rounded text-xs font-mono">
            <div>{formatDate(currentTime)}</div>
            <div className="font-semibold">{formatTime(currentTime)}</div>
          </div>
          {/* Camera label */}
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-mono">
            CAM 01
          </div>
          {/* Recording indicator */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/70 text-white px-2 py-1 rounded text-xs">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="font-mono">REC</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          Live camera feed - For visual context only, not used in analysis
        </p>
      </CardContent>
    </Card>
  )
}
