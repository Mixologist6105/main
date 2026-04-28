import { useId } from 'react'

function AToggle({ label, checked = false, onChange, disabled = false, onHoverHint, tooltip }) {
  const gradientId = useId()

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      className={`atoggle-root has-fluent-tooltip ${checked ? 'is-checked' : ''} ${disabled ? 'is-disabled' : ''}`}
      onClick={() => !disabled && onChange?.(!checked)}
      onMouseEnter={onHoverHint}
      data-tooltip={tooltip || undefined}
      aria-label={tooltip || undefined}
    >
      <span className="atoggle-label">{label}</span>
      <span className="atoggle-box" aria-hidden="true">
        <svg viewBox="0 0 16 16" className="atoggle-check">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="18.7%" stopColor="var(--gradient-start)" />
              <stop offset="54.7%" stopColor="var(--gradient-mid)" />
              <stop offset="100%" stopColor="var(--gradient-end)" />
            </linearGradient>
          </defs>
          <path
            fill={`url(#${gradientId})`}
            d="M7.53 1.282a.5.5 0 0 1 .94 0l.478 1.306a7.492 7.492 0 0 0 4.464 4.464l1.305.478a.5.5 0 0 1 0 .94l-1.305.478a7.492 7.492 0 0 0-4.464 4.464l-.478 1.305a.5.5 0 0 1-.94 0l-.478-1.305a7.492 7.492 0 0 0-4.464-4.464L1.282 8.47a.5.5 0 0 1 0-.94l1.306-.478a7.492 7.492 0 0 0 4.464-4.464Z"
          />
        </svg>
      </span>
    </button>
  )
}

export default AToggle
