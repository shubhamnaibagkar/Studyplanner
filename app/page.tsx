"use client"

import { useState } from "react"
import { CalendarView } from "@/components/calendar-view"
import { SubjectCard } from "@/components/subject-card"
import { AddSubjectDialog } from "@/components/add-subject-dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, BookOpen, Calendar } from "lucide-react"
import type { Subject, Task } from "@/lib/types"

export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: "1",
      name: "Computer Science",
      color: "bg-chart-2",
      tasks: [
        { id: "1", type: "test", name: "Midterm Exam", deadline: "2025-01-15", completed: false, progress: 60 },
        {
          id: "2",
          type: "homework",
          name: "Algorithm Assignment",
          deadline: "2025-01-10",
          completed: true,
          progress: 100,
        },
        { id: "3", type: "lab", name: "Web Development Lab", deadline: "2025-01-12", completed: false, progress: 40 },
      ],
    },
    {
      id: "2",
      name: "Mathematics",
      color: "bg-chart-1",
      tasks: [
        { id: "4", type: "test", name: "Calculus Quiz", deadline: "2025-01-18", completed: false, progress: 30 },
        { id: "5", type: "homework", name: "Problem Set 5", deadline: "2025-01-08", completed: false, progress: 70 },
      ],
    },
  ])

  const [activeTab, setActiveTab] = useState("subjects")

  const addSubject = (name: string, color: string) => {
    const newSubject: Subject = {
      id: Date.now().toString(),
      name,
      color,
      tasks: [],
    }
    setSubjects([...subjects, newSubject])
  }

  const addTask = (subjectId: string, task: Omit<Task, "id">) => {
    setSubjects(
      subjects.map((subject) => {
        if (subject.id === subjectId) {
          return {
            ...subject,
            tasks: [...subject.tasks, { ...task, id: Date.now().toString() }],
          }
        }
        return subject
      }),
    )
  }

  const updateTask = (subjectId: string, taskId: string, updates: Partial<Task>) => {
    setSubjects(
      subjects.map((subject) => {
        if (subject.id === subjectId) {
          return {
            ...subject,
            tasks: subject.tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task)),
          }
        }
        return subject
      }),
    )
  }

  const deleteTask = (subjectId: string, taskId: string) => {
    setSubjects(
      subjects.map((subject) => {
        if (subject.id === subjectId) {
          return {
            ...subject,
            tasks: subject.tasks.filter((task) => task.id !== taskId),
          }
        }
        return subject
      }),
    )
  }

  const deleteSubject = (subjectId: string) => {
    setSubjects(subjects.filter((subject) => subject.id !== subjectId))
  }

  const allTasks = subjects.flatMap((subject) => subject.tasks.map((task) => ({ ...task, subject })))

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">Study Planner</h1>
          <p className="text-muted-foreground text-balance">
            Organize your subjects, track assignments, and never miss a deadline
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="bg-secondary">
              <TabsTrigger value="subjects" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Subjects
              </TabsTrigger>
              <TabsTrigger value="calendar" className="gap-2">
                <Calendar className="h-4 w-4" />
                Calendar
              </TabsTrigger>
            </TabsList>

            {activeTab === "subjects" && (
              <AddSubjectDialog onAdd={addSubject}>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Subject
                </Button>
              </AddSubjectDialog>
            )}
          </div>

          <TabsContent value="subjects" className="space-y-6">
            {subjects.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No subjects yet</h3>
                <p className="text-muted-foreground mb-6">Get started by adding your first subject</p>
                <AddSubjectDialog onAdd={addSubject}>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Subject
                  </Button>
                </AddSubjectDialog>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {subjects.map((subject) => (
                  <SubjectCard
                    key={subject.id}
                    subject={subject}
                    onAddTask={(task) => addTask(subject.id, task)}
                    onUpdateTask={(taskId, updates) => updateTask(subject.id, taskId, updates)}
                    onDeleteTask={(taskId) => deleteTask(subject.id, taskId)}
                    onDeleteSubject={() => deleteSubject(subject.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarView tasks={allTasks} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
