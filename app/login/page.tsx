export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { auth, signIn } from "@/lib/auth"

export default async function LoginPage() {
  const session = await auth()
  if (session) redirect("/home")

  return (
    <div style={{
      minHeight: "100vh", background: "var(--black)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "24px",
    }}>
      <div style={{
        background: "var(--dark)", border: "1px solid rgba(162,123,92,0.18)",
        borderRadius: "24px", padding: "48px 40px", width: "100%", maxWidth: "400px", textAlign: "center",
      }}>
        <div style={{ marginBottom: "32px" }}>
          <div style={{
            width: "56px", height: "56px", background: "rgba(162,123,92,0.15)",
            border: "1px solid rgba(162,123,92,0.3)", borderRadius: "16px",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#A27B5C" strokeWidth="1.5" strokeLinecap="round">
              <rect x="3" y="4" width="18" height="18" rx="3"/>
              <path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "var(--cream)", marginBottom: "8px" }}>
            Event<span style={{ color: "var(--brown)" }}>Sync</span>
          </h1>
          <p style={{ fontSize: "14px", color: "var(--sage)", lineHeight: 1.5 }}>
            Gerencie seus eventos e sincronize<br />automaticamente com o Google Agenda.
          </p>
        </div>

        <div style={{ height: "1px", background: "rgba(162,123,92,0.1)", marginBottom: "28px" }} />

        <form action={async () => {
          "use server"
          await signIn("google", { redirectTo: "/home" })
        }}>
          <button type="submit" style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
            background: "var(--brown)", color: "var(--cream)", border: "none", borderRadius: "12px",
            padding: "14px 24px", fontSize: "15px", fontWeight: 500, cursor: "pointer", fontFamily: "var(--font)",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#DCD7C9"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#DCD7C9"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#DCD7C9"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#DCD7C9"/>
            </svg>
            Entrar com o Google
          </button>
        </form>

        <p style={{ fontSize: "12px", color: "var(--sage)", marginTop: "20px", lineHeight: 1.5 }}>
          Ao entrar, você autoriza o EventSync a criar eventos no seu Google Agenda.
        </p>
      </div>
    </div>
  )
}
