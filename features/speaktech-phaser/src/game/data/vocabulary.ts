import * as Phaser from 'phaser'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WordEntry {
  id:       string
  english:  string
  correct:  string
  wrong:    string[]
  category: string
}

export interface SentenceEntry {
  id:       string
  wordId:   string   // links to WordEntry.id for progression filtering
  sentence: string
  correct:  string
  wrong:    string[]
  category: string
}

export interface SpawnedQuestion {
  entry:   WordEntry
  answers: AnswerOption[]
}

export interface SentenceQuestion {
  entry:   SentenceEntry
  answers: AnswerOption[]
}

export type GameQuestion = SpawnedQuestion | SentenceQuestion

export interface AnswerOption {
  text:      string
  isCorrect: boolean
}

export function isSentenceQuestion(question: GameQuestion): question is SentenceQuestion {
  return 'sentence' in question.entry
}

// ─── Word bank ────────────────────────────────────────────────────────────────

export const WORD_BANK: WordEntry[] = [
  { id: 'algorithm', english: 'Algorithm', correct: 'אלגוריתם', wrong: ['נוסחה', 'תוכנה', 'ערוץ'], category: 'AI' },
  { id: 'database', english: 'Database', correct: 'בסיס נתונים', wrong: ['קובץ', 'תיקייה', 'אחסון'], category: 'Tech' },
  { id: 'browser', english: 'Browser', correct: 'דפדפן', wrong: ['מנוע חיפוש', 'אתר', 'סרוור'], category: 'Tech' },
  { id: 'password', english: 'Password', correct: 'סיסמה', wrong: ['משהו', 'קוד', 'בסיס נתונים'], category: 'Tech' },
  { id: 'server', english: 'Server', correct: 'שרת', wrong: ['קליינט', 'רוטר', 'מנוע'], category: 'Tech' },
  { id: 'upload', english: 'Upload', correct: 'העלאה', wrong: ['הורדה', 'שלח', 'קבל'], category: 'Tech' },
  { id: 'download', english: 'Download', correct: 'הורדה', wrong: ['העלאה', 'שמור', 'פתח'], category: 'Tech' },
  { id: 'bug', english: 'Bug', correct: 'באג', wrong: ['תכנית', 'שגיאה', 'בעיה'], category: 'Coding' },
  { id: 'api', english: 'API', correct: 'ממשק תוכנה', wrong: ['בסיס נתונים', 'שפת תכנות', 'קוד'], category: 'Coding' },
  { id: 'pixel', english: 'Pixel', correct: 'פיקסל', wrong: ['תמונה', 'דוט', 'קו'], category: '3D' },
  { id: 'render', english: 'Render', correct: 'רנדור', wrong: ['ציור', 'ראן', 'הצגה'], category: '3D' },
  { id: 'animation', english: 'Animation', correct: 'אנימציה', wrong: ['וידאו', 'תנועה', 'טיימר'], category: '3D' },
  { id: 'texture', english: 'Texture', correct: 'טקסטורה', wrong: ['צבע', 'חומר', 'רקם'], category: '3D' },
  { id: 'shader', english: 'Shader', correct: 'הצללה', wrong: ['מסנן', 'רנדור', 'אור'], category: 'Graphics' },
  { id: 'mesh', english: 'Mesh', correct: 'רשת תלת-ממדית', wrong: ['טקסטורה', 'שלד', 'אובייקט'], category: '3D' },
  { id: 'geometry', english: 'Geometry', correct: 'גיאומטריה', wrong: ['טופולוגיה', 'צורה', 'מבנה'], category: '3D' },
  { id: 'rigging', english: 'Rigging', correct: 'שלדול', wrong: ['ציור', 'הנפשה', 'תנועה'], category: 'Animation' },
  { id: 'network', english: 'Network', correct: 'רשת', wrong: ['אתר', 'קשר', 'ערוץ'], category: 'Tech' },
  { id: 'mvp', english: 'MVP', correct: 'מוצר מינימלי', wrong: ['תוכנה', 'פרויקט', 'מטרה'], category: 'Startup' },
  { id: 'prompt', english: 'Prompt', correct: 'הנמקה', wrong: ['שאלה', 'תגובה', 'בקשה'], category: 'AI' },
]

// ─── Sentence bank ────────────────────────────────────────────────────────────

