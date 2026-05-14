import { useState, useRef, useEffect, useCallback } from 'react'
import {
  MIN_CONFIDENCE, DEFAULT_SPEED,
  MAX_TRANSCRIPT_WORDS, MAX_PENDING_LETTERS, DEFAULT_MODEL,
} from '../constants'
import { predictFromLandmarks, loadTFJSModel } from '../utils/tfjsModel'

/**
 *
 * Mobile mirroring fix:
 * Speed modes:
 *   captureInterval and repeatsToConfirm come from the active speed mode,
 *   passed in as props. Changing speed mid-session restarts the predict loop.
 */
 
export function useSignSession({ videoRef, canvasRef, overlayRef }) {
  // ── Refs ────────────────────────────────────────────────────────────────────
  const handsRef       = useRef(null)
  const runningRef     = useRef(false)
  const stoppedRef     = useRef(false)
  const intervalRef    = useRef(null)
  const handPresentRef = useRef(false)
  const landmarksRef   = useRef(null)
  const lastLetterRef  = useRef(null)
  const repeatCountRef = useRef(0)
  const sessionStartRef= useRef(null)
  const pendingWordRef = useRef('')
  // Speed mode refs — read by the interval loop without stale closure
  const captureIntervalRef  = useRef(DEFAULT_SPEED.captureInterval)
  const repeatsToConfirmRef = useRef(DEFAULT_SPEED.repeatsToConfirm)

  // ── State ───────────────────────────────────────────────────────────────────
  const [running,       setRunning]       = useState(false)
  const [mpLoading,     setMpLoading]     = useState(false)
  const [mpError,       setMpError]       = useState('')
  const [modelLoading,  setModelLoading]  = useState(false)
  const [modelError,    setModelError]    = useState('')
  const [activeModel,   setActiveModel]   = useState(DEFAULT_MODEL)
  const [activeSpeed,   setActiveSpeed]   = useState(DEFAULT_SPEED)
  const [currentLetter, setCurrentLetter] = useState(null)
  const [confidence,    setConfidence]    = useState(0)
  const [pendingWord,   setPendingWord]   = useState('')
  const [transcript,    setTranscript]    = useState([])
  const [archivedCount, setArchivedCount] = useState(0)
  const [elapsed,       setElapsed]       = useState(0)
  const [handPresent,   setHandPresent]   = useState(false)

  useEffect(() => { pendingWordRef.current = pendingWord }, [pendingWord])

  // Keep speed refs in sync with state — the interval loop reads refs directly
  useEffect(() => {
    captureIntervalRef.current  = activeSpeed.captureInterval
    repeatsToConfirmRef.current = activeSpeed.repeatsToConfirm
  }, [activeSpeed])

  // ── Session timer ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!running) return
    const t = setInterval(() => {
      setElapsed(sessionStartRef.current
        ? Math.floor((Date.now() - sessionStartRef.current) / 1000) : 0)
    }, 1000)
    return () => clearInterval(t)
  }, [running])

  // ── Hand-presence polling ──────────────────────────────────────────────────
  useEffect(() => {
    if (!running) { setHandPresent(false); return }
    const t = setInterval(() => setHandPresent(handPresentRef.current), 200)
    return () => clearInterval(t)
  }, [running])

  // ── Keyboard shortcuts ─────────────────────────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e) => {
      if (!runningRef.current) return
      if (e.code === 'Space')     { e.preventDefault(); const w = pendingWordRef.current.trim(); if (w) commitWord(w) }
      if (e.code === 'Backspace') { e.preventDefault(); setPendingWord(w => w.slice(0, -1)) }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // ── Commit word ────────────────────────────────────────────────────────────
  const commitWord = useCallback((w) => {
    setTranscript(prev => {
      const next = [...prev, w]
      if (next.length > MAX_TRANSCRIPT_WORDS) {
        const overflow = next.length - MAX_TRANSCRIPT_WORDS
        setArchivedCount(c => c + overflow)
        return next.slice(overflow)
      }
      return next
    })
    setPendingWord('')
    lastLetterRef.current  = null
    repeatCountRef.current = 0
  }, [])

  // ── Normalize landmarks ────────────────────────────────────────────────────
  // MediaPipe receives the raw unmirrored video stream on all platforms.
  // CSS scaleX(-1) is cosmetic only — landmarks are already in the same
  // coordinate space as desktop training data on mobile too.
  // No transform needed. Previous X-flip was inverting correct coordinates.
  const normalizeLandmarks = useCallback((landmarks) => landmarks, [])

  // ── Load MediaPipe ─────────────────────────────────────────────────────────
  const loadMediaPipe = async () => {
    if (handsRef.current) return handsRef.current
    setMpLoading(true)
    setMpError('')
    try {
      if (!window.Hands) throw new Error('MediaPipe scripts not loaded. Refresh the page.')
      const hands = new window.Hands({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${file}`
      })
      hands.setOptions({
        maxNumHands:            1,
        modelComplexity:        1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence:  0.5,
      })
      hands.onResults((results) => {
        const overlay = overlayRef.current
        if (!overlay) return
        const ctx = overlay.getContext('2d')
        ctx.clearRect(0, 0, overlay.width, overlay.height)

        const detected = !!(results.multiHandLandmarks?.length)
        handPresentRef.current = detected

        if (detected) {
          const lm = results.multiHandLandmarks[0]
          // Store normalized landmarks for predict loop
          landmarksRef.current = normalizeLandmarks(lm)
          // Draw original (un-normalized) for visual — CSS handles mirror
          window.drawConnectors(ctx, lm, window.HAND_CONNECTIONS, { color: '#2AABAC', lineWidth: 2 })
          window.drawLandmarks(ctx, lm, { color: '#ffffff', lineWidth: 1, radius: 3 })
        } else {
          landmarksRef.current = null
        }
      })
      handsRef.current = hands
      return hands
    } catch (e) {
      console.error('MediaPipe load error:', e)
      setMpError('Failed to load hand-tracking model. Refresh the page.')
      return null
    } finally {
      setMpLoading(false)
    }
  }

  // ── Load TFJS model ────────────────────────────────────────────────────────
  const loadModel = async (modelId) => {
    setModelLoading(true)
    setModelError('')
    try {
      await loadTFJSModel(modelId)
      return true
    } catch (e) {
      console.error('TFJS model load error:', e)
      setModelError(`Failed to load "${modelId}" model.`)
      return false
    } finally {
      setModelLoading(false)
    }
  }

  // ── Landmark overlay loop ──────────────────────────────────────────────────
  const startLandmarkLoop = (hands) => {
    let processing = false
    const loop = async () => {
      if (!runningRef.current) return
      const video = videoRef.current
      if (video && video.readyState >= 2 && !processing) {
        if (overlayRef.current) {
          overlayRef.current.width  = video.videoWidth  || 640
          overlayRef.current.height = video.videoHeight || 480
        }
        processing = true
        try { await hands.send({ image: video }) } catch {}
        processing = false
      }
      if (runningRef.current) requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)
  }

  // ── Predict loop ───────────────────────────────────────────────────────────
  // Uses refs for captureInterval and repeatsToConfirm so speed changes
  // take effect immediately without restarting the loop.
  const startPredictLoop = (modelId) => {
    let predicting = false
    let lastTick   = 0

    const loop = async (now) => {
      if (!runningRef.current || stoppedRef.current) return

      // Self-scheduling rAF with manual interval check
      // This lets us change captureInterval live via ref
      if (now - lastTick >= captureIntervalRef.current) {
        lastTick = now

        if (!predicting && handPresentRef.current && landmarksRef.current) {
          predicting = true
          try {
            const { letter, confidence: conf } = await predictFromLandmarks(
              landmarksRef.current,
              modelId,
              MIN_CONFIDENCE,
            )
            if (stoppedRef.current) return

            setCurrentLetter(letter === 'None' ? null : letter)
            setConfidence(conf)

            if (letter !== 'None' && conf >= MIN_CONFIDENCE) {
              if (letter === lastLetterRef.current) {
                repeatCountRef.current += 1
                if (repeatCountRef.current === repeatsToConfirmRef.current) {
                  setPendingWord(w => {
                    const next = w + letter
                    if (next.length >= MAX_PENDING_LETTERS) {
                      setTimeout(() => commitWord(next), 0)
                      return ''
                    }
                    return next
                  })
                  repeatCountRef.current = 0
                }
              } else {
                lastLetterRef.current  = letter
                repeatCountRef.current = 1
              }
            } else {
              lastLetterRef.current  = null
              repeatCountRef.current = 0
            }
          } finally {
            predicting = false
          }
        }
      }
      if (runningRef.current) intervalRef.current = requestAnimationFrame(loop)
    }
    intervalRef.current = requestAnimationFrame(loop)
  }

  // ── Start ──────────────────────────────────────────────────────────────────
  const handleStart = async () => {
    const video = videoRef.current
    if (!video) return
    const [hands, modelOk] = await Promise.all([
      loadMediaPipe(),
      loadModel(activeModel.id),
    ])
    if (!hands || !modelOk) return

    stoppedRef.current  = false
    runningRef.current  = true
    setRunning(true)
    setTranscript([])
    setArchivedCount(0)
    setPendingWord('')
    setCurrentLetter(null)
    setConfidence(0)
    setElapsed(0)
    setHandPresent(false)
    lastLetterRef.current   = null
    repeatCountRef.current  = 0
    landmarksRef.current    = null
    sessionStartRef.current = Date.now()

    startPredictLoop(activeModel.id)
    startLandmarkLoop(hands)
  }

  // ── Stop ───────────────────────────────────────────────────────────────────
  const handleStop = () => {
    stoppedRef.current     = true
    runningRef.current     = false
    handPresentRef.current = false
    landmarksRef.current   = null
    cancelAnimationFrame(intervalRef.current)
    setRunning(false)
    setCurrentLetter(null)
    setHandPresent(false)

    if (overlayRef.current) {
      overlayRef.current.getContext('2d')
        .clearRect(0, 0, overlayRef.current.width, overlayRef.current.height)
    }
    const w = pendingWordRef.current.trim()
    if (w) setTranscript(prev => [...prev, w])
    setPendingWord('')
  }

  // ── Word actions ───────────────────────────────────────────────────────────
  const handleSpace = () => { const w = pendingWord.trim(); if (w) commitWord(w) }
  const handleBack  = () => setPendingWord(w => w.slice(0, -1))
  const handleClear = () => {
    setTranscript([])
    setArchivedCount(0)
    setPendingWord('')
    lastLetterRef.current  = null
    repeatCountRef.current = 0
  }
  const handleModelChange = (model) => { if (!running) setActiveModel(model) }
  const handleSpeedChange = (speed) => {
    setActiveSpeed(speed)
    // Refs update via useEffect above — loop picks up change on next tick
    if (!running) return
    lastLetterRef.current  = null
    repeatCountRef.current = 0
  }

  return {
    running, mpLoading, mpError, modelLoading, modelError,
    activeModel, activeSpeed, handPresent,
    currentLetter, confidence, pendingWord, transcript, archivedCount, elapsed,
    handleStart, handleStop, handleSpace, handleBack, handleClear,
    handleModelChange, handleSpeedChange,
  }
}
