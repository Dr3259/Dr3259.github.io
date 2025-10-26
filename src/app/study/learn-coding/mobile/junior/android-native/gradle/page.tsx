'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Package, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function GradlePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/study/learn-coding/mobile/junior/android-native" passHref>
            <Button variant="outline" size="sm" className="hover:bg-white/80 shadow-sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回 Android 原生开发
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg mb-4">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            Gradle 构建工具
          </h1>
          <p className="text-gray-600">
            Android 项目的自动化构建系统
          </p>
        </div>

        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-600" />
            工具概述
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Gradle 是 Android 官方的构建工具，用于管理项目依赖、编译代码、打包应用等。
              它使用 Kotlin DSL 或 Groovy DSL 来配置构建脚本。
            </p>
            <p>
              从 Android Studio 开始，Google 推荐使用 Kotlin DSL（build.gradle.kts）来编写构建脚本，
              提供更好的类型安全和 IDE 支持。
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">核心概念</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
              <h3 className="font-semibold text-emerald-800 mb-2">项目结构</h3>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>settings.gradle.kts - 项目设置</li>
                <li>build.gradle.kts (项目级) - 全局配置</li>
                <li>build.gradle.kts (模块级) - 模块配置</li>
              </ul>
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">依赖管理</h3>
              <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg overflow-x-auto text-xs mt-2">
{`dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.compose.ui:ui:1.5.4")
    testImplementation("junit:junit:4.13.2")
}`}
              </pre>
            </div>

            <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-2">构建变体</h3>
              <p className="text-sm text-gray-700">支持 debug、release 等不同构建类型，以及多渠道打包</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">推荐资源</h2>
          <a href="https://gradle.org/" target="_blank" rel="noopener noreferrer" 
             className="block p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200 hover:border-emerald-300 hover:shadow-md transition-all">
            <h3 className="font-semibold text-emerald-800">Gradle 官方文档</h3>
            <p className="text-sm text-gray-600 mt-1">深入学习 Gradle 构建系统</p>
          </a>
        </Card>
      </div>
    </div>
  );
}
