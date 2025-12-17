"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LinkIcon, X, ExternalLink } from "lucide-react"
import type { Attachment } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TaskAttachmentsDialogProps {
  taskName: string
  attachments: Attachment[]
  onSave: (attachments: Attachment[]) => void
  children?: React.ReactNode
}

export function TaskAttachmentsDialog({ taskName, attachments, onSave, children }: TaskAttachmentsDialogProps) {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<Attachment[]>(attachments)
  const [linkName, setLinkName] = useState("")
  const [linkUrl, setLinkUrl] = useState("")

  const handleAddLink = () => {
    if (linkName && linkUrl) {
      const newAttachment: Attachment = {
        id: Date.now().toString(),
        name: linkName,
        url: linkUrl,
        type: "link",
      }
      setItems([...items, newAttachment])
      setLinkName("")
      setLinkUrl("")
    }
  }

  const handleRemove = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const handleSave = () => {
    onSave(items)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Attachments - {taskName}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="links" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="links">Links & Resources</TabsTrigger>
          </TabsList>
          <TabsContent value="links" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="link-name">Resource Name</Label>
              <Input
                id="link-name"
                value={linkName}
                onChange={(e) => setLinkName(e.target.value)}
                placeholder="e.g., Study Guide, Video Tutorial"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <Button onClick={handleAddLink} className="w-full bg-transparent" variant="outline">
              <LinkIcon className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          </TabsContent>
        </Tabs>

        <div className="space-y-2 mt-4">
          <Label>Attachments ({items.length})</Label>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No attachments yet</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 rounded border bg-secondary/50">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <LinkIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => window.open(item.url, "_blank")}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => handleRemove(item.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Attachments</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
