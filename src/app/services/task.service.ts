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
    console.log(currentUserId);
    
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
  // addTask(task: Omit<Task, "id" | "createdAt" | "updatedAt | userId">): Observable<Task> {
  //   const currentUserId = localStorage.getItem('currentUser')
  //   console.log(currentUserId);
    
  // if (!currentUserId) {
  //   throw new Error('User not logged in')
  // }

  // // Add the userId to the task object
  // const taskWithUser = { ...task, userId: currentUserId }

  //   return this.http.post<Task>(this.apiUrl, taskWithUser).pipe(
  //     tap((newTask) => {
  //       const currentTasks = this.tasksSubject.value
  //       this.tasksSubject.next([...currentTasks, newTask])
  //     }),
  //     catchError(this.handleError),
  //   )
  // }
  addTask(task: Omit<Task, "id" | "createdAt" | "updatedAt" >): Observable<Task> {
    const currentUserId = localStorage.getItem('currentUser')
  
    if (!currentUserId) {
      throw new Error('User not logged in')
    }
  
    // Add the userId to the task object
    const taskWithUser = { ...task, userId: currentUserId }
    console.log(taskWithUser);
    
  
    return this.http.post<Task>(this.apiUrl, taskWithUser).pipe(
      tap((newTask) => {
        const currentTasks = this.tasksSubject.value
        this.tasksSubject.next([...currentTasks, newTask])
      }),
      catchError(this.handleError),
    )
  }
  

  //get by Id
  getTaskById(id: string): Observable<Task | undefined> {
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
  updateTask(id: string, task: Omit<Task, "taskId" | "createdAt" | "updatedAt">): Observable<Task> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, task);
    // this.tasks = this.tasks.map((t) => (t.id === id ? { ...t, ...task, updatedAt: new Date().toISOString() } : t))
    // this.tasksSubject.next(this.tasks)
  }

  //delete task
  deleteTask(id: string): void {
    console.log(id);
    
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