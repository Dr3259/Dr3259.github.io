'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Package, Code2, GitBranch, Zap, Terminal, Settings, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function BuildLayerPage() {
  const [activeSection, setActiveSection] = useState<'gradle' | 'studio' | 'relation'>('relation');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 p-4 sm:p-6">
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg mb-4">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            构建层：Gradle & Android Studio
          </h1>
          <p className="text-gray-600">
            从源码到产物的完整构建流程与工具链详解
          </p>
        </div>

        {/* 导航标签 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveSection('relation')}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
              activeSection === 'relation'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-sm'
            }`}
          >
            <GitBranch className="inline w-4 h-4 mr-2" />
            协同关系
          </button>
          <button
            onClick={() => setActiveSection('gradle')}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
              activeSection === 'gradle'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-sm'
            }`}
          >
            🐘 Gradle 详解
          </button>
          <button
            onClick={() => setActiveSection('studio')}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
              activeSection === 'studio'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-sm'
            }`}
          >
            🎨 Android Studio 详解
          </button>
        </div>

        {/* 协同关系 */}
        {activeSection === 'relation' && (
          <div className="space-y-6">
            {/* 定位对比 */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">核心定位</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-emerald-50 to-white p-5 rounded-lg border-2 border-emerald-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-6 h-6 text-emerald-600" />
                    <h4 className="font-bold text-gray-800">Gradle</h4>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">构建引擎</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 构建脚本与任务管理</li>
                    <li>• 产物生成（APK/AAB）</li>
                    <li>• CI/CD 构建执行</li>
                    <li>• 依赖解析与缓存</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-lg border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Code2 className="w-6 h-6 text-blue-600" />
                    <h4 className="font-bold text-gray-800">Android Studio</h4>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">开发工作台</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 代码编辑与调试</li>
                    <li>• 可视化工具（Layout/Compose）</li>
                    <li>• 性能分析（Profiler）</li>
                    <li>• 触发构建并展示结果</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* 交互方式 */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-teal-600" />
                交互机制
              </h3>
              <div className="space-y-4">
                <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                  <div className="font-semibold text-teal-800 mb-2">Gradle Tooling API</div>
                  <p className="text-sm text-gray-700">
                    Android Studio 通过 Gradle Tooling API 与 Gradle Wrapper 交互，
                    点击 "Run"/"Build" 实际调用 <code className="bg-white px-2 py-0.5 rounded">./gradlew</code> 对应任务
                  </p>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                  <div className="font-semibold text-teal-800 mb-2">Project Sync</div>
                  <p className="text-sm text-gray-700">
                    "Sync Project with Gradle Files" 触发配置解析（configuration phase），
                    IDE 读取 project model 构建项目视图（modules, facets, variants）
                  </p>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                  <div className="font-semibold text-teal-800 mb-2">单一真相来源</div>
                  <p className="text-sm text-gray-700">
                    Gradle 脚本是配置的唯一来源（Source of Truth），
                    IDE 显示的模块/variant 信息源于 Gradle model
                  </p>
                </div>
              </div>
            </Card>

            {/* 构建流程 */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">完整构建流程</h3>
              <div className="space-y-3">
                {[
                  { step: 1, title: '解析 & Sync', desc: 'Gradle 解析 settings.gradle / build.gradle，建立项目模型', color: 'emerald' },
                  { step: 2, title: '依赖解析', desc: '下载/解析外部依赖（AAR/JAR/Maven）', color: 'emerald' },
                  { step: 3, title: '资源合并', desc: 'AAPT2 合并 res/，生成 R 类', color: 'blue' },
                  { step: 4, title: '源码编译', desc: 'kotlinc/javac 编译到 .class，执行注解处理器（kapt/KSP）', color: 'blue' },
                  { step: 5, title: '字节码处理', desc: 'D8 转换 .class → .dex，R8 做 shrink/obfuscation', color: 'purple' },
                  { step: 6, title: '打包', desc: '将 dex、资源、assets、native libs 打包为 APK/AAB', color: 'purple' },
                  { step: 7, title: '签名优化', desc: '签名、zipalign、生成最终产物', color: 'orange' },
                  { step: 8, title: '部署', desc: 'installDebug / bundleRelease / publish', color: 'orange' },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full bg-${item.color}-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0`}>
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{item.title}</div>
                      <div className="text-sm text-gray-600">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* 实战建议 */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-teal-600" />
                实战建议
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="font-semibold text-gray-800 mb-2">✅ 推荐做法</div>
                  <div className="space-y-1 text-sm text-gray-700">
                    <div>• 使用 Gradle Wrapper（./gradlew）</div>
                    <div>• 采用 Kotlin DSL（build.gradle.kts）</div>
                    <div>• 启用 Build Cache（本地/远程）</div>
                    <div>• 使用 Configuration Avoidance API</div>
                    <div>• 开启 R8 shrink 与 resource shrinking</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold text-gray-800 mb-2">❌ 避免做法</div>
                  <div className="space-y-1 text-sm text-gray-700">
                    <div>• 在配置阶段做耗时操作</div>
                    <div>• 频繁触发 Full Gradle Sync</div>
                    <div>• 手动修改 .iml 等 IDE 生成文件</div>
                    <div>• 使用全局 Gradle 而非 Wrapper</div>
                    <div>• 忽略 Build Analyzer 的优化建议</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Gradle 详解 */}
        {activeSection === 'gradle' && (
          <div className="space-y-4">
            {/* 概念 */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-l-4 border-emerald-500">
              <h3 className="text-xl font-bold text-gray-800 mb-3">🐘 什么是 Gradle？</h3>
              <p className="text-gray-700 mb-2">
                Gradle 是 JVM 生态主流的构建工具，采用任务与增量构建模型，支持多语言、多平台。
                Android 项目通过 Android Gradle Plugin (AGP) 与 Gradle 集成。
              </p>
              <div className="bg-emerald-50 p-3 rounded-lg text-sm text-gray-700">
                <strong>核心优势：</strong>增量构建、任务依赖管理、强大的插件生态、构建缓存
              </div>
            </Card>

            {/* 核心概念 */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-emerald-600" />
                核心概念
              </h3>
              <div className="space-y-3">
                <div className="border-l-4 border-emerald-400 pl-4 py-2">
                  <div className="font-semibold text-gray-800 mb-1">Project & Task</div>
                  <p className="text-sm text-gray-600">
                    构建由项目与任务组成，每个 task 有 inputs/outputs，支持增量构建
                  </p>
                </div>

                <div className="border-l-4 border-emerald-400 pl-4 py-2">
                  <div className="font-semibold text-gray-800 mb-1">Configuration vs Execution</div>
                  <p className="text-sm text-gray-600 mb-2">
                    Gradle 先进入配置阶段（解析脚本、创建任务），再进入执行阶段（按依赖顺序运行）
                  </p>
                  <div className="bg-amber-50 p-2 rounded text-xs text-amber-800">
                    ⚠️ 配置阶段耗时直接影响 Android Studio 的 "Sync" 速度
                  </div>
                </div>

                <div className="border-l-4 border-emerald-400 pl-4 py-2">
                  <div className="font-semibold text-gray-800 mb-1">Gradle Wrapper (gradlew)</div>
                  <p className="text-sm text-gray-600">
                    为每个项目锁定 Gradle 版本，保证 CI 与本地一致
                  </p>
                  <code className="text-xs bg-slate-100 px-2 py-1 rounded mt-1 inline-block">
                    ./gradlew assembleDebug
                  </code>
                </div>

                <div className="border-l-4 border-emerald-400 pl-4 py-2">
                  <div className="font-semibold text-gray-800 mb-1">Build Cache</div>
                  <p className="text-sm text-gray-600">
                    本地/远程缓存任务输出，跨机器复用构建产物，显著加速构建
                  </p>
                </div>

                <div className="border-l-4 border-emerald-400 pl-4 py-2">
                  <div className="font-semibold text-gray-800 mb-1">Gradle Daemon</div>
                  <p className="text-sm text-gray-600">
                    守护进程常驻内存，避免每次启动 JVM 的开销
                  </p>
                </div>

                <div className="border-l-4 border-emerald-400 pl-4 py-2">
                  <div className="font-semibold text-gray-800 mb-1">Configuration Avoidance API</div>
                  <p className="text-sm text-gray-600">
                    使用 <code className="bg-slate-100 px-1 rounded">register</code> 而非 <code className="bg-slate-100 px-1 rounded">create</code> 延迟注册任务，减少配置开销
                  </p>
                </div>

                <div className="border-l-4 border-emerald-400 pl-4 py-2">
                  <div className="font-semibold text-gray-800 mb-1">Kotlin DSL vs Groovy DSL</div>
                  <p className="text-sm text-gray-600">
                    build.gradle.kts（Kotlin）提供类型安全与更好的 IDE 支持，日益成为主流
                  </p>
                </div>
              </div>
            </Card>

            {/* 常用任务 */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-600" />
                常用 Gradle 任务
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="bg-slate-900 p-3 rounded-lg">
                  <code className="text-emerald-400 text-sm">./gradlew assembleDebug</code>
                  <p className="text-xs text-slate-400 mt-1">构建 debug APK</p>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg">
                  <code className="text-emerald-400 text-sm">./gradlew assembleRelease</code>
                  <p className="text-xs text-slate-400 mt-1">构建 release APK（含优化）</p>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg">
                  <code className="text-emerald-400 text-sm">./gradlew bundleRelease</code>
                  <p className="text-xs text-slate-400 mt-1">生成 AAB（App Bundle）</p>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg">
                  <code className="text-emerald-400 text-sm">./gradlew installDebug</code>
                  <p className="text-xs text-slate-400 mt-1">安装 debug 版本到设备</p>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg">
                  <code className="text-emerald-400 text-sm">./gradlew clean</code>
                  <p className="text-xs text-slate-400 mt-1">清理构建产物</p>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg">
                  <code className="text-emerald-400 text-sm">./gradlew test</code>
                  <p className="text-xs text-slate-400 mt-1">运行单元测试</p>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg">
                  <code className="text-emerald-400 text-sm">./gradlew lint</code>
                  <p className="text-xs text-slate-400 mt-1">运行代码检查</p>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg">
                  <code className="text-emerald-400 text-sm">./gradlew dependencies</code>
                  <p className="text-xs text-slate-400 mt-1">查看依赖树</p>
                </div>
              </div>
            </Card>

            {/* 配置示例 */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">配置示例</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">settings.gradle.kts</div>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs overflow-x-auto">
{`pluginManagement {
    repositories {
        gradlePluginPortal()
        google()
        mavenCentral()
    }
}

rootProject.name = "MyApp"
include(":app")
include(":feature:home")
include(":core:network")`}
                  </pre>
                </div>

                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">build.gradle.kts (模块级)</div>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs overflow-x-auto">
{`plugins {
    id("com.android.application")
    kotlin("android")
}

android {
    namespace = "com.example.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.app"
        minSdk = 21
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.11.0")
    
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
}`}
                  </pre>
                </div>
              </div>
            </Card>

            {/* 优化技巧 */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">⚡ 构建优化技巧</h3>
              <div className="space-y-3">
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <div className="font-semibold text-emerald-800 mb-2">启用构建缓存</div>
                  <pre className="bg-white p-2 rounded text-xs">
{`# gradle.properties
org.gradle.caching=true
org.gradle.parallel=true
org.gradle.daemon=true`}
                  </pre>
                </div>

                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <div className="font-semibold text-emerald-800 mb-2">使用 Configuration Avoidance</div>
                  <pre className="bg-white p-2 rounded text-xs">
{`// ✅ 推荐
tasks.register("myTask") {
    doLast { println("Task executed") }
}

// ❌ 避免
tasks.create("myTask") {
    doLast { println("Task executed") }
}`}
                  </pre>
                </div>

                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <div className="font-semibold text-emerald-800 mb-2">优化依赖解析</div>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div>• 使用具体版本号，避免动态版本（1.+）</div>
                    <div>• 启用依赖锁定（Dependency Locking）</div>
                    <div>• 使用 implementation 而非 api（减少重编译）</div>
                  </div>
                </div>

                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <div className="font-semibold text-emerald-800 mb-2">分析构建性能</div>
                  <pre className="bg-white p-2 rounded text-xs">
{`./gradlew assembleDebug --profile
./gradlew assembleDebug --scan
./gradlew assembleDebug --build-cache --info`}
                  </pre>
                </div>
              </div>
            </Card>

            {/* 生态现状 */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">2025 生态现状</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span className="text-gray-700">Kotlin DSL 成为主流，提供更好的类型检查与 IDE 支持</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span className="text-gray-700">R8 已成为默认 shrink/obfuscator，持续强化优化能力</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span className="text-gray-700">Remote Build Cache 在大型团队成为必需品</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span className="text-gray-700">Build Scan / Gradle Enterprise 帮助定位慢构建点</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span className="text-gray-700">与 Kotlin Multiplatform、Compose 的深度集成</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Android Studio 详解 */}
        {activeSection === 'studio' && (
          <div className="space-y-4">
            {/* 概念 */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-l-4 border-blue-500">
              <h3 className="text-xl font-bold text-gray-800 mb-3">🎨 什么是 Android Studio？</h3>
              <p className="text-gray-700 mb-2">
                Android Studio 基于 IntelliJ IDEA，是 Android 官方 IDE，
                内置 Android 专属工具（AVD、Layout Editor、Profiler、Gradle 集成等）。
              </p>
              <div className="bg-blue-50 p-3 rounded-lg text-sm text-gray-700">
                <strong>核心价值：</strong>不仅是代码编辑器，更是构建、调试、性能分析与发布的综合环境
              </div>
            </Card>

            {/* 关键能力 */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">核心能力</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="font-semibold text-blue-800 mb-2">🔄 Gradle Integration</div>
                  <p className="text-sm text-gray-700">
                    与 Gradle 项目模型同步（Project Sync），管理构建变体
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="font-semibold text-blue-800 mb-2">🎨 Layout & Compose</div>
                  <p className="text-sm text-gray-700">
                    可视化布局编辑器 + Compose 实时预览与 Live Edit
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="font-semibold text-blue-800 mb-2">📱 Emulator & Device</div>
                  <p className="text-sm text-gray-700">
                    Android 虚拟设备管理与真机调试
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="font-semibold text-blue-800 mb-2">📊 Profiler</div>
                  <p className="text-sm text-gray-700">
                    实时分析 CPU、内存、网络、能耗
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="font-semibold text-blue-800 mb-2">🔍 Lint & Analysis</div>
                  <p className="text-sm text-gray-700">
                    静态代码检查、建议修复、代码质量分析
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="font-semibold text-blue-800 mb-2">🛠️ Refactor & Generate</div>
                  <p className="text-sm text-gray-700">
                    智能重构、代码生成、快速修复
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="font-semibold text-blue-800 mb-2">📦 APK Analyzer</div>
                  <p className="text-sm text-gray-700">
                    检查产物内容、分析体积、检测资源冗余
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="font-semibold text-blue-800 mb-2">⚡ Build Analyzer</div>
                  <p className="text-sm text-gray-700">
                    诊断慢构建任务与缓存命中率
                  </p>
                </div>
              </div>
            </Card>

            {/* Profiler 详解 */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Android Profiler 工具</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-400 pl-4 py-2">
                  <div className="font-semibold text-gray-800 mb-1">CPU Profiler</div>
                  <p className="text-sm text-gray-600">
                    追踪方法调用、识别性能瓶颈、分析线程活动
                  </p>
                  <div className="text-xs text-blue-600 mt-1">
                    支持 Sample / Instrumented / System Trace
                  </div>
                </div>

                <div className="border-l-4 border-blue-400 pl-4 py-2">
                  <div className="font-semibold text-gray-800 mb-1">Memory Profiler</div>
                  <p className="text-sm text-gray-600">
                    实时查看内存分配、检测内存泄漏、分析堆转储
                  </p>
                  <div className="text-xs text-blue-600 mt-1">
                    配合 LeakCanary 使用效果更佳
                  </div>
                </div>

                <div className="border-l-4 border-blue-400 pl-4 py-2">
                  <div className="font-semibold text-gray-800 mb-1">Network Profiler</div>
                  <p className="text-sm text-gray-600">
                    监控网络请求、查看请求/响应内容、分析网络性能
                  </p>
                </div>

                <div className="border-l-4 border-blue-400 pl-4 py-2">
                  <div className="font-semibold text-gray-800 mb-1">Energy Profiler</div>
                  <p className="text-sm text-gray-600">
                    分析电量消耗、识别耗电组件（CPU/网络/位置/唤醒锁）
                  </p>
                </div>
              </div>
            </Card>

            {/* Compose 工具 */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Jetpack Compose 工具</h3>
              <div className="space-y-3">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="font-semibold text-blue-800 mb-2">Compose Preview</div>
                  <p className="text-sm text-gray-700 mb-2">
                    在 IDE 中实时预览 Composable 函数，无需运行应用
                  </p>
                  <pre className="bg-white p-2 rounded text-xs">
{`@Preview(showBackground = true)
@Composable
fun MyComponentPreview() {
    MyComponent()
}`}
                  </pre>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="font-semibold text-blue-800 mb-2">Live Edit</div>
                  <p className="text-sm text-gray-700">
                    修改 Compose 代码后，无需重新构建即可在运行的应用中看到变化
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="font-semibold text-blue-800 mb-2">Layout Inspector</div>
                  <p className="text-sm text-gray-700">
                    检查运行时的 Compose 层级结构、查看属性值
                  </p>
                </div>
              </div>
            </Card>

            {/* 调试技巧 */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">调试技巧</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="font-semibold text-gray-800 text-sm mb-1">断点调试</div>
                  <p className="text-xs text-gray-600">
                    条件断点、日志断点、异常断点
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="font-semibold text-gray-800 text-sm mb-1">Logcat 过滤</div>
                  <p className="text-xs text-gray-600">
                    按标签、级别、包名过滤日志
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="font-semibold text-gray-800 text-sm mb-1">Database Inspector</div>
                  <p className="text-xs text-gray-600">
                    实时查看 Room 数据库内容
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="font-semibold text-gray-800 text-sm mb-1">Network Inspector</div>
                  <p className="text-xs text-gray-600">
                    查看 OkHttp 网络请求详情
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="font-semibold text-gray-800 text-sm mb-1">Device File Explorer</div>
                  <p className="text-xs text-gray-600">
                    浏览设备文件系统
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="font-semibold text-gray-800 text-sm mb-1">Systrace</div>
                  <p className="text-xs text-gray-600">
                    系统级性能追踪与分析
                  </p>
                </div>
              </div>
            </Card>

            {/* 快捷键 */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">常用快捷键</h3>
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                  <span className="text-gray-700">搜索文件</span>
                  <kbd className="px-2 py-1 bg-slate-200 rounded text-xs">Ctrl+Shift+N</kbd>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                  <span className="text-gray-700">搜索类</span>
                  <kbd className="px-2 py-1 bg-slate-200 rounded text-xs">Ctrl+N</kbd>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                  <span className="text-gray-700">全局搜索</span>
                  <kbd className="px-2 py-1 bg-slate-200 rounded text-xs">Ctrl+Shift+F</kbd>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                  <span className="text-gray-700">重构重命名</span>
                  <kbd className="px-2 py-1 bg-slate-200 rounded text-xs">Shift+F6</kbd>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                  <span className="text-gray-700">格式化代码</span>
                  <kbd className="px-2 py-1 bg-slate-200 rounded text-xs">Ctrl+Alt+L</kbd>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                  <span className="text-gray-700">优化导入</span>
                  <kbd className="px-2 py-1 bg-slate-200 rounded text-xs">Ctrl+Alt+O</kbd>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                  <span className="text-gray-700">运行应用</span>
                  <kbd className="px-2 py-1 bg-slate-200 rounded text-xs">Shift+F10</kbd>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                  <span className="text-gray-700">调试应用</span>
                  <kbd className="px-2 py-1 bg-slate-200 rounded text-xs">Shift+F9</kbd>
                </div>
              </div>
            </Card>

            {/* 最佳实践 */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">⚡ 最佳实践</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span className="text-gray-700">避免频繁 Full Gradle Sync，只在必要时触发</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span className="text-gray-700">使用 Build Analyzer 诊断慢构建，按提示优化</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span className="text-gray-700">使用 Compose Live Edit / Previews 做组件级调试</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span className="text-gray-700">定期使用 APK Analyzer 检查产物体积</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span className="text-gray-700">配置合适的 IDE 与 Gradle Daemon 内存</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span className="text-gray-700">使用 Profiler 定位性能瓶颈与内存泄漏</span>
                </div>
              </div>
            </Card>

            {/* 2025 趋势 */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">2025 生态趋势</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span className="text-gray-700">更深度的 Compose 工具链集成（Live Edit、实时渲染）</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span className="text-gray-700">Gradle Sync 优化（partial sync、project model caching）</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span className="text-gray-700">AI 助手集成（代码补全、重构建议、错误修复）</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span className="text-gray-700">Profilers 更强大（一体化追踪 UI 卡顿、ANR）</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span className="text-gray-700">Apple Silicon / Windows 优化（更快编译与模拟器）</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* 学习资源 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mt-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-teal-600" />
            <h2 className="text-xl font-bold text-gray-800">推荐学习资源</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="https://docs.gradle.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800 flex items-center gap-2">
                🐘 Gradle 官方文档
              </div>
              <div className="text-sm text-gray-600">完整的 Gradle 指南</div>
            </a>
            <a
              href="https://developer.android.com/build"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-white border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800 flex items-center gap-2">
                🤖 Android Gradle Plugin
              </div>
              <div className="text-sm text-gray-600">AGP 官方文档</div>
            </a>
            <a
              href="https://developer.android.com/studio"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-teal-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800 flex items-center gap-2">
                🎨 Android Studio 指南
              </div>
              <div className="text-sm text-gray-600">IDE 使用文档</div>
            </a>
            <a
              href="https://gradle.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-teal-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800 flex items-center gap-2">
                🚀 Gradle Enterprise
              </div>
              <div className="text-sm text-gray-600">构建性能优化平台</div>
            </a>
            <a
              href="https://developer.android.com/studio/build/optimize-your-build"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-teal-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800 flex items-center gap-2">
                ⚡ 构建优化指南
              </div>
              <div className="text-sm text-gray-600">加速构建的最佳实践</div>
            </a>
            <a
              href="https://github.com/gradle/gradle"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-teal-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800 flex items-center gap-2">
                🔧 Gradle GitHub
              </div>
              <div className="text-sm text-gray-600">源码与示例</div>
            </a>
            <a
              href="https://developer.android.com/studio/profile"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-teal-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800 flex items-center gap-2">
                📊 Profiler 工具
              </div>
              <div className="text-sm text-gray-600">性能分析与调试</div>
            </a>
            <a
              href="https://developer.android.com/studio/releases/gradle-plugin"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-teal-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800 flex items-center gap-2">
                📝 AGP 发行说明
              </div>
              <div className="text-sm text-gray-600">最新特性与变更</div>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
