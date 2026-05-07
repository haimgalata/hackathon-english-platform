import * as Phaser from 'phaser'
import { GAME_WIDTH, GAME_HEIGHT } from '../config'
import { WORD_BANK } from '../data/vocabulary'
import { GameMode } from '../systems/ModeManager'

// ─── Types ────────────────────────────────────────────────────────────────────
interface StarData { x: number; y: number; speed: number; size: number; alpha: number }

interface FloatingCard {
  container: Phaser.GameObjects.Container
  gfx:       Phaser.GameObjects.Graphics
  label:     Phaser.GameObjects.Text
  vx: number; vy: number
  w: number;  h: number
}

// ─────────────────────────────────────────────────────────────────────────────
export class StartScene extends Phaser.Scene {

  private starLayers: Phaser.GameObjects.Graphics[] = []
  private starData:   StarData[][] = []
  private cards:      FloatingCard[] = []
  private promptText!: Phaser.GameObjects.Text
  private inputLocked = false
  private selectedMode = GameMode.Translation
  private modeButtons: Array<{
    mode: GameMode
    container: Phaser.GameObjects.Container
    box: Phaser.GameObjects.Graphics
    title: Phaser.GameObjects.Text
    subtitle: Phaser.GameObjects.Text
  }> = []

  constructor() { super({ key: 'StartScene' }) }

  // ── Lifecycle ────────────────────────────────────────────────────────────────

  create() {
    this.cameras.main.fadeIn(600, 0, 0, 0)

    this.createStarfield()
    this.createVignette()
    this.createFloatingCards()
    this.createTitle()
    this.createModeSelection()
    this.setupInput()
  }

  update(_time: number, delta: number) {
    const dt = delta / 1000
    this.scrollStars(dt)
    this.updateCards(dt)
  }

  // ── Stars ─────────────────────────────────────────────────────────────────────

  private createStarfield() {
    const layers = [
      { count: 120, speedRange: [12, 22],  sizeRange: [0.5, 1.0], alphaRange: [0.15, 0.45] },
      { count: 55,  speedRange: [30, 50],  sizeRange: [1.0, 1.5], alphaRange: [0.35, 0.65] },
      { count: 22,  speedRange: [60, 90],  sizeRange: [1.5, 2.5], alphaRange: [0.55, 0.95] },
    ]
    layers.forEach((layer) => {
      const gfx = this.add.graphics()
      const stars: StarData[] = Array.from({ length: layer.count }, () => ({
        x:     Phaser.Math.Between(0, GAME_WIDTH),
        y:     Phaser.Math.Between(0, GAME_HEIGHT),
        speed: Phaser.Math.FloatBetween(layer.speedRange[0], layer.speedRange[1]),
        size:  Phaser.Math.FloatBetween(layer.sizeRange[0],  layer.sizeRange[1]),
        alpha: Phaser.Math.FloatBetween(layer.alphaRange[0], layer.alphaRange[1]),
      }))
      this.starLayers.push(gfx)
      this.starData.push(stars)
      this.drawStarLayer(gfx, stars)
    })
  }

  private drawStarLayer(gfx: Phaser.GameObjects.Graphics, stars: StarData[]) {
    gfx.clear()
    stars.forEach((s) => {
      gfx.fillStyle(0xaaccff, s.alpha)
      gfx.fillCircle(s.x, s.y, s.size)
    })
  }

  private scrollStars(dt: number) {
    this.starData.forEach((stars, i) => {
      stars.forEach((s) => {
        s.y += s.speed * dt
        if (s.y > GAME_HEIGHT + 4) { s.y = -4; s.x = Phaser.Math.Between(0, GAME_WIDTH) }
      })
      this.drawStarLayer(this.starLayers[i], stars)
    })
  }

  // ── Vignette ──────────────────────────────────────────────────────────────────

  private createVignette() {
    const gfx = this.add.graphics().setDepth(1)
    // Top gradient (darker near title area)
    for (let i = 0; i < 8; i++) {
      gfx.fillStyle(0x000000, 0.06 * (8 - i) / 8)
      gfx.fillRect(0, i * 12, GAME_WIDTH, 12)
    }
    // Bottom gradient
    for (let i = 0; i < 8; i++) {
      gfx.fillStyle(0x000000, 0.06 * i / 8)
      gfx.fillRect(0, GAME_HEIGHT - (i + 1) * 12, GAME_WIDTH, 12)
    }
  }

