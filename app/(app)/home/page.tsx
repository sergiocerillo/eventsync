export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import HomeClient from "@/components/calendar/HomeClient"

export default async function HomePage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const userId = session.user.id
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

  const events = await prisma.event.findMany({
    where: { userId, date: { gte: start, lte: end } },
    orderBy: { date: "asc" },
  })

  const serialized = events.map((e) => ({
    ...e,
    date: e.date?.toISOString() ?? null,
    syncedAt: e.syncedAt?.toISOString() ?? null,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
  }))

  return <HomeClient initialEvents={serialized} />
}
