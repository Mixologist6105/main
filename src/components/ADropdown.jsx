import { useEffect, useMemo, useRef, useState } from 'react'

function ADropdown({
  title = 'Dropdown',
  options = [],
  value,
  defaultValue,
  onChange,
  disabled = false,
  onHoverHint,
  tooltip,
}) {
  const rootRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [innerValue, setInnerValue] = useState(defaultValue ?? options[0] ?? '')
  const isControlled = value !== undefined
  const selectedValue = isControlled ? value : innerValue

  const normalizedOptions = useMemo(
    () =>
      options.map((option) =>
        typeof option === 'string'
          ? { label: option, value: option }
          : { label: option.label, value: option.value },
      ),
    [options],
  )

  useEffect(() => {
    const onDocumentClick = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocumentClick)
    return () => document.removeEventListener('mousedown', onDocumentClick)
  }, [])

  const handleSelect = (nextValue) => {
    if (!isControlled) {
      setInnerValue(nextValue)
    }
    onChange?.(nextValue)
    setOpen(false)
  }

  const selectedLabel =
    normalizedOptions.find((option) => option.value === selectedValue)?.label ?? selectedValue

  return (
    <div
      ref={rootRef}
      className={`adropdown-root has-fluent-tooltip ${disabled ? 'is-disabled' : ''}`}
      onMouseEnter={onHoverHint}
      data-tooltip={tooltip || undefined}
      aria-label={tooltip || undefined}
    >
      <span className="adropdown-title">{title}</span>

      <button
        type="button"
        className={`adropdown-trigger ${open ? 'is-open' : ''}`}
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="adropdown-selected">{selectedLabel}</span>
        <span className="adropdown-arrow" aria-hidden="true">
          <svg viewBox="0 0 20 20" fill="none">
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {open && !disabled && (
        <div className="adropdown-popup">
          {normalizedOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`adropdown-item ${
                option.value === selectedValue ? 'is-selected' : ''
              }`}
              onClick={() => handleSelect(option.value)}
            >
              <span className="adropdown-indicator" />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ADropdown