  // ── Floating word cards ───────────────────────────────────────────────────────

  private createFloatingCards() {
    // Pick 8 random vocab words to float around
    const picked = Phaser.Utils.Array.Shuffle([...WORD_BANK]).slice(0, 8) as typeof WORD_BANK

    const positions: [number, number][] = [
      [90,  90],  [680, 80],  [60,  320], [720, 300],
      [130, 480], [640, 460], [350, 520], [400, 100],
    ]

    picked.forEach((entry, i) => {
      const [cx, cy] = positions[i] ?? [
        Phaser.Math.Between(80, GAME_WIDTH - 80),
        Phaser.Math.Between(80, GAME_HEIGHT - 80),
      ]

      const displayText = `${entry.english}\n${entry.correct}`
      const cardW = 130
      const cardH = 46

      const gfx = this.add.graphics()

      // Background
      gfx.fillStyle(0x050018, 0.82)
      this.roundRectPath(gfx, -cardW / 2, -cardH / 2, cardW, cardH, 8)
      gfx.fillPath()

      // Border — alternate category colours for variety
      const colors = [0x00aaff, 0xaa33ff, 0x00ffaa, 0xff9900, 0xff44aa]
      const borderColor = colors[i % colors.length]
      gfx.lineStyle(1.2, borderColor, 0.7)
      this.roundRectPath(gfx, -cardW / 2, -cardH / 2, cardW, cardH, 8)
      gfx.strokePath()

      const label = this.add.text(0, 0, displayText, {
        fontFamily: '"Share Tech Mono", monospace',
        fontSize:   '11px',
        color:      '#cceeff',
        align:      'center',
        lineSpacing: 2,
      }).setOrigin(0.5, 0.5)

      const container = this.add.container(cx, cy, [gfx, label]).setDepth(2).setAlpha(0)

      // Fade in with stagger
      this.tweens.add({
        targets: container, alpha: 0.65, duration: 600,
        delay: i * 100, ease: 'Quad.easeOut',
      })

      // Random slow drift velocity
      const speed = 18 + Math.random() * 20
      const angle = Math.random() * Math.PI * 2

      this.cards.push({
        container, gfx, label,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        w: cardW, h: cardH,
      })
    })
  }

  private updateCards(dt: number) {
    const margin = 60
    for (const card of this.cards) {
      card.container.x += card.vx * dt
      card.container.y += card.vy * dt

      // Bounce off edges
      if (card.container.x < margin || card.container.x > GAME_WIDTH - margin)  card.vx *= -1
      if (card.container.y < margin || card.container.y > GAME_HEIGHT - margin) card.vy *= -1

      card.container.x = Phaser.Math.Clamp(card.container.x, margin, GAME_WIDTH  - margin)
      card.container.y = Phaser.Math.Clamp(card.container.y, margin, GAME_HEIGHT - margin)
    }
  }

  // ── Title ─────────────────────────────────────────────────────────────────────

