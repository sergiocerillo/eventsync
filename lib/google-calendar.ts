import { google } from "googleapis"
import { prisma } from "@/lib/prisma"

interface EventData {
  title: string | null
  date: Date | null
  startTime: string | null
  endTime: string
  location: string | null
  locationAddress: string | null
  description: string | null
}

async function getOAuthClient(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      googleAccessToken: true,
      googleRefreshToken: true,
      googleTokenExpiry: true,
    },
  })

  if (!user?.googleAccessToken) {
    throw new Error("Token do Google não encontrado. Faça logout e login novamente.")
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.AUTH_GOOGLE_ID,
    process.env.AUTH_GOOGLE_SECRET
  )

  oauth2Client.setCredentials({
    access_token: user.googleAccessToken,
    refresh_token: user.googleRefreshToken ?? undefined,
    expiry_date: user.googleTokenExpiry?.getTime(),
  })

  oauth2Client.on("tokens", async (tokens) => {
    await prisma.user.update({
      where: { id: userId },
      data: {
        googleAccessToken: tokens.access_token ?? undefined,
        googleRefreshToken: tokens.refresh_token ?? undefined,
        googleTokenExpiry: tokens.expiry_date
          ? new Date(tokens.expiry_date)
          : undefined,
      },
    })
  })

  return oauth2Client
}

function buildPayload(event: EventData) {
  const dateStr = event.date
    ? new Date(event.date).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0]
  const startTime = event.startTime ?? "12:00"
  const endTime = event.endTime ?? "23:30"

  return {
    summary: event.title ?? "(Sem título)",
    description: event.description ?? "",
    location: event.locationAddress ?? event.location ?? "",
    start: {
      dateTime: `${dateStr}T${startTime}:00`,
      timeZone: "America/Sao_Paulo",
    },
    end: {
      dateTime: `${dateStr}T${endTime}:00`,
      timeZone: "America/Sao_Paulo",
    },
  }
}

export async function createGoogleCalendarEvent(
  userId: string,
  event: EventData
): Promise<string> {
  const auth = await getOAuthClient(userId)
  const calendar = google.calendar({ version: "v3", auth })
  const response = await calendar.events.insert({
    calendarId: "primary",
    requestBody: buildPayload(event),
  })
  return response.data.id!
}

export async function updateGoogleCalendarEvent(
  userId: string,
  googleEventId: string,
  event: EventData
): Promise<void> {
  const auth = await getOAuthClient(userId)
  const calendar = google.calendar({ version: "v3", auth })
  await calendar.events.update({
    calendarId: "primary",
    eventId: googleEventId,
    requestBody: buildPayload(event),
  })
}

export async function deleteGoogleCalendarEvent(
  userId: string,
  googleEventId: string
): Promise<void> {
  const auth = await getOAuthClient(userId)
  const calendar = google.calendar({ version: "v3", auth })
  await calendar.events.delete({
    calendarId: "primary",
    eventId: googleEventId,
  })
}
