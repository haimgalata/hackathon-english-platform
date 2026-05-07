import { buildQuestion, buildSentenceQuestion, buildSentenceQuestionFromWords, GameQuestion } from '../data/vocabulary'

export enum GameMode {
  Translation = 'translation',
  Sentence    = 'sentence',
}

export class ModeManager {
  public currentMode = GameMode.Translation

  /** Word IDs mastered in Translation mode — restricts Sentence mode questions when set. */
  public masteredWordIds: string[] | null = null

  onModeChanged: ((mode: GameMode) => void) | null = null

  setMode(mode: GameMode) {
    this.currentMode = mode
    this.onModeChanged?.(mode)
  }

  toggleMode() {
    this.setMode(
      this.currentMode === GameMode.Translation
        ? GameMode.Sentence
        : GameMode.Translation,
    )
  }

  buildNextQuestion(exclude?: string): GameQuestion {
    if (this.currentMode === GameMode.Sentence) {
      return this.masteredWordIds
        ? buildSentenceQuestionFromWords(this.masteredWordIds, exclude)
        : buildSentenceQuestion(exclude)
    }
    return buildQuestion(exclude)
  }
}
