import { useState } from 'react'
import {
  RiAliensFill,
  RiCpuLine,
  RiEyeLine,
  RiEyeOffLine,
  RiInformationLine,
  RiPriceTag3Fill,
  RiRefreshLine,
  RiTimeFill,
} from 'react-icons/ri'

const iconMap = {
  information: RiInformationLine,
  user: RiAliensFill,
  time: RiTimeFill,
  tag: RiPriceTag3Fill,
  cpu: RiCpuLine,
  refresh: RiRefreshLine,
  eye: RiEyeLine,
  eyeOff: RiEyeOffLine,
}

function AInfoCard({
  title,
  value,
  icon = 'information',
  sensitive = false,
  actionIcon,
  onAction,
}) {
  const [masked, setMasked] = useState(Boolean(sensitive))
  const InfoIcon = iconMap[icon] ?? iconMap.information

  const displayValue = masked ? '************' : value
  const ActionIcon = sensitive
    ? masked
      ? iconMap.eye
      : iconMap.eyeOff
    : iconMap[actionIcon] ?? iconMap.refresh

  return (
    <div className="ainfo-card">
      <div className="ainfo-card-inner">
        <div className="ainfo-main">
          <div className="ainfo-head">
            <span className="ainfo-icon-wrap" aria-hidden="true">
              <InfoIcon />
            </span>
            <span className="ainfo-title-chip">{title.toUpperCase()}</span>
          </div>
          <p className="ainfo-value">{displayValue}</p>
        </div>

        {(sensitive || onAction) && (
          <button
            type="button"
            className="ainfo-action-btn"
            onClick={() => {
              if (sensitive) {
                setMasked((prev) => !prev)
                return
              }
              onAction?.()
            }}
          >
            <ActionIcon />
          </button>
        )}
      </div>
    </div>
  )
}

export default AInfoCard
