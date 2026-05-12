import { type KeyboardEvent, useRef, useState } from 'react'

type ChatInputProps = {
  disabled?: boolean
  onSend: (text: string) => void
}

export function ChatInput({ disabled = false, onSend }: ChatInputProps) {
  const [value, setValue] = useState('')
  const ta = useRef<HTMLTextAreaElement>(null)

  const submit = () => {
    const t = value.trim()
    if (!t || disabled) return
    onSend(t)
    setValue('')
    ta.current?.focus()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div className="border-t border-white/5 bg-zinc-950/90 px-3 py-3 backdrop-blur-md md:px-5">
      <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-white/10 bg-zinc-900/80 p-2 shadow-xl shadow-black/40 transition focus-within:border-sky-500/40 focus-within:ring-1 focus-within:ring-sky-500/30">
        <textarea
          ref={ta}
          rows={1}
          value={value}
          disabled={disabled}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Message TechLingo…"
          className="max-h-32 min-h-[44px] flex-1 resize-none bg-transparent px-2 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none disabled:opacity-50"
        />
        <button
          type="button"
          disabled={disabled || !value.trim()}
          onClick={submit}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-violet-500 text-zinc-950 shadow-lg shadow-sky-500/25 transition hover:brightness-110 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
          aria-label="Send message"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M3.4 20.4 21 12 3.4 3.6l2.2 6.6L17 12 5.6 12.4 3.4 20.4Z" />
          </svg>
        </button>
      </div>
      <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-zinc-600">Enter to send · Shift+Enter for newline</p>
    </div>
  )
}
