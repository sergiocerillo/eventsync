export const dynamic = "force-dynamic"
export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { updateGoogleCalendarEvent, deleteGoogleCalendarEvent } from "@/lib/google-calendar"

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  const event = await prisma.event.findUnique({ where: { id: params.id } })
  if (!event || event.userId !== session.user.id) return NextResponse.json({ error: "Não encontrado" }, { status: 404 })
  return NextResponse.json(event)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  const existing = await prisma.event.findUnique({ where: { id: params.id } })
  if (!existing || existing.userId !== session.user.id) return NextResponse.json({ error: "Não encontrado" }, { status: 404 })

  const body = await req.json()
  const { title, date, startTime, location, locationAddress, description, imageBase64 } = body

  if (imageBase64 && imageBase64.length > 3_000_000) {
    return NextResponse.json({ error: "Imagem muito grande." }, { status: 400 })
  }

  const updated = await prisma.event.update({
    where: { id: params.id },
    data: {
      title: title !== undefined ? title : existing.title,
      date: date ? new Date(date) : existing.date,
      startTime: startTime !== undefined ? startTime : existing.startTime,
      location: location !== undefined ? location : existing.location,
      locationAddress: locationAddress !== undefined ? locationAddress : existing.locationAddress,
      description: description !== undefined ? description : existing.description,
      imageData: imageBase64 !== undefined ? imageBase64 : existing.imageData,
    },
  })

  if (existing.googleEventId) {
    try { await updateGoogleCalendarEvent(session.user.id, existing.googleEventId, updated) }
    catch (err) { console.error("Google Calendar update error:", err) }
  }

  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  const existing = await prisma.event.findUnique({ where: { id: params.id } })
  if (!existing || existing.userId !== session.user.id) return NextResponse.json({ error: "Não encontrado" }, { status: 404 })

  if (existing.googleEventId) {
    try { await deleteGoogleCalendarEvent(session.user.id, existing.googleEventId) }
    catch (err) { console.error("Google Calendar delete error:", err) }
  }

  await prisma.event.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
