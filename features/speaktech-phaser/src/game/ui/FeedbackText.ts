import * as Phaser from 'phaser'

/**
 * Spawns a floating arcade-style feedback label that rises and fades out.
 * Self-destructs — no cleanup needed by caller.
 *
 * Usage:
 *   FeedbackText.show(this, x, y, '+300  COMBO x3!', '#00ff88')
 */
export class FeedbackText {
  static show(
    scene:  Phaser.Scene,
    x:      number,
    y:      number,
    text:   string,
    color:  string,
    size = 20,
  ) {
    const label = scene.add.text(x, y, text, {
      fontFamily: 'Orbitron, "Share Tech Mono", monospace',
      fontSize:   `${size}px`,
      fontStyle:  'bold',
      color,
      stroke:     '#000000',
      strokeThickness: 3,
      shadow: {
        offsetX: 0, offsetY: 0,
        color,
        blur:   10,
        fill:   true,
        stroke: false,
      },
    })
    label.setOrigin(0.5, 0.5).setDepth(30)

    scene.tweens.add({
      targets:  label,
      y:        y - 70,
      alpha:    { from: 1, to: 0 },
      scaleX:   { from: 1, to: 0.8 },
      scaleY:   { from: 1, to: 0.8 },
      duration: 1100,
      ease:     'Quad.easeOut',
      onComplete: () => label.destroy(),
    })
  }

  /** Large centred flash (e.g. "COMBO x5!") that pulses and fades */
  static showCombo(scene: Phaser.Scene, x: number, y: number, combo: number) {
    if (combo < 2) return

    const label = scene.add.text(x, y, `COMBO  x${combo}!`, {
      fontFamily: 'Orbitron, monospace',
      fontSize:   '30px',
      fontStyle:  'bold',
      color:      '#ffee00',
      stroke:     '#000',
      strokeThickness: 4,
      shadow: { offsetX: 0, offsetY: 0, color: '#ffee00', blur: 16, fill: true, stroke: false },
    })
    label.setOrigin(0.5, 0.5).setDepth(31)

    scene.tweens.add({
      targets:  label,
      y:        y - 50,
      scaleX:   { from: 1.3, to: 0.9 },
      scaleY:   { from: 1.3, to: 0.9 },
      alpha:    { from: 1,   to: 0 },
      duration: 900,
      ease:     'Back.easeOut',
      onComplete: () => label.destroy(),
    })
  }
}
