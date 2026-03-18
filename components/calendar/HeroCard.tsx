"use client"

import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { SerializedEvent } from "@/types"

export default function HeroCard({ event }: { event: SerializedEvent }) {
  const dateLabel = event.date
    ? format(new Date(event.date), "EEEE, d 'de' MMMM", { locale: ptBR })
    : null
  const dateCap = dateLabel
    ? dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1)
    : null

  return (
    <div style={{ position: "relative", borderRadius: "20px", overflow: "hidden", height: "320px", marginBottom: "8px" }}>
      {event.imageData ? (
        <img src={event.imageData} alt={event.title ?? ""} style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", filter: "brightness(0.48)",
        }} />
      ) : (
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, #1a1008 0%, #3d2010 40%, #5c3a1a 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: "72px", fontWeight: 700, color: "rgba(220,215,201,0.05)", letterSpacing: "-3px" }}>
            {(event.title ?? "EVENTO").substring(0, 8).toUpperCase()}
          </span>
        </div>
      )}

      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(15,14,14,0.96) 0%, rgba(15,14,14,0.2) 55%, transparent 100%)",
      }} />

      <div style={{
        position: "absolute", top: "20px", left: "20px",
        background: "var(--brown)", color: "var(--cream)",
        fontSize: "10px", fontWeight: 700, letterSpacing: "1px",
        textTransform: "uppercase", padding: "4px 14px", borderRadius: "20px",
      }}>
        ✦ Destaque do mês
      </div>

      {event.status === "CONFIRMED" && (
        <div style={{
          position: "absolute", top: "20px", right: "20px",
          background: "rgba(162,123,92,0.85)", color: "var(--cream)",
          fontSize: "10px", fontWeight: 600, padding: "4px 12px", borderRadius: "20px",
          display: "flex", alignItems: "center", gap: "5px",
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Google Agenda
        </div>
      )}

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 28px" }}>
        {dateCap && (
          <p style={{ fontSize: "12px", color: "rgba(220,215,201,0.6)", marginBottom: "6px" }}>
            {dateCap}{event.startTime ? ` · ${event.startTime.replace(":", "h")}` : ""}
          </p>
        )}
        <h2 style={{ fontSize: "26px", fontWeight: 700, color: "var(--cream)", marginBottom: "6px", lineHeight: 1.1 }}>
          {event.title ?? "(Sem título)"}
        </h2>
        {event.location && (
          <p style={{ fontSize: "13px", color: "rgba(220,215,201,0.55)", display: "flex", alignItems: "center", gap: "5px" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            </svg>
            {event.location}
          </p>
        )}
      </div>

      <div style={{ position: "absolute", bottom: "24px", right: "28px" }}>
        <Link href={`/events/${event.id}`} style={{
          background: "rgba(220,215,201,0.12)", border: "1px solid rgba(220,215,201,0.2)",
          color: "var(--cream)", borderRadius: "8px", padding: "8px 16px", fontSize: "12px",
        }}>
          Ver detalhes
        </Link>
      </div>
    </div>
  )
}
