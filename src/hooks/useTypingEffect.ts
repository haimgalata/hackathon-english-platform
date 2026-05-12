import { useEffect, useState } from 'react'

export function useTypingEffect(fullText: string, enabled: boolean) {
  const [displayed, setDisplayed] = useState(() => (enabled ? '' : fullText))

  useEffect(() => {
    if (!enabled) {
      setDisplayed(fullText)
      return
    }
    setDisplayed('')
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setDisplayed(fullText.slice(0, i))
      if (i >= fullText.length) window.clearInterval(id)
    }, 18)
    return () => window.clearInterval(id)
  }, [fullText, enabled])

  return displayed
}
