import Phaser from 'phaser'
import { GameQuestion, isSentenceQuestion } from '../data/vocabulary'
import { GameMode } from '../systems/ModeManager'
import { GAME_WIDTH } from '../config'

// ─────────────────────────────────────────────────────────────────────────────
/**
 * Fixed HUD panel (top of screen) showing the current target word + wave counter.
 */
export class TargetWordDisplay {
  private catText:    Phaser.GameObjects.Text
  private modeText:   Phaser.GameObjects.Text
  private helpText:   Phaser.GameObjects.Text
  private hintText:   Phaser.GameObjects.Text
  private wordText:   Phaser.GameObjects.Text
  private waveText:   Phaser.GameObjects.Text

  private readonly PANEL_H = 72

  constructor(scene: Phaser.Scene) {
    const cx = GAME_WIDTH / 2

    // ── Background panel ──────────────────────────────────────────────────────
    const bg = scene.add.graphics().setDepth(10)
    bg.fillStyle(0x000814, 0.90)
    bg.fillRect(0, 0, GAME_WIDTH, this.PANEL_H)
    // Top line
    bg.lineStyle(1, 0x003366, 1)
    bg.beginPath(); bg.moveTo(0, 0); bg.lineTo(GAME_WIDTH, 0); bg.strokePath()
    // Bottom glow border
    bg.lineStyle(1.5, 0x0055cc, 0.55)
    bg.beginPath(); bg.moveTo(0, this.PANEL_H); bg.lineTo(GAME_WIDTH, this.PANEL_H); bg.strokePath()
    // Subtle centre under-glow (stacked alpha rects, no temp Graphics)
    for (let i = 0; i < 5; i++) {
      bg.fillStyle(0x0033aa, 0.025 * (5 - i))
      bg.fillRect(GAME_WIDTH * 0.15, this.PANEL_H - (i + 1) * 4, GAME_WIDTH * 0.7, 4)
    }

    // ── Category badge ────────────────────────────────────────────────────────
    this.modeText = scene.add.text(12, 12, 'MODE: TRANSLATION', {
      fontFamily: '"Segoe UI", "Segoe UI Hebrew", Arial, sans-serif',
      fontSize: '10px', color: '#66ccff',
    }).setOrigin(0, 0.5).setDepth(11)

    this.helpText = scene.add.text(12, 32, 'Press M to switch modes', {
      fontFamily: '"Segoe UI", "Segoe UI Hebrew", Arial, sans-serif',
      fontSize: '10px', color: '#aabbee',
    }).setOrigin(0, 0.5).setDepth(11)

    this.catText = scene.add.text(cx, 10, '', {
      fontFamily: '"Segoe UI", "Segoe UI Hebrew", Arial, sans-serif',
      fontSize: '11px', color: '#8866cc',
    }).setOrigin(0.5, 0.5).setDepth(11)

    // ── Instruction ───────────────────────────────────────────────────────────
    this.hintText = scene.add.text(cx, 26, 'SHOOT THE CORRECT HEBREW TRANSLATION OF:', {
      fontFamily: '"Segoe UI", "Segoe UI Hebrew", Arial, sans-serif',
      fontSize: '10px', color: '#445566',
    }).setOrigin(0.5, 0.5).setDepth(11)

    // ── Target word ───────────────────────────────────────────────────────────
    this.wordText = scene.add.text(cx, 52, '...', {
      fontFamily: '"Segoe UI", "Segoe UI Hebrew", Arial, sans-serif',
      fontSize: '24px', fontStyle: 'bold', color: '#00f5ff',
      align: 'center',
      wordWrap: { width: GAME_WIDTH * 0.82 },
      shadow: { offsetX: 0, offsetY: 0, color: '#00bbee', blur: 14, fill: true, stroke: false },
    }).setOrigin(0.5, 0.5).setDepth(11)

    // ── Wave counter (top-right corner of the panel) ──────────────────────────
    this.waveText = scene.add.text(GAME_WIDTH - 10, 36, 'WAVE 1', {
      fontFamily: '"Segoe UI", "Segoe UI Hebrew", Arial, sans-serif',
      fontSize: '11px', color: '#334466',
    }).setOrigin(1, 0.5).setDepth(11)
  }

  setMode(mode: GameMode) {
    this.modeText.setText(mode === GameMode.Sentence ? 'MODE: SENTENCE' : 'MODE: TRANSLATION')
    this.hintText.setText(
      mode === GameMode.Sentence
        ? 'COMPLETE THE TECH SENTENCE:'
        : 'SHOOT THE CORRECT HEBREW TRANSLATION OF:',
    )
    const color = mode === GameMode.Sentence ? '#ffe36b' : '#00f5ff'
    const size = mode === GameMode.Sentence ? '20px' : '24px'
    this.wordText.setStyle({ color, fontSize: size })
  }

  setQuestion(q: GameQuestion) {
    this.catText.setText(`[ ${q.entry.category.toUpperCase()} ]`)
    if (isSentenceQuestion(q)) {
      this.wordText.setText(q.entry.sentence)
    } else {
      this.wordText.setText(q.entry.english)
    }
  }

  setWave(n: number) {
    this.waveText.setText(`WAVE  ${n}`)
  }
}
