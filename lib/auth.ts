// Mock authentication utilities
export function login(username: string, password: string): boolean {
  // Mock credentials
  if (username === "admin" && password === "admin") {
    if (typeof window !== "undefined") {
      localStorage.setItem("authenticated", "true")
      localStorage.setItem("username", username)
    }
    return true
  }
  return false
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authenticated")
    localStorage.removeItem("username")
    localStorage.removeItem("selectedProduct")
  }
}

export function isAuthenticated(): boolean {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authenticated") === "true"
  }
  return false
}

export function getUsername(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("username") || ""
  }
  return ""
}
