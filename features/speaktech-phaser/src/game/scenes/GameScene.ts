import Phaser from 'phaser'
import { GAME_WIDTH, GAME_HEIGHT }  from '../config'
import { createLaserTexture }       from '../objects/PlayerLaser'
import { LaserSystem }              from '../systems/LaserSystem'
import { AnswerSpawner }            from '../systems/AnswerSpawner'
import { CollisionManager }         from '../systems/CollisionManager'
import { ScoreManager }             from '../systems/ScoreManager'
import { SoundSystem }              from '../audio/SoundSystem'
import { MuzzleFlash }              from '../effects/MuzzleFlash'
import { spawnExplosion }           from '../effects/ExplosionEffect'
import { TargetWordDisplay }        from '../ui/TargetWordDisplay'
import { GameHUD }                  from '../ui/GameHUD'
import { FeedbackText }             from '../ui/FeedbackText'
import { GameOverScreen }           from '../ui/GameOverScreen'
import { AnswerEnemy }              from '../objects/AnswerEnemy'
import { ModeManager, GameMode }    from '../systems/ModeManager'
import { isSentenceQuestion }        from '../data/vocabulary'
import { addLeaderboardScore, getTopLeaderboard } from '../systems/LeaderBoard'

// ─── Constants ────────────────────────────────────────────────────────────────
const SHIP_SPEED    = 380
const SHIP_Y_OFFSET = 80

type StarData = { x: number; y: number; speed: number; size: number; alpha: number }

// ─────────────────────────────────────────────────────────────────────────────
export class GameScene extends Phaser.Scene {

  // ── Player ───────────────────────────────────────────────────────────────────
  private ship!:  Phaser.GameObjects.Graphics
  private shipX = GAME_WIDTH / 2
  private shipY = GAME_HEIGHT - SHIP_Y_OFFSET

  // ── Systems ──────────────────────────────────────────────────────────────────
  private laserSystem!:      LaserSystem
  private answerSpawner!:    AnswerSpawner
  private collisionManager!: CollisionManager
  private scoreManager!:     ScoreManager
  private sfx!:              SoundSystem

  // ── UI ───────────────────────────────────────────────────────────────────────
  private targetDisplay!:  TargetWordDisplay
  private hud!:            GameHUD
  private damageOverlay!:  Phaser.GameObjects.Rectangle
  private gameOverScreen:  GameOverScreen | null = null

  private modeManager!:      ModeManager
  private initialMode      = GameMode.Translation
  private modeToggleKey!:   Phaser.Input.Keyboard.Key
  private nickname         = 'STUDENT'

  // ── Progression tracking ──────────────────────────────────────────────────────
  private correctWordIds   = new Set<string>()
  private correctWordNames = new Map<string, string>()  // id → english label
  private continueScore    = 0
  private incomingWordIds: string[] | null = null

  // ── Input ────────────────────────────────────────────────────────────────────
  private cursors!:  Phaser.Types.Input.Keyboard.CursorKeys
  private wasd!:     { left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key }
  private spaceKey!: Phaser.Input.Keyboard.Key

  // ── Stars ────────────────────────────────────────────────────────────────────
  private starLayers: Phaser.GameObjects.Graphics[] = []
  private starData:   StarData[][] = []

  constructor() { super({ key: 'GameScene' }) }

  // ── Lifecycle ────────────────────────────────────────────────────────────────

  init(data: { selectedMode?: GameMode; correctWordIds?: string[]; continueScore?: number; nickname?: string }) {
    this.initialMode     = data?.selectedMode ?? GameMode.Translation
    this.incomingWordIds = data?.correctWordIds ?? null
    this.continueScore   = data?.continueScore  ?? 0
    if (data?.nickname) this.nickname = data.nickname
    this.correctWordIds.clear()
    this.correctWordNames.clear()
  }

