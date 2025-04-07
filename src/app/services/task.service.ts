import { Injectable } from "@angular/core"
import type { Task, TaskStatus } from "../models/task.model"
import { BehaviorSubject, type Observable, map, of } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class TaskService {
  private tasks: Task[] = [
    {
      id: 1,
      title: "Set up project structure",
      description: "Initialize Angular project and configure routing",
      status: "TO_DO",
      createdAt: "2025-04-01T09:30:00Z",
      updatedAt: "2025-04-01T09:30:00Z",
    },
    {
      id: 2,
      title: "Create components",
      description: "Build the necessary components for the application",
      status: "IN_PROGRESS",
      createdAt: "2025-04-02T10:15:00Z",
      updatedAt: "2025-04-03T14:20:00Z",
    },
    {
      id: 3,
      title: "Implement services",
      description: "Create services for data management",
      status: "TO_DO",
      createdAt: "2025-04-02T11:45:00Z",
      updatedAt: "2025-04-02T11:45:00Z",
    },
    {
      id: 4,
      title: "Add styling",
      description: "Apply Bootstrap CSS for responsive design",
      status: "DONE",
      createdAt: "2025-04-03T09:00:00Z",
      updatedAt: "2025-04-05T16:30:00Z",
    },
  ]

  private tasksSubject = new BehaviorSubject<Task[]>(this.tasks)

  constructor() {}

  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable()
  }
}