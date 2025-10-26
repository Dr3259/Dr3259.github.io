'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Bug, BookOpen, Package, Activity } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function DebugReleasePage() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: '调试发布概览', icon: '🧰' },
    { id: 'adb', label: 'ADB', icon: '🔌' },
    { id: 'profiler', label: 'Profiler', icon: '🔍' },
    { id: 'appbundle', label: 'App Bundle', icon: '📦' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link href="/study/learn-coding/mobile/junior/android-native" passHref>
            <Button variant="outline" size="sm" className="hover:bg-white/80 shadow-sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回 Android 原生开发
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-600 to-gray-700 rounded-2xl shadow-lg mb-4">
            <Bug className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            调试与发布
          </h1>
          <p className="text-gray-600">
            ADB / Profiler / App Bundle：从开发到上线的完整工具链
          </p>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                activeSection === section.id
                  ? 'bg-slate-700 text-white shadow-md'
                  : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-sm'
              }`}
            >
              <span className="mr-2">{section.icon}</span>
              {section.label}
            </button>
          ))}
        </div>

        {activeSection === 'overview' && (
          <div className="space-y-4">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🧩 核心关系概览</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-3 text-left font-semibold">层级</th>
                      <th className="p-3 text-left font-semibold">工具/概念</th>
                      <th className="p-3 text-left font-semibold">核心作用</th>
                      <th className="p-3 text-left font-semibold">所在阶段</th>
                      <th className="p-3 text-left font-semibold">关系</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-3 font-semibold text-blue-600">开发调试层</td>
                      <td className="p-3 font-semibold">ADB</td>
                      <td className="p-3">与设备通信、安装、调试、日志</td>
                      <td className="p-3">开发调试期</td>
                      <td className="p-3">所有调试工具的底层桥梁</td>
                    </tr>
                    <tr className="border-t bg-slate-50">
                      <td className="p-3 font-semibold text-green-600">性能分析层</td>
                      <td className="p-3 font-semibold">Profiler</td>
                      <td className="p-3">CPU / 内存 / 网络 / 电量分析</td>
                      <td className="p-3">性能调优期</td>
                      <td className="p-3">通过 ADB 与设备通信采样数据</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3 font-semibold text-purple-600">发布层</td>
                      <td className="p-3 font-semibold">App Bundle</td>
                      <td className="p-3">应用发布打包格式</td>
                      <td className="p-3">打包发布期</td>
                      <td className="p-3">基于 Gradle 构建产物上传 Play Store</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg border border-slate-200">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>简单来说：</strong>
                </p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>• 🔌 <strong>ADB</strong> 是连接桥梁</li>
                  <li>• 🧠 <strong>Profiler</strong> 是分析仪器</li>
                  <li>• 📦 <strong>App Bundle</strong> 是最终交付包</li>
                </ul>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">⚙️ 工作流程与关系图</h3>
              <div className="bg-slate-900 text-slate-100 p-6 rounded-lg font-mono text-sm mb-4">
                <pre className="whitespace-pre">
{`┌──────────────────────────────────────┐
│         开发调试阶段                 │
│  Android Studio                      │
│   │                                  │
│   ├─> ADB：连接模拟器/真机           │
│   │    ├─ 推送 APK / 启动进程        │
│   │    └─ 采集 logcat、调试数据      │
│   └─> Profiler：分析 CPU/内存/网络   │
│         （底层依赖 ADB 通信）         │
└──────────────────────────────────────┘
                 ↓
