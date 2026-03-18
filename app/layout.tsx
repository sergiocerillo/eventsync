import type { Metadata } from "next"
import { Toaster } from "react-hot-toast"
import "./globals.css"

export const metadata: Metadata = {
  title: "EventSync",
  description: "Gerencie eventos e sincronize com o Google Agenda",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#1E201E",
              color: "#DCD7C9",
              border: "1px solid rgba(162,123,92,0.3)",
              fontFamily: "'Google Sans', sans-serif",
              fontSize: "14px",
            },
            success: { iconTheme: { primary: "#A27B5C", secondary: "#DCD7C9" } },
            error: { iconTheme: { primary: "#e85555", secondary: "#DCD7C9" } },
          }}
        />
      </body>
    </html>
  )
}
