// types/index.d.ts
export interface User {
  id: string
  name: string
  email: string
  password?: string // Hashed password
  temporary_password?: string // "password123" for initial users
  designation: string
  role: string
  is_password_changed: boolean // 0 or 1 in DB, convert to boolean
  created_at: Date
}

export interface Report {
  id: string
  title: string
  power_bi_report_id: string
  type: "Accounting" | "Manufacturing"
  description: string
  created_at: Date
}

export interface UserReportAccess {
  id: number
  user_id: string
  report_id: string
  granted_at: Date
}

export interface AuthTokenPayload {
  userId: string
  email: string
  isPasswordChanged: boolean
  exp: number // Expiration time
}
