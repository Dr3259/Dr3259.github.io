
# Week Glance - 项目结构深度解析

本文档旨在提供 `Week Glance` 项目的完整目录结构和文件功能说明，帮助开发者快速理解代码组织、功能模块划分以及项目的设计理念。

## 🌳 项目根目录结构

```
.
├── src/
│   ├── app/                # Next.js App Router 核心目录
│   ├── components/         # React 组件
│   ├── context/            # React 全局上下文
│   ├── hooks/              # 自定义 React Hooks
│   ├── lib/                # 核心库、工具函数和类型定义
│   └── ai/                 # Genkit AI 相关流程
├── public/                 # 静态资源
├── scripts/                # 项目脚本
├── __tests__/              # Jest 测试文件
├── .env                    # 环境变量
├── next.config.ts          # Next.js 配置文件
├── tailwind.config.ts      # Tailwind CSS 配置文件
├── package.json            # 项目依赖与脚本
└── README.md               # 项目主说明文档
```

---

## 📂 `src/` 核心代码目录

### `src/app/` - 路由与页面

这是应用的核心，遵循 Next.js App Router 的约定。每个子目录代表一个URL路径，其中的 `page.tsx` 是该路径对应的页面组件。

```
app/
├── (main)/
│   ├── page.tsx            # 📅 主页 - 周视图
│   ├── day/[dayName]/page.tsx # 📝 日计划详情页
│   └── weekly-summary/page.tsx # 📊 周总结报告页
│
├── (features)/
│   ├── rest/
│   │   ├── page.tsx        # 🏖️ 休闲驿站主页
│   │   └── games/page.tsx  # 🎲 小游戏列表页
│   │
│   ├── play/
│   │   ├── 2048/page.tsx   # 🕹️ 2048 游戏页
│   │   ├── klotski/page.tsx# 🕹️ 数字华容道游戏页
│   │   └── ... (其他游戏)
│   │
│   ├── personal-library/
│   │   ├── page.tsx        # 📚 个人图书馆书架页
│   │   └── [id]/page.tsx   # 📖 书籍/文档阅读器页
│   │
│   ├── personal-video-library/page.tsx # 🎬 个人视频库页
│   ├── private-music-player/page.tsx # 🎵 私人音乐播放器页
│   │
│   ├── tech/
│   │   ├── page.tsx        # 💻 科技中心主页
│   │   ├── ai-world/page.tsx # 🤖 AI 世界动态页
│   │   └── ... (其他科技页面)
│   │
│   ├── health/
│   │   ├── page.tsx        # ❤️ 健康中心主页
│   │   └── ... (其他健康页面)
│   │
│   └── ... (其他功能模块)
│
├── layout.tsx              # 🌐 全局根布局
├── globals.css             # 🎨 全局样式与 Tailwind CSS 定义
└── error.tsx               # 💥 全局错误处理页
```

- **`page.tsx`**: 主界面，以周视图的形式展示每一天。
- **`day/[dayName]/page.tsx`**: 动态路由，展示某一天的详细小时安排。
- **功能中心 (`rest`, `tech`, `health`)**: 聚合了应用内不同主题的工具和信息，如游戏、AI资讯、健康练习等。
- **`layout.tsx`**: 定义了所有页面的共享UI结构，如全局字体、`Toaster`通知系统、`AuthProvider`和`MusicProvider`等。

### `src/components/` - 可复用UI组件

此目录存放了应用中所有可复用的React组件，大部分是基于 ShadCN UI 构建的。

```
components/
├── ui/                   # 🏗️ ShadCN UI 基础组件 (Button, Card, Input...)
├── page/                 # 📄 页面级组件 (特定页面使用的复杂组件)
│   ├── day-view/         #    - 日视图相关组件
│   └── ...
├── AddToPlaylistPopover.tsx  # 🎵 添加到播放列表的弹出菜单
├── CreatePlaylistDialog.tsx  # ➕ 创建播放列表的对话框
├── DayBox.tsx            # 🗓️ 周视图中的日期卡片
├── DayHoverPreview.tsx   # 🏮 鼠标悬停时显示的黄历预览
├── MiniMusicPlayer.tsx   # 🎶 悬浮迷你音乐播放器
├── PdfReader.tsx         # 📄 PDF 阅读器核心
└── ... (其他模态框和UI组件)
```

- **`ui/`**: 存放由 ShadCN UI 生成的原子组件，是构建界面的基础。
- **`page/`**: 存放与特定页面紧密相关的、较复杂的组合组件，以保持页面文件的整洁。
- **通用组件**: 如 `DayBox`、`DayHoverPreview`、`MiniMusicPlayer` 等，它们在应用的多个地方被使用，具有高度的可复用性。

### `src/context/` - 全局状态上下文

此目录用于管理跨组件共享的全局状态。

- **`AuthContext.tsx`**: 封装了 Firebase Authentication，提供 `user` 和 `loading` 状态，便于在整个应用中判断用户登录情况。
- **`MusicContext.tsx`**: 音乐播放器的“大脑”，管理着播放列表、当前曲目、播放状态、音量等所有与音乐播放相关的逻辑。

### `src/hooks/` - 自定义 Hooks

封装可复用的逻辑，提升代码的可维护性。

- **`usePlannerStore.ts`**: 使用 Zustand 实现的核心数据存储。它管理着所有的用户计划数据（待办、笔记、链接等），并负责与后端（Firebase）或本地存储（LocalStorage）进行同步。
- **`use-toast.ts`**: 全局通知（Toast）系统的 Hook。
- **`use-local-storage.ts`**: 一个通用的、用于与 LocalStorage 交互的 Hook。

### `src/lib/` - 核心库与工具

存放项目的核心逻辑、工具函数、类型定义和第三方库的配置。

```
lib/
├── db.ts                 #  IndexedDB 数据库操作封装 (用于音乐、书籍等)
├── firebase.ts           # Firebase 应用初始化配置
├── firebase-provider.ts  # Firebase 数据提供者实现
├── data-provider.ts      # 抽象数据提供者接口 (优雅设计✨)
├── utils.ts              # 通用工具函数 (如 cn, getHuangliData)
├── page-types.ts         # 全局 TypeScript 类型定义
└── data/                 # 静态数据 (如电影数据)
```

- **`data-provider.ts`**: 这是一个非常优雅的架构设计。它定义了一个抽象的 `DataProvider` 接口，使得上层应用逻辑不直接依赖于 Firebase。未来可以轻松切换到其他后端服务，只需实现新的 `provider` 即可。

### `src/ai/` - Genkit AI 功能

所有与 Google AI (Genkit) 相关的功能都集中在这里。

- **`genkit.ts`**: 初始化和配置全局的 Genkit `ai` 实例。
- **`flows/`**: 存放所有的 AI 流程（Flows）。每个 `flow` 文件都代表一个具体的AI任务，如：
    - `info-hub-flow.ts`: 信息聚合，能根据URL或话题进行研究总结。
    - `github-trending-flow.ts`: 使用AI搜索获取GitHub趋势项目。
    - `movie-search-flow.ts`: 搜索电影信息。

---

## 🏁 总结

`Week Glance` 项目采用了一种现代、模块化且可扩展的前端架构。通过合理运用 Next.js App Router、Zustand、Context API 和抽象数据提供者等技术，项目在实现了丰富功能的同时，也保持了代码的清晰和可维护性，为未来的功能迭代和技术升级打下了坚实的基础。
