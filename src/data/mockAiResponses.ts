export type MockResponse = {
  keywords: string[]
  text: string
}

export const MOCK_RESPONSES: MockResponse[] = [
  {
    keywords: ['bug', 'api', 'error', 'broken'],
    text: "Great tech vocabulary!\nA more professional way to say it could be:\n\"I encountered an issue in the API integration.\"",
  },
  {
    keywords: ['deploy', 'deployment', 'release', 'production'],
    text: 'Nice context on shipping work.\nYou could sound more polished with:\n"We are targeting a production deployment in the next sprint."',
  },
  {
    keywords: ['meeting', 'sync', 'call', 'calendar'],
    text: 'Good instinct to coordinate.\nA sharper phrasing might be:\n"Let’s schedule a brief sync to align on priorities and next steps."',
  },
  {
    keywords: ['blocker', 'stuck', 'waiting', 'blocked'],
    text: 'Clear signal to stakeholders.\nTry elevating it to:\n"We have a dependency risk that is currently blocking forward progress."',
  },
  {
    keywords: ['refactor', 'cleanup', 'rewrite', 'technical debt'],
    text: 'Strong engineering vocabulary.\nA professional variant is:\n"We should allocate capacity to reduce technical debt in this module."',
  },
  {
    keywords: ['database', 'db', 'query', 'sql'],
    text: 'Solid domain wording.\nConsider:\n"We observed elevated latency on read queries against the primary datastore."',
  },
  {
    keywords: ['deadline', 'timeline', 'eta', 'due'],
    text: 'Helpful update for planning.\nMore executive-friendly language:\n"Based on current scope, we are confident in the committed delivery window."',
  },
  {
    keywords: ['stakeholder', 'pm', 'manager', 'leadership'],
    text: 'Good awareness of audience.\nYou could refine it as:\n"I will socialize the tradeoffs with stakeholders before we finalize the approach."',
  },
  {
    keywords: ['performance', 'slow', 'latency', 'optimize'],
    text: 'Useful performance framing.\nTry:\n"We are profiling the hot path to improve end-to-end latency for end users."',
  },
  {
    keywords: ['test', 'qa', 'coverage', 'regression'],
    text: 'Great quality focus.\nA polished version:\n"We are expanding automated coverage to reduce regression risk ahead of release."',
  },
]

function normalize(s: string) {
  return s.toLowerCase()
}

export function pickMockReply(userText: string): string {
  const n = normalize(userText)
  for (const r of MOCK_RESPONSES) {
    if (r.keywords.some((k) => n.includes(k))) return r.text
  }
  const pool = MOCK_RESPONSES.map((r) => r.text)
  const i = Math.floor(Math.random() * pool.length)
  return (
    pool[i] ??
    'Nice message!\nTo sound more professional in tech settings, lead with context, be specific about impact, and propose a clear next step.'
  )
}
