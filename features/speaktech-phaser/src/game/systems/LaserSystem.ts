import * as Phaser from 'phaser'
import { PlayerLaser } from '../objects/PlayerLaser'

interface LaserSystemConfig {
  /** Minimum ms between shots. Default 180 ms (~5.5 shots/sec). */
  cooldownMs?: number
  /** Maximum pooled laser objects. Default 25. */
  maxSize?: number
}

/**
 * Manages the player's laser pool, shoot cooldown, and the physics group
 * ready for overlap/collider registration against enemies.
 *
 * Usage in GameScene:
 *   this.laserSystem = new LaserSystem(this)
 *   // later in update:
 *   this.laserSystem.tryShoot(this.shipX, this.shipY - 28)
 *   // for collision (Step 6+):
 *   this.physics.add.overlap(this.laserSystem.group, enemyGroup, handler)
 */
export class LaserSystem {
  /** Expose so GameScene (or future scenes) can register colliders */
  readonly group: Phaser.Physics.Arcade.Group

  private scene: Phaser.Scene
  private cooldownMs: number
  private lastFiredAt = -Infinity
  private _shotCount = 0

  constructor(scene: Phaser.Scene, config: LaserSystemConfig = {}) {
    this.scene = scene
    this.cooldownMs = config.cooldownMs ?? 180

    this.group = scene.physics.add.group({
      classType: PlayerLaser,
      maxSize: config.maxSize ?? 25,
      runChildUpdate: true,         // enables PlayerLaser.preUpdate()
    })
  }

  /**
   * Attempt to fire a laser from (x, y).
   * Returns true if a shot was fired, false if on cooldown or pool exhausted.
   */
  tryShoot(x: number, y: number): boolean {
    const now = this.scene.time.now

    if (now - this.lastFiredAt < this.cooldownMs) return false

    const laser = this.group.get(x, y) as PlayerLaser | null
    if (!laser) return false     // pool exhausted — silently skip

    laser.fire(x, y)
    this.lastFiredAt = now
    this._shotCount++
    return true
  }

  /** How many shots have been fired this session */
  get shotCount() { return this._shotCount }

  /** True if the weapon is ready to fire */
  get isReady() {
    return this.scene.time.now - this.lastFiredAt >= this.cooldownMs
  }

  /** 0→1 progress of the cooldown (1 = fully recharged) */
  get cooldownRatio() {
    const elapsed = this.scene.time.now - this.lastFiredAt
    return Math.min(1, elapsed / this.cooldownMs)
  }
}
