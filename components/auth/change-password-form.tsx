"use client"

import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { changePassword } from "@/lib/actions"
import { useState } from "react"
import { useRouter } from "next/navigation" // Import useRouter

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Changing Password..." : "Change Password"}
    </Button>
  )
}

export function ChangePasswordForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter() // Initialize useRouter

  const handleSubmit = async (formData: FormData) => {
    setError(null)
    setSuccess(null)
    const result = await changePassword(formData)
    if (result?.error) {
      setError(result.error)
    } else if (result?.redirectPath) {
      setSuccess("Password changed successfully! Redirecting to dashboard...")
      // Use a small delay to allow the success message to be seen before redirecting
      setTimeout(() => {
        router.push(result.redirectPath) // Perform client-side redirect
      }, 1500) // Redirect after 1.5 seconds
    } else {
      setSuccess("Password changed successfully!") // Fallback if no redirectPath
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-50">
      <div className="mx-auto w-[400px] space-y-6 p-6 rounded-lg shadow-lg bg-gray-900">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-white">Change Your Password</h1>
          <p className="text-gray-400">Please update your temporary password to continue.</p>
        </div>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-gray-300">
              Current Password
            </Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              className="bg-gray-800 border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-gray-300">
              New Password
            </Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              className="bg-gray-800 border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-300">
              Confirm New Password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="bg-gray-800 border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && <p className="text-green-500 text-sm text-center">{success}</p>}
          <SubmitButton />
        </form>
      </div>
    </div>
  )
}
