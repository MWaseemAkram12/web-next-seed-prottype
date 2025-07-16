"use server"

import { cookies } from "next/headers"
import { db } from "./db"
import { verifySession, encrypt } from "./auth"

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required." }
  }

  try {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    })

    if (!user || user.password !== password) {
      return { error: "Invalid credentials." }
    }

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    const session = await encrypt({ user: user.id, expires })

    cookies().set("session", session, { expires, httpOnly: true })

    return { success: true, redirectPath: "/dashboard" }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "An unexpected error occurred during login." }
  }
}

export async function logout() {
  try {
    cookies().delete("session")
    return { success: true, redirectPath: "/login" } // Return path for client-side redirect
  } catch (error) {
    console.error("Logout error:", error)
    return { success: false, error: "Failed to logout." }
  }
}

export async function changePassword(formData: FormData) {
  const oldPassword = formData.get("oldPassword") as string
  const newPassword = formData.get("newPassword") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!oldPassword || !newPassword || !confirmPassword) {
    return { error: "All fields are required." }
  }

  if (newPassword !== confirmPassword) {
    return { error: "New password and confirm password do not match." }
  }

  const session = await verifySession()
  if (!session?.userId) {
    return { error: "User not authenticated." }
  }

  try {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, session.userId),
    })

    if (!user || user.password !== oldPassword) {
      return { error: "Invalid old password." }
    }

    await db
      .update(db.query.users)
      .set({ password: newPassword })
      .where((users, { eq }) => eq(users.id, session.userId))

    return { success: true, message: "Password changed successfully!" }
  } catch (error) {
    console.error("Change password error:", error)
    if (error instanceof Error && error.message.includes("Connection terminated due to connection timeout")) {
      return { error: "Database connection timed out. Please try again later or check server logs." }
    }
    return { error: "An unexpected error occurred during password change." }
  }
}

export async function getUserDetails() {
  const session = await verifySession()
  if (!session?.userId) {
    return null
  }

  try {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, session.userId),
      columns: {
        id: true,
        email: true,
        name: true,
        role: true,
        designation: true,
      },
    })
    return user
  } catch (error) {
    console.error("Error fetching user details:", error)
    return null
  }
}

export async function getUserReports() {
  const session = await verifySession()
  if (!session?.userId) {
    return { accounting: [], manufacturing: [] }
  }

  try {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, session.userId),
      with: {
        userReports: {
          with: {
            report: true,
          },
        },
      },
    })

    if (!user) {
      return { accounting: [], manufacturing: [] }
    }

    const accountingReports = user.userReports.filter((ur) => ur.report.type === "Accounting").map((ur) => ur.report)
    const manufacturingReports = user.userReports
      .filter((ur) => ur.report.type === "Manufacturing")
      .map((ur) => ur.report)

    return { accounting: accountingReports, manufacturing: manufacturingReports }
  } catch (error) {
    console.error("Error fetching user reports:", error)
    return { accounting: [], manufacturing: [] }
  }
}

export async function getReportByPowerBiId(powerBiReportId: string) {
  const session = await verifySession()
  if (!session?.userId) {
    return null
  }

  try {
    const report = await db.query.reports.findFirst({
      where: (reports, { eq }) => eq(reports.power_bi_report_id, powerBiReportId),
    })

    // Optional: Add logic to check if the current user has access to this specific report
    // This would involve checking the user's role or specific user-report assignments.
    // For now, we assume if authenticated, they can view any report by ID.

    return report
  } catch (error) {
    console.error("Error fetching report by Power BI ID:", error)
    return null
  }
}
