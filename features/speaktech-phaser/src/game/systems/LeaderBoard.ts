export interface LeaderBoardEntry {
  name:      string
  score:     number
  mode:      string
  timestamp: number
}

const STORAGE_KEY = 'stg_leaderboard'

function loadRecords(): LeaderBoardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as LeaderBoardEntry[]
  } catch {
    return []
  }
}

function saveRecords(records: LeaderBoardEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(0, 12)))
  } catch {
    // ignore storage errors
  }
}

export function addLeaderboardScore(name: string, score: number, mode: string) {
  const record: LeaderBoardEntry = {
    name:      name || 'STUDENT',
    score,
    mode,
    timestamp: Date.now(),
  }
  const records = loadRecords()
  records.push(record)
  records.sort((a, b) => b.score - a.score || a.timestamp - b.timestamp)
  saveRecords(records)
}

export function getTopLeaderboard(limit = 5): LeaderBoardEntry[] {
  return loadRecords().slice(0, limit)
}
