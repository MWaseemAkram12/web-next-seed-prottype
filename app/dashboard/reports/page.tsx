import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserReports } from "@/lib/actions"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import React from "react"

export default async function ReportsPage() {
  const { accounting, manufacturing } = await getUserReports()

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Reports", isPage: true },
  ]

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={item.label}>
              <BreadcrumbItem>
                {item.href ? (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold tracking-tight">All Reports</h1>
      <p className="text-muted-foreground">Browse and access all available Power BI reports.</p>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Accounting Reports</CardTitle>
            <CardDescription>Reports related to financial data and accounting operations.</CardDescription>
          </CardHeader>
          <CardContent>
            {accounting.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2">
                {accounting.map((report) => (
                  <li key={report.id}>
                    <Link href={`/report/${report.power_bi_report_id}`} className="text-blue-500 hover:underline">
                      {report.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No accounting reports available.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manufacturing Reports</CardTitle>
            <CardDescription>Reports related to production, inventory, and manufacturing processes.</CardDescription>
          </CardHeader>
          <CardContent>
            {manufacturing.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2">
                {manufacturing.map((report) => (
                  <li key={report.id}>
                    <Link href={`/report/${report.power_bi_report_id}`} className="text-blue-500 hover:underline">
                      {report.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No manufacturing reports available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
