export type EventStatus = "DRAFT" | "CONFIRMED" | "CANCELLED"

export interface SerializedEvent {
  id: string
  title: string | null
  date: string | null
  startTime: string | null
  endTime: string
  location: string | null
  locationAddress: string | null
  description: string | null
  imageData: string | null
  status: string
  googleEventId: string | null
  syncedAt: string | null
  createdAt: string
  updatedAt: string
}

export const VENUES: { name: string; address: string }[] = [
  { name: "Allianz Parque", address: "Av. Francisco Matarazzo, 1705 – Água Branca, São Paulo – SP" },
  { name: "Audio", address: "Av. Francisco Matarazzo, 694 - Barra Funda, São Paulo - SP" },
  { name: "Autódromo de Interlagos", address: "Av. Sen. Teotônio Vilela, 261 - São Paulo, SP" },
  { name: "Burning House", address: "Av. Santa Marina, 247 - Água Branca, São Paulo - SP" },
  { name: "Carioca Club Pinheiros", address: "Rua Cardeal Arcoverde, 2899 - Pinheiros, São Paulo, SP" },
  { name: "Cine Joia", address: "Praça Carlos Gomes, 82 - Liberdade, São Paulo - SP" },
  { name: "City Lights Music Hall", address: "R. Padre Garcia Velho, 61 - Pinheiros, São Paulo - SP" },
  { name: "Espaço Unimed", address: "R. Tagipuru, 795 - Barra Funda, São Paulo - SP" },
  { name: "Espaço Usine", address: "R. Barra Funda, 973 - Barra Funda, São Paulo - SP" },
  { name: "Estádio do MorumBIS", address: "Praça Roberto Gomes Pedrosa, 1 - Morumbi, São Paulo - SP" },
  { name: "Fabrique Club", address: "R. Barra Funda, 1071 - Barra Funda, São Paulo - SP" },
  { name: "Fenda 315", address: "Rua Doutor Cândido Espinheira, 315 - Perdizes, São Paulo, SP" },
  { name: "Hangar 110", address: "R. Rodolfo Miranda, 110 - Bom Retiro, São Paulo - SP" },
  { name: "La Iglesia", address: "Rua João Moura, 515 – Galpão 06, São Paulo - SP" },
  { name: "Manifesto", address: "Rua Ramos Batista, 207 - Vila Olímpia, São Paulo, SP" },
  { name: "Memorial da América Latina", address: "Av. Mário de Andrade, 664 - Barra Funda, São Paulo, SP" },
  { name: "Red Star Studios", address: "R. Teodoro Sampaio, 462 - Pinheiros, São Paulo - SP" },
  { name: "Sesc Belenzinho", address: "R. Padre Adelino, 1000 - Belenzinho, São Paulo - SP" },
  { name: "Sesc Bom Retiro", address: "Alameda Nothmann, 185 - Campos Elíseos, São Paulo - SP" },
  { name: "Suhai Music Hall", address: "Av. das Nações Unidas, 22540 - Jurubatuba, São Paulo - SP" },
  { name: "Terra SP", address: "Av. Salim Antônio Curiati, 160 - Campo Grande, São Paulo - SP" },
  { name: "Tokio Marine Hall", address: "R. Bragança Paulista, 1281 - Várzea de Baixo, São Paulo - SP" },
  { name: "Vibra São Paulo", address: "Av. das Nações Unidas, 17955 - Vila Almeida, São Paulo - SP" },
  { name: "Vip Station", address: "R. Gibraltar, 346 - Santo Amaro, São Paulo - SP" },
]

export const TIME_SLOTS = [
  "12:00", "13:00", "14:00", "15:00", "16:00",
  "17:00", "18:00", "19:00", "20:00", "21:00",
  "22:00", "23:00",
]
