"use client"

import Link from "next/link"
import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { SerializedEvent } from "@/types"

export default function EventCard({ event }: { event: SerializedEvent }) {
  const [hovered, setHovered] = useState(false)
  const day = event.date ? format(new Date(event.date), "d") : "—"
  const month = event.date ? format(new Date(event.date), "MMM", { locale: ptBR }) : "—"
  const monthCap = month.charAt(0).toUpperCase() + month.slice(1)
  const isSynced = event.status === "CONFIRMED"

  return (
    <Link href={`/events/${event.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        background: "var(--dark)",
        border: `1px solid ${hovered ? "rgba(162,123,92,0.35)" : "rgba(162,123,92,0.12)"}`,
        borderRadius: "16px", overflow: "hidden", cursor: "pointer",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "transform 0.18s, border-color 0.18s",
      }}>
        <div style={{ position: "relative", height: "170px", overflow: "hidden", background: "#0a0a0a" }}>
          {event.imageData ? (
            <img src={event.imageData} alt={event.title ?? ""} style={{
              width: "100%", height: "100%", objectFit: "cover", display: "block",
              transform: hovered ? "scale(1.05)" : "scale(1)", transition: "transform 0.3s",
            }} />
          ) : (
            <div style={{
              width: "100%", height: "100%",
              background: "linear-gradient(135deg, #0f0a06 0%, #2a1508 50%, #3d2010 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: "32px", fontWeight: 700, color: "rgba(220,215,201,0.06)", letterSpacing: "-1px" }}>
                {(event.title ?? "E").substring(0, 6).toUpperCase()}
              </span>
            </div>
          )}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(30,32,30,0.9) 0%, transparent 55%)",
          }} />
          <div style={{
            position: "absolute", top: "12px", left: "12px",
            background: "rgba(15,14,14,0.78)", border: "1px solid rgba(162,123,92,0.22)",
            borderRadius: "8px", padding: "5px 9px", textAlign: "center", minWidth: "42px",
          }}>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--cream)", lineHeight: 1 }}>{day}</div>
            <div style={{ fontSize: "10px", color: "var(--brown)", textTransform: "uppercase" }}>{monthCap}</div>
          </div>
          {isSynced && (
            <div style={{
              position: "absolute", top: "12px", right: "12px",
              width: "26px", height: "26px", borderRadius: "50%",
              background: "rgba(162,123,92,0.85)", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
          )}
        </div>
        <div style={{ padding: "12px 14px 14px" }}>
          <p style={{
            fontSize: "14px", fontWeight: 700, color: "var(--cream)",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "4px",
          }}>
            {event.title ?? "(Sem título)"}
          </p>
          <p style={{
            fontSize: "12px", color: "var(--sage)",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            display: "flex", alignItems: "center", gap: "4px",
          }}>
            {event.location && (
              <>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                </svg>
                {event.location}
              </>
            )}
          </p>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginTop: "10px", paddingTop: "10px", borderTop: "1px solid rgba(162,123,92,0.08)",
          }}>
            <span style={{
              fontSize: "11px", padding: "3px 10px", borderRadius: "20px",
              background: isSynced ? "rgba(162,123,92,0.14)" : "rgba(105,117,101,0.14)",
              color: isSynced ? "var(--brown)" : "var(--sage)",
            }}>
              {isSynced ? "● Sincronizado" : "○ Rascunho"}
            </span>
            <span style={{ fontSize: "11px", color: "var(--brown)", fontWeight: 500 }}>
              {event.startTime ? event.startTime.replace(":", "h") : "—"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
