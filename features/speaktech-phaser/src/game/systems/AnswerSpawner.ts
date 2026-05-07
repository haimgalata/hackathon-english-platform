import * as Phaser from 'phaser'
import { AnswerEnemy } from '../objects/AnswerEnemy'
import { GameQuestion } from '../data/vocabulary'
import { GAME_WIDTH, GAME_HEIGHT } from '../config'
import { GameMode, ModeManager } from './ModeManager'

// ─── Difficulty curve ─────────────────────────────────────────────────────────
//  wave  1 : speed ~70,  stagger 520 ms, 4 enemies
//  wave  5 : speed ~110, stagger 430 ms, 4 enemies
//  wave 10 : speed ~160, stagger 320 ms, 5 enemies
//  wave 15 : speed ~210, stagger 260 ms, 6 enemies
//  wave 20+: speed ~240, stagger 220 ms, 6 enemies

function difficultyFor(wave: number, mode: GameMode) {
  const normalized = Math.min(wave / (mode === GameMode.Sentence ? 28 : 24), 1)
  const t = Math.pow(normalized, mode === GameMode.Sentence ? 1.05 : 1.2)

  const speed = mode === GameMode.Sentence
    ? 22 + t * 38        // very slow sentence mode — max ~60 px/s
    : 70 + t * 170       // translation mode

  const staggerMs = mode === GameMode.Sentence
    ? Math.round(620 - Math.pow(normalized, 1.08) * 260) // 620 → 360 ms
    : Math.round(520 - Math.pow(normalized, 1.05) * 300) // 520 → 220 ms

  const enemyCount = mode === GameMode.Sentence
    ? (wave < 10 ? 3 : 4)
    : wave < 8 ? 4 : wave < 14 ? 5 : 6

  return { speed, staggerMs, enemyCount }
}

function waveGapFor(mode: GameMode) {
  return mode === GameMode.Sentence ? 2200 : 1700
}

// ─────────────────────────────────────────────────────────────────────────────
export class AnswerSpawner {
  /** Live enemies — flat array exposed for collision checks */
  readonly enemies: AnswerEnemy[] = []

  currentQuestion: GameQuestion | null = null
  onNewQuestion: ((q: GameQuestion) => void) | null = null

  /** Read-only wave counter for the HUD */
  get wave() { return this._wave }
  private _wave = 0

  private scene: Phaser.Scene
  private modeManager: ModeManager
  private spawnQueue: { text: string; isCorrect: boolean }[] = []
  private staggerTimer = 0
  private currentStagger = 380
  private gapTimer = 0
  private waitingForGap = false
  private lastQuestionId = ''
  private waveGapMs = 1700

  constructor(scene: Phaser.Scene, modeManager: ModeManager) {
    this.scene = scene
    this.modeManager = modeManager
  }

  // ── Public ────────────────────────────────────────────────────────────────────

  start() { this.loadNextWave() }

  update(delta: number) {
    // Tick and cull off-screen enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i]
      e.tick(delta)
      if (e.isOffScreen(GAME_HEIGHT)) {
        e.destroy()
        this.enemies.splice(i, 1)
      }
    }

    // Drain stagger queue
    if (this.spawnQueue.length > 0) {
      this.staggerTimer += delta
      if (this.staggerTimer >= this.currentStagger) {
        this.staggerTimer -= this.currentStagger
        this.spawnNext()
      }
      return
    }

    // Wait for all enemies to leave then apply gap
    if (!this.waitingForGap) { this.waitingForGap = true; this.gapTimer = 0 }

    if (this.enemies.length === 0) {
      this.gapTimer += delta
      if (this.gapTimer >= this.waveGapMs) {
        this.waitingForGap = false
        this.loadNextWave()
      }
    }
  }

  /** Called after a correct hit — clears remaining enemies and fast-forwards to next wave */
  clearCurrentWave() {
    this.spawnQueue    = []
    this.staggerTimer  = 0
    for (const e of this.enemies) e.destroy()
    this.enemies.length = 0
    // Jump most of the way through the gap so next wave arrives quickly
    this.waitingForGap = true
    this.gapTimer      = this.waveGapMs * 0.55
  }

  /** Halts all movement — called on game over */
  freeze() {
    this.spawnQueue = []
    for (const e of this.enemies) {
      const body = e.body as Phaser.Physics.Arcade.Body
      body.setVelocity(0)
    }
  }

  // ── Private ───────────────────────────────────────────────────────────────────

  private loadNextWave() {
    this._wave++
    this.waveGapMs = waveGapFor(this.modeManager.currentMode)
    const { staggerMs } = difficultyFor(this._wave, this.modeManager.currentMode)
    this.currentStagger = staggerMs

    const q = this.modeManager.buildNextQuestion(this.lastQuestionId)
    this.currentQuestion = q
    this.lastQuestionId = q.entry.id
    this.onNewQuestion?.(q)

    this.spawnQueue = q.answers.map((a) => ({ text: a.text, isCorrect: a.isCorrect }))
    this.staggerTimer = staggerMs  // fire first enemy immediately
  }

  private spawnNext() {
    const next = this.spawnQueue.shift()
    if (!next) return

    const { speed, enemyCount } = difficultyFor(this._wave, this.modeManager.currentMode)
    const spawnedSoFar = enemyCount - this.spawnQueue.length - 1

    // Divide canvas into enemyCount columns, place one enemy per column
    const slotW   = GAME_WIDTH / enemyCount
    const colIdx  = spawnedSoFar % enemyCount
    const x = Phaser.Math.Clamp(
      slotW * colIdx + slotW / 2 + Phaser.Math.Between(-18, 18),
      55, GAME_WIDTH - 55,
    )

    // Add slight per-enemy speed jitter for organic feel
    const finalSpeed = speed + Phaser.Math.FloatBetween(-12, 18)

    this.enemies.push(new AnswerEnemy(this.scene, x, -70, next.text, next.isCorrect, finalSpeed))
  }
}
