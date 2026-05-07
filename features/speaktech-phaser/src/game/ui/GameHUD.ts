import * as Phaser from 'phaser'
import { GameStats } from '../systems/ScoreManager'
import { GAME_WIDTH } from '../config'

// ─────────────────────────────────────────────────────────────────────────────
/**
 * In-game HUD: health hearts (top-left), score + combo (top-right).
 * Sits on depth 10 — above enemies, below feedback text.
 *
 * Call hud.update(stats) every frame (cheap — only redraws on change).
 */
export class GameHUD {
  private heartTexts:  Phaser.GameObjects.Text[] = []
  private nameLabel:   Phaser.GameObjects.Text
  private scoreLabel:  Phaser.GameObjects.Text
  private scoreValue:  Phaser.GameObjects.Text
  private comboText:   Phaser.GameObjects.Text

  // Track previous values to avoid redundant setText calls
  private prevScore  = -1
  private prevCombo  = -1
  private prevHealth = -1
  private prevName   = ''

  private readonly HUD_Y    = 82    // below the target-word panel (72px tall)
  private readonly PAD      = 14

  constructor(scene: Phaser.Scene) {
    const rightX = GAME_WIDTH - this.PAD

    // ── Health hearts ─────────────────────────────────────────────────────────
    for (let i = 0; i < 3; i++) {
      const t = scene.add.text(this.PAD + i * 28, this.HUD_Y, '♥', {
        fontFamily: 'Arial',
        fontSize:   '22px',
        color:      '#ff3355',
        shadow: { offsetX: 0, offsetY: 0, color: '#ff0033', blur: 8, fill: true, stroke: false },
      })
      t.setOrigin(0, 0).setDepth(10)
      this.heartTexts.push(t)
    }

    this.nameLabel = scene.add.text(this.PAD, this.HUD_Y + 28, 'STUDENT', {
      fontFamily: '"Share Tech Mono", monospace',
      fontSize: '10px',
      color: '#88bbff',
    }).setOrigin(0, 0).setDepth(10)

    // ── Score label ───────────────────────────────────────────────────────────
    this.scoreLabel = scene.add.text(rightX, this.HUD_Y, 'SCORE', {
      fontFamily: '"Share Tech Mono", monospace',
      fontSize:   '11px',
      color:      '#5577aa',
    })
    this.scoreLabel.setOrigin(1, 0).setDepth(10)

    this.scoreValue = scene.add.text(rightX, this.HUD_Y + 14, '0', {
      fontFamily: 'Orbitron, monospace',
      fontSize:   '20px',
      fontStyle:  'bold',
      color:      '#00f5ff',
      shadow: { offsetX: 0, offsetY: 0, color: '#00ccff', blur: 8, fill: true, stroke: false },
    })
    this.scoreValue.setOrigin(1, 0).setDepth(10)

    // ── Combo ─────────────────────────────────────────────────────────────────
    this.comboText = scene.add.text(rightX, this.HUD_Y + 40, '', {
      fontFamily: 'Orbitron, monospace',
      fontSize:   '13px',
      fontStyle:  'bold',
      color:      '#ffee00',
      shadow: { offsetX: 0, offsetY: 0, color: '#ffaa00', blur: 6, fill: true, stroke: false },
    })
    this.comboText.setOrigin(1, 0).setDepth(10)
  }

  // ── Called every frame ─────────────────────────────────────────────────────

  update(stats: GameStats) {
    // Score
    if (stats.score !== this.prevScore) {
      this.scoreValue.setText(stats.score.toString())
      this.prevScore = stats.score
    }

    // Combo
    if (stats.combo !== this.prevCombo) {
      this.comboText.setText(stats.combo >= 2 ? `x${stats.combo} COMBO` : '')
      this.prevCombo = stats.combo
    }

    // Hearts
    if (stats.health !== this.prevHealth) {
      this.heartTexts.forEach((t, i) => {
        const alive = i < stats.health
        t.setText(alive ? '♥' : '♡')
        t.setColor(alive ? '#ff3355' : '#333355')
        t.setShadow(0, 0, alive ? '#ff0033' : 'transparent', alive ? 8 : 0, true, false)
      })
      this.prevHealth = stats.health
    }
  }

  setPlayerName(name: string) {
    if (name === this.prevName) return
    this.nameLabel.setText(name.toUpperCase())
    this.prevName = name
  }

  /** Flash the score upward when points are awarded */
  punchScore(scene: Phaser.Scene) {
    scene.tweens.add({
      targets:  this.scoreValue,
      scaleX:   { from: 1.4, to: 1 },
      scaleY:   { from: 1.4, to: 1 },
      duration: 200,
      ease:     'Back.easeOut',
    })
  }

  /** Shake the hearts when health is lost */
  shakeHealth(scene: Phaser.Scene) {
    const targets = this.heartTexts.filter((_, i) => i < 3)
    scene.tweens.add({
      targets,
      x:        { from: (t: Phaser.GameObjects.Text) => t.x - 5, to: (t: Phaser.GameObjects.Text) => t.x },
      duration: 60,
      yoyo:     true,
      repeat:   2,
    })
  }
}
