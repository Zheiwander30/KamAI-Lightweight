import { useState, useEffect } from 'react'

/**
 * Tracks device orientation angle.
 * Returns the current orientation in degrees: 0, 90, -90, 180
 *
 * 0   = landscape (desktop default, phone landscape)
 * 90  = portrait rotated left
 * -90 = portrait rotated right
 * 180 = upside down landscape
 *
 * Uses screen.orientation API with fallback to window.orientation.
 */
export function useOrientation() {
  const getAngle = () => {
    if (screen?.orientation?.angle !== undefined) return screen.orientation.angle
    if (window.orientation !== undefined) return window.orientation
    return 0  // desktop default
  }

  const [angle, setAngle] = useState(getAngle())

  useEffect(() => {
    const update = () => setAngle(getAngle())
    screen?.orientation?.addEventListener?.('change', update)
    window.addEventListener('orientationchange', update)
    return () => {
      screen?.orientation?.removeEventListener?.('change', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  return angle
}
