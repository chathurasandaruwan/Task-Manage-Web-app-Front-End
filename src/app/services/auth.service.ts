import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { AuthResponse, User } from '../models/user.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = "http://localhost:5050/taskmanager/auth"
  private currentUserSubject = new BehaviorSubject<string | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem("token")
  }

  get currentUserValue(): string | null {
    return this.currentUserSubject.value
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signin`, { email, password }).pipe(
      tap((response) => this.handleAuthResponse(response)),
      catchError(this.handleError),
    )
  }

  register( email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, {email, password }).pipe(
      tap((response) => this.handleAuthResponse(response)),
      catchError(this.handleError),
    )
  }
  logout(): void {
    // Remove user from local storage
    localStorage.removeItem("currentUser")
    localStorage.removeItem("token")
    this.currentUserSubject.next(null)
    this.router.navigate(["/signin"])
  }

  // handle the authentication response
  private handleAuthResponse(response: AuthResponse): void {
    if (response && response.token) {
      // Store user details and token in local storage
      localStorage.setItem("currentUser", response.userId)
      localStorage.setItem("token", response.token)
      this.currentUserSubject.next(response.userId)
    }
  }

  // handle errors
  private handleError(error: HttpErrorResponse) {
    let errorMessage = "An unknown error occurred"
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`
    } else {
      // Server-side error
      if (error.error && error.error.message) {
        errorMessage = error.error.message
      } else if (error.status === 401) {
        errorMessage = "Invalid email or password"
      } else if (error.status === 409) {
        errorMessage = "Email already in use"
      } else if (error.status === 400) {
        errorMessage = "Invalid input data"
      }
    }
    return throwError(() => new Error(errorMessage))
  }
}
