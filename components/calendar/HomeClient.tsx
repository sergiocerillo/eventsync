"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import EventCard from "@/components/calendar/EventCard"
import HeroCard from "@/components/calendar/HeroCard"
import type { SerializedEvent } from "@/types"

const MONTHS_PT = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho",
                   "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"]
type Filter = "all" | "CONFIRMED" | "DRAFT"

export default function HomeClient({ initialEvents }: { initialEvents: SerializedEvent[] }) {
  const [filter, setFilter] = useState<Filter>("all")
  const now = new Date()

  const filtered = useMemo(() =>
    filter === "all" ? initialEvents : initialEvents.filter((e) => e.status === filter),
    [initialEvents, filter]
  )

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "CONFIRMED", label: "Confirmados" },
    { key: "DRAFT", label: "Rascunhos" },
  ]

  return (
    <div style={{ padding: "28px 32px", maxWidth: "1280px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--cream)" }}>
            {MONTHS_PT[now.getMonth()]} {now.getFullYear()}
          </h1>
          <p style={{ fontSize: "13px", color: "var(--sage)", marginTop: "3px" }}>
            {initialEvents.length} evento{initialEvents.length !== 1 ? "s" : ""} este mês
          </p>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          {filters.map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: "7px 16px", borderRadius: "8px", fontSize: "12px",
              fontWeight: filter === f.key ? 500 : 400,
              background: filter === f.key ? "var(--brown)" : "transparent",
              color: filter === f.key ? "var(--cream)" : "var(--sage)",
              border: filter === f.key ? "none" : "1px solid rgba(162,123,92,0.2)",
              cursor: "pointer", fontFamily: "var(--font)", transition: "all 0.15s",
            }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div style={{
          textAlign: "center", padding: "80px 24px",
          background: "var(--dark)", borderRadius: "20px",
          border: "1px solid rgba(162,123,92,0.12)",
        }}>
          <p style={{ fontSize: "16px", fontWeight: 500, color: "var(--cream)", marginBottom: "8px" }}>
            Nenhum evento encontrado
          </p>
          <p style={{ fontSize: "13px", color: "var(--sage)", marginBottom: "24px" }}>
            Cadastre seu primeiro evento para ver ele aqui.
          </p>
          <Link href="/events/new" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "var(--brown)", color: "var(--cream)", borderRadius: "10px",
            padding: "10px 22px", fontSize: "14px", fontWeight: 500,
          }}>
            + Novo Evento
          </Link>
        </div>
      )}

      {filtered.length > 0 && <HeroCard event={filtered[0]} />}

      {filtered.length > 0 && (
        <>
          <div style={{ margin: "24px 0 16px" }}>
            <span style={{ fontSize: "12px", color: "var(--sage)", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 500 }}>
              Todos os eventos
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
            {filtered.map((event) => <EventCard key={event.id} event={event} />)}
            <Link href="/events/new" style={{
              background: "transparent", border: "2px dashed rgba(162,123,92,0.2)",
              borderRadius: "16px", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", minHeight: "260px",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(162,123,92,0.45)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(162,123,92,0.2)")}
            >
              <div style={{
                width: "44px", height: "44px", borderRadius: "50%",
                background: "rgba(162,123,92,0.1)", border: "1px solid rgba(162,123,92,0.22)",
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A27B5C" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </div>
              <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--brown)" }}>Novo evento</span>
              <span style={{ fontSize: "11px", color: "var(--sage)", marginTop: "4px" }}>Clique para cadastrar</span>
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
