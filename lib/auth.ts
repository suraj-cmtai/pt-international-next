export interface User {
  email: string
  password: string
}

const ADMIN_CREDENTIALS: User = {
  email: process.env.USERNAME || "",
  password: process.env.PASSWORD || "",
}

export function validateCredentials(email: string, password: string): boolean {
  return email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem("isAuthenticated") === "true"
}

export function login(email: string, password: string): boolean {
  if (validateCredentials(email, password)) {
    localStorage.setItem("isAuthenticated", "true")
    return true
  }
  return false
}

export function logout(): void {
  localStorage.removeItem("isAuthenticated")
}
