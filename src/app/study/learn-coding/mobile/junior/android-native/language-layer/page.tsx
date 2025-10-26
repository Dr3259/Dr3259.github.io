'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Code2, Layers, Cpu, Link2 } from 'lucide-react';
import Link from 'next/link';

export default function LanguageLayerPage() {
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-800 rounded-2xl shadow-lg mb-4">
            <Layers className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            语言层生态现状（2025）
          </h1>
          <p className="text-gray-600">
            Kotlin → JVM / ART 的完整生态解析
          </p>
        </div>

        {/* 核心概念 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Code2 className="w-6 h-6 text-slate-600" />
            核心概念
          </h2>
          <div className="space-y-4 text-gray-700">
            <p className="leading-relaxed">
              <span className="font-semibold text-slate-800">Kotlin</span> 是 Android 官方首选语言（自 2019 起），运行在 JVM 上。
              但 Android 原生开发的语言生态，并不只有 Kotlin —— 它是生态的"中心语言"，周边还有 Java、C/C++、Dart、Rust 等语言在局部场景中扮演辅助角色。
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="text-blue-900 font-medium">
                这句话 "Kotlin →（运行于）JVM / ART" 其实蕴含三个层面的生态逻辑：语言生态层、运行时生态层、以及两者的关系生态层。
              </p>
            </div>
          </div>
        </Card>

        {/* 一、Kotlin 及相关语言生态现状 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold">🟢</div>
            <h2 className="text-2xl font-bold text-gray-800">一、Kotlin 及相关语言生态现状</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">⚙️ 生态构成与现状（2025）</h3>
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-100 to-gray-100">
                      <th className="border-b-2 border-slate-300 p-3 text-left font-bold text-slate-800">语言</th>
                      <th className="border-b-2 border-slate-300 p-3 text-left font-bold text-slate-800">定位</th>
                      <th className="border-b-2 border-slate-300 p-3 text-left font-bold text-slate-800">现状</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-purple-50/50 transition-colors">
                      <td className="border-b border-slate-200 p-3 font-semibold text-purple-700">Kotlin</td>
                      <td className="border-b border-slate-200 p-3 text-sm">官方推荐语言</td>
                      <td className="border-b border-slate-200 p-3 text-sm text-gray-600">Jetpack Compose、协程、KMP 全面成熟；已取代 Java 成为主流</td>
                    </tr>
                    <tr className="hover:bg-amber-50/50 transition-colors">
                      <td className="border-b border-slate-200 p-3 font-semibold text-amber-700">Java</td>
                      <td className="border-b border-slate-200 p-3 text-sm">传统主力</td>
                      <td className="border-b border-slate-200 p-3 text-sm text-gray-600">仍支撑大量旧项目，JDK 11/17 的部分特性在 Android SDK 内逐步支持</td>
                    </tr>
                    <tr className="hover:bg-blue-50/50 transition-colors">
                      <td className="border-b border-slate-200 p-3 font-semibold text-blue-700">C / C++ (NDK)</td>
                      <td className="border-b border-slate-200 p-3 text-sm">性能层</td>
                      <td className="border-b border-slate-200 p-3 text-sm text-gray-600">主要用于游戏、音视频、AI 推理等性能敏感模块</td>
                    </tr>
                    <tr className="hover:bg-cyan-50/50 transition-colors">
                      <td className="border-b border-slate-200 p-3 font-semibold text-cyan-700">Dart (Flutter)</td>
                      <td className="border-b border-slate-200 p-3 text-sm">跨平台 UI 层</td>
                      <td className="border-b border-slate-200 p-3 text-sm text-gray-600">虽然不属于"原生语言层"，但与原生生态协作日益紧密</td>
                    </tr>
                    <tr className="hover:bg-red-50/50 transition-colors">
                      <td className="border-b border-slate-200 p-3 font-semibold text-red-700">Rust</td>
                      <td className="border-b border-slate-200 p-3 text-sm">系统安全层</td>
                      <td className="border-b border-slate-200 p-3 text-sm text-gray-600">Google 官方推动，用于替代 C++ 编写底层库（如 Android System Components）</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-5 rounded-xl border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">🧠 为什么 Kotlin 成为核心</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">▸</span>
                  <span>Kotlin 编译到 JVM 字节码，兼容 Java</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">▸</span>
                  <span>JetBrains 与 Google 联合维护</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">▸</span>
                  <span>空安全、协程、DSL 让代码简洁且现代</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">▸</span>
                  <span>Jetpack Compose（Android 官方 UI 框架）以 Kotlin 为唯一语言支持</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* 二、JVM / ART 的生态现状 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white font-bold">🟣</div>
            <h2 className="text-2xl font-bold text-gray-800">二、JVM / ART 的生态现状（运行时生态层）</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <Cpu className="w-5 h-5" />
                🧩 是什么
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><span className="font-semibold text-blue-700">JVM（Java Virtual Machine）：</span>语言运行规范。定义字节码如何被解释或编译执行。</p>
                <p><span className="font-semibold text-blue-700">ART（Android Runtime）：</span>Android 平台对 JVM 的定制实现，用来执行 .dex 格式的字节码。</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">⚙️ 现状与趋势（2025）</h3>
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-100 to-gray-100">
                      <th className="border-b-2 border-slate-300 p-3 text-left font-bold text-slate-800 w-1/4">方面</th>
                      <th className="border-b-2 border-slate-300 p-3 text-left font-bold text-slate-800">描述</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="border-b border-slate-200 p-3 font-semibold text-slate-700">运行时核心</td>
                      <td className="border-b border-slate-200 p-3 text-sm text-gray-600">ART 完全取代 Dalvik，成为 Android 系统标准运行时</td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="border-b border-slate-200 p-3 font-semibold text-slate-700">编译模式</td>
                      <td className="border-b border-slate-200 p-3 text-sm text-gray-600">AOT + JIT + PGO 混合执行模式（性能与能耗平衡）</td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="border-b border-slate-200 p-3 font-semibold text-slate-700">优化能力</td>
                      <td className="border-b border-slate-200 p-3 text-sm text-gray-600">动态 Profile 收集与启动优化（Android 14+ 提升显著）</td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="border-b border-slate-200 p-3 font-semibold text-slate-700">模块化</td>
                      <td className="border-b border-slate-200 p-3 text-sm text-gray-600">ART 作为独立模块（Play System Update 可单独更新）</td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="border-b border-slate-200 p-3 font-semibold text-slate-700">字节码支持</td>
                      <td className="border-b border-slate-200 p-3 text-sm text-gray-600">支持 JVM 8+ 特性（Lambda、默认方法、invokeDynamic）</td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="border-b border-slate-200 p-3 font-semibold text-slate-700">生态整合</td>
                      <td className="border-b border-slate-200 p-3 text-sm text-gray-600">ART 与 Kotlin 编译器紧密适配，Compose、Coroutines 深度优化</td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="border-b border-slate-200 p-3 font-semibold text-slate-700">安全趋势</td>
                      <td className="border-b border-slate-200 p-3 text-sm text-gray-600">引入运行时隔离与 Rust-native runtime 组件（Google 积极推进）</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-5 rounded-xl border border-red-200">
              <h3 className="text-lg font-semibold text-red-800 mb-3">⚠️ 已过时的部分</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                  <span className="text-red-600 font-bold">❌</span>
                  <div className="flex-1">
                    <span className="font-semibold text-gray-800">Dalvik VM：</span>
                    <span className="text-gray-600">已废弃 - 性能差、不支持新字节码</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                  <span className="text-red-600 font-bold">❌</span>
                  <div className="flex-1">
                    <span className="font-semibold text-gray-800">Jack & Jill 编译链：</span>
                    <span className="text-gray-600">中止 - 维护复杂，被 D8 / R8 替代</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                  <span className="text-amber-600 font-bold">⚠️</span>
                  <div className="flex-1">
                    <span className="font-semibold text-gray-800">纯 Java 生态编译：</span>
                    <span className="text-gray-600">边缘化 - 缺乏协程、空安全、现代特性支持</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 三、Kotlin 与 JVM / ART 的关系现状 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">🔗</div>
            <h2 className="text-2xl font-bold text-gray-800">三、Kotlin 与 JVM / ART 的关系现状</h2>
          </div>
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-5 rounded-xl border border-cyan-200">
              <h3 className="text-lg font-semibold text-cyan-800 mb-3 flex items-center gap-2">
                <Link2 className="w-5 h-5" />
                🧩 是什么关系
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                Kotlin 并不是直接在 CPU 上执行的语言，它依托 JVM 规范，而 JVM 在 Android 中由 ART 实现。
              </p>
              <div className="bg-white/80 p-4 rounded-lg font-mono text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-purple-600 font-semibold">Kotlin 源码 (.kt)</span>
                </div>
                <div className="flex items-center gap-2 pl-4">
                  <span className="text-slate-400">↓</span>
                  <span className="text-gray-600">Kotlin 编译器 (kotlinc)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-semibold">JVM 字节码 (.class)</span>
                </div>
                <div className="flex items-center gap-2 pl-4">
                  <span className="text-slate-400">↓</span>
                  <span className="text-gray-600">D8 / R8 转换为 Android 格式</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-semibold">DEX 文件 (.dex)</span>
                </div>
                <div className="flex items-center gap-2 pl-4">
                  <span className="text-slate-400">↓</span>
                  <span className="text-gray-600">ART 运行时执行</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-orange-600 font-semibold">机器码 → CPU 执行</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">⚙️ 生态层面关系（2025）</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">编译层面</h4>
                  <p className="text-sm text-gray-600">Kotlin 编译器（K2）直接生成 JVM 字节码，兼容 Java 生态</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">转换层面</h4>
                  <p className="text-sm text-gray-600">D8 / R8 工具链优化 Kotlin 编译产物（字节码 → DEX）</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">运行层面</h4>
                  <p className="text-sm text-gray-600">ART 执行 Kotlin 生成的 DEX 文件，支持协程、Compose 等优化</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-2">工具生态</h4>
                  <p className="text-sm text-gray-600">Android Studio 整合 Kotlin 编译器与 ART 模拟器，调试无缝</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-xl border border-indigo-200">
              <h3 className="text-lg font-semibold text-indigo-800 mb-3">🧠 生态影响</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-1">▸</span>
                  <span>Kotlin 与 ART 共进化（语言层更新能直接利用 ART 新特性）</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-1">▸</span>
                  <span>Java 虽然仍能编译运行在 ART，但生态关注度下降</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-1">▸</span>
                  <span>Jetpack、Compose、协程等都以「Kotlin+ART」为默认环境</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* 四、总结 - 语言层生态三点合图 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center text-white font-bold">🧭</div>
            <h2 className="text-2xl font-bold text-gray-800">四、总结 - 语言层生态三点合图</h2>
          </div>

          <div className="space-y-6">
            {/* 架构图 */}
            <div className="bg-gradient-to-br from-slate-50 to-gray-100 p-6 rounded-xl border border-slate-300">
              <div className="max-w-2xl mx-auto space-y-4">
                <div className="bg-white p-5 rounded-xl border-2 border-purple-300 shadow-sm">
                  <div className="text-center">
                    <div className="font-bold text-purple-800 mb-2">Kotlin / Java / C++ 等语言层</div>
                    <div className="text-sm text-gray-600">↑ Kotlin 主导现代 Android 生态</div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className="text-slate-400 text-sm">↓ 编译成 JVM 字节码</div>
                </div>

                <div className="bg-white p-5 rounded-xl border-2 border-blue-300 shadow-sm">
                  <div className="text-center">
                    <div className="font-bold text-blue-800 mb-2">JVM 层（虚拟机规范）</div>
                    <div className="text-sm text-gray-600">↑ 语言中立的中间执行格式 (.class)</div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="text-slate-400 text-sm">↓ 转换成 DEX</div>
                </div>

                <div className="bg-white p-5 rounded-xl border-2 border-green-300 shadow-sm">
                  <div className="text-center">
                    <div className="font-bold text-green-800 mb-2">ART 层（Android Runtime）</div>
                    <div className="text-sm text-gray-600">↑ 执行 DEX，JIT/AOT 优化执行</div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="text-slate-400 text-sm">↓ 实际运行在 CPU 上</div>
                </div>

                <div className="bg-gradient-to-r from-orange-100 to-amber-100 p-4 rounded-xl border border-orange-300 text-center">
                  <div className="font-bold text-orange-800">CPU 执行</div>
                </div>
              </div>
            </div>

            {/* 最终结论表格 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">✅ 最终结论</h3>
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-100 to-gray-100">
                      <th className="border-b-2 border-slate-300 p-3 text-left font-bold text-slate-800 w-1/4">层面</th>
                      <th className="border-b-2 border-slate-300 p-3 text-left font-bold text-slate-800">说明</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-purple-50/50 transition-colors">
                      <td className="border-b border-slate-200 p-3 font-semibold text-purple-700">① Kotlin 语言生态</td>
                      <td className="border-b border-slate-200 p-3 text-sm text-gray-600">Android 官方主推语言，现代、类型安全、跨平台化趋势明显</td>
                    </tr>
                    <tr className="hover:bg-blue-50/50 transition-colors">
                      <td className="border-b border-slate-200 p-3 font-semibold text-blue-700">② JVM / ART 运行时生态</td>
                      <td className="border-b border-slate-200 p-3 text-sm text-gray-600">JVM 是规范，ART 是 Android 实现，持续模块化与性能优化</td>
                    </tr>
                    <tr className="hover:bg-green-50/50 transition-colors">
                      <td className="border-b border-slate-200 p-3 font-semibold text-green-700">③ Kotlin ↔ JVM/ART 关系生态</td>
                      <td className="border-b border-slate-200 p-3 text-sm text-gray-600">Kotlin 与 ART 高度协作：编译链、性能优化、语言特性全线融合</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Card>


      </div>
    </div>
  );
}
