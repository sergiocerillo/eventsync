export const dynamic = "force-dynamic"

import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import EventForm from "@/components/events/EventForm"
import Link from "next/link"

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const event = await prisma.event.findUnique({ where: { id: params.id } })
  if (!event || event.userId !== session.user.id) notFound()

  const initialData = {
    title: event.title ?? "",
    date: event.date ? event.date.toISOString().split("T")[0] : "",
    startTime: event.startTime ?? "",
    location: event.location ?? "",
    locationAddress: event.locationAddress ?? "",
    description: event.description ?? "",
    imageData: event.imageData ?? "",
  }

  return (
    <div style={{ padding: "32px", maxWidth: "720px", margin: "0 auto" }}>
      <Link href={`/events/${params.id}`} style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        fontSize: "13px", color: "var(--sage)", marginBottom: "24px",
      }}>
        ← Voltar
      </Link>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--cream)", marginBottom: "6px" }}>
          Editar Evento
        </h1>
        <p style={{ fontSize: "14px", color: "var(--sage)" }}>
          As alterações serão sincronizadas com o Google Agenda.
        </p>
      </div>
      <EventForm initialData={initialData} eventId={params.id} />
    </div>
  )
}
