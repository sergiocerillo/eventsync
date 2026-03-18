"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

interface NavbarProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()
    : "U"

  const links = [
    { href: "/home", label: "Eventos" },
    { href: "/events/new", label: "+ Novo Evento" },
    { href: "/dashboard", label: "Dashboard" },
  ]

  return (
    <nav style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 28px", height: "62px",
      background: "var(--dark)",
      borderBottom: "1px solid rgba(162,123,92,0.18)",
      position: "sticky", top: 0, zIndex: 100,
    }}>
      <Link href="/home" style={{ fontSize: "18px", fontWeight: 700, color: "var(--cream)" }}>
        Event<span style={{ color: "var(--brown)" }}>Sync</span>
      </Link>

      <div style={{ display: "flex", gap: "4px" }}>
        {links.map((link) => {
          const isNew = link.href === "/events/new"
          const isActive = pathname === link.href
          return (
            <Link key={link.href} href={link.href} style={{
              padding: "7px 16px", borderRadius: "8px", fontSize: "13px",
              fontWeight: isNew || isActive ? 500 : 400,
              background: isNew ? "var(--brown)" : isActive ? "rgba(162,123,92,0.12)" : "transparent",
              color: isNew || isActive ? "var(--cream)" : "var(--sage)",
              border: isNew ? "none" : "1px solid transparent",
              transition: "all 0.15s",
            }}>
              {link.label}
            </Link>
          )
        })}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "13px", color: "var(--sage)" }}>
          {user?.name?.split(" ")[0] ?? ""}
        </span>
        {user?.image ? (
          <img src={user.image} alt="" style={{ width: "34px", height: "34px", borderRadius: "50%", objectFit: "cover" }} />
        ) : (
          <div style={{
            width: "34px", height: "34px", borderRadius: "50%",
            background: "var(--brown)", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "var(--cream)",
          }}>
            {initials}
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          style={{
            background: "transparent", border: "1px solid rgba(162,123,92,0.2)",
            color: "var(--sage)", borderRadius: "8px", padding: "6px 12px",
            fontSize: "12px", cursor: "pointer", fontFamily: "var(--font)",
          }}
        >
          Sair
        </button>
      </div>
    </nav>
  )
}
