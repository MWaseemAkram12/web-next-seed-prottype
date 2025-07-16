import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserDetails, getUserReports } from "@/lib/actions"
import { BarChart3, FileText, Users, DollarSign, CreditCard, Activity } from "lucide-react"
import Link from "next/link"
import { User2 } from "lucide-react"

export default async function DashboardPage() {
  const user = await getUserDetails()
  const { accounting, manufacturing } = await getUserReports()

  const totalReports = accounting.length + manufacturing.length

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Welcome</CardTitle>
          <User2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{user?.name || "Guest"}</div>
          <p className="text-xs text-muted-foreground">{user?.designation || "No designation"}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalReports}</div>
          <p className="text-xs text-muted-foreground">
            {accounting.length} Accounting, {manufacturing.length} Manufacturing
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">User Role</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{user?.role || "N/A"}</div>
          <p className="text-xs text-muted-foreground">Your current access level</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Quick Access</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Reports</div>
          <p className="text-xs text-muted-foreground">
            <Link href="/dashboard/reports" className="text-blue-500 hover:underline">
              View all reports
            </Link>
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$45,231.89</div>
          <p className="text-xs text-muted-foreground">+20.1% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+2350</div>
          <p className="text-xs text-muted-foreground">+180.1% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sales</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+12,234</div>
          <p className="text-xs text-muted-foreground">+19% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Now</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+573</div>
          <p className="text-xs text-muted-foreground">+201 since last hour</p>
        </CardContent>
      </Card>
      <div className="col-span-full grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Accounting Reports</CardTitle>
            <CardDescription>Reports related to financial data.</CardDescription>
          </CardHeader>
          <CardContent>
            {accounting.length > 0 ? (
              <ul className="list-disc pl-5">
                {accounting.map((report) => (
                  <li key={report.id}>
                    <Link href={`/report/${report.power_bi_report_id}`} className="text-blue-500 hover:underline">
                      {report.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No accounting reports available.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Manufacturing Reports</CardTitle>
            <CardDescription>Reports related to production and operations.</CardDescription>
          </CardHeader>
          <CardContent>
            {manufacturing.length > 0 ? (
              <ul className="list-disc pl-5">
                {manufacturing.map((report) => (
                  <li key={report.id}>
                    <Link href={`/report/${report.power_bi_report_id}`} className="text-blue-500 hover:underline">
                      {report.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No manufacturing reports available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