const SENTENCE_BANK: SentenceEntry[] = [
  { id: 'sentence-1',  wordId: 'algorithm', sentence: 'A step-by-step procedure for solving a problem is called an ____.', correct: 'Algorithm', wrong: ['Protocol', 'Flowchart', 'Function'], category: 'AI' },
  { id: 'sentence-2',  wordId: 'database',  sentence: 'An ____ stores and organizes structured data for fast retrieval.', correct: 'Database', wrong: ['Archive', 'Logfile', 'Registry'], category: 'Tech' },
  { id: 'sentence-3',  wordId: 'browser',   sentence: 'You use a ____ to access websites on the internet.', correct: 'Browser', wrong: ['Compiler', 'Terminal', 'Router'], category: 'Tech' },
  { id: 'sentence-4',  wordId: 'password',  sentence: 'A secret string used to authenticate a user is called a ____.', correct: 'Password', wrong: ['Username', 'Token', 'Certificate'], category: 'Tech' },
  { id: 'sentence-5',  wordId: 'server',    sentence: 'A ____ listens for requests and sends responses to clients over a network.', correct: 'Server', wrong: ['Gateway', 'Switch', 'Firewall'], category: 'Tech' },
  { id: 'sentence-6',  wordId: 'upload',    sentence: 'Transferring a file from your device to the internet is called an ____.', correct: 'Upload', wrong: ['Download', 'Sync', 'Export'], category: 'Tech' },
  { id: 'sentence-7',  wordId: 'bug',       sentence: 'A ____ is an unintended error or flaw in software code.', correct: 'Bug', wrong: ['Patch', 'Log', 'Warning'], category: 'Coding' },
  { id: 'sentence-8',  wordId: 'api',       sentence: 'An ____ lets different software applications communicate with each other.', correct: 'API', wrong: ['SDK', 'IDE', 'CDN'], category: 'Coding' },
  { id: 'sentence-9',  wordId: 'pixel',     sentence: 'The smallest addressable element in a digital image is a ____.', correct: 'Pixel', wrong: ['Vertex', 'Node', 'Glyph'], category: '3D' },
  { id: 'sentence-10', wordId: 'render',    sentence: 'Converting a 3D scene into a 2D image on screen is called ____.', correct: 'Rendering', wrong: ['Sampling', 'Rasterizing', 'Exporting'], category: '3D' },
  { id: 'sentence-11', wordId: 'rigging',   sentence: 'The animator adjusted the ____ for smoother character movement.', correct: 'Rigging', wrong: ['Shading', 'Topology', 'Keyframe'], category: 'Animation' },
  { id: 'sentence-12', wordId: 'network',   sentence: 'A ____ is a set of interconnected computers that share data and resources.', correct: 'Network', wrong: ['Cluster', 'Domain', 'Stack'], category: 'Tech' },
  { id: 'sentence-13', wordId: 'mvp',       sentence: 'A ____ is the simplest version of a product built to test core assumptions.', correct: 'MVP', wrong: ['Prototype', 'Beta', 'Mockup'], category: 'Startup' },
  { id: 'sentence-14', wordId: 'prompt',    sentence: 'Text given as input to an AI model to guide its output is called a ____.', correct: 'Prompt', wrong: ['Query', 'Command', 'Request'], category: 'AI' },
  { id: 'sentence-15', wordId: 'texture',   sentence: 'A surface image applied to a 3D model to add detail is called a ____.', correct: 'Texture', wrong: ['Material', 'Decal', 'Bitmap'], category: '3D' },
]

// ─── Build questions ─────────────────────────────────────────────────────────

export function buildQuestion(exclude?: string): SpawnedQuestion {
  let entry: WordEntry
  const attempts = 20
  for (let i = 0; i < attempts; i++) {
    entry = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)]!
    if (!exclude || entry.id !== exclude) break
  }
  if (!entry!) entry = WORD_BANK[0]!

  const answers = [
    { text: entry.correct, isCorrect: true },
    ...entry.wrong.map((w) => ({ text: w, isCorrect: false })),
  ]

  return {
    entry,
    answers: Phaser.Utils.Array.Shuffle(answers) as AnswerOption[],
  }
}

/** Build a sentence question restricted to a set of mastered word IDs. Falls back to full bank if none match. */
export function buildSentenceQuestionFromWords(wordIds: string[], exclude?: string): SentenceQuestion {
  const pool = SENTENCE_BANK.filter((e) => wordIds.includes(e.wordId))
  const bank = pool.length > 0 ? pool : SENTENCE_BANK

  let entry: SentenceEntry
  const attempts = 20
  for (let i = 0; i < attempts; i++) {
    entry = bank[Math.floor(Math.random() * bank.length)]!
    if (!exclude || entry.id !== exclude) break
  }
  if (!entry!) entry = bank[0]!

  const answers = [
    { text: entry.correct, isCorrect: true },
    ...entry.wrong.map((w) => ({ text: w, isCorrect: false })),
  ]
  return { entry, answers: Phaser.Utils.Array.Shuffle(answers) as AnswerOption[] }
}

export function buildSentenceQuestion(exclude?: string): SentenceQuestion {
  let entry: SentenceEntry
  const attempts = 20
  for (let i = 0; i < attempts; i++) {
    entry = SENTENCE_BANK[Math.floor(Math.random() * SENTENCE_BANK.length)]!
    if (!exclude || entry.id !== exclude) break
  }
  if (!entry!) entry = SENTENCE_BANK[0]!

  const answers = [
    { text: entry.correct, isCorrect: true },
    ...entry.wrong.map((w) => ({ text: w, isCorrect: false })),
  ]

  return {
    entry,
    answers: Phaser.Utils.Array.Shuffle(answers) as AnswerOption[],
  }
}
