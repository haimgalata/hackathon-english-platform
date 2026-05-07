import * as Phaser from 'phaser'
import { StartScene }      from './scenes/StartScene'
import { GameScene }       from './scenes/GameScene'
import { TransitionScene } from './scenes/TransitionScene'

export const GAME_WIDTH  = 800
export const GAME_HEIGHT = 600

export function createPhaserConfig(parent: string): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    width:  GAME_WIDTH,
    height: GAME_HEIGHT,
    parent,
    backgroundColor: '#000814',
    physics: {
      default: 'arcade',
      arcade: { gravity: { x: 0, y: 0 }, debug: false },
    },
    // StartScene launches first; it transitions to GameScene on input
    scene: [StartScene, GameScene, TransitionScene],
    scale: {
      mode:       Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
  }
}
