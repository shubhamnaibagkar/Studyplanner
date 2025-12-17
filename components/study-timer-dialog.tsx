"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Play, Pause, Square } from "lucide-react"
import { useEffect } from "react"

interface StudyTimerDialogProps {
  subjectId: string
  subjectName: string
  onSave: (duration: number) => void
  children?: React.ReactNode
}

export function StudyTimerDialog({ subjectId, subjectName, onSave, children }: StudyTimerDialogProps) {
  const [open, setOpen] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning])

  const handleStop = () => {
    if (seconds > 0) {
      onSave(Math.floor(seconds / 60))
    }
    setIsRunning(false)
    setSeconds(0)
    setOpen(false)
  }

  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600)
    const mins = Math.floor((secs % 3600) / 60)
    const remainingSecs = secs % 60
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Study Timer - {subjectName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="text-center">
            <div className="text-6xl font-mono font-bold text-primary mb-8">{formatTime(seconds)}</div>
            <div className="flex justify-center gap-4">
              {!isRunning ? (
                <Button onClick={() => setIsRunning(true)} size="lg" className="gap-2">
                  <Play className="h-5 w-5" />
                  Start
                </Button>
              ) : (
                <Button onClick={() => setIsRunning(false)} size="lg" variant="secondary" className="gap-2">
                  <Pause className="h-5 w-5" />
                  Pause
                </Button>
              )}
              <Button
                onClick={handleStop}
                size="lg"
                variant="outline"
                className="gap-2 bg-transparent"
                disabled={seconds === 0}
              >
                <Square className="h-5 w-5" />
                Stop & Save
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
