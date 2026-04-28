import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { RiSettings3Fill } from 'react-icons/ri'

function AClassID({
  title = 'Edit Class ID',
  classes = [],
  selectedClasses = [],
  onSelectedClassesChange,
  popupTitle = 'AI Classes',
  disabled = false,
  onHoverHint,
  tooltip,
}) {
  const rootRef = useRef(null)
  const [popupOpen, setPopupOpen] = useState(false)

  const normalizedClasses = useMemo(
    () => classes.map((item) => (typeof item === 'string' ? item : item?.label ?? String(item))),
    [classes],
  )

  const selectedSet = useMemo(() => new Set(selectedClasses), [selectedClasses])

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

  const toggleClass = (className, checked) => {
    if (disabled) return
    const next = new Set(selectedSet)
    if (checked) next.add(className)
    else next.delete(className)
    onSelectedClassesChange?.(Array.from(next))
  }

  return (
    <div
      ref={rootRef}
      className={`aclassid-root has-fluent-tooltip ${disabled ? 'is-disabled' : ''}`}
      onMouseEnter={onHoverHint}
      onContextMenu={onRootContextMenu}
      data-tooltip={tooltip || undefined}
      aria-label={tooltip || undefined}
    >
      <div className="aclassid-row">
        <span className="aclassid-title">{title}</span>
        <button
          type="button"
          className="aclassid-icon-btn"
          disabled={disabled}
          aria-label={popupTitle}
          onClick={openPopup}
        >
          <RiSettings3Fill aria-hidden="true" />
        </button>
      </div>

      {popupOpen && !disabled && (
        <div className="aclassid-popup" role="dialog" aria-label={popupTitle}>
          <p className="aclassid-popup-heading">{popupTitle}</p>
          <div className="aclassid-popup-sep" />
          <div className="aclassid-list">
            {normalizedClasses.map((className) => (
              <label key={className} className="aclassid-item">
                <input
                  type="checkbox"
                  checked={selectedSet.has(className)}
                  onChange={(ev) => toggleClass(className, ev.target.checked)}
                />
                <span>{className}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AClassID
