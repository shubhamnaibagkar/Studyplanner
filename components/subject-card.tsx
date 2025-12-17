"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Plus, Trash2, MoreVertical } from "lucide-react"
import { AddTaskDialog } from "@/components/add-task-dialog"
import { TaskItem } from "@/components/task-item"
import type { Subject, Task } from "@/lib/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface SubjectCardProps {
  subject: Subject
  onAddTask: (task: Omit<Task, "id">) => void
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
  onDeleteTask: (taskId: string) => void
  onDeleteSubject: () => void
}

export function SubjectCard({ subject, onAddTask, onUpdateTask, onDeleteTask, onDeleteSubject }: SubjectCardProps) {
  const completedTasks = subject.tasks.filter((task) => task.completed).length
  const totalTasks = subject.tasks.length
  const overallProgress =
    totalTasks > 0 ? Math.round(subject.tasks.reduce((acc, task) => acc + task.progress, 0) / totalTasks) : 0

  return (
    <Card className="overflow-hidden border-2 hover:shadow-lg transition-shadow">
      <CardHeader className={`${subject.color} bg-opacity-10 pb-4`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{subject.name}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                {completedTasks}/{totalTasks} completed
              </span>
              <span>•</span>
              <span>{overallProgress}% progress</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onDeleteSubject} className="text-destructive focus:text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Subject
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Progress value={overallProgress} className="h-2 mt-3" />
      </CardHeader>

      <CardContent className="pt-6">
        <div className="space-y-3">
          {subject.tasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm mb-4">No tasks yet</p>
            </div>
          ) : (
            subject.tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onUpdate={(updates) => onUpdateTask(task.id, updates)}
                onDelete={() => onDeleteTask(task.id)}
              />
            ))
          )}

          <AddTaskDialog onAdd={onAddTask}>
            <Button variant="outline" className="w-full gap-2 bg-transparent" size="sm">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </AddTaskDialog>
        </div>
      </CardContent>
    </Card>
  )
}
