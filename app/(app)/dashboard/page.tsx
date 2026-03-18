export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import DashboardClient from "@/components/dashboard/DashboardClient"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const userId = session.user.id
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
  const startOfYear = new Date(now.getFullYear(), 0, 1)

  const [total, thisMonth, synced, draft, upcoming, byMonth] = await Promise.all([
    prisma.event.count({ where: { userId } }),
    prisma.event.count({ where: { userId, date: { gte: startOfMonth, lte: endOfMonth } } }),
    prisma.event.count({ where: { userId, status: "CONFIRMED" } }),
    prisma.event.count({ where: { userId, status: "DRAFT" } }),
    prisma.event.findMany({
      where: { userId, date: { gte: now } },
      orderBy: { date: "asc" },
      take: 5,
      select: { id: true, title: true, date: true, startTime: true, location: true, imageData: true, status: true },
    }),
    prisma.event.findMany({
      where: { userId, date: { gte: startOfYear } },
      select: { date: true },
    }),
  ])

  const monthCounts = Array(12).fill(0)
  byMonth.forEach((e) => { if (e.date) monthCounts[e.date.getMonth()]++ })

  const serializedUpcoming = upcoming.map((e) => ({
    ...e,
    date: e.date?.toISOString() ?? null,
  }))

  return (
    <DashboardClient
      metrics={{ total, thisMonth, synced, draft }}
      monthCounts={monthCounts}
      upcoming={serializedUpcoming}
      currentMonth={now.getMonth()}
    />
  )
}
