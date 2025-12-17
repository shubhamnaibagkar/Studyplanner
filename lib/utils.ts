import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { StudySession } from "@/lib/types"
import { differenceInDays } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTotalStudyTime(sessions: StudySession[]): number {
  return sessions.reduce((total, session) => total + session.duration, 0)
}

export function calculateStreak(sessions: StudySession[]): number {
  if (sessions.length === 0) return 0

  const uniqueDates = Array.from(new Set(sessions.map((s) => s.date))).sort((a, b) => b.localeCompare(a))

  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < uniqueDates.length; i++) {
    const sessionDate = new Date(uniqueDates[i])
    sessionDate.setHours(0, 0, 0, 0)

    const expectedDate = new Date(today)
    expectedDate.setDate(today.getDate() - i)

    if (differenceInDays(expectedDate, sessionDate) === 0) {
      streak++
    } else {
      break
    }
  }

  return streak
}

export function getDifficultyRating(hoursSpent: number, avgProgress: number): "easy" | "medium" | "hard" {
  const efficiency = avgProgress / Math.max(hoursSpent, 0.1)

  if (efficiency > 15) return "easy"
  if (efficiency > 8) return "medium"
  return "hard"
}
