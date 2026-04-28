import { useCallback, useEffect, useRef, useState } from 'react'
import { RiWifiLine } from 'react-icons/ri'

function ANetworkSettings({
  title = 'UDP 网络推流设置',
  value,
  onChange,
  popupTitle = 'UDP 网络推流设置',
  disabled = false,
  onHoverHint,
  tooltip,
}) {
  const rootRef = useRef(null)
  const [popupOpen, setPopupOpen] = useState(false)

  const ip = value?.ip ?? '127.0.0.1'
  const port = value?.port ?? '6000'

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

  const onRootContextMenu = (e) => {
    e.preventDefault()
    openPopup()
  }

  const update = (next) => onChange?.({ ip, port, ...next })

  return (
    <div
      ref={rootRef}
      className={`anetwork-root has-fluent-tooltip ${disabled ? 'is-disabled' : ''}`}
      onMouseEnter={onHoverHint}
      onContextMenu={onRootContextMenu}
      data-tooltip={tooltip || undefined}
      aria-label={tooltip || undefined}
    >
      <div className="anetwork-row">
        <span className="anetwork-title">{title}</span>
        <button
          type="button"
          className="anetwork-icon-btn"
          disabled={disabled}
          aria-label={popupTitle}
          onClick={openPopup}
        >
          <RiWifiLine aria-hidden="true" />
        </button>
      </div>

      {popupOpen && !disabled && (
        <div className="anetwork-popup" role="dialog" aria-label={popupTitle}>
          <div className="anetwork-fields">
            <label className="anetwork-field">
              <span>IPv4</span>
              <input
                type="text"
                value={ip}
                onChange={(ev) => update({ ip: ev.target.value.trim() })}
                placeholder="127.0.0.1"
              />
            </label>
            <span className="anetwork-colon">:</span>
            <label className="anetwork-field anetwork-field-port">
              <span>Port</span>
              <input
                type="text"
                value={port}
                onChange={(ev) => update({ port: ev.target.value.trim() })}
                placeholder="6000"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  )
}

export default ANetworkSettings
