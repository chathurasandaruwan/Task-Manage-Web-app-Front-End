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
  //get All tasks
  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable()
  }

  // add new task
  addTask(task: Omit<Task, "id" | "createdAt" | "updatedAt">): void {
    const now = new Date().toISOString()
    const newTask: Task = {
      ...task,
      id: this.getNextId(),
      createdAt: now,
      updatedAt: now,
    }

    this.tasks = [...this.tasks, newTask]
    this.tasksSubject.next(this.tasks)
  }

  //get by Id
  getTaskById(id: number): Observable<Task | undefined> {
    return of(this.tasks.find((task) => task.id === id))
  }

  //filter tasks
  filterTasks(title = "", status: TaskStatus | "" = ""): Observable<Task[]> {
    return this.getTasks().pipe(
      map((tasks) => {
        return tasks.filter((task) => {
          const matchesTitle = title ? task.title.toLowerCase().includes(title.toLowerCase()) : true
          const matchesStatus = status ? task.status === status : true
          return matchesTitle && matchesStatus
        })
      }),
    )
  }

  //update task
  updateTask(id: number, task: Omit<Task, "id" | "createdAt" | "updatedAt">): void {
    this.tasks = this.tasks.map((t) => (t.id === id ? { ...t, ...task, updatedAt: new Date().toISOString() } : t))
    this.tasksSubject.next(this.tasks)
  }

  //delete task
  deleteTask(id: number): void {
    this.tasks = this.tasks.filter((task) => task.id !== id)
    this.tasksSubject.next(this.tasks)
  }

  private getNextId(): number {
    return Math.max(0, ...this.tasks.map((task) => task.id)) + 1
  }
}