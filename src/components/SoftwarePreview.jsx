import { useMemo, useState } from 'react'
import ADropdown from './ADropdown'
import AToggle from './AToggle'
import ASlider from './ASlider'
import AKeyChanger from './AKeyChanger'
import AClassID from './AClassID'
import AHitboxEdit from './AHitboxEdit'
import ANetworkSettings from './ANetworkSettings'
import ADeveloperCard from './ADeveloperCard'
import AInfoCard from './AInfoCard'
import LogoIcon from './LogoIcon'
import {
  RiCodeBoxFill,
  RiFolder3Fill,
  RiInformationFill,
  RiShieldUserFill,
  RiSkull2Fill,
  RiToolsFill,
} from 'react-icons/ri'

const sidebarItems = [
  { labelZh: 'Legit', labelEn: 'Legit', icon: RiSkull2Fill, menu: 'AimMenu' },
  {
    labelZh: 'Models / Configs',
    labelEn: 'Models / Configs',
    icon: RiFolder3Fill,
    menu: null,
    disabled: true,
  },
  { labelZh: 'Debug', labelEn: 'Debug', icon: RiToolsFill, menu: null, disabled: true },
  {
    labelZh: 'Tools',
    labelEn: 'Tools',
    icon: RiCodeBoxFill,
    menu: null,
    disabled: true,
  },
]

const groupNameMap = {
  General: { zh: 'General', en: 'General' },
  KeyBinds: { zh: 'KeyBinds', en: 'KeyBinds' },
  Trigger: { zh: 'Trigger', en: 'Trigger' },
  Basic: { zh: 'Basic', en: 'Basic' },
  Legit: { zh: 'Legit', en: 'Legit' },
  FOV: { zh: 'FOV', en: 'FOV' },
}

