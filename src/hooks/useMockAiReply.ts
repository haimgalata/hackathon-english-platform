import { useCallback } from 'react'
import { pickMockReply } from '../data/mockAiResponses'

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export function useMockAiReply() {
  const reply = useCallback(async (userText: string) => {
    const ms = 600 + Math.floor(Math.random() * 600)
    await delay(ms)
    return pickMockReply(userText)
  }, [])

  return { reply }
}
