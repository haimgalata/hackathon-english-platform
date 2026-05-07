import * as Phaser from 'phaser'

/**
 * One-shot particle burst at (x, y).
 *
 * Reuses the 'pixel' texture created by GameScene's engine emitter.
 * The emitter self-destructs after all particles have died.
 *
 * @param correct  true → green burst, false → red/orange burst
 */
export function spawnExplosion(
  scene:   Phaser.Scene,
  x:       number,
  y:       number,
  correct: boolean,
): void {
  const tints   = correct
    ? [0x00ff88, 0x44ffaa, 0xffffff]
    : [0xff4400, 0xff8800, 0xffcc00]

  const emitter = scene.add.particles(x, y, 'pixel', {
    speed:     { min: 60,  max: 220 },
    angle:     { min: 0,   max: 360 },
    scale:     { start: 1.2, end: 0 },
    alpha:     { start: 1,   end: 0 },
    lifespan:  { min: 300, max: 600 },
    quantity:  correct ? 28 : 16,
    tint:      tints,
    blendMode: Phaser.BlendModes.ADD,
    // Emit one burst then stop
    emitting:  false,
  })

  emitter.setDepth(20)
  emitter.explode(correct ? 28 : 16, x, y)

  // Destroy the emitter once all particles are dead
  scene.time.delayedCall(700, () => emitter.destroy())
}