  private createTitle() {
    const cx = GAME_WIDTH  / 2
    const cy = GAME_HEIGHT / 2

    // ── Decorative ring behind title ──────────────────────────────────────────
    const ring = this.add.graphics().setDepth(3)
    ring.lineStyle(1, 0x003366, 0.5)
    ring.strokeEllipse(cx, cy - 20, 500, 180)
    this.tweens.add({
      targets: ring, angle: 360, duration: 20000, repeat: -1, ease: 'Linear',
    })

    // ── Title ─────────────────────────────────────────────────────────────────
    const title = this.add.text(cx, cy - 80, 'SPEAKTECH GALAXY', {
      fontFamily: 'Orbitron, monospace',
      fontSize:   '44px',
      fontStyle:  'bold',
      color:      '#00f5ff',
      shadow: { offsetX: 0, offsetY: 0, color: '#00ccff', blur: 28, fill: true, stroke: false },
    }).setOrigin(0.5).setDepth(4).setAlpha(0).setScale(0.6)

    this.tweens.add({
      targets: title,
      alpha: 1, scaleX: 1, scaleY: 1,
      duration: 700, delay: 200, ease: 'Back.easeOut',
    })

    // ── Subtitle ──────────────────────────────────────────────────────────────
    const sub = this.add.text(cx, cy - 26, 'English  ·  Tech  ·  Vocabulary  Shooter', {
      fontFamily: '"Share Tech Mono", monospace',
      fontSize:   '14px',
      color:      '#6688aa',
    }).setOrigin(0.5).setDepth(4).setAlpha(0)

    this.tweens.add({ targets: sub, alpha: 1, duration: 500, delay: 700, ease: 'Quad.easeOut' })

    // ── Category chips ────────────────────────────────────────────────────────
    const cats  = ['TECH', 'AI', 'GAMING', '3D', 'STARTUP']
    const cols  = ['#00aaff', '#aa33ff', '#ff9900', '#00ffaa', '#ff44aa']
    const totalW = cats.length * 90
    cats.forEach((cat, i) => {
      const chipX = cx - totalW / 2 + i * 90 + 45
      const chip = this.add.text(chipX, cy + 14, cat, {
        fontFamily: '"Segoe UI", "Segoe UI Hebrew", Arial, sans-serif',
        fontSize:   '11px',
        color:      cols[i],
        backgroundColor: '#00000055',
        padding: { x: 8, y: 4 },
      }).setOrigin(0.5).setDepth(4).setAlpha(0)

      this.tweens.add({ targets: chip, alpha: 0.8, duration: 400, delay: 900 + i * 80 })
    })

    // ── Choose a mode ────────────────────────────────────────────────────────
    this.promptText = this.add.text(cx, cy + 96, 'CLICK A MODE CARD OR PRESS 1 / 2', {
      fontFamily: '"Segoe UI", "Segoe UI Hebrew", Arial, sans-serif',
      fontSize:   '13px',
      color:      '#ffffff',
      shadow: { offsetX: 0, offsetY: 0, color: '#00aaff', blur: 10, fill: true, stroke: false },
    }).setOrigin(0.5).setDepth(4).setAlpha(0)

    this.tweens.add({ targets: this.promptText, alpha: 1, duration: 400, delay: 1200 })

    // Blink loop
    this.time.delayedCall(1200, () => {
      this.tweens.add({
        targets: this.promptText,
        alpha: { from: 0.25, to: 1 },
        duration: 650, yoyo: true, repeat: -1,
      })
    })

    // ── High score ────────────────────────────────────────────────────────────
    try {
      const saved = localStorage.getItem('stg_highscore')
      if (saved && parseInt(saved) > 0) {
        this.add.text(cx, cy + 112, `BEST  ${parseInt(saved).toLocaleString()}`, {
          fontFamily: '"Segoe UI", "Segoe UI Hebrew", Arial, sans-serif',
          fontSize:   '12px',
          color:      '#ffee00',
          shadow: { offsetX: 0, offsetY: 0, color: '#ffcc00', blur: 6, fill: true, stroke: false },
        }).setOrigin(0.5).setDepth(4).setAlpha(0)
          .setAlpha(0)
        // lazy fade — just set immediately
      }
    } catch { /* localStorage unavailable */ }

    // ── Version / credit ──────────────────────────────────────────────────────
    this.add.text(GAME_WIDTH - 8, GAME_HEIGHT - 8, 'SpeakTech Galaxy  v1.0', {
      fontFamily: '"Share Tech Mono", monospace',
      fontSize:   '10px',
      color:      '#334455',
    }).setOrigin(1, 1).setDepth(4)
  }

  // ── Input ─────────────────────────────────────────────────────────────────────

