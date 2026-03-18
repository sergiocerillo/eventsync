export const dynamic = "force-dynamic"

import EventForm from "@/components/events/EventForm"

export default function NewEventPage() {
  return (
    <div style={{ padding: "32px", maxWidth: "720px", margin: "0 auto" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--cream)", marginBottom: "6px" }}>
          Novo Evento
        </h1>
        <p style={{ fontSize: "14px", color: "var(--sage)" }}>
          Após salvar, o evento é sincronizado automaticamente com o seu Google Agenda.
        </p>
      </div>
      <EventForm />
    </div>
  )
}
