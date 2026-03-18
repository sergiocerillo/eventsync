export const dynamic = "force-dynamic"
export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createGoogleCalendarEvent } from "@/lib/google-calendar"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const month = searchParams.get("month")
  const year = searchParams.get("year")
  const where: any = { userId: session.user.id }

  if (month && year) {
    const start = new Date(parseInt(year), parseInt(month) - 1, 1)
    const end = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59)
    where.date = { gte: start, lte: end }
  }

  const events = await prisma.event.findMany({ where, orderBy: { date: "asc" } })
  return NextResponse.json(events)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  const body = await req.json()
  const { title, date, startTime, location, locationAddress, description, imageBase64 } = body

  if (imageBase64 && imageBase64.length > 3_000_000) {
    return NextResponse.json({ error: "Imagem muito grande. Use uma menor que 2MB." }, { status: 400 })
  }

  const event = await prisma.event.create({
    data: {
      title: title || null,
      date: date ? new Date(date) : null,
      startTime: startTime || null,
      endTime: "23:30",
      location: location || null,
      locationAddress: locationAddress || null,
      description: description || null,
      imageData: imageBase64 || null,
      status: "DRAFT",
      userId: session.user.id,
    },
  })

  try {
    const googleEventId = await createGoogleCalendarEvent(session.user.id, event)
    const synced = await prisma.event.update({
      where: { id: event.id },
      data: { googleEventId, status: "CONFIRMED", syncedAt: new Date() },
    })
    return NextResponse.json(synced, { status: 201 })
  } catch (err) {
    console.error("Google Calendar error:", err)
    return NextResponse.json(
      { ...event, syncWarning: "Evento salvo, mas não foi possível sincronizar com o Google Agenda." },
      { status: 201 }
    )
  }
}
