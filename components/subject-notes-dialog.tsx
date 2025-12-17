"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface SubjectNotesDialogProps {
  subjectName: string
  notes: string
  onSave: (notes: string) => void
  children?: React.ReactNode
}

export function SubjectNotesDialog({ subjectName, notes, onSave, children }: SubjectNotesDialogProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(notes)

  const handleSave = () => {
    onSave(value)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Notes - {subjectName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Add your subject notes here... (lecture notes, important topics, formulas, etc.)"
            className="min-h-[300px]"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Notes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