const aimGroups = {
  General: [
    {
      key: 'AimbotToggle',
      label: '实时推理 / AI Thread',
      type: 'toggle',
      hint: '整个 AI 的推理开关, 要先加载模型再开启 / Master switch for AI inference. Load your model before enabling it.',
    },
    {
      key: 'ToggleKey',
      label: '开关按键 / Toggle Key',
      type: 'keychanger',
      popupTitle: '热键列表 / Hotkey List',
      hint: '用于控制 "AI 实时推理" 的开启与关闭 / Keybind used to turn AI real-time inference on or off.',
    },
    {
      key: 'AI_Min_Conf',
      label: '置信度 / Min. Confidence',
      type: 'range',
      min: 10,
      max: 100,
      step: 1,
      unitText: '%',
      hint: 'AI 识别模型的准确率, 准确率越高, 识别的模型就更精准但也更慢，根据自己手感来调, 推荐使用 30~35 / Confidence threshold for AI detection. Higher values improve precision but may reduce responsiveness. Recommended range: 30-35.',
    },
    {
      key: 'Frame_Limited',
      label: '帧数限制 / Frame Limited',
      type: 'range',
      min: 1,
      max: 300,
      step: 1,
      unitText: 'FPS',
      hint: '帧数限制, 用于限制 AI 的帧数, 帧数越高, 模型识别反应速度越快, 但也会导致 GPU 占用率越高, 根据自己电脑配置来调整 / FPS limit for AI processing. Higher values react faster but consume more GPU resources. Adjust based on your hardware.',
    },
    {
      key: 'ScreenShot_Method',
      label: '截图 API / Screenshot API',
      type: 'select',
      options: ['DXGI', 'OBS UDP'],
      hint: '调整 AI 用来截取屏幕的引擎，分为本机 DXGI 以及 OBS UDP 推流，OBS UDP 推流可双机部署 / Choose the capture backend: local DXGI or OBS UDP stream. OBS UDP supports dual-PC streaming setups.',
    },
    {
      key: 'Network_Settings',
      label: 'UDP 网络推流设置 / UDP Network Stream',
      type: 'networksettings',
      popupTitle: 'UDP 网络推流设置',
      hint: 'OBS UDP 推流设置, 用于设置 OBS UDP 推流的 IP 地址和端口, 根据主机 OBS 内的 UDP 设置来调整 / OBS UDP stream settings. Configure IP and port to match the host OBS UDP settings.',
    },
  ],
  KeyBinds: [
    {
      key: 'MouseMoveMethod',
      label: '鼠标移动 API / Mouse Move API',
      type: 'select',
      options: ['Makcu Box'],
      hint: '目前仅接入了 Makcu / Currently only Makcu is supported.',
    },
    {
      key: 'key1',
      label: '瞄准按键 / Aim Key',
      type: 'keychanger',
      popupTitle: '热键列表 / Hotkey List',
      hint: '你可以随意的绑定任意按键，按键数量无限制 / Bind any key or combination you want. Number of bindings is unlimited.',
    },
  ],
  Trigger: [
    {
      key: 'TriggerBot',
      label: '自动扳机 / TriggerBot',
      type: 'toggle',
      hint: '检测到目标自动开火, 需要绑定 "扳机按键" / Automatically fires when a target is detected. Requires a trigger key binding.',
    },
    {
      key: 'Trigger_Hitbox',
      label: '扳机范围 / Edit Trigger Hitbox',
      type: 'hitboxedit',
      hint: '我们开发了更先进的击打部位框选功能，只需要拖动你的鼠标，调整目标框即可 / Advanced hitbox selection. Drag with your mouse to adjust the target box.',
    },
    {
      key: 'TriggerBotKey',
      label: '扳机按键 / Trigger Key',
      type: 'keychanger',
      popupTitle: '热键列表 / Hotkey List',
      hint: '用于控制 "自动扳机" 的按键绑定 / Keybind used to control TriggerBot behavior.',
    },
    {
      key: 'First_Shot_Delay',
      label: '反应时间 / Reaction time',
      type: 'range',
      min: 1,
      max: 1000,
      step: 1,
      unitText: 'ms',
      hint: '控制 AI 在第一次瞄准目标时的开枪延迟, 单位为毫秒 / Delay before the first shot after target lock (in milliseconds).',
    },
    {
      key: 'Trigger_Delay',
      label: '间隔延迟 / Delay Between Shots',
      type: 'range',
      min: 15,
      max: 1000,
      step: 1,
      unitText: 'ms',
      hint: '控制两次开枪之间的延迟, 单位为毫秒 / Delay between consecutive shots (in milliseconds).',
    },
  ],
  Basic: [
    {
      key: 'MouseMove_Pred',
      label: '移动预测算法 / Movement Logic',
      type: 'select',
      options: ['-', 'Mixo'],
      hint: '计算敌人向量并增益补偿鼠标移动 / Calculates target movement vectors and applies prediction compensation to cursor movement.',
    },
    {
      key: 'Pred_Comp',
      label: '预测增益 (X) / Pred Strength X',
      type: 'range',
      min: 0,
      max: 20,
      step: 1,
      unitText: 'X',
      hint: '控制 X 轴的预测增益, 数值越大, 预测的越精准, 但也会导致鼠标移动轨迹不平滑, 数值越小, 预测的越不精准, 但也会导致鼠标移动轨迹平滑 / Controls prediction compensation on X axis. Higher values increase prediction strength but can reduce smoothness.',
    },
    {
      key: 'Pred_Comp_y',
      label: '预测增益 (Y) / Pred Strength Y',
      type: 'range',
      min: 0,
      max: 20,
      step: 1,
      unitText: 'Y',
      hint: '控制 Y 轴的预测增益, 数值越大, 预测的越精准, 但也会导致鼠标移动轨迹不平滑, 数值越小, 预测的越不精准, 但也会导致鼠标移动轨迹平滑 / Controls prediction compensation on Y axis. Higher values increase prediction strength but can reduce smoothness.',
    },
    {
      key: 'EditClassID',
      label: '编辑 AI 标签 / Edit AI Labels',
      type: 'classid',
      popupTitle: 'AI Classes',
      options: ['All', 'Player', 'Head', 'Body', 'Neck'],
      hint: '用于选择 AI 识别的目标类别, 由多个类别组成, 可以同时识别多个类别，类别由模型决定 / Select AI target classes. Multiple classes can be enabled at once, depending on model capabilities.',
    },
    {
      key: 'Y_Offset',
      label: '瞄准偏移 / Aim Offset',
      type: 'range',
      min: 0,
      max: 100,
      step: 1,
      unitText: '↑↓',
      hint: '调整瞄准的速度比例，X 轴建议为 100，Y 轴视情况调整，一般 Y 轴比 X 轴低 (在后坐力比较低的情况下，后坐力高的情况下 Y 轴可以辅助压枪，反之亦然) / Adjust aim offset ratio. X is usually around 100; tune Y lower or higher based on recoil behavior.',
    },
  ],
  Legit: [
    {
      key: 'PID_PX',
      label: '速度 (X) / Speed (X)',
      type: 'range',
      min: 1,
      max: 100,
      step: 1,
      unitText: '%',
      hint: '常规吸附速度 X。 / Standard aim assist speed on X axis.',
    },
    {
      key: 'PID_PY',
      label: '速度 (Y) / Speed (Y)',
      type: 'range',
      min: 1,
      max: 100,
      step: 1,
      unitText: '%',
      hint: '常规吸附速度 Y。 / Standard aim assist speed on Y axis.',
    }, 
    {
      key: 'ScopedKey',
      label: '开镜按键 / Scoped Key',
      type: 'keychanger',
      popupTitle: '热键列表 / Hotkey List',
      hint: '用于绑定你的开镜按键 / Keybind used to bind your scoped key.',
    },
  ],
  FOV: [
    {
      key: 'ShowFOV',
      label: 'FOV 可视化 / FOV Visualize',
      type: 'toggle',
      hint: '在屏幕上显示 FOV 大小 / Display the FOV area on screen.',
    },
    {
      key: 'FOV_Size_x',
      label: 'FOV (X)',
      type: 'range',
      min: 10,
      max: 640,
      step: 1,
      unitText: 'size',
      hint: '调节 AI 锁定的范围宽度 / Adjust width of AI lock-on area.',
    },
    {
      key: 'FOV_Size_y',
      label: 'FOV (Y)',
      type: 'range',
      min: 10,
      max: 640,
      step: 1,
      unitText: 'size',
      hint: '调节 AI 锁定的范围高度 / Adjust height of AI lock-on area.',
    },
    {
      key: 'Mouse_FOV',
      label: 'FOV 基于 / FOV Based By',
      type: 'select',
      options: ['Screen Center', 'Around Mouse'],
      hint: '调节 AI 锁定范围的中心点，分为屏幕中心和鼠标中心，鼠标中心会跟随鼠标移动，屏幕中心不会跟随鼠标移动 / Choose lock-on center: screen center or mouse center. Mouse center follows cursor movement; screen center remains fixed.',
    },
  ],
}

