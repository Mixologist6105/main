import { forwardRef, useImperativeHandle, useMemo } from 'react'

const ASlider = forwardRef(function ASlider(
  {
    configKey,
    title,
    value,
    min = 0,
    max = 100,
    step = 1,
    unitText = '',
    customTextMap = {},
    onChange,
    onHoverHint,
    tooltip,
  },
  ref,
) {
  const safeMax = Number(max)
  const safeMin = Number(min)
  const numericValue = Number(value)
  const roundedValue = Number(numericValue.toFixed(2))
  const percent = ((numericValue - safeMin) / (safeMax - safeMin || 1)) * 100

  const displayText = useMemo(() => {
    const entries = Object.entries(customTextMap ?? {})
    const mapped = entries.find(([key]) => Number(key).toFixed(2) === roundedValue.toFixed(2))
    if (mapped) return mapped[1]
    return `${roundedValue.toFixed(2)} ${unitText}`.trim()
  }, [customTextMap, roundedValue, unitText])

  useImperativeHandle(
    ref,
    () => ({
      getValue: () => numericValue,
      setValue: (nextValue) => onChange?.(Number(nextValue)),
      getConfigKey: () => configKey,
    }),
    [configKey, numericValue, onChange],
  )

  return (
    <div
      className="aslider-root has-fluent-tooltip"
      onMouseEnter={onHoverHint}
      data-tooltip={tooltip || undefined}
      aria-label={tooltip || undefined}
    >
      <div className="aslider-top">
        <span className="aslider-title">{title}</span>
        <span className="aslider-notifier">{displayText}</span>
      </div>

      <div className="aslider-track-wrap" style={{ '--slider-progress': `${percent}%` }}>
        <div className="aslider-track-fill" />
        <div className="aslider-track-rest" />
        <input
          className="aslider-input"
          type="range"
          value={numericValue}
          min={min}
          max={max}
          step={step}
          onChange={(event) => onChange?.(Number(event.target.value))}
        />
      </div>
    </div>
  )
})

export default ASlider
