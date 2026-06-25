const API_BASE = '/api'
const TIMEOUT = 4000

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      ...options,
      signal: AbortSignal.timeout(TIMEOUT),
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

// ─── Auth ──────────────────────────────────────────

export async function loginAPI(
  nick: string,
  pass: string
): Promise<{ success: boolean; user: string; isAdmin: boolean } | null> {
  return apiFetch('/login.php', {
    method: 'POST',
    body: JSON.stringify({ nick, pass }),
  })
}

export async function registerAPI(
  nick: string,
  email: string,
  password: string,
  cpass: string
): Promise<{ success: boolean; user: string } | null> {
  return apiFetch('/register.php', {
    method: 'POST',
    body: JSON.stringify({ nick, email, password, cpass }),
  })
}

export async function recoveryAPI(
  nick: string,
  mail: string
): Promise<{ success: boolean; password: string } | null> {
  return apiFetch('/recovery.php', {
    method: 'POST',
    body: JSON.stringify({ nick, mail }),
  })
}

// ─── Characters ────────────────────────────────────

export interface CharacterData {
  id?: number
  nombre: string
  clase: string
  raza: string
  subraza?: string
  nivel: number
  fuerza?: number
  destreza?: number
  constitucion?: number
  inteligencia?: number
  sabiduria?: number
  carisma?: number
  armorClass?: number
  hitPoints?: number
  hitDice?: string
  speed?: number
  spells?: string
  invent?: string
  asociadoa?: string
  trasfondo?: string
  alineamiento?: string
  competencias?: string
  monedas_oro?: number
  arma?: string
  armadura?: string
  preparedSpells?: string[]
  usedSlots?: number[]
  maxSlots?: number[]
  xp?: number
  classList?: { name: string; level: number }[]
}

export async function getCharactersAPI(user: string): Promise<CharacterData[] | null> {
  return apiFetch(`/characters.php?user=${encodeURIComponent(user)}`)
}

export async function getAllCharactersAPI(): Promise<CharacterData[] | null> {
  return apiFetch('/characters.php?all=1')
}

export async function createCharacterAPI(
  char: CharacterData
): Promise<{ success: boolean; id: number } | null> {
  return apiFetch('/characters.php', {
    method: 'POST',
    body: JSON.stringify(char),
  })
}

export async function updateCharacterAPI(
  char: CharacterData
): Promise<{ success: boolean } | null> {
  return apiFetch('/characters.php', {
    method: 'PUT',
    body: JSON.stringify(char),
  })
}

export async function deleteCharacterAPI(id: number): Promise<{ success: boolean } | null> {
  return apiFetch(`/characters.php?id=${id}`, { method: 'DELETE' })
}

// ─── Users (admin) ─────────────────────────────────

export interface UserData {
  id: number
  nick: string
}

export async function getUsersAPI(): Promise<UserData[] | null> {
  return apiFetch('/users.php')
}

export async function deleteUserAPI(id: number): Promise<{ success: boolean } | null> {
  return apiFetch(`/users.php?id=${id}`, { method: 'DELETE' })
}
