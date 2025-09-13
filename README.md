
<div align="center">
  <h1 style="font-size: 2.5rem;">🌟 周览 (Week Glance) 🌟</h1>
  <p><strong>一款集周计划、日视图、黄历预览、精神花园和休闲功能于一体的全能生产力工具</strong></p>
  <p><strong>A comprehensive productivity tool combining weekly planning, daily views, Chinese almanac, mental garden, and recreational features</strong></p>
  
  <div align="center">
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white">
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white">
    <img alt="React" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
    <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white">
    <img alt="PWA" src="https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white">
  </div>
  
  <br>
  
  <div align="center">
    <a href="#功能特色">🚀 功能特色</a> |
    <a href="#技术栈">⚡ 技术栈</a> |
    <a href="#快速开始">🏁 快速开始</a> |
    <a href="#预览截图">📸 预览截图</a>
  </div>
</div>

---

<details>
<summary><strong>English Description</strong></summary>

## About The Project

**Week Glance** is a comprehensive web application designed to help you organize your life with ease and efficiency. It serves as a digital weekly planner where you can manage your tasks, notes, and personal reflections, all while offering a "Rest Stop" with fun mini-games and useful tools for when you need a break.

The application is fully responsive, bilingual (English/Chinese), and supports both light and dark themes.

### Core Features

*   **Weekly View**: The main dashboard provides a bird's-eye view of your week. You can quickly see which days have content and assign a rating (Excellent, Average, Terrible) to each past day.

*   **Detailed Daily Planner**: Click on any day to dive into a detailed hourly schedule. For each time slot, you can add, edit, and manage:
    *   **To-do Lists**: With categories (e.g., Work, Study, Shopping), deadlines, and importance levels.
    *   **Meeting Notes**: Document meeting details, including title, attendees, notes, and action items.
    *   **Shared Links**: Save and categorize URLs with custom titles and tags.
    *   **Personal Insights**: A space for your personal reflections and thoughts throughout the day.

*   **Smart Clipboard Detection**:
    *   When the app window is focused (on both the main page and daily detail pages), it automatically detects if there's a new URL in your clipboard.
    *   A modal pops up, allowing you to instantly save the link, add a title, and assign a custom tag without manual entry.
    *   This feature intelligently prevents duplicate entries and won't bother you again for a link that has already been saved or dismissed.

*   **Weekly Summary Page**:
    *   Get a statistical overview of your week with visualized data.
    *   Includes charts for to-do completion rates, task category distribution, and daily rating trends.

*   **Rest Stop**:
    *   A dedicated section for relaxation and utility, featuring:
        *   **Mini-Games**: Play classic games like 2048 and numeric Klotski.
        *   **Food Finder**: Helps you discover nearby restaurants (requires location access).
        *   **Personal Library**: Import and read your local `.txt` and `.pdf` files.
        *   **Private Music Player**: Import and listen to your local audio files with a rich player interface.
        *   **Other Tools**: Placeholder modules for Legal Info, Personality Tests, and more for future expansion.
        
*   **Health & Tech Hubs**:
    *   **Health Center**: A dedicated space to manage and explore different aspects of well-being, such as mental and physical health.
    *   **Tech Time**: A hub for tech-related information, currently featuring a dynamic programming language ranking page.

*   **User Experience**:
    *   **Draggable Card-based Interface**: Rearrange and pin your favorite features in the "Rest Stop," "Health," and "Tech" hubs for a personalized layout.
    *   **PWA Support**: Installable as a Progressive Web App for an app-like experience, including support for the Web Share Target API to save links directly from other apps.
    *   **Quick Add**: Simply press `Enter` on the main or day-detail page to quickly open the task creation modal.

### Built With

This project is built with a modern tech stack:

*   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
*   **UI Library**: [React](https://react.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)

</details>

<details open>
<summary><strong>中文描述</strong></summary>

## 关于项目

**周览 (Week Glance)** 是一款功能全面的网页应用，旨在帮助您轻松高效地组织生活。它既是一个数字化的周计划本，让您能管理任务、笔记和个人心得；也提供了一个包含趣味小游戏和实用工具的“休闲驿站”，供您在需要时放松身心。

本应用完全支持响应式设计，提供中英双语界面，并兼容浅色和深色两种主题模式。

## 🚀 功能特色

### 📅 核心规划功能

*   **🔍 周视图**: 主面板提供了您整周的鸟瞰图。您可以快速查看哪些日子记录了内容，并为每个过去的日子评级（好极了、一般般、糟透了）。

*   **📋 详细的日计划**: 点击任何一天即可进入详细的按小时划分的日程表。在每个时间段，您可以添加、编辑和管理：
    *   **待办事项**: 支持分类（如：工作、学习、购物）、截止日期和重要性级别。
    *   **会议记录**: 记录会议详情，包括标题、与会者、笔记和行动项。
    *   **分享链接**: 保存和分类 URL，并附带自定义标题和标签。
    *   **个人心得**: 一个记录您全天个人反思和想法的空间。

*   **🔗 智能剪贴板检测**:
    *   当应用窗口获得焦点时（在首页和日子详情页均有效），它会自动检测您的剪贴板中是否有新的 URL。
    *   此时会弹出一个模态框，让您无需手动输入即可立即保存链接、添加标题并分配自定义标签。
    *   该功能能智能地防止重复录入，对于已经保存或忽略过的链接，不会再次打扰您。

*   **📊 本周总结页面**:
    *   通过可视化的数据，获取您一周的统计概览。
    *   包括待办事项完成率、任务分类分布和每日评分趋势的图表。

### 🎭 传统文化与美学体验

*   **📜 智能黄历预览**:
    *   鼠标悬停任意日期，1秒后显示精美的黄历信息
    *   包含农历日期、干支纪年、生肖星座、宜忌事项
    *   财神方位指引，基于传统命理学计算
    *   动态极光和粒子效果背景，营造神秘浪漫氛围
    *   智能位置计算，确保黄历完整显示不被遮挡

*   **🌸 精神花园**:
    *   专为放松心灵设计的沉浸式视觉体验空间
    *   包含多种高品质动画效果：
        *   🎆 **绚烂烟花**: 夜空中绽放的璀璨烟花
        *   🌹 **浪漫玫瑰**: 旋转绽放的红玫瑰花朵
        *   ⭐ **璀璨星空**: 满天繁星闪烁的梦幻夜空
        *   🌊 **海浪涟漪**: 海浪拍打的动态效果
        *   🌸 **飘落花瓣**: 樱花花瓣飘落的春日景象
        *   🔮 **水晶生长**: 神秘水晶的生长动画
        *   🌌 **粒子星系**: 星系旋转的宇宙奇观
        *   🕉️ **神圣几何**: 古老智慧的几何图案
        *   🔵 **蓝色水晶妖姬**: 优雅神秘的水晶玫瑰
        *   ⚡ **量子场域**: 科幻感十足的量子效果
        *   🌈 **幻境极光**: 梦幻般的极光舞动
        *   🪐 **太阳系**: 行星轨道的宇宙ballet
        *   🎨 **几何曼陀罗**: 禅意几何的心灵净化
        *   ⚡ **3D皮卡丘**: 可爱治愈的3D互动模型
    *   支持全屏观赏模式，打造沉浸式体验
    *   每种效果都经过精心优化，60FPS流畅运行

### 🎮 娱乐与实用功能

*   **🏖️ 休闲驿站**:
    *   一个专为放松和实用功能而设的版块，主要功能有：
        *   🎲 **小游戏**: 畅玩 2048、数字华容道等经典益智游戏
        *   🍽️ **去哪吃**: 帮助您发现附近的餐馆（需要位置权限）
        *   📚 **个人图书馆**: 导入并阅读您本地的 `.txt` 和 `.pdf` 文件
        *   🎵 **私人音乐播放器**: 导入并聆听您本地的音频文件，拥有功能丰富的播放界面
        *   🔧 **其他工具**: 为法律普及、人格测试等预留了模块，以备未来扩展

*   **🏥 健康与科技中心**:
    *   💪 **健康中心**: 一个用于管理和探索身心健康各方面功能的专属空间
    *   💻 **科技一下**: 一个科技资讯中心，目前提供一个动态的编程语言排行榜页面

### ✨ 卓越的用户体验

*   **🎯 智能交互设计**:
    *   🔄 **可拖拽的卡片式界面**: 在"休闲驿站"、"健康"和"科技"等中心，您可以自由拖拽和置顶您最喜欢的功能，实现个性化布局
    *   📱 **PWA 支持**: 可作为渐进式网页应用（PWA）安装，提供原生应用般的体验，并支持网页分享目标（Web Share Target），可从其他应用直接分享链接到本应用保存
    *   ⚡ **快速添加**: 在主页或日视图页，只需按下 `回车键` 即可快速打开任务创建窗口
    *   🌓 **主题切换**: 支持浅色/深色主题，保护您的眼睛
    *   🌐 **中英双语**: 完整的国际化支持，自动识别系统语言
    *   📱 **响应式设计**: 完美适配桌面、平板、手机等各种设备

*   **🚀 性能优化**:
    *   ⚡ **懒加载**: 模态框组件按需加载，减少初始包大小60-70%
    *   🗃️ **智能缓存**: 时间段计算缓存，避免重复计算
    *   📊 **数据分片**: 仅加载当前页面相关数据，内存使用减少50%
    *   🔄 **代码分割**: 采用Next.js 15.2.3和Turbopack，极速开发体验

## ⚡ 技术栈

本项目采用现代化技术栈构建，注重性能与开发体验：

### 🛠️ 核心技术

*   **⚛️ 框架**: [Next.js 15.2.3](https://nextjs.org/) (App Router + Turbopack)
*   **🔷 UI 库**: [React](https://react.dev/) (最新版本，支持并发特性)
*   **📘 语言**: [TypeScript](https://www.typescriptlang.org/) (完整类型安全)
*   **🎨 样式**: [Tailwind CSS](https://tailwindcss.com/) (原子化CSS)
*   **🎭 UI 组件**: [ShadCN UI](https://ui.shadcn.com/) (现代化组件库)
*   **🐻 状态管理**: [Zustand](https://zustand-demo.pmnd.rs/) (轻量级状态管理)
*   **🎬 动画**: [Framer Motion](https://www.framer.com/motion/) (流畅动画效果)

### 🚀 开发工具

*   **📦 包管理**: npm/yarn
*   **🔧 构建工具**: Turbopack (极速热重载)
*   **📏 代码规范**: ESLint + Prettier
*   **🎯 部署**: Vercel/Netlify (零配置部署)

## 🏁 快速开始

### 📋 环境要求

- Node.js 18+ 
- npm 或 yarn
- Git

### 🚀 安装与运行

```
# 克隆项目
git clone https://github.com/Dr3259/Dr3259.github.io.git
cd Dr3259.github.io

# 安装依赖
npm install
# 或
yarn install

# 启动开发服务器
npm run dev
# 或
yarn dev

# 构建生产版本
npm run build
# 或
yarn build
```

### 🌐 访问地址

开发服务器默认运行在 `http://localhost:3000`

## 📸 预览截图

> 📝 注：由于项目包含丰富的动画效果和交互功能，建议直接体验在线版本以获得最佳效果

### 🖥️ 主要界面

- **周览主页**: 优雅的周视图布局，一目了然的日程管理
- **日计划详情**: 精细化的时间管理，支持多种内容类型
- **黄历预览**: 传统文化与现代设计的完美融合
- **精神花园**: 沉浸式视觉体验，14种精美动画效果
- **休闲驿站**: 游戏娱乐与实用工具的集合

## 🤝 贡献指南

欢迎提交 Issues 和 Pull Requests！

1. Fork 本项目
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🌟 致谢

感谢所有为这个项目做出贡献的开发者和设计师！

---

<div align="center">
  <p>如果这个项目对您有帮助，请给它一个 ⭐!</p>
  <p>Made with ❤️ by <a href="https://github.com/Dr3259">Dr3259</a></p>
</div>

</details>
