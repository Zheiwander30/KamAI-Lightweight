import { useRef, useCallback } from 'react'

/**
 * Plays a soft click tone when a letter gets added to the building word.
 * Uses Web Audio API
 *
 * The sound is a short sine wave click (like a typewriter key):
 *   - 1200Hz tone (bright, distinct, not annoying)
 *   - 40ms duration with quick fade-out
 *   - Low volume (0.12) - subtle, not distracting
 */
export function useLetterSound() {
  const audioCtxRef = useRef(null)

  // Lazily create AudioContext on first use
  // (browsers block AudioContext creation before user interaction)
  const getCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }
    return audioCtxRef.current
  }

  const playLetter = useCallback(() => {
    try {
      const ctx      = getCtx()
      const now      = ctx.currentTime

      const osc      = ctx.createOscillator()
      osc.type       = 'sine'
      osc.frequency.setValueAtTime(1200, now)
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.04)

      const gain     = ctx.createGain()
      gain.gain.setValueAtTime(0.12, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.05)
    } catch {

    }
  }, [])

  const playWord = useCallback(() => {

    try {
      const ctx      = getCtx()
      const now      = ctx.currentTime

      const osc      = ctx.createOscillator()
      osc.type       = 'sine'
      osc.frequency.setValueAtTime(800, now)
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.08)

      const gain     = ctx.createGain()
      gain.gain.setValueAtTime(0.10, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.1)
    } catch {}
  }, [])

  return { playLetter, playWord }
}
