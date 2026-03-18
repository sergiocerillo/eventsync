"use client"

import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const MONTHS_SHORT = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"]

interface Props {
  metrics: { total: number; thisMonth: number; synced: number; draft: number }
  monthCounts: number[]
  upcoming: Array<{
    id: string; title: string | null; date: string | null
    startTime: string | null; location: string | null; imageData: string | null; status: string
  }>
  currentMonth: number
}

export default function DashboardClient({ metrics, monthCounts, upcoming, currentMonth }: Props) {
  const maxCount = Math.max(...monthCounts, 1)
  const cards = [
    { label: "Total de eventos", value: metrics.total, sub: "cadastrados" },
    { label: "Este mês", value: metrics.thisMonth, sub: "no mês atual" },
    { label: "Sincronizados", value: metrics.synced, sub: "no Google Agenda" },
    { label: "Rascunhos", value: metrics.draft, sub: "pendentes" },
  ]

  return (
    <div style={{ padding: "28px 32px", maxWidth: "1280px", margin: "0 auto" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--cream)" }}>Dashboard</h1>
        <p style={{ fontSize: "13px", color: "var(--sage)", marginTop: "4px" }}>Visão geral dos seus eventos</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "28px" }}>
        {cards.map((c) => (
          <div key={c.label} style={{
            background: "var(--dark)", border: "1px solid rgba(162,123,92,0.15)",
            borderRadius: "14px", padding: "20px 22px",
          }}>
            <p style={{ fontSize: "11px", color: "var(--sage)", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: "10px" }}>{c.label}</p>
            <p style={{ fontSize: "32px", fontWeight: 700, color: "var(--cream)", lineHeight: 1 }}>{c.value}</p>
            <p style={{ fontSize: "12px", color: "var(--sage)", marginTop: "6px" }}>{c.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px", alignItems: "start" }}>
        <div style={{ background: "var(--dark)", border: "1px solid rgba(162,123,92,0.15)", borderRadius: "16px", padding: "24px" }}>
          <p style={{ fontSize: "11px", color: "var(--sage)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "24px", fontWeight: 500 }}>
            Eventos por mês — {new Date().getFullYear()}
          </p>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", height: "160px" }}>
            {monthCounts.map((count, i) => {
              const h = count > 0 ? Math.max((count / maxCount) * 140, 8) : 6
              const isCurr = i === currentMonth
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                  {count > 0 && (
                    <span style={{ fontSize: "11px", color: isCurr ? "var(--brown)" : "var(--sage)", fontWeight: isCurr ? 700 : 400 }}>
                      {count}
                    </span>
                  )}
                  <div style={{
                    width: "100%", height: `${h}px`,
                    background: isCurr ? "var(--brown)" : count > 0 ? "rgba(162,123,92,0.35)" : "rgba(105,117,101,0.15)",
                    borderRadius: "4px 4px 0 0",
                  }} />
                  <span style={{
                    fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.3px",
                    color: isCurr ? "var(--cream)" : "var(--sage)", fontWeight: isCurr ? 700 : 400,
                  }}>
                    {MONTHS_SHORT[i]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ background: "var(--dark)", border: "1px solid rgba(162,123,92,0.15)", borderRadius: "16px", padding: "20px" }}>
          <p style={{ fontSize: "11px", color: "var(--sage)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "16px", fontWeight: 500 }}>
            Próximos eventos
          </p>
          {upcoming.length === 0 ? (
            <p style={{ fontSize: "13px", color: "var(--sage)", textAlign: "center", padding: "20px 0" }}>
              Nenhum evento futuro
            </p>
          ) : (
            upcoming.map((ev, i) => {
              const d = ev.date ? new Date(ev.date) : null
              const day = d ? format(d, "d") : "—"
              const month = d ? format(d, "MMM", { locale: ptBR }) : "—"
              const mCap = month.charAt(0).toUpperCase() + month.slice(1)
              return (
                <Link key={ev.id} href={`/events/${ev.id}`} style={{
                  display: "flex", alignItems: "center", gap: "12px", padding: "12px 0",
                  borderBottom: i < upcoming.length - 1 ? "1px solid rgba(162,123,92,0.08)" : "none",
                }}>
                  <div style={{ textAlign: "center", minWidth: "38px" }}>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--brown)", lineHeight: 1 }}>{day}</div>
                    <div style={{ fontSize: "10px", color: "var(--sage)", textTransform: "capitalize" }}>{mCap}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: "13px", fontWeight: 500, color: "var(--cream)",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "2px",
                    }}>
                      {ev.title ?? "(Sem título)"}
                    </p>
                    <p style={{ fontSize: "11px", color: "var(--sage)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {ev.location ?? "—"}{ev.startTime ? ` · ${ev.startTime.replace(":", "h")}` : ""}
                    </p>
                  </div>
                  {ev.imageData ? (
                    <img src={ev.imageData} alt="" style={{ width: "40px", height: "40px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }} />
                  ) : (
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "8px",
                      background: "rgba(162,123,92,0.12)", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#697565" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/>
                        <path d="M21 15l-5-5L5 21"/>
                      </svg>
                    </div>
                  )}
                </Link>
              )
            })
          )}
          <Link href="/home" style={{
            display: "block", textAlign: "center", marginTop: "14px",
            paddingTop: "14px", borderTop: "1px solid rgba(162,123,92,0.1)",
            fontSize: "12px", color: "var(--brown)",
          }}>
            Ver todos os eventos →
          </Link>
        </div>
      </div>
    </div>
  )
}
