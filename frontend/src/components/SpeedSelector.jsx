import { SPEED_MODES } from '../constants'

/**
 * Speed mode selector — compact pill group.
 * Shows icon always, label only on sm+ screens.
 */
 
export function SpeedSelector({ selected, onChange, disabled }) {
  return (
    <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-white flex-shrink-0">
      {SPEED_MODES.map(mode => (
        <button
          key={mode.id}
          type="button"
          disabled={disabled}
          onClick={() => onChange(mode)}
          title={`${mode.label} — ${mode.desc}`}
          className={`flex items-center gap-1 px-2.5 py-2 text-xs font-semibold transition-all
            border-r border-gray-200 last:border-r-0
            ${selected.id === mode.id
              ? 'bg-teal-500 text-white'
              : 'text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
        >
          <span className="text-sm leading-none">{mode.icon}</span>
          <span className="hidden sm:inline">{mode.label}</span>
        </button>
      ))}
    </div>
  )
}
