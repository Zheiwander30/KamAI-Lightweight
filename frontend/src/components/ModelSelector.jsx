import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { SIGN_MODELS } from '../constants'
import { FlagIcon } from './FlagIcon'

/**
 * Dropdown model selector.
 * The dropdown panel is rendered as a portal on document.body so it
 * escapes any overflow:hidden parent containers.
 */
export function ModelSelector({ selected, onChange, disabled }) {
  const [open, setOpen] = useState(false)
  const [pos,  setPos]  = useState({ top: 0, left: 0 })
  const triggerRef      = useRef(null)
  const dropdownRef     = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        triggerRef.current  && !triggerRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close on scroll/resize so the portal doesn't float away
  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [open])

  const handleOpen = () => {
    if (disabled) return
    if (!open && triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect()
      setPos({ top: r.bottom + window.scrollY + 6, left: r.left + window.scrollX })
    }
    setOpen(o => !o)
  }

  const dropdown = open ? createPortal(
    <div
      ref={dropdownRef}
      style={{ position: 'absolute', top: pos.top, left: pos.left, minWidth: 220, zIndex: 9999 }}
      className="bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden"
    >
      {SIGN_MODELS.map(m => (
        <button
          key={m.id}
          type="button"
          onClick={() => { onChange(m); setOpen(false) }}
          className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors
            ${selected.id === m.id
              ? 'bg-teal-50 text-teal-700 font-semibold'
              : 'text-gray-700 hover:bg-gray-50 font-medium'
            }`}
        >
          <FlagIcon code={m.countryCode} size={24} />
          <div>
            <p className="font-semibold leading-tight">{m.label}</p>
            <p className="text-xs text-gray-400 font-normal leading-tight">{m.fullName}</p>
          </div>
          {selected.id === m.id && (
            <svg className="w-4 h-4 text-teal-500 ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
            </svg>
          )}
        </button>
      ))}
    </div>,
    document.body
  ) : null

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden sm:block whitespace-nowrap">
        Model
      </span>
      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          onClick={handleOpen}
          className={`flex items-center gap-2 pl-2.5 pr-8 py-2 text-sm font-semibold
            bg-white border rounded-xl text-gray-700 transition-all min-w-[170px]
            ${open ? 'border-teal-400 ring-2 ring-teal-400/30' : 'border-gray-200 hover:border-gray-300'}
            disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          <FlagIcon code={selected.countryCode} size={20} />
          <span>{selected.label}</span>
          <span className="text-gray-400 font-normal text-xs truncate hidden sm:inline">— {selected.fullName}</span>
        </button>
        <svg
          className={`pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
      {dropdown}
    </div>
  )
}
