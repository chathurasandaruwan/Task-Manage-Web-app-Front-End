export interface User {
    id?: string;
    email: string;
    password: string;
}
export interface AuthResponse {
    userId: string,
    token: string
  }