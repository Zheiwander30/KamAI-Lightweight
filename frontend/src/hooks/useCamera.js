import { useState, useRef, useCallback, useEffect } from 'react'

/**
 * Manages webcam access.
 * Returns { camReady, camError, videoRef, initCamera, teardown }
 */
export function useCamera() {
  const videoRef  = useRef(null)
  const streamRef = useRef(null)

  const [camReady, setCamReady] = useState(false)
  const [camError, setCamError] = useState('')

  const initCamera = useCallback(async () => {
    setCamError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      })
      streamRef.current = stream
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

  return { camReady, camError, videoRef, initCamera, teardown }
}
