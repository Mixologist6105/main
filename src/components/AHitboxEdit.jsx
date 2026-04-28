import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { RiSettings3Fill } from 'react-icons/ri'

const FRAME_WIDTH = 120
const FRAME_HEIGHT = 220
const MIN_SIZE = 10

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function AHitboxEdit({
  title = 'Edit Trigger Hitbox',
  value,
  onChange,
  popupTitle = 'Edit Trigger Hitbox',
  disabled = false,
  onHoverHint,
  tooltip,
}) {
  const rootRef = useRef(null)
  const [popupOpen, setPopupOpen] = useState(false)
  const [dragState, setDragState] = useState(null)
  const [resizeState, setResizeState] = useState(null)

  const normalized = useMemo(() => {
    const top = clamp(Number(value?.top ?? 0.3), 0, 1)
    const width = clamp(Number(value?.width ?? 0.66), MIN_SIZE / FRAME_WIDTH, 1)
    const height = clamp(Number(value?.height ?? 0.22), MIN_SIZE / FRAME_HEIGHT, 1)
    return { top, width, height }
  }, [value])

  const rectPx = useMemo(() => {
    const width = clamp(normalized.width * FRAME_WIDTH, MIN_SIZE, FRAME_WIDTH)
    const height = clamp(normalized.height * FRAME_HEIGHT, MIN_SIZE, FRAME_HEIGHT)
    const top = clamp(normalized.top * FRAME_HEIGHT, 0, FRAME_HEIGHT - height)
    const left = (FRAME_WIDTH - width) / 2
    return { left, top, width, height }
  }, [normalized])

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

  const emitChangeFromPx = (nextPx) => {
    const width = clamp(nextPx.width, MIN_SIZE, FRAME_WIDTH)
    const height = clamp(nextPx.height, MIN_SIZE, FRAME_HEIGHT)
    const top = clamp(nextPx.top, 0, FRAME_HEIGHT - height)
    onChange?.({
      top: top / FRAME_HEIGHT,
      width: width / FRAME_WIDTH,
      height: height / FRAME_HEIGHT,
    })
  }

  const onRectPointerDown = (ev) => {
    if (disabled || !popupOpen) return
    if (resizeState) return
    ev.currentTarget.setPointerCapture?.(ev.pointerId)
    setDragState({ startY: ev.clientY, startTop: rectPx.top })
  }

  const onRectPointerMove = (ev) => {
    if (!dragState) return
    ev.preventDefault()
    const deltaY = ev.clientY - dragState.startY
    emitChangeFromPx({ ...rectPx, top: dragState.startTop + deltaY })
  }

  const onRectPointerUp = (ev) => {
    if (!dragState) return
    ev.currentTarget.releasePointerCapture?.(ev.pointerId)
    setDragState(null)
  }

  const onHandlePointerDown = (ev) => {
    if (disabled || !popupOpen) return
    if (dragState) return
    ev.stopPropagation()
    ev.currentTarget.setPointerCapture?.(ev.pointerId)
    setResizeState({
      startX: ev.clientX,
      startY: ev.clientY,
      startW: rectPx.width,
      startH: rectPx.height,
      top: rectPx.top,
    })
  }

  const onHandlePointerMove = (ev) => {
    if (!resizeState) return
    ev.preventDefault()
    const deltaX = ev.clientX - resizeState.startX
    const deltaY = ev.clientY - resizeState.startY
    const nextW = clamp(resizeState.startW + deltaX, MIN_SIZE, FRAME_WIDTH)
    const nextH = clamp(
      resizeState.startH + deltaY,
      MIN_SIZE,
      FRAME_HEIGHT - clamp(resizeState.top, 0, FRAME_HEIGHT),
    )
    emitChangeFromPx({ ...rectPx, width: nextW, height: nextH, top: resizeState.top })
  }

  const onHandlePointerUp = (ev) => {
    if (!resizeState) return
    ev.currentTarget.releasePointerCapture?.(ev.pointerId)
    setResizeState(null)
  }

  return (
    <div
      ref={rootRef}
      className={`ahitbox-root has-fluent-tooltip ${disabled ? 'is-disabled' : ''}`}
      onMouseEnter={onHoverHint}
      onContextMenu={onRootContextMenu}
      data-tooltip={tooltip || undefined}
      aria-label={tooltip || undefined}
    >
      <div className="ahitbox-row">
        <span className="ahitbox-title">{title}</span>
        <button
          type="button"
          className="ahitbox-icon-btn"
          disabled={disabled}
          aria-label={popupTitle}
          onClick={openPopup}
        >
          <RiSettings3Fill aria-hidden="true" />
        </button>
      </div>

      {popupOpen && !disabled && (
        <div className="ahitbox-popup" role="dialog" aria-label={popupTitle}>
          <div className="ahitbox-frame">
            <div className="ahitbox-canvas" aria-label="Hitbox editor">
              <div
                className="ahitbox-rect"
                style={{
                  top: `${rectPx.top}px`,
                  left: `${rectPx.left}px`,
                  width: `${rectPx.width}px`,
                  height: `${rectPx.height}px`,
                }}
                onPointerDown={onRectPointerDown}
                onPointerMove={onRectPointerMove}
                onPointerUp={onRectPointerUp}
              >
                <div
                  className="ahitbox-handle"
                  style={{ right: 0, bottom: 0 }}
                  onPointerDown={onHandlePointerDown}
                  onPointerMove={onHandlePointerMove}
                  onPointerUp={onHandlePointerUp}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AHitboxEdit
