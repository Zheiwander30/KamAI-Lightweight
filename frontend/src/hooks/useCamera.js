import { useState, useRef, useCallback, useEffect } from 'react'

/**
 * Manages webcam access.
 *
 * Mobile mirroring fix:
 *   On mobile front cameras, browsers mirror the display via CSS but
 *   MediaPipe still receives the raw (unmirrored) pixel data. However,
 *   the landmark X coordinates come out mirrored relative to desktop
 *   because of how mobile browsers expose the camera stream orientation.
 *   We detect this and expose `isMobileFront` so useSignSession can
 *   flip landmark X coords before feeding them to the model.
 *
 * Returns { camReady, camError, isMobileFront, videoRef, initCamera, teardown }
 */
export function useCamera() {
  const videoRef   = useRef(null)
  const streamRef  = useRef(null)

  const [camReady,      setCamReady]      = useState(false)
  const [camError,      setCamError]      = useState('')
  const [isMobileFront, setIsMobileFront] = useState(false)

  const initCamera = useCallback(async () => {
    setCamError('')
    setCamReady(false)

    // Detect mobile — affects landmark X orientation
    const mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)

    // On mobile we still use the front camera (user-facing) for signing,
    // but we record that fact so landmarks can be corrected.
    const constraints = {
      video: {
        width:      { ideal: 640 },
        height:     { ideal: 480 },
        facingMode: 'user',
      }
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      // Check which camera we actually got
      const track      = stream.getVideoTracks()[0]
      const settings   = track.getSettings?.() ?? {}
      const facingMode = settings.facingMode ?? ''
      const isFront    = facingMode === 'user' || facingMode === ''

      setIsMobileFront(mobile && isFront)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => setCamReady(true)
      }
    } catch (err) {
      setCamError(
        err.name === 'NotAllowedError' ? 'Camera permission denied. Please allow camera access and reload.' :
        err.name === 'NotFoundError'   ? 'No camera found. Please connect a webcam.' :
        `Camera error: ${err.message}`
      )
    }
  }, [])

  const teardown = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop())
  }, [])

  useEffect(() => {
    initCamera()
    return teardown
  }, [])

  return { camReady, camError, isMobileFront, videoRef, initCamera, teardown }
}