┌──────────────────────────────────────┐
│         构建与发布阶段               │
│  Gradle → 构建 App Bundle (.aab)     │
│   │                                  │
│   └─> Play Console → 分发优化包      │
│         （Google Play 根据设备拆分）  │
└──────────────────────────────────────┘`}
                </pre>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🧠 它们在开发周期中的职责分工</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-3 text-left font-semibold">阶段</th>
                      <th className="p-3 text-left font-semibold">使用工具</th>
                      <th className="p-3 text-left font-semibold">核心任务</th>
                      <th className="p-3 text-left font-semibold">是否依赖 ADB</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">开发阶段</td>
                      <td className="p-3">ADB</td>
                      <td className="p-3">运行、调试、日志输出</td>
                      <td className="p-3 text-green-600">✅</td>
                    </tr>
                    <tr className="border-t bg-slate-50">
                      <td className="p-3 font-semibold">性能优化阶段</td>
                      <td className="p-3">Profiler</td>
                      <td className="p-3">分析 CPU、内存、网络、帧率</td>
                      <td className="p-3 text-green-600">✅</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">发布阶段</td>
                      <td className="p-3">App Bundle</td>
                      <td className="p-3">构建发布包、签名上传</td>
                      <td className="p-3 text-red-600">❌（通过 Gradle）</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🔄 它们之间的联系总结</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-3 text-left font-semibold">工具</th>
                      <th className="p-3 text-left font-semibold">上层依赖</th>
                      <th className="p-3 text-left font-semibold">下层依赖</th>
                      <th className="p-3 text-left font-semibold">输出产物</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">ADB</td>
                      <td className="p-3">Android Studio</td>
                      <td className="p-3">Android Debug Service</td>
                      <td className="p-3">设备连接、日志、进程控制</td>
                    </tr>
                    <tr className="border-t bg-slate-50">
                      <td className="p-3 font-semibold">Profiler</td>
                      <td className="p-3">Android Studio</td>
                      <td className="p-3">ADB</td>
                      <td className="p-3">性能数据分析</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">App Bundle</td>
                      <td className="p-3">Gradle、Android Studio</td>
                      <td className="p-3">Android 构建系统</td>
                      <td className="p-3">.aab 包（发布用）</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700">
                  <strong>🧩 数据流：</strong>开发 → 调试(ADB) → 分析(Profiler) → 构建(App Bundle) → 发布
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📊 2025 年生态现状总览</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-3 text-left font-semibold">项目</th>
                      <th className="p-3 text-left font-semibold">状态</th>
                      <th className="p-3 text-left font-semibold">趋势</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">ADB</td>
                      <td className="p-3 text-green-600">✅ 核心工具</td>
                      <td className="p-3">支持 Wi-Fi 调试、多设备连接</td>
                    </tr>
                    <tr className="border-t bg-slate-50">
                      <td className="p-3 font-semibold">Profiler</td>
                      <td className="p-3 text-green-600">✅ 集成度更高</td>
                      <td className="p-3">与 Firebase、Compose Inspector 深度整合</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">App Bundle (.aab)</td>
                      <td className="p-3 text-green-600">✅ 主流格式</td>
                      <td className="p-3">APK 仅用于本地调试，发布全改 AAB</td>
                    </tr>
                    <tr className="border-t bg-slate-50">
                      <td className="p-3 font-semibold">Gradle Build System</td>
                      <td className="p-3 text-blue-600">🔄 稳定升级</td>
                      <td className="p-3">AGP（Android Gradle Plugin）已到 8.x</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">Compose Preview + Inspector</td>
                      <td className="p-3 text-blue-600">🌱 新增</td>
                      <td className="p-3">替代部分 Profiler 的实时分析</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">✅ 总结一句话</h3>
              <div className="p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg border border-slate-200">
                <p className="text-lg font-semibold text-slate-800 text-center mb-2">
                  ADB 是"桥"，Profiler 是"眼"，App Bundle 是"成果"
                </p>
                <div className="text-sm text-gray-700 space-y-1 mt-3">
                  <p>• 🧱 <strong>ADB：</strong>开发期所有交互的基础（连接、部署、日志）</p>
                  <p>• 🔍 <strong>Profiler：</strong>优化性能与内存的关键（依赖 ADB）</p>
                  <p>• 📦 <strong>App Bundle：</strong>构建与发布的标准产物（面向 Play Store）</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeSection === 'adb' && (
          <div className="space-y-4">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🔌 ADB (Android Debug Bridge)</h3>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                <h4 className="font-semibold text-blue-800 mb-2">定位</h4>
                <p className="text-sm text-gray-700">Android 与开发机的通信桥梁，所有调试工具的底层基础</p>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>核心作用：</strong>设备连接、应用安装、日志查看、文件传输、Shell 命令
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">常用 ADB 命令</h3>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <h4 className="font-semibold text-slate-800 text-sm mb-2">设备管理</h4>
                  <pre className="bg-slate-900 text-slate-100 p-2 rounded text-xs overflow-x-auto">
{`adb devices              # 查看连接的设备
adb connect <IP>:5555    # 无线连接设备
adb disconnect           # 断开连接
adb kill-server          # 停止 ADB 服务
adb start-server         # 启动 ADB 服务`}
                  </pre>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg">
                  <h4 className="font-semibold text-slate-800 text-sm mb-2">应用管理</h4>
                  <pre className="bg-slate-900 text-slate-100 p-2 rounded text-xs overflow-x-auto">
{`adb install app.apk                    # 安装应用
adb install -r app.apk                 # 覆盖安装
adb uninstall com.example.app          # 卸载应用
adb shell pm list packages             # 列出所有包名
adb shell pm clear com.example.app     # 清除应用数据`}
                  </pre>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg">
                  <h4 className="font-semibold text-slate-800 text-sm mb-2">日志查看</h4>
                  <pre className="bg-slate-900 text-slate-100 p-2 rounded text-xs overflow-x-auto">
{`adb logcat                             # 查看所有日志
adb logcat -c                          # 清除日志
adb logcat | grep "MyApp"              # 过滤日志
adb logcat *:E                         # 只显示错误级别
adb logcat -v time                     # 显示时间戳`}
                  </pre>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg">
                  <h4 className="font-semibold text-slate-800 text-sm mb-2">文件操作</h4>
                  <pre className="bg-slate-900 text-slate-100 p-2 rounded text-xs overflow-x-auto">
{`adb push local.txt /sdcard/           # 推送文件到设备
adb pull /sdcard/file.txt ./           # 从设备拉取文件
adb shell ls /sdcard/                  # 列出目录
adb shell rm /sdcard/file.txt          # 删除文件`}
                  </pre>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg">
                  <h4 className="font-semibold text-slate-800 text-sm mb-2">Shell 命令</h4>
                  <pre className="bg-slate-900 text-slate-100 p-2 rounded text-xs overflow-x-auto">
{`adb shell                              # 进入设备 Shell
adb shell am start -n <package>/<activity>  # 启动 Activity
adb shell am force-stop <package>      # 强制停止应用
adb shell input text "Hello"           # 输入文本
adb shell screencap /sdcard/screen.png # 截屏
adb shell screenrecord /sdcard/demo.mp4 # 录屏`}
                  </pre>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">无线调试（ADB over Wi-Fi）</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`# 方法 1：通过 USB 启用（Android 10 及以下）
