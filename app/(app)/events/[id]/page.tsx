export const dynamic = "force-dynamic"

import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import EventDetailClient from "@/components/events/EventDetailClient"

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const event = await prisma.event.findUnique({ where: { id: params.id } })
  if (!event || event.userId !== session.user.id) notFound()

  const serialized = {
    ...event,
    date: event.date?.toISOString() ?? null,
    syncedAt: event.syncedAt?.toISOString() ?? null,
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
  }

  return <EventDetailClient event={serialized} />
}
