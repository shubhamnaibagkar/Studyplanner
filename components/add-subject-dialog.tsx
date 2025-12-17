"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddSubjectDialogProps {
  children: React.ReactNode
  onAdd: (name: string, color: string) => void
}

const colorOptions = [
  { name: "Purple", value: "bg-chart-2" },
  { name: "Blue", value: "bg-chart-1" },
  { name: "Green", value: "bg-chart-3" },
  { name: "Yellow", value: "bg-chart-4" },
  { name: "Pink", value: "bg-chart-5" },
]

export function AddSubjectDialog({ children, onAdd }: AddSubjectDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [color, setColor] = useState(colorOptions[0].value)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onAdd(name.trim(), color)
      setName("")
      setColor(colorOptions[0].value)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
          <DialogDescription>Create a new subject to organize your tasks</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject-name">Subject Name</Label>
            <Input
              id="subject-name"
              placeholder="e.g., Computer Science"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>Color Theme</Label>
            <div className="flex gap-2">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setColor(option.value)}
                  className={`w-10 h-10 rounded-lg ${option.value} transition-transform ${
                    color === option.value ? "ring-2 ring-primary ring-offset-2 scale-110" : "hover:scale-105"
                  }`}
                  title={option.name}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Add Subject
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