function SoftwarePreview({ lang = 'zh', onHintChange, defaultHint }) {
  const [activeMenu, setActiveMenu] = useState('AimMenu')
  const [values, setValues] = useState(initialValues)
  const [aiBoxStatus, setAiBoxStatus] = useState('Connected')
  const aimSections = useMemo(() => Object.entries(aimGroups), [])
  const uiLang = lang
  const fallbackHint =
    defaultHint ?? (uiLang === 'zh' ? '鼠标移到控件上可查看功能介绍。' : 'Hover controls to see usage tips.')

  const textByLang = (zhText, enText) => (uiLang === 'zh' ? zhText : enText)
  const splitBilingual = (text) => {
    const parts = text.split(' / ')
    if (parts.length === 2) return uiLang === 'zh' ? parts[0] : parts[1]
    return text
  }

  const updateValue = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }
  const emitHint = (hint) => onHintChange?.(hint || fallbackHint)

  const renderControl = (control) => {
    const value = values[control.key]
    const hintText = (() => {
      const rawHint = control.hint || ''
      if (rawHint.includes(' / ')) return splitBilingual(rawHint)
      if (uiLang === 'en') return `Usage tip: ${splitBilingual(control.label)}.`
      return rawHint
    })()
    if (control.type === 'select') {
      return (
        <div key={control.key} className="control-item control-item-dropdown">
          <ADropdown
            title={splitBilingual(control.label)}
            options={control.options}
            value={value}
            onChange={(next) => updateValue(control.key, next)}
            onHoverHint={() => emitHint(hintText)}
            tooltip={hintText}
          />
        </div>
      )
    }

    if (control.type === 'toggle') {
      return (
        <div key={control.key} className="control-item control-item-toggle">
          <AToggle
            label={splitBilingual(control.label)}
            checked={Boolean(value)}
            onChange={(next) => updateValue(control.key, next)}
            onHoverHint={() => emitHint(hintText)}
            tooltip={hintText}
          />
        </div>
      )
    }

    if (control.type === 'keychanger') {
      const list = Array.isArray(value) ? value : value != null ? [String(value)] : []
      const popupTitle = control.popupTitle
        ? splitBilingual(control.popupTitle)
        : uiLang === 'zh'
          ? '热键列表'
          : 'Hotkey List'
      return (
        <div key={control.key} className="control-item control-item-keychanger">
          <AKeyChanger
            title={splitBilingual(control.label)}
            bindings={list}
            popupTitle={popupTitle}
            onBindingsChange={(next) => updateValue(control.key, next)}
            onHoverHint={() => emitHint(hintText)}
            tooltip={hintText}
          />
        </div>
      )
    }

    if (control.type === 'classid') {
      const selected = Array.isArray(value) ? value : []
      return (
        <div key={control.key} className="control-item control-item-classid">
          <AClassID
            title={splitBilingual(control.label)}
            classes={control.options ?? []}
            selectedClasses={selected}
            popupTitle={control.popupTitle ?? 'AI Classes'}
            onSelectedClassesChange={(next) => updateValue(control.key, next)}
            onHoverHint={() => emitHint(hintText)}
            tooltip={hintText}
          />
        </div>
      )
    }

    if (control.type === 'hitboxedit') {
      const safeValue =
        value && typeof value === 'object'
          ? value
          : { top: 0.3, width: 0.66, height: 0.22 }
      return (
        <div key={control.key} className="control-item control-item-hitbox">
          <AHitboxEdit
            title={splitBilingual(control.label)}
            value={safeValue}
            onChange={(next) => updateValue(control.key, next)}
            onHoverHint={() => emitHint(hintText)}
            tooltip={hintText}
          />
        </div>
      )
    }

    if (control.type === 'networksettings') {
      const safeValue =
        value && typeof value === 'object'
          ? value
          : { ip: '127.0.0.1', port: '6000' }
      return (
        <div key={control.key} className="control-item control-item-network">
          <ANetworkSettings
            title={splitBilingual(control.label)}
            value={safeValue}
            popupTitle={control.popupTitle ?? 'UDP 网络推流设置'}
            onChange={(next) => updateValue(control.key, next)}
            onHoverHint={() => emitHint(hintText)}
            tooltip={hintText}
          />
        </div>
      )
    }

    if (control.type === 'range') {
      return (
        <div key={control.key} className="control-item control-item-slider">
          <ASlider
            configKey={control.key}
            title={splitBilingual(control.label)}
            value={Number(value)}
            min={control.min}
            max={control.max}
            step={control.step}
            unitText={control.unitText}
            customTextMap={control.customTextMap}
            onChange={(next) => updateValue(control.key, next)}
            onHoverHint={() => emitHint(hintText)}
            tooltip={hintText}
          />
        </div>
      )
    }

    return null
  }

  return (
    <section className="software-preview" onMouseLeave={() => onHintChange?.(fallbackHint)}>
      <div className="software-window-frame">
            <div className="software-shell">
        <aside className="software-sidebar">
          <div className="software-brand-card">
            <div className="software-brand-icon" aria-hidden="true">
              <LogoIcon className="software-brand-icon-svg" />
            </div>
            <div>
              <p className="software-brand-title text-backslash">MIXOCORE</p>
              <p className="software-brand-sub">DML</p>
            </div>
          </div>

          <p className="software-logo">{textByLang('Main', 'Main')}</p>
          {sidebarItems.map((item) => (
            <button
              key={item.labelEn}
              type="button"
              disabled={item.disabled}
              className={`software-nav-item ${activeMenu === item.menu ? 'is-active' : ''}`}
              onClick={() => item.menu && setActiveMenu(item.menu)}
            >
              <span className="software-nav-icon" aria-hidden="true">
                <item.icon />
              </span>
              <span className="software-nav-label">
                {textByLang(item.labelZh, item.labelEn)}
              </span>
            </button>
          ))}

          <button
            type="button"
            className={`software-nav-item software-nav-bottom ${
              activeMenu === 'InfoMenu' ? 'is-active' : ''
            }`}
            onClick={() => setActiveMenu('InfoMenu')}
          >
            <span className="software-nav-icon" aria-hidden="true">
              <RiShieldUserFill />
            </span>
            <span className="software-nav-label">{textByLang('Information', 'Information')}</span>
          </button>
        </aside>

        <div className="software-main">
          <div className="software-topbar">
            <div className="software-topbar-left">
              <button type="button" className="software-icon-btn">
                <RiInformationFill />
              </button>
            </div>
          </div>

          <div className="software-content">
            {activeMenu === 'AimMenu' && (
              <div className="aim-scrollviewer">
                <div className="software-columns">
                  <div className="software-column-stack">
                    {aimSections.slice(0, 3).map(([group, controls]) => (
                      <div key={group} className="groupbox">
                        <div className="groupbox-header">
                          {textByLang(groupNameMap[group].zh, groupNameMap[group].en)}
                        </div>
                        <div className="groupbox-content control-list">
                          {controls.map((control) => renderControl(control))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="software-column-stack">
                    {aimSections.slice(3).map(([group, controls]) => (
                      <div key={group} className="groupbox">
                        <div className="groupbox-header">
                          {textByLang(groupNameMap[group].zh, groupNameMap[group].en)}
                        </div>
                        <div className="groupbox-content control-list">
                          {controls.map((control) => renderControl(control))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeMenu === 'InfoMenu' && (
              <div className="info-layout">
                <ADeveloperCard />
                <div className="info-grid">
                  <div className="info-col">
                    <AInfoCard
                      title={textByLang('用户 ID', 'User ID')}
                      value="theMixo_6105"
                      icon="user"
                      sensitive
                    />
                    <AInfoCard
                      title={textByLang('到期时间', 'Expiration Date')}
                      value="2027-12-31"
                      icon="time"
                    />
                  </div>
                  <div className="info-col">
                    <AInfoCard title={textByLang('AI 版本', 'AI Version')} value="v 2.5.1" icon="tag" />
                    <AInfoCard
                      title={textByLang('Makcu 盒子状态', 'Makcu Box Status')}
                      value={aiBoxStatus}
                      icon="cpu"
                      actionIcon="refresh"
                      onAction={() => {
                        setAiBoxStatus('Connecting...')
                        setTimeout(() => setAiBoxStatus('Connected'), 900)
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
      </div>
    </section>
  )
}

const initialValues = {
  AimbotToggle: true,
  AI_Min_Conf: 40,
  Frame_Limited: 240,
  ScreenShot_Method: 'DXGI',
  Network_Settings: { ip: '127.0.0.1', port: '12500' },
  Language: '简体中文',
  MouseMoveMethod: 'Makcu Box',
  ToggleKey: ['Oem 3'],
  key1: ['Mouse 4', 'Left'],
  TriggerBot: false,
  Trigger_Hitbox: { top: 0.02, width: 0.66, height: 0.70 },
  TriggerBotKey: ['Mouse 4'],
  ScopedKey: ['Right'],
  First_Shot_Delay: 80,
  Trigger_Delay: 120,
  MouseMove_Pred: 'Mixo',
  Pred_Comp: 15,
  Pred_Comp_y: 5,
  EditClassID: ['All', 'Player', 'Head', 'Body', 'Neck'],
  Y_Offset: 20,
  PID_PX: 90,
  PID_PY: 80, 
  scope_key: 'Right',
  ShowFOV: true,
  FOV_Size_x: 220,
  FOV_Size_y: 50,
  Mouse_FOV: 'Screen Center',
}

export default SoftwarePreview
