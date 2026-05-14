import { SIGN_MODELS } from '../constants'
import { FlagIcon }    from './FlagIcon'

export function ModelSelector({ selected, onChange, disabled }) {
  return (
    <div className="flex items-center gap-1.5 flex-1 min-w-0">
      {/* Flag of selected model */}
      <div className="flex-shrink-0">
        <FlagIcon code={selected.countryCode} size={20} />
      </div>

      <div className="relative flex-1 min-w-0">
        <select
          disabled={disabled}
          value={selected.id}
          onChange={e => {
            const m = SIGN_MODELS.find(m => m.id === e.target.value)
            if (m) onChange(m)
          }}
          className="w-full appearance-none pl-2 pr-6 py-2 text-sm font-semibold
            bg-white border border-gray-200 rounded-xl text-gray-700 truncate
            focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent
            disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer
            transition-all hover:border-gray-300"
        >
          {SIGN_MODELS.map(m => (
            <option key={m.id} value={m.id}>
              {m.label} — {m.fullName}
            </option>
          ))}
        </select>
        {/* Chevron */}
        <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400"
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
    </div>
  )
}
