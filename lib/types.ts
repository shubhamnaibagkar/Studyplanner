export interface Task {
  id: string
  type: "test" | "lab" | "homework"
  name: string
  deadline: string
  completed: boolean
  progress: number
}

export interface Subject {
  id: string
  name: string
  color: string
  tasks: Task[]
}

export interface TaskWithSubject extends Task {
  subject: Subject
}