  private setupInput() {
    const space     = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    const keyOne    = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ONE)
    const keyTwo    = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.TWO)

    // Wait until animation settles before accepting input
    this.time.delayedCall(1000, () => {
      keyOne.once('down', () => this.beginGame(GameMode.Translation))
      keyTwo.once('down', () => this.beginGame(GameMode.Sentence))
      space.once('down', () => this.beginGame(this.selectedMode))
    })
  }

  private beginGame(mode: GameMode) {
    if (this.inputLocked) return
    this.inputLocked = true
    this.selectedMode = mode

    this.cameras.main.fadeOut(500, 0, 0, 0)
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('GameScene', { selectedMode: mode })
    })
  }

  // ── Helpers ───────────────────────────────────────────────────────────────────

  private createModeSelection() {
    const cx = GAME_WIDTH / 2
    const y  = GAME_HEIGHT / 2 + 56

    const modes: Array<{ mode: GameMode; label: string; description: string; color: number }> = [
      {
        mode: GameMode.Translation,
        label: 'TRANSLATION MODE',
        description: 'SHOOT THE CORRECT HEBREW WORD',
        color: 0x0066ff,
      },
      {
        mode: GameMode.Sentence,
        label: 'SENTENCE MODE',
        description: 'COMPLETE THE TECH SENTENCE',
        color: 0xffaa00,
      },
    ]

    modes.forEach((entry, index) => {
      const x = cx + (index === 0 ? -170 : 170)
      const box = this.add.graphics().setDepth(4)
      this.roundRectPath(box, -124, -40, 248, 80, 14)
      box.fillStyle(0x10102b, 0.94)
      box.fillPath()
      box.lineStyle(2, entry.color, 0.85)
      this.roundRectPath(box, -124, -40, 248, 80, 14)
      box.strokePath()

      const title = this.add.text(0, -10, entry.label, {
        fontFamily: '"Segoe UI", "Segoe UI Hebrew", Arial, sans-serif',
        fontSize:   '17px',
        color:      '#ffffff',
        fontStyle:  'bold',
      }).setOrigin(0.5).setDepth(5)

      const subtitle = this.add.text(0, 18, entry.description, {
        fontFamily: '"Segoe UI", "Segoe UI Hebrew", Arial, sans-serif',
        fontSize:   '11px',
        color:      '#aaccee',
        align:      'center',
      }).setOrigin(0.5).setDepth(5)

      const container = this.add.container(x, y, [box, title, subtitle]).setSize(248, 80).setDepth(4)
      container.setInteractive(new Phaser.Geom.Rectangle(-124, -40, 248, 80), Phaser.Geom.Rectangle.Contains)
      container.on('pointerdown', () => this.beginGame(entry.mode))
      container.on('pointerover', () => {
        if (this.inputLocked) return
        box.clear()
        this.roundRectPath(box, -124, -40, 248, 80, 14)
        box.fillStyle(0x182047, 0.96)
        box.fillPath()
        box.lineStyle(2, entry.color, 1)
        this.roundRectPath(box, -124, -40, 248, 80, 14)
        box.strokePath()
      })
      container.on('pointerout', () => {
        if (this.inputLocked) return
        box.clear()
        this.roundRectPath(box, -124, -40, 248, 80, 14)
        box.fillStyle(0x10102b, 0.94)
        box.fillPath()
        box.lineStyle(2, entry.color, 0.85)
        this.roundRectPath(box, -124, -40, 248, 80, 14)
        box.strokePath()
      })

      this.modeButtons.push({ mode: entry.mode, container, box, title, subtitle })
    })

    this.updateModeSelection()
  }

  private updateModeSelection() {
    this.modeButtons.forEach((entry) => {
      entry.box.clear()
      const isActive = entry.mode === this.selectedMode
      this.roundRectPath(entry.box, -124, -40, 248, 80, 14)
      entry.box.fillStyle(isActive ? 0x003b7f : 0x10102b, 0.96)
      entry.box.fillPath()
      entry.box.lineStyle(2, entry.mode === GameMode.Translation ? 0x0066ff : 0xffaa00, isActive ? 1 : 0.85)
      this.roundRectPath(entry.box, -124, -40, 248, 80, 14)
      entry.box.strokePath()

      entry.title.setColor(isActive ? '#ffffff' : '#cce6ff')
      entry.subtitle.setColor(isActive ? '#dfefff' : '#99b1d9')
    })
  }

  private roundRectPath(
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
}
