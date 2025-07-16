import React from "react"
import { getReportByPowerBiId } from "@/lib/actions"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link"

interface ReportPageProps {
  params: {
    id: string
  }
}

export default async function ReportPage({ params }: ReportPageProps) {
  const report = await getReportByPowerBiId(params.id)

  if (!report) {
    notFound()
  }

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Reports", href: "/dashboard/reports" },
    { label: report.title, href: `/report/${report.power_bi_report_id}` },
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

      <Card className="flex-1">
        <CardHeader>
          <CardTitle>{report.title}</CardTitle>
          <CardDescription>{report.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
            {" "}
            {/* 16:9 Aspect Ratio */}
            <iframe
              title={report.title}
              width="100%"
              height="100%"
              src={`https://app.powerbi.com/reportEmbed?reportId=${report.power_bi_report_id}&autoAuth=true&ctid=${process.env.NEXT_PUBLIC_POWER_BI_TENANT_ID}`}
              frameBorder="0"
              allowFullScreen={true}
              className="absolute top-0 left-0 w-full h-full"
            ></iframe>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
