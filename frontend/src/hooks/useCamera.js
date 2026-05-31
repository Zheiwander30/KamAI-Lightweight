import { useState, useRef, useCallback, useEffect } from 'react'

/**
 * Camera hook — platform-aware constraints for best prediction quality.
 *
 * Mobile vs Desktop are configured differently because:
 *
 *   Mobile:  Lower fps (15) = longer exposure per frame = sharper image on phone.
 *            30fps on mobile causes motion blur because the sensor exposure time
 *            is too short. Sharper frames = more precise MediaPipe landmarks.
 *            Manual focus/exposure/WB locks the camera state so landmark
 *            positions don't drift frame-to-frame from camera adjustments.
 *
 *   Desktop: 30fps is fine — webcam sensors handle it cleanly.
 *            Advanced constraints (focusMode etc) are not supported on
 *            desktop webcams and cause errors if applied.
 *
 * Both platforms:
 *   640×480 matches training data resolution exactly — no rescaling pipeline.
 *   resizeMode:'none' tells the browser to crop the native sensor output
 *   instead of scaling it down, eliminating interpolation artifacts.
 */

const IS_MOBILE = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)

// ── Platform-specific base constraints ────────────────────────────────────────
const DESKTOP_CONSTRAINTS = {
  video: {
    facingMode:  'user',
    width:       { ideal: 640, max: 1280 },
    height:      { ideal: 480, max: 720  },
    frameRate:   { ideal: 30,  max: 30   },
    resizeMode:  'none',
  }
}

const MOBILE_CONSTRAINTS = {
  video: {
    facingMode:  'user',
    width:       { ideal: 640, max: 640 },
    height:      { ideal: 480, max: 480 },
    // 15fps on mobile — longer exposure per frame = sharper, less motion blur
    // MediaPipe processes at its own rate anyway so lower input fps is fine
    frameRate:   { ideal: 15,  max: 20  },
    resizeMode:  'none',
  }
}

// ── Advanced mobile constraints (Chrome Android only) ─────────────────────────
// These lock the camera state so pixel values are consistent frame-to-frame.
// Silently ignored on iOS Safari, Firefox, and desktop — safe to always attempt.
async function applyAdvancedMobileConstraints(track) {
  if (!track?.applyConstraints) return

  const caps = track.getCapabilities?.() ?? {}
  const advanced = {}

  // Lock focus at ~50cm — comfortable signing distance from phone
  if (caps.focusMode?.includes('manual')) {
    advanced.focusMode = 'manual'
    if (caps.focusDistance) {
      // 0.5 metres — close enough for hand detail, far enough for full hand
      const clamp = (v, min, max) => Math.min(Math.max(v, min), max)
      advanced.focusDistance = clamp(0.5, caps.focusDistance.min ?? 0, caps.focusDistance.max ?? 1)
    }
  }

  // Lock exposure — prevents brightness jumps between frames
  // Use a slightly darker-than-auto exposure to reduce overexposed skin tones
  if (caps.exposureMode?.includes('manual')) {
    advanced.exposureMode = 'manual'
    if (caps.exposureTime) {
      // Bias toward the lower third of the exposure range
      // Brighter scenes from overexposure wash out landmark detail
      const range = caps.exposureTime.max - caps.exposureTime.min
      advanced.exposureTime = caps.exposureTime.min + range * 0.3
    }
  }

  // Lock white balance — removes warm/cool color shifts from auto-WB
  // that affect how MediaPipe's CNN reads skin tone
  if (caps.whiteBalanceMode?.includes('manual')) {
    advanced.whiteBalanceMode = 'manual'
    if (caps.colorTemperature) {
      // 4500K — neutral daylight white, close to what desktop webcams default to
      const clamp = (v, min, max) => Math.min(Math.max(v, min), max)
      advanced.colorTemperature = clamp(4500, caps.colorTemperature.min ?? 2500, caps.colorTemperature.max ?? 8000)
    }
  }

  if (Object.keys(advanced).length === 0) return

  try {
    await track.applyConstraints({ advanced: [advanced] })
    const applied = Object.keys(advanced).join(', ')
    console.log(`[useCamera] Mobile advanced constraints applied: ${applied}`)
  } catch (e) {
    // Non-fatal — device doesn't support these, predictions still work
    console.log('[useCamera] Advanced constraints not supported on this device')
  }
}

export function useCamera() {
  const videoRef  = useRef(null)
  const streamRef = useRef(null)

  const [camReady, setCamReady] = useState(false)
  const [camError, setCamError] = useState('')
  const [camInfo,  setCamInfo]  = useState('')   // debug info shown in console

  const initCamera = useCallback(async () => {
    setCamError('')
    setCamReady(false)

    const constraints = IS_MOBILE ? MOBILE_CONSTRAINTS : DESKTOP_CONSTRAINTS

    let stream
    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints)
    } catch {
      // resizeMode or frameRate cap may be unsupported — fall back without them
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
        })
        console.log('[useCamera] Fell back to basic constraints')
      } catch (err) {
        setCamError(
          err.name === 'NotAllowedError' ? 'Camera permission denied. Please allow camera access and reload.' :
          err.name === 'NotFoundError'   ? 'No camera found. Please connect a webcam.' :
          `Camera error: ${err.message}`
        )
        return
      }
    }

    streamRef.current = stream
    const track = stream.getVideoTracks()[0]

    // Apply advanced mobile constraints after stream is open
    if (IS_MOBILE) {
      await applyAdvancedMobileConstraints(track)
    }

    if (videoRef.current) {
      videoRef.current.srcObject = stream
      videoRef.current.onloadedmetadata = () => {
        const s = track.getSettings?.() ?? {}
        const info = `${s.width ?? '?'}×${s.height ?? '?'} @ ${s.frameRate ?? '?'}fps`
        setCamInfo(info)
        console.log(`[useCamera] ${IS_MOBILE ? 'Mobile' : 'Desktop'} stream: ${info}, resizeMode=${s.resizeMode ?? 'default'}`)
        setCamReady(true)
      }
    }
  }, [])

  const teardown = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop())
  }, [])

  useEffect(() => {
    initCamera()
    return teardown
  }, [])

  return { camReady, camError, camInfo, videoRef, initCamera, teardown }
}
