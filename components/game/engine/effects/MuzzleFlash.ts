import Phaser from 'phaser'

/**
 * One-shot muzzle flash effect at the ship's cannon tip.
 * Creates two overlapping circles (inner bright + outer glow) and
 * tweens them to alpha=0 then self-destructs — zero manual cleanup needed.
 */
export class MuzzleFlash {
  private inner: Phaser.GameObjects.Arc
  private outer: Phaser.GameObjects.Arc

  constructor(scene: Phaser.Scene, x: number, y: number) {
    // Outer glow ring
    this.outer = scene.add.circle(x, y, 12, 0x00eeff, 0.45)
    this.outer.setBlendMode(Phaser.BlendModes.ADD)

    // Inner bright core
    this.inner = scene.add.circle(x, y, 6, 0xffffff, 0.95)
    this.inner.setBlendMode(Phaser.BlendModes.ADD)

    // Both fade to invisible then are destroyed
    scene.tweens.add({
      targets: [this.inner, this.outer],
      alpha:    { from: 1, to: 0 },
      scaleX:   { from: 1, to: 2.2 },
      scaleY:   { from: 1, to: 2.2 },
      duration: 90,
      ease:     'Quad.easeOut',
      onComplete: () => {
        this.inner.destroy()
        this.outer.destroy()
      },
    })
  }
}
