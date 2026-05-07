import Phaser from 'phaser'

/**
 * A single player laser bolt.
 *
 * Extends Phaser.Physics.Arcade.Image so the physics group owns it and
 * future enemy colliders can be wired in one line (scene.physics.add.overlap).
 *
 * Lifecycle:
 *   fire()  → activate + set velocity
 *   preUpdate() → auto-recycle when above screen
 */
export class PlayerLaser extends Phaser.Physics.Arcade.Image {
  static readonly TEXTURE_KEY = 'player-laser'
  static readonly SPEED = 680        // px/s — fast, arcade feel
  static readonly BODY_W = 6
  static readonly BODY_H = 26

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, PlayerLaser.TEXTURE_KEY)
    this.setBlendMode(Phaser.BlendModes.ADD)
  }

  /** Called by LaserSystem.shoot() to reuse a pooled instance */
  fire(x: number, y: number) {
    this.setActive(true).setVisible(true)
    this.setPosition(x, y)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.reset(x, y)
    body.setVelocityY(-PlayerLaser.SPEED)
    body.setSize(PlayerLaser.BODY_W, PlayerLaser.BODY_H)
  }

  /** Phaser calls this every frame for objects in a group with runChildUpdate */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(_time: number, _delta: number) {
    if (this.active && this.y < -30) {
      this.setActive(false).setVisible(false)
    }
  }
}

// ─── Texture factory ─────────────────────────────────────────────────────────
/**
 * Generates the laser bolt texture once and registers it with the scene.
 * Call this during GameScene.create() before constructing LaserSystem.
 */
export function createLaserTexture(scene: Phaser.Scene) {
  if (scene.textures.exists(PlayerLaser.TEXTURE_KEY)) return

  const w = 6
  const h = 28

  const gfx = scene.make.graphics({ x: 0, y: 0 })

  // Soft outer glow (wide, transparent)
  gfx.fillStyle(0x00ccff, 0.25)
  gfx.fillRect(0, 0, w, h)

  // Bright core
  gfx.fillStyle(0x00eeff, 0.85)
  gfx.fillRect(1, 0, w - 2, h)

  // White-hot centre line
  gfx.fillStyle(0xffffff, 1)
  gfx.fillRect(2, 0, w - 4, h)

  // Bright tip
  gfx.fillStyle(0xffffff, 1)
  gfx.fillRect(1, 0, w - 2, 5)

  gfx.generateTexture(PlayerLaser.TEXTURE_KEY, w, h)
  gfx.destroy()
}
