"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import toast from "react-hot-toast"
import Link from "next/link"
import type { SerializedEvent } from "@/types"

export default function EventDetailClient({ event }: { event: SerializedEvent }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [syncing, setSyncing] = useState(false)

  const dateLabel = event.date
    ? format(new Date(event.date), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })
    : null
  const dateCap = dateLabel ? dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1) : null

  const handleDelete = async () => {
    if (!confirm("Deseja mesmo excluir este evento? Ele será removido do Google Agenda também.")) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/events/${event.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success("Evento excluído.")
      router.push("/home")
      router.refresh()
    } catch {
      toast.error("Não foi possível excluir.")
      setDeleting(false)
    }
  }

  const handleRetrySync = async () => {
    setSyncing(true)
    try {
      const res = await fetch("/api/google-calendar/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id }),
      })
      if (!res.ok) throw new Error()
      toast.success("Sincronizado com o Google Agenda!")
      router.refresh()
    } catch {
      toast.error("Não foi possível sincronizar.")
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div style={{ padding: "32px", maxWidth: "820px", margin: "0 auto" }}>
      <Link href="/home" style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        fontSize: "13px", color: "var(--sage)", marginBottom: "24px",
      }}>
        ← Voltar
      </Link>

      {event.imageData ? (
        <div style={{ borderRadius: "20px", overflow: "hidden", height: "340px", marginBottom: "28px", position: "relative" }}>
          <img src={event.imageData} alt={event.title ?? ""} style={{
            width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.65)",
          }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,14,14,0.9) 0%, transparent 60%)" }} />
          <div style={{ position: "absolute", bottom: "28px", left: "28px" }}>
            <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--cream)", marginBottom: "6px" }}>
              {event.title ?? "(Sem título)"}
            </h1>
            {dateCap && <p style={{ fontSize: "13px", color: "rgba(220,215,201,0.65)" }}>{dateCap}</p>}
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--cream)", marginBottom: "4px" }}>
            {event.title ?? "(Sem título)"}
          </h1>
          {dateCap && <p style={{ fontSize: "14px", color: "var(--sage)" }}>{dateCap}</p>}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "20px", alignItems: "start" }}>
        <div style={{ background: "var(--dark)", border: "1px solid rgba(162,123,92,0.15)", borderRadius: "16px", padding: "24px" }}>
          <InfoRow icon="📅" label="Data">{dateCap ?? "—"}</InfoRow>
          <InfoRow icon="🕐" label="Horário">
            {event.startTime ? `${event.startTime.replace(":", "h")} – ${event.endTime.replace(":", "h")}` : "—"}
          </InfoRow>
          <InfoRow icon="📍" label="Local">
            {event.location ?? "—"}
            {event.locationAddress && (
              <span style={{ display: "block", fontSize: "12px", color: "var(--sage)", marginTop: "3px" }}>
                {event.locationAddress}
              </span>
            )}
          </InfoRow>
          {event.description && <InfoRow icon="📝" label="Descrição">{event.description}</InfoRow>}
        </div>

        <div>
          <div style={{
            background: "var(--dark)", border: "1px solid rgba(162,123,92,0.15)",
            borderRadius: "16px", padding: "20px", marginBottom: "14px",
          }}>
            <p style={{ fontSize: "11px", color: "var(--sage)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "14px" }}>
              Status
            </p>
            <div style={{
              display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px", borderRadius: "10px",
              background: event.status === "CONFIRMED" ? "rgba(162,123,92,0.1)" : "rgba(105,117,101,0.1)",
              border: `1px solid ${event.status === "CONFIRMED" ? "rgba(162,123,92,0.25)" : "rgba(105,117,101,0.2)"}`,
            }}>
              <div style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: event.status === "CONFIRMED" ? "var(--brown)" : "var(--sage)",
              }} />
              <span style={{
                fontSize: "13px", fontWeight: 500,
                color: event.status === "CONFIRMED" ? "var(--brown)" : "var(--sage)",
              }}>
                {event.status === "CONFIRMED" ? "Sincronizado" : "Rascunho"}
              </span>
            </div>
            {event.status === "DRAFT" && (
              <button onClick={handleRetrySync} disabled={syncing} style={{
                width: "100%", marginTop: "12px", padding: "9px 0",
                background: "var(--brown)", border: "none", color: "var(--cream)",
                borderRadius: "8px", fontSize: "13px", fontWeight: 500,
                cursor: syncing ? "not-allowed" : "pointer", fontFamily: "var(--font)", opacity: syncing ? 0.6 : 1,
              }}>
                {syncing ? "Sincronizando..." : "🔄 Sincronizar agora"}
              </button>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Link href={`/events/${event.id}/edit`} style={{
              display: "block", textAlign: "center", padding: "10px",
              background: "transparent", border: "1px solid rgba(162,123,92,0.25)",
              color: "var(--cream)", borderRadius: "10px", fontSize: "13px",
            }}>
              ✏️ Editar evento
            </Link>
            <button onClick={handleDelete} disabled={deleting} style={{
              padding: "10px", background: "transparent",
              border: "1px solid rgba(220,85,85,0.25)", color: "rgba(220,85,85,0.8)",
              borderRadius: "10px", fontSize: "13px", cursor: deleting ? "not-allowed" : "pointer",
              fontFamily: "var(--font)", opacity: deleting ? 0.6 : 1,
            }}>
              {deleting ? "Excluindo..." : "🗑️ Excluir evento"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: "14px", marginBottom: "18px" }}>
      <span style={{ fontSize: "16px", width: "22px", flexShrink: 0, marginTop: "2px" }}>{icon}</span>
      <div>
        <p style={{ fontSize: "11px", color: "var(--sage)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "4px" }}>{label}</p>
        <p style={{ fontSize: "14px", color: "var(--cream)", lineHeight: 1.5 }}>{children}</p>
      </div>
    </div>
  )
}
