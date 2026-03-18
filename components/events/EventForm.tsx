"use client"

import { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { VENUES, TIME_SLOTS } from "@/types"

interface EventFormProps {
  initialData?: {
    title?: string; date?: string; startTime?: string
    location?: string; locationAddress?: string; description?: string; imageData?: string
  }
  eventId?: string
}

export default function EventForm({ initialData, eventId }: EventFormProps) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const isEdit = !!eventId

  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    date: initialData?.date ?? "",
    startTime: initialData?.startTime ?? "",
    location: initialData?.location ?? "",
    locationAddress: initialData?.locationAddress ?? "",
    description: initialData?.description ?? "",
  })
  const [imageBase64, setImageBase64] = useState<string | null>(initialData?.imageData ?? null)
  const [loading, setLoading] = useState(false)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      if (name === "location") {
        const venue = VENUES.find((v) => v.name === value)
        setForm((p) => ({ ...p, location: value, locationAddress: venue?.address ?? "" }))
      } else {
        setForm((p) => ({ ...p, [name]: value }))
      }
    }, []
  )

  const handleImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { toast.error("Imagem muito grande. Máx. 2MB."); return }
    const reader = new FileReader()
    reader.onload = (ev) => setImageBase64(ev.target?.result as string)
    reader.readAsDataURL(file)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(isEdit ? `/api/events/${eventId}` : "/api/events", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, imageBase64: imageBase64 ?? undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Erro ao salvar")
      if (data.syncWarning) {
        toast("Evento salvo! Não foi possível sincronizar agora.", { icon: "⚠️" })
      } else {
        toast.success(isEdit ? "Evento atualizado!" : `"${data.title ?? "Evento"}" sincronizado com o Google Agenda!`)
      }
      router.push(isEdit ? `/events/${eventId}` : "/home")
      router.refresh()
    } catch (err: any) {
      toast.error(err.message ?? "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  const previewDay = form.date ? new Date(form.date + "T12:00:00").getDate() : null
  const previewMonth = form.date ? new Date(form.date + "T12:00:00").toLocaleString("pt-BR", { month: "short" }) : null

  return (
    <form onSubmit={handleSubmit}>
      <div style={{
        display: "flex", alignItems: "center", gap: "12px",
        background: "rgba(162,123,92,0.07)", border: "1px solid rgba(162,123,92,0.18)",
        borderRadius: "12px", padding: "14px 18px", marginBottom: "24px",
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A27B5C" strokeWidth="1.5" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
        </svg>
        <p style={{ fontSize: "13px", color: "var(--sage)", lineHeight: 1.4 }}>
          <span style={{ color: "var(--cream)", fontWeight: 500 }}>Google Agenda conectado — </span>
          {isEdit ? "as alterações serão sincronizadas ao salvar." : "o evento será disparado automaticamente ao confirmar."}
        </p>
      </div>

      <div style={{ background: "var(--dark)", border: "1px solid rgba(162,123,92,0.15)", borderRadius: "18px", padding: "28px" }}>
        <SL>Informações do evento</SL>
        <FG label="Título">
          <input name="title" value={form.title} onChange={handleChange} placeholder="Ex: Show do Alok — Vibra SP" style={iS} />
        </FG>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <FG label="Data">
            <input name="date" type="date" value={form.date} onChange={handleChange} style={iS} />
          </FG>
          <FG label="Horário de início">
            <select name="startTime" value={form.startTime} onChange={handleChange} style={sS}>
              <option value="">Selecionar</option>
              {TIME_SLOTS.map((t) => <option key={t} value={t}>{t.replace(":", "h")}</option>)}
            </select>
          </FG>
        </div>
        <FG label="Local">
          <select name="location" value={form.location} onChange={handleChange} style={sS}>
            <option value="">Selecionar venue</option>
            {VENUES.map((v) => <option key={v.name} value={v.name}>{v.name}</option>)}
          </select>
        </FG>
        {form.locationAddress && (
          <p style={{ fontSize: "12px", color: "var(--sage)", marginTop: "-10px", marginBottom: "16px" }}>
            📍 {form.locationAddress}
          </p>
        )}

        <SL>Descrição</SL>
        <FG label="Descrição do evento">
          <textarea name="description" value={form.description} onChange={handleChange}
            placeholder="Detalhes, atrações, line-up..." rows={4}
            style={{ ...iS, resize: "vertical", lineHeight: 1.5 }} />
        </FG>

        <SL>Imagem do evento</SL>
        <p style={{ fontSize: "11px", color: "var(--sage)", marginBottom: "10px" }}>
          Máx. 2MB — armazenada diretamente no banco.
        </p>
        <div onClick={() => fileRef.current?.click()} style={{
          border: "2px dashed rgba(162,123,92,0.22)", borderRadius: "14px",
          overflow: "hidden", cursor: "pointer", transition: "border-color 0.2s",
        }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(162,123,92,0.5)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(162,123,92,0.22)")}
        >
          {imageBase64 ? (
            <div style={{ position: "relative" }}>
              <img src={imageBase64} alt="" style={{ width: "100%", height: "220px", objectFit: "cover", display: "block" }} />
              <div style={{
                position: "absolute", inset: 0, background: "rgba(15,14,14,0.45)",
                display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
              >
                <button type="button" onClick={(ev) => { ev.stopPropagation(); fileRef.current?.click() }}
                  style={{
                    background: "rgba(220,215,201,0.15)", border: "1px solid rgba(220,215,201,0.3)",
                    color: "var(--cream)", borderRadius: "8px", padding: "8px 18px",
                    fontSize: "13px", cursor: "pointer", fontFamily: "var(--font)",
                  }}>
                  Trocar imagem
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: "36px 20px", textAlign: "center" }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "12px",
                background: "rgba(162,123,92,0.12)", border: "1px solid rgba(162,123,92,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px",
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A27B5C" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M21 15l-5-5L5 21"/>
                </svg>
              </div>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--cream)", marginBottom: "4px" }}>
                Adicionar foto do artista / evento
              </p>
              <p style={{ fontSize: "12px", color: "var(--sage)" }}>PNG · JPG · WEBP — máx. 2MB</p>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />

        {(imageBase64 || form.title) && (
          <div style={{ marginTop: "24px" }}>
            <p style={{
              fontSize: "11px", color: "var(--sage)", textTransform: "uppercase",
              letterSpacing: "0.8px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px",
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--brown)", display: "inline-block" }}/>
              Preview do card
            </p>
            <div style={{
              background: "rgba(15,14,14,0.5)", border: "1px solid rgba(162,123,92,0.15)",
              borderRadius: "14px", overflow: "hidden", maxWidth: "240px",
            }}>
              <div style={{ position: "relative", height: "130px", overflow: "hidden", background: "#0a0a0a" }}>
                {imageBase64 ? (
                  <img src={imageBase64} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{
                    width: "100%", height: "100%", background: "linear-gradient(135deg,#0f0a06,#2a1508)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontSize: "28px", color: "rgba(220,215,201,0.06)", fontWeight: 700 }}>
                      {(form.title || "E").substring(0, 5).toUpperCase()}
                    </span>
                  </div>
                )}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(30,32,30,0.9) 0%,transparent 55%)" }} />
                {previewDay && (
                  <div style={{
                    position: "absolute", top: "10px", left: "10px",
                    background: "rgba(15,14,14,0.78)", border: "1px solid rgba(162,123,92,0.22)",
                    borderRadius: "7px", padding: "4px 8px", textAlign: "center",
                  }}>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--cream)", lineHeight: 1 }}>{previewDay}</div>
                    <div style={{ fontSize: "9px", color: "var(--brown)", textTransform: "capitalize" }}>{previewMonth}</div>
                  </div>
                )}
              </div>
              <div style={{ padding: "10px 12px 12px" }}>
                <p style={{
                  fontSize: "13px", fontWeight: 700, color: "var(--cream)", marginBottom: "3px",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {form.title || "Título do evento"}
                </p>
                <p style={{ fontSize: "11px", color: "var(--sage)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {form.location || "Local do evento"}
                </p>
              </div>
            </div>
          </div>
        )}

        <div style={{
          display: "flex", gap: "10px", justifyContent: "flex-end",
          paddingTop: "24px", marginTop: "24px", borderTop: "1px solid rgba(162,123,92,0.1)",
        }}>
          <button type="button" onClick={() => router.back()} style={{
            background: "transparent", border: "1px solid rgba(162,123,92,0.22)",
            color: "var(--sage)", borderRadius: "10px", padding: "10px 20px",
            fontSize: "14px", cursor: "pointer", fontFamily: "var(--font)",
          }}>
            Cancelar
          </button>
          <button type="submit" disabled={loading} style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: loading ? "rgba(162,123,92,0.5)" : "var(--brown)",
            color: "var(--cream)", border: "none", borderRadius: "10px",
            padding: "10px 24px", fontSize: "14px", fontWeight: 500,
            cursor: loading ? "not-allowed" : "pointer", fontFamily: "var(--font)",
          }}>
            {loading ? (
              <>
                <span style={{
                  width: "14px", height: "14px", borderRadius: "50%",
                  border: "2px solid rgba(220,215,201,0.3)", borderTopColor: "var(--cream)",
                  animation: "spin 0.7s linear infinite", display: "inline-block",
                }}/>
                Salvando...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
                {isEdit ? "Salvar alterações" : "Confirmar e sincronizar"}
              </>
            )}
          </button>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </form>
  )
}

function SL({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: "10px", fontWeight: 500, color: "var(--brown)", textTransform: "uppercase",
      letterSpacing: "1px", marginBottom: "16px", paddingBottom: "8px",
      borderBottom: "1px solid rgba(162,123,92,0.1)",
    }}>{children}</p>
  )
}

function FG({ label, children, style }: { label: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px", ...style }}>
      <label style={{ fontSize: "12px", color: "var(--sage)" }}>{label}</label>
      {children}
    </div>
  )
}

const iS: React.CSSProperties = {
  background: "rgba(15,14,14,0.7)", border: "1px solid rgba(162,123,92,0.18)",
  borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "var(--cream)",
  width: "100%", fontFamily: "var(--font)", outline: "none",
}

const sS: React.CSSProperties = {
  ...iS, appearance: "none", cursor: "pointer",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7' viewBox='0 0 10 7'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23697565' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
  backgroundSize: "10px", paddingRight: "36px", backgroundAttachment: "initial",
}
