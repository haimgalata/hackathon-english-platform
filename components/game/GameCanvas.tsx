'use client'

import { useEffect, useRef } from 'react'
import { createPhaserConfig } from './engine/config'

const CONTAINER_ID = 'phaser-game-container'

export default function GameCanvas() {
  const gameRef = useRef<import('phaser').Game | null>(null)

  useEffect(() => {
    let game: import('phaser').Game | null = null

    const init = async () => {
      const Phaser = (await import('phaser')).default
      const config = createPhaserConfig(CONTAINER_ID)
      game = new Phaser.Game(config)
      gameRef.current = game
    }

    init()

    return () => {
      game?.destroy(true)
      gameRef.current = null
    }
  }, [])

  return (
    <div
      id={CONTAINER_ID}
      style={{ width: '100%', height: '100%' }}
    />
  )
}
