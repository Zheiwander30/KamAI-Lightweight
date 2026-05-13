/**
 * Renders a flag image from flagcdn.com using an ISO 3166-1 alpha-2 country code.
 * Falls back to a plain text pill (e.g. "PH") if the image fails to load.
 */
export function FlagIcon({ code, size = 20 }) {
  const h = Math.round(size * 0.75)
  return (
    <img
      src={`https://flagcdn.com/w${size}/${code}.png`}
      srcSet={`https://flagcdn.com/w${size * 2}/${code}.png 2x`}
      width={size}
      height={h}
      alt={code.toUpperCase()}
      className="rounded-sm object-cover flex-shrink-0 inline-block"
      onError={e => {
        const span = document.createElement('span')
        span.className = 'text-[10px] font-bold bg-gray-200 text-gray-600 px-1 py-0.5 rounded'
        span.textContent = code.toUpperCase()
        e.target.replaceWith(span)
      }}
    />
  )
}
