import Phaser from 'phaser'
import { LaserSystem }   from './LaserSystem'
import { AnswerSpawner } from './AnswerSpawner'
import { ScoreManager }  from './ScoreManager'
import { PlayerLaser }   from '../objects/PlayerLaser'
import { AnswerEnemy }   from '../objects/AnswerEnemy'

// ─────────────────────────────────────────────────────────────────────────────
/**
 * Checks laser ↔ enemy overlaps every frame using AABB against physics bodies.
 *
 * Keeps a `hitSet` so a single enemy can only be hit once even if two lasers
 * arrive on the same frame.
 *
 * Callbacks let GameScene handle visual/audio reactions without polluting this class.
 */
export class CollisionManager {
  onCorrectHit: ((enemy: AnswerEnemy, pts: number) => void) | null = null
  onWrongHit:   ((enemy: AnswerEnemy) => void)             | null = null
  onGameOver:   (() => void)                               | null = null

  private hitSet = new Set<AnswerEnemy>()

  constructor(
    private scene:   Phaser.Scene,
    private lasers:  LaserSystem,
    private spawner: AnswerSpawner,
    private score:   ScoreManager,
  ) {}

  // ── Called every frame from GameScene.update() ────────────────────────────

  update() {
    if (this.score.isGameOver) return

    const activeLasers = this.lasers.group.getChildren() as PlayerLaser[]

    for (const laser of activeLasers) {
      if (!laser.active) continue

      for (const enemy of this.spawner.enemies) {
        if (this.hitSet.has(enemy)) continue

        if (this.aabbOverlap(laser, enemy)) {
          // Consume the laser immediately — prevents it hitting a second enemy
          laser.setActive(false).setVisible(false)
          ;(laser.body as Phaser.Physics.Arcade.Body).setVelocity(0)

          // Lock the enemy so it can't be hit again this frame
          this.hitSet.add(enemy)

          if (enemy.isCorrect) {
            const pts = this.score.registerCorrectHit()
            this.onCorrectHit?.(enemy, pts)
          } else {
            this.score.registerWrongHit()
            this.onWrongHit?.(enemy)
            if (this.score.isGameOver) this.onGameOver?.()
          }

          break  // laser is spent — stop checking enemies
        }
      }
    }

    this.cleanHitSet()
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  /**
   * AABB test using the arcade physics bodies (already sized in each class).
   * More reliable than getBounds() on Containers.
   */
  private aabbOverlap(laser: PlayerLaser, enemy: AnswerEnemy): boolean {
    const lb = laser.body as Phaser.Physics.Arcade.Body
    const eb = enemy.body  as Phaser.Physics.Arcade.Body

    return (
      lb.x           < eb.x + eb.width  &&
      lb.x + lb.width > eb.x            &&
      lb.y           < eb.y + eb.height &&
      lb.y + lb.height > eb.y
    )
  }

  /** Remove stale entries — enemies that were destroyed by the spawner */
  private cleanHitSet() {
    for (const e of this.hitSet) {
      if (!this.spawner.enemies.includes(e)) this.hitSet.delete(e)
    }
  }
}
