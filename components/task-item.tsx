"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Calendar } from "lucide-react"
import { EditTaskDialog } from "@/components/edit-task-dialog"
import type { Task } from "@/lib/types"

interface TaskItemProps {
  task: Task
  onUpdate: (updates: Partial<Task>) => void
  onDelete: () => void
}

const taskTypeColors = {
  test: "bg-destructive text-destructive-foreground",
  lab: "bg-chart-1 text-accent-foreground",
  homework: "bg-chart-3 text-accent-foreground",
}

const taskTypeLabels = {
  test: "Test",
  lab: "Lab",
  homework: "Homework",
}

export function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const isOverdue = new Date(task.deadline) < new Date() && !task.completed

  return (
    <div className="border rounded-lg p-4 space-y-3 hover:border-primary/50 transition-colors">
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={(checked) =>
            onUpdate({
              completed: !!checked,
              progress: checked ? 100 : task.progress,
            })
          }
          className="mt-0.5"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <EditTaskDialog task={task} onUpdate={onUpdate}>
              <button
                className={`font-medium text-sm text-left hover:text-primary transition-colors ${
                  task.completed ? "line-through text-muted-foreground" : ""
                }`}
              >
                {task.name}
              </button>
            </EditTaskDialog>

            <div className="flex items-center gap-2">
              <Badge className={taskTypeColors[task.type]} variant="secondary">
                {taskTypeLabels[task.type]}
              </Badge>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onDelete}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Calendar className="h-3 w-3" />
            <span className={isOverdue ? "text-destructive font-medium" : ""}>
              {new Date(task.deadline).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
              {isOverdue && " (Overdue)"}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{task.progress}%</span>
            </div>
            <Progress value={task.progress} className="h-1.5" />
          </div>
        </div>
      </div>
    </div>
  )
}
