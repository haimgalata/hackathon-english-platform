'use client'

import { useEffect, useRef } from 'react'
import * as Phaser from 'phaser'
import { createPhaserConfig } from '../game/config'

const CONTAINER_ID = 'phaser-container'

export default function GameCanvas() {
  const gameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    // Mount once — StrictMode fires this twice in dev, guard with ref
    if (gameRef.current) return

    const config = createPhaserConfig(CONTAINER_ID)
    gameRef.current = new Phaser.Game(config)

    return () => {
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [])

  return (
    <div
      id={CONTAINER_ID}
      className="w-full h-full flex items-center justify-center"
    />
  )
}
