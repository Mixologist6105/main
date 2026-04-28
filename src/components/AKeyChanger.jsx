import { useCallback, useEffect, useRef, useState } from 'react'
import {
  RiCheckboxCircleFill,
  RiDeleteBinLine,
  RiKeyboardBoxLine,
  RiSettings3Fill,
} from 'react-icons/ri'

function formatKeyEvent(ev) {
  if (ev.repeat) return null
  if (ev.key === 'Escape') return '__CANCEL__'
  if (['Control', 'Shift', 'Alt', 'Meta'].includes(ev.key)) return null
  const parts = []
  if (ev.ctrlKey) parts.push('Ctrl')
  if (ev.altKey) parts.push('Alt')
  if (ev.shiftKey) parts.push('Shift')
  if (ev.metaKey) parts.push('Win')
  let k = ev.key
  if (k === ' ') k = 'Space'
  else if (k.length === 1) k = k.toUpperCase()
  parts.push(k)
  return parts.join('+')
}

function AKeyChanger({
  title = 'Key Binds',
  bindings = [],
  onBindingsChange,
  onStartListening,
  onStopListening,
  popupTitle = 'Hotkey List',
  disabled = false,
  onHoverHint,
  tooltip,
}) {
  const rootRef = useRef(null)
  const [popupOpen, setPopupOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [listening, setListening] = useState(false)
  const [addDoneFlash, setAddDoneFlash] = useState(false)

  const openPopup = useCallback(() => {
    if (disabled) return
    setPopupOpen(true)
  }, [disabled])

  useEffect(() => {
    const onDocMouseDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setPopupOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [])

  useEffect(() => {
    if (!listening) return undefined
    const onKeyDown = (ev) => {
      ev.preventDefault()
      ev.stopPropagation()
      const label = formatKeyEvent(ev)
      if (label === '__CANCEL__') {
        setListening(false)
        onStopListening?.()
        return
      }
      if (!label) return
      if (!bindings.includes(label)) {
        onBindingsChange?.([...bindings, label])
      }
      setListening(false)
      onStopListening?.()
      setAddDoneFlash(true)
      window.setTimeout(() => setAddDoneFlash(false), 600)
    }
    window.addEventListener('keydown', onKeyDown, true)
    return () => window.removeEventListener('keydown', onKeyDown, true)
  }, [listening, bindings, onBindingsChange, onStopListening])

  const handleAddClick = () => {
    if (disabled) return
    if (!listening) {
      setListening(true)
      onStartListening?.()
    }
  }

  const handleRemove = () => {
    if (disabled || selected == null) return
    const next = bindings.filter((b) => b !== selected)
    onBindingsChange?.(next)
    setSelected(null)
  }

  const onRootContextMenu = (e) => {
    e.preventDefault()
    openPopup()
  }

  return (
    <div
      ref={rootRef}
      className={`akeychanger-root has-fluent-tooltip ${disabled ? 'is-disabled' : ''} ${
        listening ? 'is-listening' : ''
      }`}
      onMouseEnter={onHoverHint}
      onContextMenu={onRootContextMenu}
      data-tooltip={tooltip || undefined}
      aria-label={tooltip || undefined}
    >
      <div className="akeychanger-row">
        <span className="akeychanger-title">{title}</span>

        <button
          type="button"
          className="akeychanger-icon-btn"
          disabled={disabled}
          aria-label={popupTitle}
          onClick={openPopup}
        >
          <RiSettings3Fill aria-hidden="true" />
        </button>

        <button
          type="button"
          className="akeychanger-add-btn"
          disabled={disabled}
          aria-label={listening ? 'Listening for key' : 'Add hotkey'}
          onClick={handleAddClick}
        >
          {listening ? (
            <RiCheckboxCircleFill className="akeychanger-add-icon is-listening" aria-hidden="true" />
          ) : addDoneFlash ? (
            <RiCheckboxCircleFill className="akeychanger-add-icon is-done" aria-hidden="true" />
          ) : (
            <RiKeyboardBoxLine className="akeychanger-add-icon" aria-hidden="true" />
          )}
        </button>
      </div>

      {popupOpen && !disabled && (
        <div className="akeychanger-popup" role="dialog" aria-label={popupTitle}>
          <p className="akeychanger-popup-heading">{popupTitle}</p>
          <div className="akeychanger-popup-sep" />
          <ul className="akeychanger-list" role="listbox">
            {bindings.length === 0 ? (
              <li className="akeychanger-list-empty">—</li>
            ) : (
              bindings.map((binding, index) => (
                <li key={`${binding}-${index}`}>
                  <button
                    type="button"
                    className={`akeychanger-list-item ${selected === binding ? 'is-selected' : ''}`}
                    onClick={() => setSelected(binding === selected ? null : binding)}
                  >
                    {binding}
                  </button>
                </li>
              ))
            )}
          </ul>
          <button
            type="button"
            className="akeychanger-remove-btn"
            disabled={selected == null}
            onClick={handleRemove}
          >
            <RiDeleteBinLine aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  )
}

export default AKeyChanger
