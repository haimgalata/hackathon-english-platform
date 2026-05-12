import { useCallback, useId, useRef, useState } from 'react'
import { useChatAutoScroll } from '../hooks/useChatAutoScroll'
import { useMockAiReply } from '../hooks/useMockAiReply'
import { ChatInput } from './ChatInput'
import { ChatMessage } from './ChatMessage'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export type ChatLine = {
  id: string
  role: 'user' | 'assistant'
  content: string
  typewriter?: boolean
}

type ChatPageProps = {
  username: string
  onLogout?: () => void
}

export function ChatPage({ username, onLogout }: ChatPageProps) {
  const idPrefix = useId()
  const { reply } = useMockAiReply()
  const [messages, setMessages] = useState<ChatLine[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [scrollTick, setScrollTick] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)

  const bumpScroll = useCallback(() => {
    setScrollTick((t) => t + 1)
  }, [])

  useChatAutoScroll(listRef, [messages, isLoading, scrollTick])

  const handleSend = async (text: string) => {
    const userId = `${idPrefix}-u-${crypto.randomUUID()}`
    setMessages((m) => [...m, { id: userId, role: 'user', content: text }])
    setIsLoading(true)
    try {
      const aiText = await reply(text)
      const aid = `${idPrefix}-a-${crypto.randomUUID()}`
      setMessages((m) => [...m, { id: aid, role: 'assistant', content: aiText, typewriter: true }])
    } finally {
      setIsLoading(false)
    }
  }

  const finishTypewriter = useCallback((id: string) => {
    setMessages((m) => m.map((msg) => (msg.id === id ? { ...msg, typewriter: false } : msg)))
  }, [])

  return (
    <div className="flex h-full min-h-0 flex-col bg-zinc-950">
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <div className="relative flex min-h-0 flex-1">
        <div
          className={`fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity md:hidden ${
            sidebarOpen ? 'opacity-100 pointer-events-auto' : 'pointer-events-none opacity-0'
          }`}
          aria-hidden={!sidebarOpen}
          onClick={() => setSidebarOpen(false)}
        />
        <div
          className={`fixed inset-y-0 left-0 z-40 w-60 transform border-r border-white/5 bg-zinc-950 shadow-2xl transition-transform md:static md:z-0 md:flex md:shadow-none ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <Sidebar className="h-full w-full border-0" onNavigate={() => setSidebarOpen(false)} />
        </div>

        <main className="flex min-w-0 min-h-0 flex-1 flex-col">
          <div className="border-b border-white/5 px-4 py-5 md:px-8">
            <div className="mx-auto flex max-w-3xl flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-white">Hello, {username}</h2>
                <p className="text-sm text-zinc-500">Let&apos;s practice professional English together</p>
              </div>
              {onLogout ? (
                <button
                  type="button"
                  onClick={onLogout}
                  className="mt-2 shrink-0 self-start rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:border-white/20 hover:text-white sm:mt-0"
                >
                  Sign out
                </button>
              ) : null}
            </div>
          </div>

          <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-8">
            <div className="mx-auto flex max-w-3xl flex-col gap-4">
              {messages.length === 0 && !isLoading ? (
                <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-zinc-900/30 px-6 py-16 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-zinc-900/80 text-zinc-500">
                    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5Z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="max-w-sm text-sm font-medium text-zinc-300">Start your first message</p>
                  <p className="mt-2 max-w-sm text-sm text-zinc-500">
                    Send a sentence about work or tech — TechLingo will suggest more professional phrasing.
                  </p>
                </div>
              ) : null}

              {messages.map((m) => (
                <ChatMessage
                  key={m.id}
                  role={m.role}
                  content={m.content}
                  typewriter={m.typewriter}
                  onScrollHint={bumpScroll}
                  onTypewriterDone={() => finishTypewriter(m.id)}
                />
              ))}

              {isLoading ? (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/10 bg-zinc-900/90 px-4 py-3">
                    <span className="tl-dot inline-block h-2 w-2 rounded-full bg-sky-400" />
                    <span className="tl-dot inline-block h-2 w-2 rounded-full bg-sky-400" />
                    <span className="tl-dot inline-block h-2 w-2 rounded-full bg-sky-400" />
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <ChatInput disabled={isLoading} onSend={handleSend} />
        </main>
      </div>
    </div>
  )
}
