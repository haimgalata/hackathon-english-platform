import * as Phaser from 'phaser'
import { GAME_WIDTH, GAME_HEIGHT } from '../config'
import { GameMode } from '../systems/ModeManager'

interface TransitionData {
  correctWordIds: string[]
  correctWords:   string[]   // display names for showing to the player
  score:          number
  nickname:       string
}

// Encouraging messages based on performance
function getMessage(correct: number, total: number): string {
  const ratio = correct / Math.max(total, 1)
  if (ratio >= 0.8) return 'OUTSTANDING PERFORMANCE!'
  if (ratio >= 0.6) return 'GREAT WORK, CADET!'
  if (ratio >= 0.4) return 'GOOD EFFORT — KEEP PUSHING!'
  return 'EVERY WORD COUNTS — STAY SHARP!'
}

export class TransitionScene extends Phaser.Scene {

  private data_: TransitionData = { correctWordIds: [], correctWords: [], score: 0, nickname: 'STUDENT' }
  private totalWords = 0

  constructor() { super({ key: 'TransitionScene' }) }

  init(data: TransitionData & { totalWords?: number }) {
    this.data_      = data
    this.totalWords = data.totalWords ?? 20
  }

  create() {
    this.cameras.main.fadeIn(500, 0, 0, 0)
    this.createBackground()
    this.createContent()
  }

  // ── Background ────────────────────────────────────────────────────────────────

  private createBackground() {
    // Dark panel
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000814, 1)

    // Animated scanlines
    const lines = this.add.graphics().setAlpha(0.06)
    for (let y = 0; y < GAME_HEIGHT; y += 4) {
      lines.lineStyle(1, 0x00aaff, 1)
      lines.beginPath(); lines.moveTo(0, y); lines.lineTo(GAME_WIDTH, y); lines.strokePath()
    }

    // Stars
    const stars = this.add.graphics()
    for (let i = 0; i < 80; i++) {
      const alpha = Phaser.Math.FloatBetween(0.1, 0.6)
      stars.fillStyle(0xaaccff, alpha)
      stars.fillCircle(
        Phaser.Math.Between(0, GAME_WIDTH),
        Phaser.Math.Between(0, GAME_HEIGHT),
        Phaser.Math.FloatBetween(0.5, 1.5),
      )
    }