adb tcpip 5555
adb connect <设备IP>:5555

# 方法 2：Android 11+ 原生支持
# 设置 → 开发者选项 → 无线调试
# 扫描二维码或输入配对码

# 验证连接
adb devices`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">ADB 在开发中的作用</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 text-sm mb-1">调试支持</h4>
                  <p className="text-xs text-gray-600">断点调试、日志输出、异常追踪</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 text-sm mb-1">应用部署</h4>
                  <p className="text-xs text-gray-600">快速安装、卸载、更新应用</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 text-sm mb-1">性能分析</h4>
                  <p className="text-xs text-gray-600">Profiler 底层数据采集</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 text-sm mb-1">自动化测试</h4>
                  <p className="text-xs text-gray-600">UI 自动化、Monkey 测试</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeSection === 'profiler' && (
          <div className="space-y-4">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🔍 Profiler (Android Studio Profiler)</h3>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                <h4 className="font-semibold text-green-800 mb-2">定位</h4>
                <p className="text-sm text-gray-700">Android Studio 内置的性能分析工具集</p>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>核心功能：</strong>CPU、内存、网络、电量分析，帮助优化应用性能
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Profiler 四大模块</h3>
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">1. CPU Profiler</h4>
                  <p className="text-sm text-gray-700 mb-2"><strong>功能：</strong>分析方法调用耗时、线程活动</p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>• 查看方法调用栈</li>
                    <li>• 识别性能瓶颈</li>
                    <li>• 分析 CPU 使用率</li>
                    <li>• 支持 Trace 录制</li>
                  </ul>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">2. Memory Profiler</h4>
                  <p className="text-sm text-gray-700 mb-2"><strong>功能：</strong>内存泄漏分析、对象分配追踪</p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>• 实时内存使用情况</li>
                    <li>• Heap Dump 分析</li>
                    <li>• 检测内存泄漏</li>
                    <li>• 对象引用链追踪</li>
                  </ul>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">3. Network Profiler</h4>
                  <p className="text-sm text-gray-700 mb-2"><strong>功能：</strong>监控网络请求、分析流量</p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>• 查看所有网络请求</li>
                    <li>• 请求/响应详情</li>
                    <li>• 流量统计</li>
                    <li>• 请求耗时分析</li>
                  </ul>
                </div>

                <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-2">4. Energy Profiler</h4>
                  <p className="text-sm text-gray-700 mb-2"><strong>功能：</strong>电量消耗分析</p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>• CPU、网络、GPS 能耗</li>
                    <li>• Wake Lock 检测</li>
                    <li>• 后台任务监控</li>
                    <li>• 电量优化建议</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">使用 Profiler 的步骤</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">启动应用</h4>
                    <p className="text-sm text-gray-600">在 Android Studio 中运行应用（Debug 模式）</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">打开 Profiler</h4>
                    <p className="text-sm text-gray-600">View → Tool Windows → Profiler</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">选择分析模块</h4>
                    <p className="text-sm text-gray-600">点击 CPU、Memory、Network 或 Energy</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">录制和分析</h4>
                    <p className="text-sm text-gray-600">开始录制 → 操作应用 → 停止录制 → 查看分析结果</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">常见性能问题</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 text-sm mb-2">内存泄漏</h4>
                  <p className="text-xs text-gray-600">使用 Memory Profiler 检测未释放的对象</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 text-sm mb-2">UI 卡顿</h4>
                  <p className="text-xs text-gray-600">使用 CPU Profiler 找出耗时方法</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 text-sm mb-2">网络慢</h4>
                  <p className="text-xs text-gray-600">使用 Network Profiler 分析请求耗时</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 text-sm mb-2">耗电快</h4>
                  <p className="text-xs text-gray-600">使用 Energy Profiler 检测高能耗操作</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeSection === 'appbundle' && (
          <div className="space-y-4">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📦 App Bundle (.aab)</h3>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-4">
                <h4 className="font-semibold text-purple-800 mb-2">定位</h4>
                <p className="text-sm text-gray-700">Google Play 官方推荐的发布格式，取代传统 APK</p>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>核心优势：</strong>按需交付、更小体积、支持动态特性模块
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">App Bundle vs APK</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-3 text-left font-semibold">对比项</th>
                      <th className="p-3 text-left font-semibold">APK</th>
                      <th className="p-3 text-left font-semibold">App Bundle</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">文件格式</td>
                      <td className="p-3">.apk</td>
                      <td className="p-3 text-green-600">.aab</td>
                    </tr>
                    <tr className="border-t bg-slate-50">
                      <td className="p-3 font-semibold">安装方式</td>
                      <td className="p-3">直接安装</td>
                      <td className="p-3 text-green-600">Play Store 动态生成 APK</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">体积</td>
                      <td className="p-3">包含所有资源</td>
                      <td className="p-3 text-green-600">平均减少 15%</td>
                    </tr>
                    <tr className="border-t bg-slate-50">
                      <td className="p-3 font-semibold">动态特性</td>
                      <td className="p-3">不支持</td>
                      <td className="p-3 text-green-600">支持按需下载模块</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">Play Store</td>
                      <td className="p-3 text-red-600">已不接受</td>
                      <td className="p-3 text-green-600">唯一接受格式</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">构建 App Bundle</h3>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <h4 className="font-semibold text-slate-800 text-sm mb-2">命令行构建</h4>
                  <pre className="bg-slate-900 text-slate-100 p-2 rounded text-xs overflow-x-auto">
{`# 构建 Release 版本
./gradlew bundleRelease

