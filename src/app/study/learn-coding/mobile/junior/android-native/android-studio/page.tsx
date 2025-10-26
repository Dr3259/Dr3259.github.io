'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Code2, Zap, Terminal, BookOpen, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function AndroidStudioPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link href="/study/learn-coding/mobile/junior/android-native" passHref>
            <Button variant="outline" size="sm" className="hover:bg-white/80 shadow-sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回 Android 原生开发
            </Button>
          </Link>
        </div>

        {/* 页面标题 */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <Code2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            Android Studio 官方 IDE
          </h1>
          <p className="text-gray-600">
            基于 IntelliJ IDEA 的 Android 开发综合环境
          </p>
        </div>

        {/* 概述 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6 border-l-4 border-blue-500">
          <h3 className="text-xl font-bold text-gray-800 mb-3">什么是 Android Studio？</h3>
          <p className="text-gray-700 mb-3">
            Android Studio 是 Google 官方推出的 Android 应用开发集成开发环境（IDE），
            基于 JetBrains 的 IntelliJ IDEA 平台构建，专为 Android 开发优化。
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="font-semibold text-blue-800 mb-2">核心优势</div>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 智能代码编辑器，支持 Kotlin 和 Java</li>
              <li>• 可视化布局编辑器和 Jetpack Compose 预览</li>
              <li>• 强大的调试和性能分析工具</li>
              <li>• 与 Gradle 深度集成的构建系统</li>
              <li>• 内置模拟器和设备管理</li>
            </ul>
          </div>
        </Card>

        {/* 核心功能 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            核心功能
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border border-blue-200">
              <div className="font-semibold text-blue-800 mb-2">🎨 可视化设计工具</div>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Layout Editor - 拖拽式 UI 设计</li>
                <li>• Compose Preview - 实时预览 Composable</li>
                <li>• Resource Manager - 资源管理</li>
                <li>• Theme Editor - 主题编辑器</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border border-blue-200">
              <div className="font-semibold text-blue-800 mb-2">🔍 调试工具</div>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Debugger - 断点调试</li>
                <li>• Logcat - 日志查看</li>
                <li>• Layout Inspector - 布局检查</li>
                <li>• Database Inspector - 数据库查看</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border border-blue-200">
              <div className="font-semibold text-blue-800 mb-2">📊 性能分析</div>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• CPU Profiler - CPU 性能分析</li>
                <li>• Memory Profiler - 内存分析</li>
                <li>• Network Profiler - 网络监控</li>
                <li>• Energy Profiler - 电量分析</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border border-blue-200">
              <div className="font-semibold text-blue-800 mb-2">🚀 构建与部署</div>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Gradle 集成构建</li>
                <li>• APK Analyzer - APK 分析</li>
                <li>• App Bundle 支持</li>
                <li>• 一键部署到设备</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* 快捷键 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-blue-600" />
            常用快捷键
          </h3>
          <div className="grid md:grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-gray-700">搜索文件</span>
              <kbd className="px-3 py-1 bg-slate-200 rounded text-xs font-mono">Ctrl+Shift+N</kbd>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-gray-700">搜索类</span>
              <kbd className="px-3 py-1 bg-slate-200 rounded text-xs font-mono">Ctrl+N</kbd>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-gray-700">全局搜索</span>
              <kbd className="px-3 py-1 bg-slate-200 rounded text-xs font-mono">Ctrl+Shift+F</kbd>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-gray-700">快速修复</span>
              <kbd className="px-3 py-1 bg-slate-200 rounded text-xs font-mono">Alt+Enter</kbd>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-gray-700">重构重命名</span>
              <kbd className="px-3 py-1 bg-slate-200 rounded text-xs font-mono">Shift+F6</kbd>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-gray-700">格式化代码</span>
              <kbd className="px-3 py-1 bg-slate-200 rounded text-xs font-mono">Ctrl+Alt+L</kbd>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-gray-700">运行应用</span>
              <kbd className="px-3 py-1 bg-slate-200 rounded text-xs font-mono">Shift+F10</kbd>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-gray-700">调试应用</span>
              <kbd className="px-3 py-1 bg-slate-200 rounded text-xs font-mono">Shift+F9</kbd>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-gray-700">查找用法</span>
              <kbd className="px-3 py-1 bg-slate-200 rounded text-xs font-mono">Alt+F7</kbd>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-gray-700">跳转到定义</span>
              <kbd className="px-3 py-1 bg-slate-200 rounded text-xs font-mono">Ctrl+B</kbd>
            </div>
          </div>
        </Card>

        {/* 最佳实践 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">⚡ 使用技巧</h3>
          <div className="space-y-3">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="font-semibold text-blue-800 mb-2">提升性能</div>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 增加 IDE 内存：Help → Edit Custom VM Options</li>
                <li>• 启用 Power Save Mode 减少后台任务</li>
                <li>• 排除不必要的文件夹（node_modules、build）</li>
                <li>• 使用 Build Analyzer 诊断慢构建</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="font-semibold text-blue-800 mb-2">高效开发</div>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 使用 Live Templates 快速生成代码</li>
                <li>• 启用 Auto Import 自动导入</li>
                <li>• 使用 Compose Preview 减少构建次数</li>
                <li>• 配置 Code Style 统一代码风格</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="font-semibold text-blue-800 mb-2">调试技巧</div>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 使用条件断点提高调试效率</li>
                <li>• Evaluate Expression 实时计算表达式</li>
                <li>• Logcat 过滤器快速定位日志</li>
                <li>• 使用 Profiler 定位性能问题</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* 官方资源 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">官方资源</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="https://developer.android.com/studio"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-lg bg-gradient-to-br from-blue-50 to-white border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-gray-800 flex items-center gap-2">
                  🎨 Android Studio 官网
                </div>
                <ExternalLink className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-sm text-gray-600">下载、文档、发行说明</div>
            </a>

            <a
              href="https://developer.android.com/studio/intro"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-gray-800 flex items-center gap-2">
                  📚 使用指南
                </div>
                <ExternalLink className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-sm text-gray-600">官方使用文档</div>
            </a>

            <a
              href="https://developer.android.com/studio/profile"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-gray-800 flex items-center gap-2">
                  📊 Profiler 工具
                </div>
                <ExternalLink className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-sm text-gray-600">性能分析工具文档</div>
            </a>

            <a
              href="https://developer.android.com/studio/debug"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-gray-800 flex items-center gap-2">
                  🔍 调试指南
                </div>
                <ExternalLink className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-sm text-gray-600">调试应用程序</div>
            </a>

            <a
              href="https://developer.android.com/studio/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-gray-800 flex items-center gap-2">
                  📝 发行说明
                </div>
                <ExternalLink className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-sm text-gray-600">最新版本与更新</div>
            </a>

            <a
              href="https://developer.android.com/studio/write"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-gray-800 flex items-center gap-2">
                  ✍️ 代码编辑器
                </div>
                <ExternalLink className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-sm text-gray-600">编辑器功能详解</div>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
