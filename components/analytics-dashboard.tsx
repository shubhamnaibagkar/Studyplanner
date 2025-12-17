"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Subject } from "@/lib/types"
import { Clock, Flame, TrendingUp, Target } from "lucide-react"
import { getTotalStudyTime, calculateStreak, getDifficultyRating } from "@/lib/utils"
import { format, subDays } from "date-fns"

interface AnalyticsDashboardProps {
  subjects: Subject[]
}

export function AnalyticsDashboard({ subjects }: AnalyticsDashboardProps) {
  const allSessions = subjects.flatMap((s) => s.studySessions)
  const totalTime = getTotalStudyTime(allSessions)
  const streak = calculateStreak(allSessions)

  // Calculate productivity heatmap data for last 30 days
  const heatmapData = Array.from({ length: 30 }, (_, i) => {
    const date = format(subDays(new Date(), 29 - i), "yyyy-MM-dd")
    const daySessions = allSessions.filter((s) => s.date === date)
    const minutes = getTotalStudyTime(daySessions)
    return { date, minutes }
  })

  const maxMinutes = Math.max(...heatmapData.map((d) => d.minutes), 1)

  // Subject difficulty ratings
  const subjectStats = subjects.map((subject) => {
    const timeSpent = getTotalStudyTime(subject.studySessions)
    const avgProgress =
      subject.tasks.length > 0 ? subject.tasks.reduce((acc, t) => acc + t.progress, 0) / subject.tasks.length : 0
    return {
      name: subject.name,
      color: subject.color,
      timeSpent,
      difficulty: getDifficultyRating(timeSpent / 60, avgProgress),
    }
  })

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(totalTime / 60)}h</div>
            <p className="text-xs text-muted-foreground">{totalTime % 60}m this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streak}</div>
            <p className="text-xs text-muted-foreground">days in a row</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subjects</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjects.length}</div>
            <p className="text-xs text-muted-foreground">
              {subjects.flatMap((s) => s.tasks).filter((t) => !t.completed).length} pending tasks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subjects.length > 0
                ? Math.round(
                    subjects.reduce((acc, s) => {
                      const progress =
                        s.tasks.length > 0 ? s.tasks.reduce((a, t) => a + t.progress, 0) / s.tasks.length : 0
                      return acc + progress
                    }, 0) / subjects.length,
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">across all subjects</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Productivity Heatmap</CardTitle>
          <p className="text-sm text-muted-foreground">Study activity over the last 30 days</p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-1 flex-wrap">
            {heatmapData.map((day) => {
              const intensity = day.minutes / maxMinutes
              const bgColor =
                intensity === 0
                  ? "bg-secondary"
                  : intensity < 0.25
                    ? "bg-chart-1/25"
                    : intensity < 0.5
                      ? "bg-chart-1/50"
                      : intensity < 0.75
                        ? "bg-chart-1/75"
                        : "bg-chart-1"

              return (
                <div
                  key={day.date}
                  className={`h-8 w-8 rounded ${bgColor} hover:ring-2 ring-primary transition-all cursor-pointer group relative`}
                  title={`${format(new Date(day.date), "MMM d")}: ${day.minutes}min`}
                >
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg border z-10">
                    {format(new Date(day.date), "MMM d")}: {day.minutes}min
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
            <span>Less</span>
            <div className="h-3 w-3 rounded bg-secondary" />
            <div className="h-3 w-3 rounded bg-chart-1/25" />
            <div className="h-3 w-3 rounded bg-chart-1/50" />
            <div className="h-3 w-3 rounded bg-chart-1/75" />
            <div className="h-3 w-3 rounded bg-chart-1" />
            <span>More</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subject Difficulty Ratings</CardTitle>
          <p className="text-sm text-muted-foreground">Based on time spent vs progress</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjectStats.map((stat) => (
              <div key={stat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${stat.color}`} />
                  <span className="font-medium">{stat.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{Math.round(stat.timeSpent / 60)}h studied</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      stat.difficulty === "easy"
                        ? "bg-green-500/10 text-green-500"
                        : stat.difficulty === "medium"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {stat.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
