/**
 * Procedural sound + music via Web Audio API.
 * Zero external files — every sound is synthesised at runtime.
 */
export class SoundSystem {
  private ctx:      AudioContext | null = null
  private masterGain!: GainNode
  private _sfxEnabled  = true
  private _volume      = 0.35

  // Music state
  private _musicPlaying   = false
  private _musicTimer:    ReturnType<typeof setInterval> | null = null
  private _padOscs:       OscillatorNode[] = []

  // ── AudioContext (lazy + gesture-safe) ───────────────────────────────────────

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx       = new AudioContext()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.value = this._volume
      this.masterGain.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') this.ctx.resume()
    return this.ctx
  }

  // ── Low-level tone helper ────────────────────────────────────────────────────

  private osc(
    freq:      number,
    endFreq:   number,
    duration:  number,
    type:      OscillatorType,
    peakGain:  number,
    delay = 0,
  ) {
    if (!this._sfxEnabled) return
    try {
      const ctx = this.getCtx()
      const now = ctx.currentTime + delay
      const o   = ctx.createOscillator()
      const g   = ctx.createGain()
      o.connect(g); g.connect(this.masterGain)
      o.type = type
      o.frequency.setValueAtTime(freq, now)
      if (endFreq !== freq) o.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), now + duration)
      g.gain.setValueAtTime(0, now)
      g.gain.linearRampToValueAtTime(peakGain, now + 0.008)
      g.gain.exponentialRampToValueAtTime(0.0001, now + duration)
      o.start(now); o.stop(now + duration + 0.01)
    } catch { /* ctx not ready */ }
  }

  private noise(duration: number, peakGain: number, filterFreq: number) {
    if (!this._sfxEnabled) return
    try {
      const ctx  = this.getCtx()
      const size = Math.floor(ctx.sampleRate * duration)
      const buf  = ctx.createBuffer(1, size, ctx.sampleRate)
      const data = buf.getChannelData(0)
      for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1
      const src    = ctx.createBufferSource()
      const filter = ctx.createBiquadFilter()
      const env    = ctx.createGain()
      src.buffer = buf; filter.type = 'bandpass'
      filter.frequency.value = filterFreq; filter.Q.value = 1.5
      env.gain.setValueAtTime(peakGain, ctx.currentTime)
      env.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
      src.connect(filter); filter.connect(env); env.connect(this.masterGain)
      src.start()
    } catch { /* */ }
  }

  // ── SFX ──────────────────────────────────────────────────────────────────────

  playLaser()     { this.osc(1200, 380, 0.11, 'sawtooth', 0.28); this.osc(1800, 560, 0.08, 'square', 0.10) }
  playCorrect()   { this.osc(523, 523, 0.09, 'sine', 0.30); this.osc(659, 659, 0.09, 'sine', 0.28, 0.08); this.osc(784, 784, 0.18, 'sine', 0.30, 0.16) }
  playWrong()     { this.osc(220, 140, 0.10, 'sawtooth', 0.28); this.osc(180, 120, 0.14, 'square', 0.18, 0.08) }
  playExplosion() { this.noise(0.30, 0.22, 900); this.osc(90, 38, 0.28, 'sawtooth', 0.22) }
  playGameOver()  { [392, 349, 311, 262].forEach((f, i) => this.osc(f, f * 0.92, 0.22, 'sawtooth', 0.22, i * 0.18)) }
  playLevelUp()   { [523, 659, 784, 1047].forEach((f, i) => this.osc(f, f, 0.14, 'sine', 0.30, i * 0.09)) }
  playClick()     { this.osc(880, 660, 0.06, 'sine', 0.20) }

  // ── Music ─────────────────────────────────────────────────────────────────────

  /**
   * Synthwave loop:
   *   • Sustained A-minor pad (sine chord)
   *   • Sawtooth bass arpeggio at ~160 BPM
   */
  startMusic() {
    if (this._musicPlaying) return
    this._musicPlaying = true
    try {
      const ctx = this.getCtx()
      this.createPad(ctx)
      this.startBassArp(ctx)
    } catch { /* */ }
  }

  stopMusic() {
    this._musicPlaying = false
    if (this._musicTimer) { clearInterval(this._musicTimer); this._musicTimer = null }
    for (const o of this._padOscs) { try { o.stop() } catch { /* */ } }
    this._padOscs = []
  }

  private createPad(ctx: AudioContext) {
    // Soft chord: A2 + E3 + A3
    const freqs = [110, 164.81, 220]
    for (const freq of freqs) {
      const o    = ctx.createOscillator()
      const filt = ctx.createBiquadFilter()
      const g    = ctx.createGain()
      o.type             = 'sine'
      o.frequency.value  = freq
      filt.type          = 'lowpass'
      filt.frequency.value = 900
      g.gain.value       = 0.030 * this._volume
      o.connect(filt); filt.connect(g); g.connect(ctx.destination)
      o.start()
      this._padOscs.push(o)
    }
  }

  private startBassArp(ctx: AudioContext) {
    // A-minor bass line: A1 A1 C2 A1 G1 A1 Bb1 A1
    const pattern = [55, 55, 65.41, 55, 49.00, 55, 58.27, 55]
    const stepMs  = 375   // 8th note at ~160 BPM

    let step = 0
    this._musicTimer = setInterval(() => {
      if (!this._musicPlaying) return
      try {
        const freq = pattern[step % pattern.length]
        const now  = ctx.currentTime

        const o    = ctx.createOscillator()
        const filt = ctx.createBiquadFilter()
        const g    = ctx.createGain()

        o.type            = 'sawtooth'
        o.frequency.value = freq
        filt.type         = 'lowpass'
        filt.frequency.setValueAtTime(180, now)
        filt.frequency.linearRampToValueAtTime(600,  now + 0.04)
        filt.frequency.exponentialRampToValueAtTime(140, now + stepMs / 1000 * 0.75)
        filt.Q.value = 3.5

        const peak = 0.14 * this._volume
        g.gain.setValueAtTime(0, now)
        g.gain.linearRampToValueAtTime(peak, now + 0.012)
        g.gain.exponentialRampToValueAtTime(0.0001, now + stepMs / 1000 * 0.78)

        o.connect(filt); filt.connect(g); g.connect(ctx.destination)
        o.start(now); o.stop(now + stepMs / 1000)
      } catch { /* ctx closed or suspended */ }
      step++
    }, stepMs)
  }

  // ── Config ───────────────────────────────────────────────────────────────────

  setVolume(v: number) {
    this._volume = Math.max(0, Math.min(1, v))
    if (this.masterGain) this.masterGain.gain.value = this._volume
  }

  setSfxEnabled(on: boolean)   { this._sfxEnabled = on }
  get sfxEnabled()              { return this._sfxEnabled }
  get volume()                  { return this._volume }
}
