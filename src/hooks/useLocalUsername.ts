import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'techlingo_username'

function readStored(): string | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (!v) return null
    const t = v.trim()
    return t.length > 0 ? t : null
  } catch {
    return null
  }
}

export function useLocalUsername() {
  const [username, setUsernameState] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setUsernameState(readStored())
    setHydrated(true)
  }, [])

  const login = useCallback((name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    try {
      localStorage.setItem(STORAGE_KEY, trimmed)
    } catch {
      /* ignore quota / private mode */
    }
    setUsernameState(trimmed)
  }, [])

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
    setUsernameState(null)
  }, [])

  return { username, hydrated, login, logout }
}
