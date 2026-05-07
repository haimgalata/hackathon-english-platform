import * as Phaser from 'phaser'
import { GAME_WIDTH, GAME_HEIGHT } from '../config'
import { LeaderBoardEntry } from '../systems/LeaderBoard'

// ─────────────────────────────────────────────────────────────────────────────
/**
 * Full-screen game-over overlay.
 * All objects sit on their own depth — no parent container (avoids z-ordering issues).
 * Calls onRestart once then removes all listeners to prevent restart spam.
 */
export class GameOverScreen {
  private objects: Phaser.GameObjects.GameObject[] = []
  private triggered = false

  constructor(
    scene: Phaser.Scene,
    finalScore: number,
    topScores: LeaderBoardEntry[],
    playerName: string,
    onRestart: () => void,
  ) {
    const cx = GAME_WIDTH  / 2
    const cy = GAME_HEIGHT / 2

    const D = 50   // base depth

    // ── Dark overlay ──────────────────────────────────────────────────────────
    const overlay = scene.add.rectangle(cx, cy, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0)
    overlay.setDepth(D)
    scene.tweens.add({ targets: overlay, fillAlpha: 0.82, duration: 400, ease: 'Quad.easeIn' })

    // ── Panel ─────────────────────────────────────────────────────────────────
    const panel = scene.add.graphics().setDepth(D + 1)
    panel.fillStyle(0x05001a, 0.96)
    panel.fillRoundedRect(cx - 230, cy - 155, 460, 310, 16)
    panel.lineStyle(2, 0xff2255, 0.85)
    panel.strokeRoundedRect(cx - 230, cy - 155, 460, 310, 16)
    // Inner glow line
    panel.lineStyle(1, 0xff2255, 0.25)
    panel.strokeRoundedRect(cx - 224, cy - 149, 448, 298, 13)

    // ── GAME OVER ─────────────────────────────────────────────────────────────
    const title = scene.add.text(cx, cy - 100, 'GAME  OVER', {
      fontFamily: 'Orbitron, monospace', fontSize: '42px', fontStyle: 'bold',
      color: '#ff2255',
      shadow: { offsetX: 0, offsetY: 0, color: '#ff0033', blur: 24, fill: true, stroke: false },
    }).setOrigin(0.5).setDepth(D + 2).setAlpha(0)

    // ── Final score label ─────────────────────────────────────────────────────
    const scoreLbl = scene.add.text(cx, cy - 24, 'FINAL  SCORE', {
      fontFamily: '"Share Tech Mono", monospace', fontSize: '13px', color: '#445577',
    }).setOrigin(0.5).setDepth(D + 2).setAlpha(0)

    const scoreNum = scene.add.text(cx, cy + 22, finalScore.toLocaleString(), {
      fontFamily: 'Orbitron, monospace', fontSize: '50px', fontStyle: 'bold',
      color: '#00f5ff',
      shadow: { offsetX: 0, offsetY: 0, color: '#00aaff', blur: 18, fill: true, stroke: false },
    }).setOrigin(0.5).setDepth(D + 2).setAlpha(0)

    const playerText = scene.add.text(cx, cy + 62, `PLAYER: ${playerName.toUpperCase()}`, {
      fontFamily: '"Share Tech Mono", monospace',
      fontSize: '11px',
      color: '#88ccff',
    }).setOrigin(0.5).setDepth(D + 2).setAlpha(0)

    const leaderboardTitle = scene.add.text(cx, cy + 88, 'TOP STUDENTS', {
      fontFamily: '"Share Tech Mono", monospace',
      fontSize: '12px',
      color: '#aaccff',
    }).setOrigin(0.5).setDepth(D + 2).setAlpha(0)

    const names = topScores.map((score, index) => `${index + 1}. ${score.name.slice(0, 12).toUpperCase()} ${score.score.toLocaleString()}`)
    const leaderboardText = scene.add.text(cx, cy + 106, names.join('\n') || 'NO SCORES YET', {
      fontFamily: '"Share Tech Mono", monospace',
      fontSize: '12px',
      color: '#88ccff',
      align: 'center',
      lineSpacing: 5,
    }).setOrigin(0.5, 0).setDepth(D + 2).setAlpha(0)

    // ── Restart prompt ────────────────────────────────────────────────────────
    const prompt = scene.add.text(cx, cy + 190, 'PRESS  SPACE  OR  TAP  TO  PLAY  AGAIN', {
      fontFamily: '"Share Tech Mono", monospace', fontSize: '12px', color: '#7788aa',
    }).setOrigin(0.5).setDepth(D + 2).setAlpha(0)

    // Staggered fade-in
    scene.tweens.add({
      targets: [title, scoreLbl, scoreNum, playerText, leaderboardTitle, leaderboardText, prompt],
      alpha: 1, duration: 320,
      delay: scene.tweens.stagger(110, { start: 280 }),
      ease: 'Quad.easeOut',
    })

    // Blink the prompt after it appears
    scene.time.delayedCall(280 + 4 * 110 + 320, () => {
      scene.tweens.add({
        targets: prompt, alpha: { from: 0.2, to: 1 },
        duration: 650, yoyo: true, repeat: -1,
      })
    })

    this.objects = [overlay, panel, title, scoreLbl, scoreNum, playerText, leaderboardTitle, leaderboardText, prompt]

    // ── Restart input — guarded with 600 ms delay + once flag ─────────────────
    const trigger = () => {
      if (this.triggered) return
      this.triggered = true
      onRestart()
    }

    scene.time.delayedCall(600, () => {
      // Use named handler so we can remove it on destroy
      const keyHandler = (ev: KeyboardEvent) => { if (ev.code === 'Space') trigger() }
      scene.input.keyboard!.on('keydown', keyHandler)
      scene.input.once('pointerdown', trigger)

      // Store for cleanup
      this._keyHandler = keyHandler
      this._kbRef = scene.input.keyboard!
    })
  }

  private _keyHandler: ((ev: KeyboardEvent) => void) | null = null
  private _kbRef: Phaser.Input.Keyboard.KeyboardPlugin | null = null

  destroy() {
    if (this._keyHandler && this._kbRef) {
      this._kbRef.off('keydown', this._keyHandler)
    }
    this.objects.forEach((o) => o.destroy())
  }
}
