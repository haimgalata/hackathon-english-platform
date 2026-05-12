"use client";

export function useAudioPlayback() {
  async function playBase64Audio(audioBase64: string) {
    const audio = new Audio(`data:audio/mpeg;base64,${audioBase64}`);
    await audio.play();
  }

  return { playBase64Audio };
}
