'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Cpu, Smartphone, Zap, Database, Cog, GitCompare, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function JvmArtPage() {
  const [activeRuntime, setActiveRuntime] = useState<'jvm' | 'art' | 'compare'>('compare');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
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
            <Cpu className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            JVM & ART 运行时详解
          </h1>
          <p className="text-gray-600">
            深入理解 Java 虚拟机与 Android 运行时的核心机制
          </p>
        </div>

        {/* 导航标签 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveRuntime('compare')}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
              activeRuntime === 'compare'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-sm'
            }`}
          >
            <GitCompare className="inline w-4 h-4 mr-2" />
            对比总览
          </button>
          <button
            onClick={() => setActiveRuntime('jvm')}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
              activeRuntime === 'jvm'
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-sm'
            }`}
          >
            ☕ JVM 详解
          </button>
          <button
            onClick={() => setActiveRuntime('art')}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
              activeRuntime === 'art'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-sm'
            }`}
          >
            🤖 ART 详解
          </button>
        </div>

        {/* 对比总览 */}
        {activeRuntime === 'compare' && (
          <div className="space-y-6">
            {/* 核心对比表 */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">核心差异对比</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-100 to-gray-100">
                      <th className="border border-slate-300 p-3 text-left font-bold">维度</th>
                      <th className="border border-slate-300 p-3 text-left font-bold bg-orange-50">☕ JVM</th>
                      <th className="border border-slate-300 p-3 text-left font-bold bg-green-50">🤖 ART</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-blue-50/30">
                      <td className="border border-slate-200 p-3 font-semibold">目标平台</td>
                      <td className="border border-slate-200 p-3">服务器 / 桌面 / 通用</td>
                      <td className="border border-slate-200 p-3">Android 移动设备</td>
                    </tr>
                    <tr className="hover:bg-blue-50/30">
                      <td className="border border-slate-200 p-3 font-semibold">字节码格式</td>
                      <td className="border border-slate-200 p-3"><code className="bg-orange-100 px-2 py-1 rounded">.class</code> (JVM bytecode)</td>
                      <td className="border border-slate-200 p-3"><code className="bg-green-100 px-2 py-1 rounded">.dex</code> (Dalvik Executable)</td>
                    </tr>
                    <tr className="hover:bg-blue-50/30">
                      <td className="border border-slate-200 p-3 font-semibold">编译策略</td>
                      <td className="border border-slate-200 p-3">主要 <strong>JIT</strong> (即时编译)</td>
                      <td className="border border-slate-200 p-3"><strong>AOT + JIT + PGO</strong> 混合</td>
                    </tr>
                    <tr className="hover:bg-blue-50/30">
                      <td className="border border-slate-200 p-3 font-semibold">优化目标</td>
                      <td className="border border-slate-200 p-3">吞吐量、长期运行性能</td>
                      <td className="border border-slate-200 p-3">启动时间、内存、电量、响应性</td>
                    </tr>
                    <tr className="hover:bg-blue-50/30">
                      <td className="border border-slate-200 p-3 font-semibold">进程模型</td>
                      <td className="border border-slate-200 p-3">独立 JVM 进程</td>
                      <td className="border border-slate-200 p-3">Zygote fork 快速启动</td>
                    </tr>
                    <tr className="hover:bg-blue-50/30">
                      <td className="border border-slate-200 p-3 font-semibold">GC 设计</td>
                      <td className="border border-slate-200 p-3">多种选择 (G1/ZGC/Shenandoah)</td>
                      <td className="border border-slate-200 p-3">优先低暂停与移动端优化</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            {/* 执行流程对比 */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-5 bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-2xl">☕</span>
                  JVM 执行流程
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">1</div>
                    <span className="text-gray-700">.java → javac → <code className="bg-orange-100 px-1 rounded">.class</code></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">2</div>
                    <span className="text-gray-700">类加载器加载字节码</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">3</div>
                    <span className="text-gray-700">解释器执行 + JIT 编译热点</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">4</div>
                    <span className="text-gray-700">GC 管理堆内存</span>
                  </div>
                </div>
              </Card>

              <Card className="p-5 bg-gradient-to-br from-green-50 to-white border-2 border-green-200">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🤖</span>
                  ART 执行流程
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">1</div>
                    <span className="text-gray-700">.kt/.java → kotlinc/javac → <code className="bg-green-100 px-1 rounded">.class</code></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">2</div>
                    <span className="text-gray-700">D8/R8 转换 → <code className="bg-green-100 px-1 rounded">.dex</code></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">3</div>
                    <span className="text-gray-700">安装时 AOT 编译 → .oat/.vdex</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">4</div>
                    <span className="text-gray-700">运行时 JIT + PGO 优化</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* 开发者关注点 */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-600" />
                开发者实际影响
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div className="font-semibold text-orange-800 mb-2">☕ JVM 场景</div>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 需要 JIT "预热" 才能达到最佳性能</li>
                      <li>• 选择合适的 GC (G1/ZGC) 和堆配置</li>
                      <li>• 适合长期运行的服务端应用</li>
                      <li>• 注意 JNI 本地内存泄漏</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="font-semibold text-green-800 mb-2">🤖 ART 场景</div>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 冷启动时间至关重要</li>
                      <li>• 使用 R8 优化方法数和体积</li>
                      <li>• PGO 配合 Play 提升真实用户体验</li>
                      <li>• 注意主线程阻塞导致 UI 卡顿</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* JVM 详解 */}
        {activeRuntime === 'jvm' && (
          <div className="space-y-4">
            {/* 概念 */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-l-4 border-orange-500">
              <h3 className="text-xl font-bold text-gray-800 mb-3">☕ 什么是 JVM？</h3>
              <p className="text-gray-700 mb-2">
                JVM (Java Virtual Machine) 是一种虚拟机规范，提供载入、验证、解释/编译并执行 Java 字节码的运行环境。
              </p>
              <div className="bg-orange-50 p-3 rounded-lg text-sm text-gray-700">
                <strong>核心理念：</strong>"一次编译，到处运行" —— 平台无关性
              </div>
            </Card>

            {/* 核心组成 */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Cog className="w-5 h-5 text-orange-600" />
                核心组成
              </h3>
              <div className="space-y-3">
                <div className="border-l-4 border-orange-400 pl-4 py-2">
                  <div className="font-semibold text-gray-800 mb-1">1. 类加载子系统 (Class Loader)</div>
                  <p className="text-sm text-gray-600">加载 .class 文件，链接（验证、准备、解析）并初始化</p>
                  <code className="text-xs bg-slate-100 px-2 py-1 rounded mt-1 inline-block">双亲委派模型：Bootstrap → Extension → Application</code>
                </div>

                <div className="border-l-4 border-orange-400 pl-4 py-2">
                  <div className="font-semibold text-gray-800 mb-1">2. 运行时数据区 (Runtime Data Areas)</div>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div className="bg-slate-50 p-2 rounded">
                      <strong>Method Area</strong>
                      <p className="text-xs text-gray-600">类元数据、常量池</p>
                    </div>
                    <div className="bg-slate-50 p-2 rounded">
                      <strong>Heap</strong>
                      <p className="text-xs text-gray-600">对象实例、GC 主战场</p>
                    </div>
                    <div className="bg-slate-50 p-2 rounded">
                      <strong>JVM Stacks</strong>
                      <p className="text-xs text-gray-600">线程栈帧、局部变量</p>
                    </div>
                    <div className="bg-slate-50 p-2 rounded">
                      <strong>PC Registers</strong>
                      <p className="text-xs text-gray-600">程序计数器</p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-orange-400 pl-4 py-2">
                  <div className="font-semibold text-gray-800 mb-1">3. 执行引擎 (Execution Engine)</div>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-start gap-2 text-sm">
                      <span className="bg-orange-500 text-white px-2 py-0.5 rounded text-xs font-semibold">解释器</span>
                      <span className="text-gray-600">逐条执行字节码（启动快）</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <span className="bg-orange-600 text-white px-2 py-0.5 rounded text-xs font-semibold">JIT</span>
                      <span className="text-gray-600">将热点代码编译为本地机器码（运行快）</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <span className="bg-orange-700 text-white px-2 py-0.5 rounded text-xs font-semibold">GC</span>
                      <span className="text-gray-600">垃圾回收器（Serial、Parallel、CMS、G1、ZGC）</span>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-orange-400 pl-4 py-2">
                  <div className="font-semibold text-gray-800 mb-1">4. 本地接口 (JNI)</div>
                  <p className="text-sm text-gray-600">调用 C/C++ 本地库，用于高性能计算</p>
                </div>
              </div>
            </Card>

            {/* GC 策略 */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">垃圾回收器选择</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="font-mono text-sm font-semibold text-orange-600 min-w-[80px]">G1 GC</div>
                  <div className="text-sm text-gray-700">适用于大堆和低延迟需求，平衡吞吐与暂停</div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="font-mono text-sm font-semibold text-orange-600 min-w-[80px]">ZGC</div>
                  <div className="text-sm text-gray-700">超低暂停（&lt;10ms），适合延迟敏感应用</div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="font-mono text-sm font-semibold text-orange-600 min-w-[80px]">Shenandoah</div>
                  <div className="text-sm text-gray-700">并发 GC，减少停顿时间</div>
                </div>
              </div>
            </Card>

            {/* 工具链 */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">诊断与监控工具</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <code className="text-sm font-semibold text-orange-700">jstat</code>
                  <p className="text-xs text-gray-600 mt-1">GC 统计</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <code className="text-sm font-semibold text-orange-700">jmap</code>
                  <p className="text-xs text-gray-600 mt-1">堆内存分析</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <code className="text-sm font-semibold text-orange-700">jstack</code>
                  <p className="text-xs text-gray-600 mt-1">线程堆栈</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <code className="text-sm font-semibold text-orange-700">VisualVM</code>
                  <p className="text-xs text-gray-600 mt-1">可视化监控</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <code className="text-sm font-semibold text-orange-700">JProfiler</code>
                  <p className="text-xs text-gray-600 mt-1">性能分析</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <code className="text-sm font-semibold text-orange-700">Flight Recorder</code>
                  <p className="text-xs text-gray-600 mt-1">生产环境追踪</p>
                </div>
              </div>
            </Card>

            {/* 最佳实践 */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">⚡ 最佳实践</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span className="text-gray-700">选择合适的 GC 和堆配置 (-Xmx/-Xms)，根据应用特性调优</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span className="text-gray-700">JIT 需要"预热"，短命任务可能无法享受优化</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span className="text-gray-700">注意 JNI 本地方法的内存泄漏，会绕过 GC 管理</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span className="text-gray-700">延迟敏感应用优先考虑 ZGC/Shenandoah</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ART 详解 */}
        {activeRuntime === 'art' && (
          <div className="space-y-4">
            {/* 概念 */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-l-4 border-green-500">
              <h3 className="text-xl font-bold text-gray-800 mb-3">🤖 什么是 ART？</h3>
              <p className="text-gray-700 mb-2">
                ART (Android Runtime) 是 Android 平台的运行时，为移动设备优化，采用 AOT + JIT + PGO 混合策略。
              </p>
              <div className="bg-green-50 p-3 rounded-lg text-sm text-gray-700">
                <strong>核心目标：</strong>更快的启动时间、更低的内存占用、更好的电量管理
              </div>
            </Card>

            {/* 文件格式与工具链 */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-green-600" />
                文件格式与编译流程
              </h3>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="font-semibold text-green-800 mb-3">从源码到执行</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">1</div>
                      <span className="text-gray-700">Kotlin/Java 源代码</span>
                    </div>
                    <div className="ml-3 border-l-2 border-green-300 pl-3 py-1">
                      <code className="text-xs bg-white px-2 py-1 rounded">kotlinc / javac</code>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">2</div>
                      <span className="text-gray-700">.class 文件（JVM 字节码）</span>
                    </div>
                    <div className="ml-3 border-l-2 border-green-300 pl-3 py-1">
                      <code className="text-xs bg-white px-2 py-1 rounded">D8 / R8</code>
                      <span className="text-xs text-gray-600 ml-2">（转换 + 优化 + 混淆）</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">3</div>
                      <span className="text-gray-700">.dex 文件（Dalvik Executable）</span>
                    </div>
                    <div className="ml-3 border-l-2 border-green-300 pl-3 py-1">
                      <span className="text-xs text-gray-600">打包为 APK/AAB</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">4</div>
                      <span className="text-gray-700">安装到设备 → ART 处理</span>
                    </div>
                    <div className="ml-3 border-l-2 border-green-300 pl-3 py-1">
                      <code className="text-xs bg-white px-2 py-1 rounded">.oat / .vdex</code>
                      <span className="text-xs text-gray-600 ml-2">（AOT 编译缓存）</span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="font-mono text-sm font-semibold text-green-600 mb-1">.dex</div>
                    <p className="text-xs text-gray-600">Android 可执行字节码，比 .class 更紧凑</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="font-mono text-sm font-semibold text-green-600 mb-1">.vdex</div>
                    <p className="text-xs text-gray-600">验证后格式，加速加载</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="font-mono text-sm font-semibold text-green-600 mb-1">.oat</div>
                    <p className="text-xs text-gray-600">AOT 生成的机器码缓存</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* 编译策略 */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">三重编译策略</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-green-400 pl-4 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs font-semibold">AOT</span>
                    <span className="font-semibold text-gray-800">Ahead-of-Time 编译</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">安装或首次运行时将代码编译为本地机器码</p>
                  <div className="flex gap-4 text-xs">
                    <span className="text-green-600">✓ 运行快、冷启动好</span>
                    <span className="text-amber-600">✗ 占用存储空间</span>
                  </div>
                </div>

                <div className="border-l-4 border-green-400 pl-4 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-green-600 text-white px-2 py-0.5 rounded text-xs font-semibold">JIT</span>
                    <span className="font-semibold text-gray-800">Just-in-Time 编译</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">运行时将热点方法编译为机器码</p>
                  <div className="flex gap-4 text-xs">
                    <span className="text-green-600">✓ 节省安装时间和存储</span>
                    <span className="text-amber-600">✗ 需要预热</span>
                  </div>
                </div>

                <div className="border-l-4 border-green-400 pl-4 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-green-700 text-white px-2 py-0.5 rounded text-xs font-semibold">PGO</span>
                    <span className="font-semibold text-gray-800">Profile-Guided Optimization</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">收集运行时 profile，基于真实使用数据优化编译</p>
                  <div className="flex gap-4 text-xs">
                    <span className="text-green-600">✓ 针对性优化、提升真实用户体验</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Zygote 进程 */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Zygote 快速启动机制</h3>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-gray-700 mb-3">
                  Android 系统启动时会创建 Zygote 进程，预加载常用类和资源。
                  当启动新应用时，通过 fork Zygote 快速创建应用进程。
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Smartphone className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">大幅减少应用启动时间和内存占用</span>
                </div>
              </div>
            </Card>

            {/* GC 设计 */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">垃圾回收优化</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span className="text-gray-700">优先<strong>低暂停</strong>设计，保证 UI 流畅性（60fps / 120fps）</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span className="text-gray-700">分代 GC + 并发回收，减少主线程阻塞</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span className="text-gray-700">持续优化，每个 Android 版本都有改进</span>
                </div>
              </div>
            </Card>

            {/* 调试工具 */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">调试与性能分析工具</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="font-semibold text-green-700 text-sm">Android Studio Profiler</div>
                  <p className="text-xs text-gray-600 mt-1">CPU / Memory / Network</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="font-semibold text-green-700 text-sm">Systrace</div>
                  <p className="text-xs text-gray-600 mt-1">系统级性能追踪</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="font-semibold text-green-700 text-sm">Perfetto</div>
                  <p className="text-xs text-gray-600 mt-1">现代追踪工具</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="font-semibold text-green-700 text-sm">LeakCanary</div>
                  <p className="text-xs text-gray-600 mt-1">内存泄漏检测</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="font-semibold text-green-700 text-sm">ADB</div>
                  <p className="text-xs text-gray-600 mt-1">设备调试桥</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="font-semibold text-green-700 text-sm">Logcat</div>
                  <p className="text-xs text-gray-600 mt-1">日志查看</p>
                </div>
              </div>
            </Card>

            {/* 最佳实践 */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">⚡ 最佳实践</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span className="text-gray-700">优化冷启动时间：减少 Application.onCreate() 工作量</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span className="text-gray-700">使用 R8 shrink/minify，减少方法数和 APK 体积</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span className="text-gray-700">避免主线程阻塞：使用协程 + Dispatchers.IO</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span className="text-gray-700">利用 Baseline Profiles 配合 PGO 优化真实用户体验</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span className="text-gray-700">注意 JNI 本地代码的内存管理和线程安全</span>
                </div>
              </div>
            </Card>

            {/* 常见误区 */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-amber-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">⚠️ 常见误区</h3>
              <div className="space-y-3">
                <div className="bg-amber-50 p-3 rounded-lg">
                  <div className="font-semibold text-amber-800 mb-1">❌ "Kotlin 直接运行在 ART"</div>
                  <p className="text-sm text-gray-700">
                    不准确。Kotlin → .class → .dex → ART 执行。理解这条链对调试很重要。
                  </p>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg">
                  <div className="font-semibold text-amber-800 mb-1">❌ "AOT 总是更快"</div>
                  <p className="text-sm text-gray-700">
                    AOT 提升运行性能，但增加安装体积和时间。混合策略才是最优解。
                  </p>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg">
                  <div className="font-semibold text-amber-800 mb-1">❌ "协程自动避免卡顿"</div>
                  <p className="text-sm text-gray-700">
                    协程是工具，错误使用仍会阻塞主线程。需配合正确的 Dispatcher。
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* 学习资源 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mt-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-800">推荐学习资源</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="https://docs.oracle.com/javase/specs/jvms/se17/html/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-gradient-to-br from-orange-50 to-white border border-orange-200 hover:border-orange-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800 flex items-center gap-2">
                ☕ JVM 规范文档
              </div>
              <div className="text-sm text-gray-600">Oracle 官方 JVM 规范</div>
            </a>
            <a
              href="https://source.android.com/docs/core/runtime"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-gradient-to-br from-green-50 to-white border border-green-200 hover:border-green-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800 flex items-center gap-2">
                🤖 ART 官方文档
              </div>
              <div className="text-sm text-gray-600">Android Runtime 详解</div>
            </a>
            <a
              href="https://developer.android.com/studio/profile"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-indigo-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800 flex items-center gap-2">
                📊 Android Profiler
              </div>
              <div className="text-sm text-gray-600">性能分析工具指南</div>
            </a>
            <a
              href="https://www.oracle.com/java/technologies/javase/vmoptions-jsp.html"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-indigo-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800 flex items-center gap-2">
                ⚙️ JVM 调优参数
              </div>
              <div className="text-sm text-gray-600">JVM 配置与优化</div>
            </a>
            <a
              href="https://developer.android.com/topic/performance"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-indigo-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800 flex items-center gap-2">
                ⚡ Android 性能优化
              </div>
              <div className="text-sm text-gray-600">官方性能最佳实践</div>
            </a>
            <a
              href="https://github.com/openjdk/jdk"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-indigo-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800 flex items-center gap-2">
                🔧 OpenJDK 源码
              </div>
              <div className="text-sm text-gray-600">深入理解 JVM 实现</div>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
