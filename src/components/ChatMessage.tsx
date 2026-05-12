import { useEffect, useRef } from 'react'
import { useTypingEffect } from '../hooks/useTypingEffect'

export type ChatRole = 'user' | 'assistant'

export type ChatMessageProps = {
  role: ChatRole
  content: string
  typewriter?: boolean
  onScrollHint?: () => void
  onTypewriterDone?: () => void
}

export function ChatMessage({ role, content, typewriter = false, onScrollHint, onTypewriterDone }: ChatMessageProps) {
  const displayed = useTypingEffect(content, role === 'assistant' && typewriter)
  const reportedDone = useRef(false)
  const scrollCb = useRef(onScrollHint)
  const doneCb = useRef(onTypewriterDone)
  scrollCb.current = onScrollHint
  doneCb.current = onTypewriterDone

  useEffect(() => {
    if (role === 'assistant' && typewriter) scrollCb.current?.()
  }, [displayed, role, typewriter])

  useEffect(() => {
    reportedDone.current = false
  }, [content])

  useEffect(() => {
    if (role !== 'assistant' || !typewriter) return
    if (displayed.length === content.length && content.length > 0 && !reportedDone.current) {
      reportedDone.current = true
      doneCb.current?.()
    }
  }, [content.length, displayed.length, role, typewriter])

  const text = role === 'assistant' && typewriter ? displayed : content

  if (role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[min(100%,36rem)] rounded-2xl rounded-br-md border border-sky-500/25 bg-gradient-to-br from-sky-500/20 to-violet-600/15 px-4 py-3 text-sm leading-relaxed text-zinc-100 shadow-lg shadow-sky-500/10">
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[min(100%,36rem)] rounded-2xl rounded-bl-md border border-white/10 bg-zinc-900/90 px-4 py-3 text-sm leading-relaxed text-zinc-200 shadow-inner shadow-black/20">
        <p className="whitespace-pre-wrap">{text}</p>
      </div>
    </div>
  )
}
