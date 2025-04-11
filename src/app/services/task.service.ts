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
  tasks$ = this.tasksSubject.asObservable();
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
  //load after edit
  loadTasks(): Observable<Task[]> {
    this.tasksLoaded = false
    return this.getTasks()
  }
  //add task
  addTask(task: Omit<Task, "id" | "createdAt" | "updatedAt" >): Observable<Task> {
    const currentUserId = localStorage.getItem('currentUser')
  
    if (!currentUserId) {
      throw new Error('User not logged in')
    }
  
    // Add the userId to the task object
    const taskWithUser = { ...task, userId: currentUserId }
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
  updateTask(id: string, task: Omit<Task, "id" | "createdAt" | "updatedAt">): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task).pipe(catchError(this.handleError));
  }
  

  //delete task
  deleteTask(taskId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${taskId}`).pipe(catchError(this.handleError),);
  }

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