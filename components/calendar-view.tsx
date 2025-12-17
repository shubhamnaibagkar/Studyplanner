"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { TaskWithSubject } from "@/lib/types"

interface CalendarViewProps {
  tasks: TaskWithSubject[]
}

const taskTypeColors = {
  test: "bg-destructive text-destructive-foreground",
  lab: "bg-chart-1 text-accent-foreground",
  homework: "bg-chart-3 text-accent-foreground",
}

export function CalendarView({ tasks }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const getTasksForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return tasks.filter((task) => task.deadline === dateStr)
  }

  const days = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="min-h-24" />)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayTasks = getTasksForDate(day)
    const isToday = new Date().toDateString() === new Date(year, month, day).toDateString()

    days.push(
      <div
        key={day}
        className={`min-h-24 p-2 border rounded-lg ${isToday ? "bg-primary/5 border-primary" : "border-border"}`}
      >
        <div className={`text-sm font-medium mb-2 ${isToday ? "text-primary" : ""}`}>{day}</div>
        <div className="space-y-1">
          {dayTasks.map((task) => (
            <div
              key={task.id}
              className="text-xs p-1.5 rounded bg-card border truncate"
              title={`${task.subject.name}: ${task.name}`}
            >
              <div className={`w-2 h-2 rounded-full inline-block mr-1 ${task.subject.color}`} />
              <span className="font-medium">{task.name}</span>
            </div>
          ))}
        </div>
      </div>,
    )
  }

  const upcomingTasks = tasks
    .filter((task) => new Date(task.deadline) >= new Date())
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5)

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={previousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground pb-2">
                {day}
              </div>
            ))}
            {days}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Deadlines</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No upcoming deadlines</p>
          ) : (
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{task.name}</p>
                      <p className="text-xs text-muted-foreground">{task.subject.name}</p>
                    </div>
                    <Badge className={taskTypeColors[task.type]} variant="secondary">
                      {task.type}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(task.deadline).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  {task.id !== upcomingTasks[upcomingTasks.length - 1].id && <div className="border-t pt-4" />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
