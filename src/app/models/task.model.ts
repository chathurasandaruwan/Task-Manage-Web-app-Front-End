export type TaskStatus = "TO_DO" | "IN_PROGRESS" | "DONE"

export interface Task {
  taskId: string
  title: string
  description: string
  status: TaskStatus
  userId: string
  createdAt: string
  updatedAt?: string
}