    // Glowing horizontal divider lines
    const div = this.add.graphics()
    div.lineStyle(1, 0x00aaff, 0.4)
    div.beginPath(); div.moveTo(0, 130); div.lineTo(GAME_WIDTH, 130); div.strokePath()
    div.lineStyle(1, 0x00aaff, 0.4)
    div.beginPath(); div.moveTo(0, GAME_HEIGHT - 110); div.lineTo(GAME_WIDTH, GAME_HEIGHT - 110); div.strokePath()
  }

  // ── Content ───────────────────────────────────────────────────────────────────

  private createContent() {
    const cx     = GAME_WIDTH  / 2
    const { correctWordIds, correctWords, score } = this.data_
    const count  = correctWordIds.length
    const msg    = getMessage(count, this.totalWords)

    // ── Stage complete banner ─────────────────────────────────────────────────
    const banner = this.add.text(cx, 40, '✦  TRANSLATION STAGE COMPLETE  ✦', {
      fontFamily: 'Orbitron, monospace',
      fontSize:   '22px',
      fontStyle:  'bold',
      color:      '#00f5ff',
      shadow: { offsetX: 0, offsetY: 0, color: '#00ccff', blur: 20, fill: true },
    }).setOrigin(0.5).setAlpha(0)

    this.tweens.add({ targets: banner, alpha: 1, duration: 600, delay: 100 })

    // ── Score line ────────────────────────────────────────────────────────────
    const scoreLine = this.add.text(cx, 85, `SCORE:  ${score.toLocaleString()}`, {
      fontFamily: '"Share Tech Mono", monospace',
      fontSize:   '15px',
      color:      '#ffee44',
    }).setOrigin(0.5).setAlpha(0)

    this.tweens.add({ targets: scoreLine, alpha: 1, duration: 400, delay: 350 })

    // ── Word count ────────────────────────────────────────────────────────────
    const countText = this.add.text(cx, 158, `WORDS MASTERED:  ${count} / ${this.totalWords}`, {
      fontFamily: 'Orbitron, monospace',
      fontSize:   '20px',
      fontStyle:  'bold',
      color:      count > 0 ? '#00ff88' : '#ff4466',
      shadow: { offsetX: 0, offsetY: 0, color: count > 0 ? '#00cc66' : '#cc2244', blur: 14, fill: true },
    }).setOrigin(0.5).setAlpha(0)

    this.tweens.add({ targets: countText, alpha: 1, duration: 500, delay: 500 })

    // ── Encouraging message ───────────────────────────────────────────────────
    const msgText = this.add.text(cx, 196, msg, {
      fontFamily: '"Share Tech Mono", monospace',
      fontSize:   '13px',
      color:      '#aaccee',
    }).setOrigin(0.5).setAlpha(0)

    this.tweens.add({ targets: msgText, alpha: 0.85, duration: 400, delay: 700 })

    // ── Mastered word list ────────────────────────────────────────────────────
    if (correctWords.length > 0) {
      const display = correctWords.slice(0, 14).join('  ·  ')
      this.add.text(cx, 232, display, {
        fontFamily: '"Share Tech Mono", monospace',
        fontSize:   '11px',
        color:      '#55ddaa',
        wordWrap:   { width: GAME_WIDTH - 80 },
        align:      'center',
      }).setOrigin(0.5).setAlpha(0.8)
    }

    if (count === 0) {
      // No correct words — can't proceed to sentence mode
      this.createRetryButton(cx)
    } else {
      this.createNextStageBlock(cx)
    }
  }

  // ── Button: no correct words ───────────────────────────────────────────────

  private createRetryButton(cx: number) {
    const info = this.add.text(cx, 310, 'No words mastered this round.\nPractice Translation Mode to unlock Sentence Mode!', {
      fontFamily: '"Share Tech Mono", monospace',
      fontSize:   '13px',
      color:      '#ff8844',
      align:      'center',
    }).setOrigin(0.5).setAlpha(0)

    this.tweens.add({ targets: info, alpha: 1, duration: 400, delay: 900 })
    this.createButton(cx, 430, 'RETRY TRANSLATION MODE', 0xff6600, () => {
      this.cameras.main.fadeOut(400, 0, 0, 0)
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('GameScene', { selectedMode: GameMode.Translation })
      })
    })
  }

  // ── Next stage block ──────────────────────────────────────────────────────

  private createNextStageBlock(cx: number) {
    // Arrow decoration
    const arrow = this.add.text(cx, 290, '▼  NEXT STAGE  ▼', {
      fontFamily: 'Orbitron, monospace',
      fontSize:   '12px',
      color:      '#334466',
    }).setOrigin(0.5).setAlpha(0)

    this.tweens.add({ targets: arrow, alpha: 0.7, duration: 400, delay: 800 })

    // Stage description
    const stageLabel = this.add.text(cx, 330, 'SENTENCE COMPLETION MODE', {
      fontFamily: 'Orbitron, monospace',
      fontSize:   '17px',
      fontStyle:  'bold',
      color:      '#ffaa00',
      shadow: { offsetX: 0, offsetY: 0, color: '#cc7700', blur: 12, fill: true },
    }).setOrigin(0.5).setAlpha(0)

    this.tweens.add({ targets: stageLabel, alpha: 1, duration: 500, delay: 950 })

    const stageDesc = this.add.text(cx, 360, 'Use your mastered words to complete real tech sentences', {
      fontFamily: '"Share Tech Mono", monospace',
      fontSize:   '12px',
      color:      '#aaccee',
    }).setOrigin(0.5).setAlpha(0)

    this.tweens.add({ targets: stageDesc, alpha: 0.85, duration: 400, delay: 1100 })

    // Button — delayed so player reads the screen first
    this.time.delayedCall(1300, () => {
      this.createButton(cx, 440, 'READY FOR THE NEXT STAGE?', 0x00aaff, () => {
        this.cameras.main.fadeOut(500, 0, 0, 0)
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('GameScene', {
            selectedMode:   GameMode.Sentence,
            correctWordIds: this.data_.correctWordIds,
            continueScore:  this.data_.score,
            nickname:       this.data_.nickname,
          })
        })
      })
    })
  }

  // ── Reusable button ──────────────────────────────────────────────────────────

  private createButton(cx: number, y: number, label: string, color: number, onClick: () => void) {
    const bw = 360
    const bh = 54

    const box = this.add.graphics()
    const drawBox = (hover: boolean) => {
      box.clear()
      box.fillStyle(hover ? color : 0x0a0a2a, hover ? 0.25 : 0.9)
      box.fillRoundedRect(cx - bw / 2, y - bh / 2, bw, bh, 10)
      box.lineStyle(2, color, hover ? 1 : 0.8)
      box.strokeRoundedRect(cx - bw / 2, y - bh / 2, bw, bh, 10)
    }
    drawBox(false)

    const text = this.add.text(cx, y, label, {
      fontFamily: 'Orbitron, monospace',
      fontSize:   '14px',
      fontStyle:  'bold',
      color:      `#${color.toString(16).padStart(6, '0')}`,
    }).setOrigin(0.5)

    // Blink tween on button text
    this.tweens.add({ targets: text, alpha: { from: 0.7, to: 1 }, duration: 700, yoyo: true, repeat: -1 })

    const zone = this.add.zone(cx, y, bw, bh).setInteractive({ useHandCursor: true })
    zone.on('pointerover',  () => drawBox(true))
    zone.on('pointerout',   () => drawBox(false))
    zone.on('pointerdown',  onClick)

    box.setAlpha(0); text.setAlpha(0)
    this.tweens.add({ targets: [box, text], alpha: 1, duration: 400 })
  }
}
