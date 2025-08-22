
<div align="center">
  <h1 style="font-size: 2.5rem;">周览 (Week Glance)</h1>
  <p>一款集周计划、日视图、自动记录和休闲功能于一体的生产力工具。</p>
  <p>A productivity tool to plan your week, glance at your days, and relax during your breaks.</p>
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

### 核心功能

*   **周视图**: 主面板提供了您整周的鸟瞰图。您可以快速查看哪些日子记录了内容，并为每个过去的日子评级（好极了、一般般、糟透了）。

*   **详细的日计划**: 点击任何一天即可进入详细的按小时划分的日程表。在每个时间段，您可以添加、编辑和管理：
    *   **待办事项**: 支持分类（如：工作、学习、购物）、截止日期和重要性级别。
    *   **会议记录**: 记录会议详情，包括标题、与会者、笔记和行动项。
    *   **分享链接**: 保存和分类 URL，并附带自定义标题和标签。
    *   **个人心得**: 一个记录您全天个人反思和想法的空间。

*   **智能剪贴板检测**:
    *   当应用窗口获得焦点时（在首页和日子详情页均有效），它会自动检测您的剪贴板中是否有新的 URL。
    *   此时会弹出一个模态框，让您无需手动输入即可立即保存链接、添加标题并分配自定义标签。
    *   该功能能智能地防止重复录入，对于已经保存或忽略过的链接，不会再次打扰您。

*   **本周总结页面**:
    *   通过可视化的数据，获取您一周的统计概览。
    *   包括待办事项完成率、任务分类分布和每日评分趋势的图表。

*   **休闲驿站**:
    *   一个专为放松和实用功能而设的版块，主要功能有：
        *   **小游戏**: 畅玩 2048、数字华容道等经典益智游戏。
        *   **去哪吃**: 帮助您发现附近的餐馆（需要位置权限）。
        *   **个人图书馆**: 导入并阅读您本地的 `.txt` 和 `.pdf` 文件。
        *   **私人音乐播放器**: 导入并聆听您本地的音频文件，拥有功能丰富的播放界面。
        *   **其他工具**: 为法律普及、人格测试等预留了模块，以备未来扩展。

*   **健康与科技中心**:
    *   **健康中心**: 一个用于管理和探索身心健康各方面功能的专属空间。
    *   **科技一下**: 一个科技资讯中心，目前提供一个动态的编程语言排行榜页面。

*   **优秀的用户体验**:
    *   **可拖拽的卡片式界面**: 在“休闲驿站”、“健康”和“科技”等中心，您可以自由拖拽和置顶您最喜欢的功能，实现个性化布局。
    *   **PWA 支持**: 可作为渐进式网页应用（PWA）安装，提供原生应用般的体验，并支持网页分享目标（Web Share Target），可从其他应用直接分享链接到本应用保存。
    *   **快速添加**: 在主页或日视图页，只需按下 `回车键` 即可快速打开任务创建窗口。

### 技术栈

本项目采用现代技术栈构建：

*   **框架**: [Next.js](https://nextjs.org/) (使用 App Router)
*   **UI 库**: [React](https://react.dev/)
*   **语言**: [TypeScript](https://www.typescriptlang.org/)
*   **样式**: [Tailwind CSS](https://tailwindcss.com/)
*   **UI 组件**: [ShadCN UI](https://ui.shadcn.com/)

</details>
