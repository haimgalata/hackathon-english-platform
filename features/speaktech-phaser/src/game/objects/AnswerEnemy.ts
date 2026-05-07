import Phaser from 'phaser'

// ─── Visual constants ─────────────────────────────────────────────────────────
const SHIP_COLOR   = 0x1a0033
const SHIP_STROKE  = 0xcc33ff
const GLOW_COLOR   = 0xaa22ff
const LABEL_BG     = 0x0d001a
const LABEL_STROKE = 0xcc33ff
const LABEL_TEXT   = '#e8d0ff'

// Physics hitbox (centred on the container origin)
const HITBOX_W = 82
const HITBOX_H = 58

// ─────────────────────────────────────────────────────────────────────────────
/**
 * A single enemy ship carrying one Hebrew answer option.
 *
 * Built as a Container so the ship graphic + text label move together.
 * Physics is added via `scene.physics.add.existing()`, giving it an
 * Arcade body ready for `scene.physics.add.overlap()` in Step 7.
 *
 * Public surface intentionally minimal — AnswerSpawner manages the group.
 */
export class AnswerEnemy extends Phaser.GameObjects.Container {
  /** True if shooting this enemy is the correct action */
  readonly isCorrect: boolean

  /** Answer text stored for score-screen / debug */
  readonly answerText: string

  private shipGfx!: Phaser.GameObjects.Graphics
  private labelBgGfx!: Phaser.GameObjects.Graphics
  private labelText!: Phaser.GameObjects.Text
  private glowTime = Math.random() * Math.PI * 2   // random phase offset

  constructor(
    scene:     Phaser.Scene,
    x:         number,
    y:         number,
    text:      string,
    isCorrect: boolean,
    speedY:    number,
  ) {
    super(scene, x, y)
    this.isCorrect  = isCorrect
    this.answerText = text

    this.buildShip(scene)
    this.buildLabel(scene, text)

    // Register with scene display list + physics world
    scene.add.existing(this)
    scene.physics.add.existing(this)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(HITBOX_W, HITBOX_H)
    body.setOffset(-HITBOX_W / 2, -HITBOX_H / 2)
    body.setVelocityY(speedY)
    body.setAllowGravity(false)
  }

  // ── Build visuals ────────────────────────────────────────────────────────────

  private buildShip(scene: Phaser.Scene) {
    // Glow ellipse (redrawn in update for pulse effect)
    this.glowGfx = scene.add.graphics()
    this.add(this.glowGfx)

    // Hull
    this.shipGfx = scene.add.graphics()
    this.drawHull()
    this.add(this.shipGfx)
  }

  private drawHull() {
    const g = this.shipGfx
    g.clear()

    // Main body — wide trapezoid (inverted, alien feel)
    g.fillStyle(SHIP_COLOR, 1)
    g.fillTriangle(-28, -10,  28, -10,  0, 20)   // lower body
    g.fillRect(-28, -22, 56, 14)                  // upper slab

    // Outline
    g.lineStyle(1.5, SHIP_STROKE, 0.9)
    g.strokeTriangle(-28, -10,  28, -10,  0, 20)
    g.strokeRect(-28, -22, 56, 14)

    // Side engine pods
    g.fillStyle(SHIP_COLOR, 1)
    g.fillRect(-40, -14, 14, 20)
    g.fillRect(26, -14, 14, 20)
    g.lineStyle(1.5, SHIP_STROKE, 0.7)
    g.strokeRect(-40, -14, 14, 20)
    g.strokeRect(26, -14, 14, 20)

    // Cockpit dome
    g.fillStyle(0x330055, 1)
    g.fillEllipse(0, -18, 20, 14)
    g.fillStyle(0xdd88ff, 0.6)
    g.fillEllipse(-3, -21, 7, 6)
  }

  private buildLabel(scene: Phaser.Scene, text: string) {
    // Background rounded rect — drawn once (static)
    this.labelBgGfx = scene.add.graphics()
    const lw = 94
    const lh = 26
    const lx = -lw / 2
    const ly = 24

    this.labelBgGfx.fillStyle(LABEL_BG, 0.92)
    this.roundRect(this.labelBgGfx, lx, ly, lw, lh, 6)
    this.labelBgGfx.fillPath()

    this.labelBgGfx.lineStyle(1.5, LABEL_STROKE, 0.85)
    this.roundRect(this.labelBgGfx, lx, ly, lw, lh, 6)
    this.labelBgGfx.strokePath()

    this.add(this.labelBgGfx)

    // Hebrew text — centred in the label box
    this.labelText = scene.add.text(0, ly + lh / 2, text, {
      fontFamily: 'Arial, sans-serif',
      fontSize:   '14px',
      color:      LABEL_TEXT,
      align:      'center',
    })
    this.labelText.setOrigin(0.5, 0.5)
    this.add(this.labelText)
  }

  // ── Rounded rect helper (draws into a Graphics path) ─────────────────────────
  private roundRect(
    g: Phaser.GameObjects.Graphics,
    x: number, y: number, w: number, h: number, r: number,
  ) {
    g.beginPath()
    g.moveTo(x + r, y)
    g.lineTo(x + w - r, y)
    g.arc(x + w - r, y + r, r, -Math.PI / 2, 0)
    g.lineTo(x + w, y + h - r)
    g.arc(x + w - r, y + h - r, r, 0, Math.PI / 2)
    g.lineTo(x + r, y + h)
    g.arc(x + r, y + h - r, r, Math.PI / 2, Math.PI)
    g.lineTo(x, y + r)
    g.arc(x + r, y + r, r, Math.PI, -Math.PI / 2)
    g.closePath()
  }

  // ── Lifecycle ────────────────────────────────────────────────────────────────

  /** Called every frame by the AnswerSpawner update loop */
  tick(delta: number) {
    this.glowTime += delta / 1000

    const pulse = 0.4 + 0.3 * Math.sin(this.glowTime * 4)
    const g = this.glowGfx
    g.clear()
    g.fillStyle(GLOW_COLOR, pulse * 0.35)
    g.fillEllipse(0, 0, 90, 50)
    g.fillStyle(0xffffff, pulse * 0.08)
    g.fillEllipse(0, -10, 50, 22)
  }

  /** True when the enemy has scrolled past the bottom of the screen */
  isOffScreen(canvasHeight: number): boolean {
    return this.y > canvasHeight + 80
  }

  // Phaser requires this to exist as a field (not inline in buildShip)
  // so TypeScript doesn't complain about assignment before super()
  private glowGfx!: Phaser.GameObjects.Graphics
}