# 输出路径
app/build/outputs/bundle/release/app-release.aab`}
                  </pre>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg">
                  <h4 className="font-semibold text-slate-800 text-sm mb-2">Android Studio 构建</h4>
                  <p className="text-xs text-gray-600 mb-2">Build → Generate Signed Bundle / APK → Android App Bundle</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg">
                  <h4 className="font-semibold text-slate-800 text-sm mb-2">签名配置</h4>
                  <pre className="bg-slate-900 text-slate-100 p-2 rounded text-xs overflow-x-auto">
{`android {
    signingConfigs {
        release {
            storeFile file("keystore.jks")
            storePassword "password"
            keyAlias "key"
            keyPassword "password"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt')
        }
    }
}`}
                  </pre>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">App Bundle 核心特性</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 text-sm mb-2">1. Dynamic Delivery（按需交付）</h4>
                  <p className="text-xs text-gray-600">Google Play 根据设备配置生成优化的 APK</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 text-sm mb-2">2. Split APKs（拆分 APK）</h4>
                  <p className="text-xs text-gray-600">按屏幕密度、CPU 架构、语言拆分资源</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 text-sm mb-2">3. Dynamic Feature Modules（动态特性模块）</h4>
                  <p className="text-xs text-gray-600">按需下载功能模块，减少初始安装体积</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">发布流程</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">构建 App Bundle</h4>
                    <p className="text-sm text-gray-600">使用 Gradle 构建签名的 .aab 文件</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">上传到 Play Console</h4>
                    <p className="text-sm text-gray-600">登录 Google Play Console 上传 .aab 文件</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">测试和发布</h4>
                    <p className="text-sm text-gray-600">内部测试 → 封闭测试 → 开放测试 → 正式发布</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">Play Store 分发</h4>
                    <p className="text-sm text-gray-600">Google Play 自动为不同设备生成优化的 APK</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        <Card className="p-6 bg-white/80 backdrop-blur-sm mt-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-slate-600" />
            <h2 className="text-xl font-bold text-gray-800">推荐资源</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="https://developer.android.com/studio/command-line/adb"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-white border border-gray-200 hover:border-slate-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800">🔌 ADB 官方文档</div>
              <div className="text-sm text-gray-600">完整的 ADB 命令参考</div>
            </a>
            <a
              href="https://developer.android.com/studio/profile"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-white border border-gray-200 hover:border-slate-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800">🔍 Profiler 文档</div>
              <div className="text-sm text-gray-600">性能分析完整指南</div>
            </a>
            <a
              href="https://developer.android.com/guide/app-bundle"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-white border border-gray-200 hover:border-slate-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800">📦 App Bundle 文档</div>
              <div className="text-sm text-gray-600">应用打包发布指南</div>
            </a>
            <a
              href="https://play.google.com/console"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-white border border-gray-200 hover:border-slate-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800">🎮 Play Console</div>
              <div className="text-sm text-gray-600">应用发布管理平台</div>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
