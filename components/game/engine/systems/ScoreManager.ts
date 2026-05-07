// ─── Types ────────────────────────────────────────────────────────────────────

export interface GameStats {
  score:      number
  combo:      number
  health:     number
  maxHealth:  number
  isGameOver: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
/**
 * Pure state container — no Phaser deps, easy to unit-test.
 *
 * Points scale with combo so streaks feel rewarding:
 *   combo 1 → 100 pts, combo 2 → 200, combo 5 → 500, etc.
 */
export class ScoreManager {
  static readonly BASE_POINTS  = 100
  static readonly MAX_HEALTH   = 5

  private _score    = 0
  private _combo    = 0
  private _health   = ScoreManager.MAX_HEALTH
  private _gameOver = false

  // ── Read-only snapshot ────────────────────────────────────────────────────

  get stats(): GameStats {
    return {
      score:      this._score,
      combo:      this._combo,
      health:     this._health,
      maxHealth:  ScoreManager.MAX_HEALTH,
      isGameOver: this._gameOver,
    }
  }

  get isGameOver() { return this._gameOver }

  // ── Mutations ─────────────────────────────────────────────────────────────

  /** Returns the points awarded (combo-multiplied) */
  registerCorrectHit(): number {
    this._combo++
    const pts = ScoreManager.BASE_POINTS * this._combo
    this._score += pts
    return pts
  }

  registerWrongHit() {
    this._combo  = 0
    this._health = Math.max(0, this._health - 1)
    if (this._health === 0) this._gameOver = true
  }

  /** Carry over a score from a previous stage. */
  seedScore(value: number) { this._score = value }

  reset() {
    this._score    = 0
    this._combo    = 0
    this._health   = ScoreManager.MAX_HEALTH
    this._gameOver = false
  }
}
