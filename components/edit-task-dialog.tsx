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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import type { Task } from "@/lib/types"

interface EditTaskDialogProps {
  children: React.ReactNode
  task: Task
  onUpdate: (updates: Partial<Task>) => void
}

export function EditTaskDialog({ children, task, onUpdate }: EditTaskDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(task.name)
  const [type, setType] = useState(task.type)
  const [deadline, setDeadline] = useState(task.deadline)
  const [progress, setProgress] = useState([task.progress])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && deadline) {
      onUpdate({
        name: name.trim(),
        type,
        deadline,
        progress: progress[0],
      })
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>Update task details and progress</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-task-name">Task Name</Label>
            <Input id="edit-task-name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-task-type">Type</Label>
            <Select value={type} onValueChange={(value: any) => setType(value)}>
              <SelectTrigger id="edit-task-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="homework">Homework</SelectItem>
                <SelectItem value="lab">Lab</SelectItem>
                <SelectItem value="test">Test</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-deadline">Deadline</Label>
            <Input id="edit-deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-progress">Progress: {progress[0]}%</Label>
            <Slider
              id="edit-progress"
              value={progress}
              onValueChange={setProgress}
              max={100}
              step={5}
              className="py-4"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || !deadline}>
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
