"use client"

import { usePathname, useRouter } from "next/navigation"
import { useTransition } from "react"
import { User2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { logout } from "@/lib/actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import React from "react"

interface DashboardHeaderProps {
  breadcrumbItems?: {
    label: string
    href?: string
    isPage?: boolean
  }[]
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  } | null
}

export function DashboardHeader({ breadcrumbItems, user }: DashboardHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(async () => {
      const result = await logout()
      if (result?.success && result.redirectPath) {
        router.push(result.redirectPath)
      } else {
        console.error("Logout failed:", result?.error)
        // Optionally show a toast notification for error
      }
    })
  }

  // Dynamically update the last breadcrumb item based on the current path
  const dynamicBreadcrumbItems =
    breadcrumbItems?.map((item) => {
      if (item.isPage) {
        // For dynamic pages like /report/[id], we need to get the actual title
        if (pathname.startsWith("/report/") && item.label === "Loading Report...") {
          // This case is handled by the ReportDetailPage itself,
          // so we'll just return the placeholder or let the page handle its own breadcrumbs.
          // For a more robust solution, you'd fetch the report title here or pass it down.
          return { ...item, label: "Report Details" } // Placeholder
        }
      }
      return item
    }) || []

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <Breadcrumb>
        <BreadcrumbList>
          {dynamicBreadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {item.href && !item.isPage ? (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {index < dynamicBreadcrumbItems.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.image || "/placeholder-user.jpg"} alt={user?.name || "User"} />
                <AvatarFallback>{user?.name ? user.name.charAt(0) : <User2 className="h-4 w-4" />}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {user?.name || "User"}
              {user?.email && <div className="text-xs text-muted-foreground">{user.email}</div>}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} disabled={isPending}>
              {isPending ? "Logging out..." : "Logout"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
