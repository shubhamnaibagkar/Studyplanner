export interface Task {
  id: string
  type: "test" | "lab" | "homework"
  name: string
  deadline: string
  completed: boolean
  progress: number
  notes?: string
  attachments?: Attachment[]
}

export interface Attachment {
  id: string
  name: string
  url: string
  type: "file" | "link"
}

export interface StudySession {
  id: string
  subjectId: string
  date: string
  duration: number // in minutes
}

export interface Subject {
  id: string
  name: string
  color: string
  tasks: Task[]
  studySessions: StudySession[]
  notes?: string
}

export interface TaskWithSubject extends Task {
  subject: Subject
}
