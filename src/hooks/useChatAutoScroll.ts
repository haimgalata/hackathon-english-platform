import { type RefObject, useEffect } from 'react'

export function useChatAutoScroll(
  ref: RefObject<HTMLElement | null>,
  deps: ReadonlyArray<unknown>,
) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
