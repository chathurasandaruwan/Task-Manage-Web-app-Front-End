import { Injectable } from "@angular/core"
import type { Task, TaskStatus } from "../models/task.model"
import { BehaviorSubject, type Observable, catchError, map, of, tap, throwError } from "rxjs"
import { HttpClient } from "@angular/common/http"

@Injectable({
  providedIn: "root",
})
export class TaskService {
  private apiUrl = "http://localhost:5050/TaskManager/api/v1/task"
  private tasksSubject = new BehaviorSubject<Task[]>([])
  private tasksLoaded = false
  
  constructor(private http: HttpClient) {}
  //get All tasks
  getTasks(): Observable<Task[]> {
    const currentUserId = localStorage.getItem('currentUser')
    if (!this.tasksLoaded) {
      const url = `${this.apiUrl}/getAllTasks/${currentUserId}`
      return this.http.get<Task[]>(url).pipe(
        tap((tasks) => {
          this.tasksSubject.next(tasks)
          this.tasksLoaded = true
        }),
        catchError(this.handleError),
      )
    }
    return this.tasksSubject.asObservable()
  }
  // add new task
  addTask(task: Omit<Task, "id" | "createdAt" | "updatedAt">): void {
    // const now = new Date().toISOString()
    // const newTask: Task = {
    //   ...task,
    //   id: this.getNextId(),
    //   createdAt: now,
    //   updatedAt: now,
    // }

    // this.tasks = [...this.tasks, newTask]
    // this.tasksSubject.next(this.tasks)
  }

  //get by Id
  getTaskById(id: number): Observable<Task | undefined> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError))
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

  // //update task
  updateTask(id: number, task: Omit<Task, "id" | "createdAt" | "updatedAt">): void {
    // this.tasks = this.tasks.map((t) => (t.id === id ? { ...t, ...task, updatedAt: new Date().toISOString() } : t))
    // this.tasksSubject.next(this.tasks)
  }

  //delete task
  deleteTask(id: number): void {
    // this.tasks = this.tasks.filter((task) => task.id !== id)
    // this.tasksSubject.next(this.tasks)
  }

  // private getNextId(): number {
  //   return Math.max(0, ...this.tasks.map((task) => task.id)) + 1
  // }
  private handleError(error: any) {
    let errorMessage = "An unknown error occurred"
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`
    } else {
      // Server-side error
      if (error.error && error.error.message) {
        errorMessage = error.error.message
      }
    }
    console.error(errorMessage)
    return throwError(() => new Error(errorMessage))
  }
}