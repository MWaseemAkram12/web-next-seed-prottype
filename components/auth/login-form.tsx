"use client"

import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/lib/actions"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation" // Import useRouter

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Logging in..." : "Login"}
    </Button>
  )
}

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter() // Initialize useRouter

  const handleSubmit = async (formData: FormData) => {
    setError(null) // Clear previous errors
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
    } else if (result?.redirectPath) {
      router.push(result.redirectPath) // Perform client-side redirect
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-50">
      <div className="mx-auto w-[350px] space-y-6 p-6 rounded-lg shadow-lg bg-gray-900">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-white">WebSeed Login</h1>
          <p className="text-gray-400">Enter your email and password to access your account</p>
        </div>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
              className="bg-gray-800 border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="ml-auto inline-block text-sm underline text-blue-400 hover:text-blue-300"
              >
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="bg-gray-800 border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <SubmitButton />
        </form>
      </div>
    </div>
  )
}