  create() {
    // Clean stop of any leftover music from previous session
    this.events.once('shutdown', () => { this.sfx?.stopMusic() })

    this.sfx          = new SoundSystem()
    this.scoreManager = new ScoreManager()
    if (this.continueScore > 0) this.scoreManager.seedScore(this.continueScore)

    createLaserTexture(this)

    this.createStarfield()
    this.createShip()
    this.setupInput()
    this.setupEngineEmitter()
    this.createDamageOverlay()

    // ── Systems ───────────────────────────────────────────────────────────────
    this.modeManager  = new ModeManager()
    this.modeManager.setMode(this.initialMode)
    if (this.incomingWordIds) this.modeManager.masteredWordIds = this.incomingWordIds
    this.laserSystem   = new LaserSystem(this, { cooldownMs: 180 })
    this.answerSpawner = new AnswerSpawner(this, this.modeManager)
    this.collisionManager = new CollisionManager(
      this, this.laserSystem, this.answerSpawner, this.scoreManager,
    )

    // ── UI ────────────────────────────────────────────────────────────────────
    this.targetDisplay = new TargetWordDisplay(this)
    this.hud           = new GameHUD(this)

    this.nickname = this.getNickname()
    this.hud.setPlayerName(this.nickname)

    // ── Wire callbacks ────────────────────────────────────────────────────────
    this.answerSpawner.onNewQuestion = (q) => {
      this.targetDisplay.setMode(this.modeManager.currentMode)
      this.targetDisplay.setQuestion(q)
      this.targetDisplay.setWave(this.answerSpawner.wave)
    }
    this.collisionManager.onCorrectHit = (e, pts) => this.handleCorrectHit(e, pts)
    this.collisionManager.onWrongHit   = (e)      => this.handleWrongHit(e)
    this.collisionManager.onGameOver   = ()        => this.handleGameOver()

    // ── Start ─────────────────────────────────────────────────────────────────
    this.cameras.main.fadeIn(400, 0, 0, 0)
    this.answerSpawner.start()
    this.sfx.startMusic()

    this.input.on('pointerdown', () => this.tryShoot())

    this.modeToggleKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.M)
  }

  update(_time: number, delta: number) {
    if (Phaser.Input.Keyboard.JustDown(this.modeToggleKey)) {
      this.toggleGameMode()
    }
    if (this.scoreManager.isGameOver) return

    const dt = delta / 1000
    this.handleMovement(dt)
    this.handleShootInput()
    this.scrollStars(dt)
    this.redrawShip()

    this.answerSpawner.update(delta)
    this.collisionManager.update()
    this.hud.update(this.scoreManager.stats)
  }

  private toggleGameMode() {
    if (this.scoreManager.isGameOver) return
    this.modeManager.toggleMode()
    this.answerSpawner.clearCurrentWave()
    this.answerSpawner.start()

    FeedbackText.show(
      this,
      GAME_WIDTH / 2,
      96,
      this.modeManager.currentMode === GameMode.Sentence ? 'SENTENCE MODE' : 'TRANSLATION MODE',
      '#ffdf00',
      18,
    )
  }

  // ── Correct hit ───────────────────────────────────────────────────────────────

  private handleCorrectHit(enemy: AnswerEnemy, pts: number) {
    const { combo } = this.scoreManager.stats

    // Track mastered words in Translation mode for smart progression
    if (this.modeManager.currentMode === GameMode.Translation) {
      const q = this.answerSpawner.currentQuestion
      if (q && !isSentenceQuestion(q)) {
        this.correctWordIds.add(q.entry.id)
        this.correctWordNames.set(q.entry.id, q.entry.english)
      }
    }

    spawnExplosion(this, enemy.x, enemy.y, true)
    this.sfx.playCorrect()
    this.cameras.main.shake(110, 0.006)

    FeedbackText.show(this, enemy.x, enemy.y - 24, `+${pts}`, '#00ff88', 22)
    FeedbackText.showCombo(this, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50, combo)

    this.hud.punchScore(this)

    // Remove hit enemy from spawner's list before clearing the wave
    const idx = this.answerSpawner.enemies.indexOf(enemy)
    if (idx !== -1) this.answerSpawner.enemies.splice(idx, 1)
    enemy.destroy()

    this.answerSpawner.clearCurrentWave()
  }

  // ── Wrong hit ─────────────────────────────────────────────────────────────────

  private handleWrongHit(enemy: AnswerEnemy) {
    spawnExplosion(this, enemy.x, enemy.y, false)
    this.sfx.playWrong()
    this.cameras.main.shake(75, 0.010)
    this.flashDamage()
    this.hud.shakeHealth(this)

    FeedbackText.show(this, enemy.x, enemy.y - 24, 'WRONG!  −1 ♥', '#ff3355', 19)

    const idx = this.answerSpawner.enemies.indexOf(enemy)
    if (idx !== -1) this.answerSpawner.enemies.splice(idx, 1)
    enemy.destroy()
  }

  // ── Game over ─────────────────────────────────────────────────────────────────

  private handleGameOver() {
    this.answerSpawner.freeze()
    this.cameras.main.shake(280, 0.014)
    this.sfx.stopMusic()
    this.sfx.playGameOver()

    const score = this.scoreManager.stats.score

    // Persist high score
    try {
      const prev = parseInt(localStorage.getItem('stg_highscore') ?? '0')
      if (score > prev) localStorage.setItem('stg_highscore', String(score))
    } catch { /* */ }

    // Translation mode → smart progression to Sentence mode
    if (this.modeManager.currentMode === GameMode.Translation) {
      this.time.delayedCall(600, () => {
        this.cameras.main.fadeOut(500, 0, 0, 0)
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('TransitionScene', {
            correctWordIds: Array.from(this.correctWordIds),
            correctWords:   Array.from(this.correctWordNames.values()),
            score,
            nickname:   this.nickname,
            totalWords: 20,
          })
        })
      })
      return
    }

    // Sentence mode (or direct sentence start) → normal game over
    this.time.delayedCall(400, () => {
      addLeaderboardScore(this.nickname, score, this.modeManager.currentMode)
      const topScores = getTopLeaderboard(5)

      this.gameOverScreen = new GameOverScreen(
        this,
        score,
        topScores,
        this.nickname,
        () => {
          this.gameOverScreen?.destroy()
          this.gameOverScreen = null
          this.sfx.stopMusic()
          this.scene.restart({ selectedMode: GameMode.Translation })
        },
      )
    })
  }

  // ── Damage flash ──────────────────────────────────────────────────────────────

  private createDamageOverlay() {
    this.damageOverlay = this.add
      .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0xff0000, 0)
      .setDepth(35)
  }

  private flashDamage() {
    this.tweens.killTweensOf(this.damageOverlay)
    this.tweens.add({
      targets: this.damageOverlay,
      alpha: { from: 0.32, to: 0 },
      duration: 400, ease: 'Quad.easeOut',
    })
  }

  // ── Shoot ─────────────────────────────────────────────────────────────────────

  private tryShoot() {
    if (this.scoreManager.isGameOver) return
    if (this.laserSystem.tryShoot(this.shipX, this.shipY - 28)) {
      this.sfx.playLaser()
      new MuzzleFlash(this, this.shipX, this.shipY - 28)
    }
  }

  private handleShootInput() {
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) this.tryShoot()
  }

  // ── Movement ──────────────────────────────────────────────────────────────────

  private handleMovement(dt: number) {
    const left  = this.cursors.left.isDown  || this.wasd.left.isDown
    const right = this.cursors.right.isDown || this.wasd.right.isDown
    if (left)  this.shipX -= SHIP_SPEED * dt
    if (right) this.shipX += SHIP_SPEED * dt
    this.shipX = Phaser.Math.Clamp(this.shipX, 30, GAME_WIDTH - 30)
  }

  // ── Input setup ───────────────────────────────────────────────────────────────

  private setupInput() {
    this.cursors = this.input.keyboard!.createCursorKeys()
    this.wasd = {
      left:  this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    }
    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (p.isDown) this.shipX = Phaser.Math.Clamp(p.x, 30, GAME_WIDTH - 30)
    })
  }

  private getNickname(): string {
    try {
      const stored = localStorage.getItem('stg_nickname')
      if (stored && stored.trim().length > 0) return stored.trim().slice(0, 16)
    } catch {
      // fallback to prompt
    }

    const chosen = window.prompt('Enter your student nickname for the leaderboard', 'STUDENT') || 'STUDENT'
    const nickname = chosen.trim().slice(0, 16) || 'STUDENT'
    try { localStorage.setItem('stg_nickname', nickname) } catch {
      // ignore storage failures
    }
    return nickname
  }

  // ── Starfield ─────────────────────────────────────────────────────────────────

  private createStarfield() {
    const layers = [
      { count: 120, speedRange: [15, 25],  sizeRange: [0.5, 1.0], alphaRange: [0.2, 0.5] },
      { count: 60,  speedRange: [35, 55],  sizeRange: [1.0, 1.5], alphaRange: [0.4, 0.7] },
      { count: 25,  speedRange: [70, 100], sizeRange: [1.5, 2.5], alphaRange: [0.6, 1.0] },
    ]
    layers.forEach((layer) => {
      const gfx   = this.add.graphics()
      const stars = Array.from({ length: layer.count }, () => ({
        x:     Phaser.Math.Between(0, GAME_WIDTH),
        y:     Phaser.Math.Between(0, GAME_HEIGHT),
        speed: Phaser.Math.FloatBetween(layer.speedRange[0], layer.speedRange[1]),
        size:  Phaser.Math.FloatBetween(layer.sizeRange[0],  layer.sizeRange[1]),
        alpha: Phaser.Math.FloatBetween(layer.alphaRange[0], layer.alphaRange[1]),
      }))
      this.starLayers.push(gfx)
      this.starData.push(stars)
    })
  }

  private drawStarLayer(gfx: Phaser.GameObjects.Graphics, stars: StarData[]) {
    gfx.clear()
    stars.forEach((s) => { gfx.fillStyle(0xaaccff, s.alpha); gfx.fillCircle(s.x, s.y, s.size) })
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

  // ── Ship ──────────────────────────────────────────────────────────────────────

  private createShip() { this.ship = this.add.graphics().setDepth(5) }

  private redrawShip() {
    const gfx   = this.ship
    const x     = this.shipX
    const y     = this.shipY
    const pulse = 0.6 + 0.4 * Math.sin(this.time.now / 125)

    gfx.clear()

    // Engine glow
    gfx.fillStyle(0x0088ff, 0.22 * pulse); gfx.fillEllipse(x, y + 28, 40, 32 * pulse)
    gfx.fillStyle(0x00ccff, 0.12 * pulse); gfx.fillEllipse(x, y + 32, 22, 18 * pulse)

    // Hull body
    gfx.fillStyle(0x001a33, 1)
    gfx.fillTriangle(x, y - 28, x - 18, y + 14, x + 18, y + 14)
    gfx.lineStyle(1.5, 0x00aaff, 0.9)
    gfx.strokeTriangle(x, y - 28, x - 18, y + 14, x + 18, y + 14)

    // Wings
    gfx.fillStyle(0x002244, 1)
    gfx.fillTriangle(x - 14, y + 4, x - 28, y + 18, x - 16, y + 18)
    gfx.lineStyle(1.5, 0x0088ff, 0.8)
    gfx.strokeTriangle(x - 14, y + 4, x - 28, y + 18, x - 16, y + 18)
    gfx.fillStyle(0x002244, 1)
    gfx.fillTriangle(x + 14, y + 4, x + 28, y + 18, x + 16, y + 18)
    gfx.lineStyle(1.5, 0x0088ff, 0.8)
    gfx.strokeTriangle(x + 14, y + 4, x + 28, y + 18, x + 16, y + 18)

    // Cockpit
    gfx.fillStyle(0x00ddff, 0.85); gfx.fillEllipse(x, y - 8, 14, 18)
    gfx.fillStyle(0xffffff, 0.5);  gfx.fillEllipse(x - 2, y - 12, 5, 7)
    gfx.fillStyle(0x00ffff, 1);    gfx.fillCircle(x, y - 28, 3)

    // Engine flame
    gfx.fillStyle(0x0044ff, 0.9 * pulse)
    gfx.fillTriangle(x - 7, y + 14, x + 7, y + 14, x, y + 28 + 6 * pulse)
    gfx.fillStyle(0x00aaff, 0.6 * pulse)
    gfx.fillTriangle(x - 4, y + 14, x + 4, y + 14, x, y + 22 + 4 * pulse)
    gfx.fillStyle(0xffffff, 0.8 * pulse); gfx.fillCircle(x, y + 15, 2.5)
  }

  // ── Engine thruster particles ─────────────────────────────────────────────────

  private setupEngineEmitter() {
    const gfx = this.make.graphics({ x: 0, y: 0 })
    gfx.fillStyle(0xffffff, 1); gfx.fillRect(0, 0, 4, 4)
    gfx.generateTexture('pixel', 4, 4); gfx.destroy()

    this.add.particles(0, 0, 'pixel', {
      x:         { onEmit: () => this.shipX },
      y:         { onEmit: () => this.shipY + 18 },
      lifespan:  { min: 180, max: 380 },
      speed:     { min: 40, max: 100 },
      angle:     { min: 80, max: 100 },
      scale:     { start: 0.8, end: 0 },
      alpha:     { start: 0.9, end: 0 },
      tint:      [0x0088ff, 0x00ccff, 0xffffff],
      blendMode: Phaser.BlendModes.ADD,
      frequency: 25, quantity: 2,
    }).setDepth(4)
  }
}
