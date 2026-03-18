export const dynamic = "force-dynamic"
export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createGoogleCalendarEvent } from "@/lib/google-calendar"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  const { eventId } = await req.json()
  const event = await prisma.event.findUnique({ where: { id: eventId } })
  if (!event || event.userId !== session.user.id) return NextResponse.json({ error: "Não encontrado" }, { status: 404 })
  if (event.googleEventId) return NextResponse.json({ message: "Já sincronizado." })

  const googleEventId = await createGoogleCalendarEvent(session.user.id, event)
  const updated = await prisma.event.update({
    where: { id: eventId },
    data: { googleEventId, status: "CONFIRMED", syncedAt: new Date() },
  })
  return NextResponse.json(updated)
}
