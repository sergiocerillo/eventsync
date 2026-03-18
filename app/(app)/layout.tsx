export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import Navbar from "@/components/ui/Navbar"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div style={{ minHeight: "100vh", background: "var(--black)" }}>
      <Navbar user={session.user} />
      <main>{children}</main>
    </div>
  )
}
