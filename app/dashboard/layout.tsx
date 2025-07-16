import type React from "react"
import { redirect } from "next/navigation"
import { getUserDetails, getUserReports } from "@/lib/actions" // Import getUserReports
import { Suspense } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarRail,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuBadge,
} from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SearchForm } from "@/components/search-form"
import { Home, Settings, Users, FileText, ChevronDown, BookOpen, Factory } from "lucide-react"
import Link from "next/link"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUserDetails()
  const userReports = await getUserReports() // Fetch user reports here

  if (!user) {
    redirect("/login")
  }

  const accountingReportsCount = userReports.accounting.length
  const manufacturingReportsCount = userReports.manufacturing.length

  return (
    <>
      <Sidebar>
        <DashboardHeader user={user} />
        <SidebarContent>
          <SearchForm />
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard">
                      <Home />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <Collapsible defaultOpen className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        <FileText />
                        <span>Reports</span>
                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {userReports.accounting.length > 0 && (
                          <SidebarMenuSubItem>
                            <Collapsible defaultOpen className="group/collapsible">
                              <CollapsibleTrigger asChild>
                                <SidebarMenuSubButton size="sm">
                                  <BookOpen className="text-blue-400" />
                                  <span>Accounting Reports</span>
                                  <SidebarMenuBadge>{accountingReportsCount}</SidebarMenuBadge>
                                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                </SidebarMenuSubButton>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <SidebarMenuSub>
                                  {userReports.accounting.map((report) => (
                                    <SidebarMenuSubItem key={report.id}>
                                      <SidebarMenuSubButton asChild size="sm">
                                        <Link href={`/report/${report.power_bi_report_id}`}>
                                          <span>{report.title}</span>
                                        </Link>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  ))}
                                </SidebarMenuSub>
                              </CollapsibleContent>
                            </Collapsible>
                          </SidebarMenuSubItem>
                        )}
                        {userReports.manufacturing.length > 0 && (
                          <SidebarMenuSubItem>
                            <Collapsible defaultOpen className="group/collapsible">
                              <CollapsibleTrigger asChild>
                                <SidebarMenuSubButton size="sm">
                                  <Factory className="text-green-400" />
                                  <span>Manufacturing Reports</span>
                                  <SidebarMenuBadge>{manufacturingReportsCount}</SidebarMenuBadge>
                                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                </SidebarMenuSubButton>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <SidebarMenuSub>
                                  {userReports.manufacturing.map((report) => (
                                    <SidebarMenuSubItem key={report.id}>
                                      <SidebarMenuSubButton asChild size="sm">
                                        <Link href={`/report/${report.power_bi_report_id}`}>
                                          <span>{report.title}</span>
                                        </Link>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  ))}
                                </SidebarMenuSub>
                              </CollapsibleContent>
                            </Collapsible>
                          </SidebarMenuSubItem>
                        )}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard/users">
                      <Users />
                      <span>Users</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard/settings">
                      <Settings />
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Suspense fallback={<div>Loading...</div>}>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </Suspense>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </>
  )
}
