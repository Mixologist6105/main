// Screenshots live in public/preview/. Always prefix public-asset paths with
// BASE so they work under the GitHub Pages sub-path (e.g. /main/).
// Public-asset prefix: '/' in dev, '/<repo>/' in GH Pages builds
const BASE = import.meta.env.BASE_URL

export const projects = [
  {
    title: 'Braytech',
    subtitle: { zh: 'AI 视觉辅助软件 | 2024.03 — Now', en: 'AI Vision Assistant | 2024.03 — Now' },
    description: {
      zh: '持续更新的项目。基于 onnxruntime 的实时视觉识别 + Lua 可编程自动化，为游戏与效率场景打造的一体化辅助工具。',
      en: 'Continuously updated projects. Real time visual recognition based on onnxruntime and Lua programmable automation, an integrated auxiliary tool designed for gaming and efficiency scenarios.',
    },
    tags: ['C#', 'C++ Native', 'onnxruntime', 'DirectML', 'Win x64'], 
    src: { zh: `${BASE}preview/Preview_Main_zh.png`, en: `${BASE}preview/Preview_Main_en.png` },
    link: '/docs',
    status: 'live',
  },
  {
    title: 'MixoSync.lua',
    subtitle: { zh: '嵌入式 LUA 脚本 | 2021.04 — 2023.11', en: 'LUA Scripts | 2021.04 — 2023.11' },
    description: {
      zh: '基于 Gamesense 和 Primordial 软件平台的 LUA 脚本项目。',
      en: 'LUA project based on Gamesense and Primordial software platforms.',
    },
    tags: ['Lua', 'FFI', 'CS:GO'], 
    src: { zh: `${BASE}preview/Gamesense_Lua.png`, en: `${BASE}preview/Gamesense_Lua.png` }, 
    status: 'archived',
  },
  {
    title: 'Auth Bot',
    subtitle: { zh: '自动授权机器人 | 2020.11 — 2023.02', en: 'Auth Bot | 2020.11 — 2023.02' },
    description: {
      zh: '通过 OneTap 软件平台开放的云脚本 API, 实现使用 Discord 机器人在云端给用户授权脚本的操作，一切授权操作都由机器人自助完成。',
      en: 'Through the cloud scripting API open on the OneTap software platform, Discord robots can be used to authorize script operations for users in the cloud, and all authorization operations are completed by the robots themselves.',
    },
    tags: ['Node.js', 'Javascript', 'CS:GO'], 
    src: { zh: `${BASE}preview/authorization_Bot.png`, en: `${BASE}preview/authorization_Bot.png` }, 
    status: 'archived',
  },
  {
    title: 'MixoYaw.js',
    subtitle: { zh: '嵌入式 JS 脚本 | 2020.11 — 2023.02', en: 'JS Scripts | 2020.11 — 2023.02' },
    description: {
      zh: '基于 Onetap 软件平台的云端 Javascript 脚本项目，脚本访问权限由 Auth Bot 分发。',
      en: 'Cloud Javascript project based on Onetap software platform, script access permissions distributed by Auth Bot.',
    },
    tags: ['Javascript', 'CS:GO'], 
    src: { zh: `${BASE}preview/Onetap_js.png`, en: `${BASE}preview/Onetap_js.png` }, 
    status: 'archived',
  },
  {
    title: 'Forum && Blog',
    subtitle: { zh: '论坛与博客 | 2020.07 — 2021.02', en: 'Forum and Blog | 2020.07 — 2021.02' },
    description: {
      zh: '使用 Typecho 创建个人博客以及使用 Xenforo 开发游戏脚本交流论坛。',
      en: 'Create a personal blog using Typecho and develop a game script communication forum using Xenforo.',
    },
    tags: ['Typecho', 'Xenforo'], 
    src: { zh: `${BASE}preview/Wiki.png`, en: `${BASE}preview/Wiki.png` }, 
    status: 'archived',
  },
  {
    title: 'Account Hacking',
    subtitle: { zh: '渗透 | 2019.05 — 2020.08', en: 'Penetration | 2019.05 — 2020.08' },
    description: {
      zh: '基于 Python 的爬虫项目, 获取本地 Steam 账号与 SSFN 授权文件。',
      en: 'A Python based crawler project to obtain local Steam accounts and SSFN authorization files.',
    },
    tags: ['Python', 'Wireshark'],  
    status: 'archived',
  },
  {
    title: { zh: '未来项目', en: 'Future Project' },
    status: 'soon',
  },
]

export const socials = [
  { label: 'GitHub', href: 'https://github.com/Mixologist6105', id: 'github' },
]
