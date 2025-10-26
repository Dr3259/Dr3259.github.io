'use client';


import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Smartphone, BookOpen, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AndroidNativePage() {
  const router = useRouter();

  const resources = [
    { name: 'Android 官方文档', url: 'https://developer.android.com/', description: 'Android 开发官方指南' },
    { name: 'Kotlin 官方文档', url: 'https://kotlinlang.org/', description: 'Kotlin 语言官方网站' },
    { name: 'Android Studio', url: 'https://developer.android.com/studio', description: 'Android 官方 IDE' },
    { name: 'Material Design', url: 'https://material.io/', description: 'Google Material 设计规范' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link href="/study/learn-coding/mobile?level=junior" passHref>
            <Button variant="outline" size="sm" className="hover:bg-white/80 shadow-sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回移动端开发
            </Button>
          </Link>
        </div>

        {/* 页面标题 */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg mb-4">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            Android 原生开发
          </h1>
          <p className="text-gray-600">
            系统掌握 Kotlin、Android Studio、Activity、Fragment 等 Android 开发核心技能
          </p>
        </div>

        {/* Android 技术栈层级 */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm mb-8">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* 语言层 */}
            <div className="relative">
              <div 
                className="flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200/60 shadow-sm transition-all hover:border-slate-300 hover:shadow-md cursor-pointer group"
                onClick={() => router.push('/study/learn-coding/mobile/junior/android-native/language-layer')}
              >
                <div className="flex-shrink-0 w-20 text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                  语言层
                </div>
                <div className="flex items-center gap-3 flex-1">
                  <span 
                    className="px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg text-sm font-medium shadow-sm cursor-pointer hover:from-slate-700 hover:to-slate-800 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push('/study/learn-coding/mobile/junior/android-native/kotlin');
                    }}
                  >
                    Kotlin
                  </span>
                  <span className="text-slate-400">→</span>
                  <span className="text-slate-500 text-sm">（运行于）</span>
                  <span 
                    className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-md text-sm font-medium shadow-sm cursor-pointer hover:from-blue-600 hover:to-indigo-700 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push('/study/learn-coding/mobile/junior/android-native/jvm-art');
                    }}
                  >
                    JVM/ART
                  </span>
                </div>
              </div>
              <div className="flex justify-center py-2">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                  <div className="w-0.5 h-3 bg-gradient-to-b from-slate-300 to-slate-200"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                </div>
              </div>
            </div>

            {/* 构建层 */}
            <div className="relative">
              <div 
                className="flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200/60 shadow-sm transition-all hover:border-slate-300 hover:shadow-md cursor-pointer group"
                onClick={() => router.push('/study/learn-coding/mobile/junior/android-native/build-layer')}
              >
                <div className="flex-shrink-0 w-20 text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">构建层</div>
                <div className="flex items-center gap-3 flex-1">
                  <span 
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg text-sm font-medium shadow-sm cursor-pointer hover:from-emerald-600 hover:to-teal-700 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push('/study/learn-coding/mobile/junior/android-native/gradle');
                    }}
                  >
                    Gradle
                  </span>
                  <span className="text-slate-400">←</span>
                  <span 
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-sm font-medium shadow-sm cursor-pointer hover:from-blue-600 hover:to-indigo-700 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push('/study/learn-coding/mobile/junior/android-native/android-studio');
                    }}
                  >
                    Android Studio
                  </span>
                </div>
              </div>
              <div className="flex justify-center py-2">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                  <div className="w-0.5 h-3 bg-gradient-to-b from-slate-300 to-slate-200"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                </div>
              </div>
            </div>

            {/* 架构层 */}
            <div className="relative">
              <div 
                className="flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200/60 shadow-sm transition-all hover:border-slate-300 hover:shadow-md cursor-pointer group"
                onClick={() => router.push('/study/learn-coding/mobile/junior/android-native/architecture-layer')}
              >
                <div className="flex-shrink-0 w-20 text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">架构层</div>
                <div className="flex flex-wrap items-center gap-2 flex-1">
                  <span className="px-3 py-1.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg text-sm font-medium shadow-sm">Activity</span>
                  <span className="text-slate-400">/</span>
                  <span className="px-3 py-1.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg text-sm font-medium shadow-sm">Fragment</span>
                  <span className="text-slate-400">/</span>
                  <span className="px-3 py-1.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg text-sm font-medium shadow-sm">ViewModel</span>
                  <span className="text-slate-400">/</span>
                  <span className="px-3 py-1.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg text-sm font-medium shadow-sm">Repository</span>
                </div>
              </div>
              <div className="flex justify-center py-2">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                  <div className="w-0.5 h-3 bg-gradient-to-b from-slate-300 to-slate-200"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                </div>
              </div>
            </div>

            {/* UI层 */}
            <div className="relative">
              <div 
                className="flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200/60 shadow-sm transition-all hover:border-slate-300 hover:shadow-md cursor-pointer group"
                onClick={() => router.push('/study/learn-coding/mobile/junior/android-native/ui-layer')}
              >
                <div className="flex-shrink-0 w-20 text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">UI层</div>
                <div className="flex flex-wrap items-center gap-2 flex-1">
                  <span className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg text-sm font-medium shadow-sm">XML Layout</span>
                  <span className="text-slate-400">←→</span>
                  <span 
                    className="px-3 py-1.5 bg-gradient-to-r from-sky-500 to-cyan-600 text-white rounded-lg text-sm font-medium shadow-sm cursor-pointer hover:from-sky-600 hover:to-cyan-700 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push('/study/learn-coding/mobile/junior/android-native/jetpack-compose');
                    }}
                  >
                    Jetpack Compose
                  </span>
                  <span className="text-slate-400">←→</span>
                  <span className="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg text-sm font-medium shadow-sm">Material Design</span>
                </div>
              </div>
              <div className="flex justify-center py-2">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                  <div className="w-0.5 h-3 bg-gradient-to-b from-slate-300 to-slate-200"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                </div>
              </div>
            </div>

            {/* 数据层 */}
            <div className="relative">
              <div 
                className="flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200/60 shadow-sm transition-all hover:border-slate-300 hover:shadow-md cursor-pointer group"
                onClick={() => router.push('/study/learn-coding/mobile/junior/android-native/data-layer')}
              >
                <div className="flex-shrink-0 w-20 text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">数据层</div>
                <div className="flex flex-wrap items-center gap-2 flex-1">
                  <span className="px-3 py-1.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg text-sm font-medium shadow-sm">Room</span>
                  <span className="text-slate-400">/</span>
                  <span className="px-3 py-1.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg text-sm font-medium shadow-sm">LiveData</span>
                  <span className="text-slate-400">/</span>
                  <span className="px-3 py-1.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg text-sm font-medium shadow-sm">Flow</span>
                </div>
              </div>
              <div className="flex justify-center py-2">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                  <div className="w-0.5 h-3 bg-gradient-to-b from-slate-300 to-slate-200"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                </div>
              </div>
            </div>

            {/* 网络层 */}
            <div className="relative">
              <div 
                className="flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200/60 shadow-sm transition-all hover:border-slate-300 hover:shadow-md cursor-pointer group"
                onClick={() => router.push('/study/learn-coding/mobile/junior/android-native/network-layer')}
              >
                <div className="flex-shrink-0 w-20 text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">网络层</div>
                <div className="flex items-center gap-2 flex-1">
                  <span className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-lg text-sm font-medium shadow-sm">Retrofit</span>
                  <span className="text-slate-400">+</span>
                  <span className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-lg text-sm font-medium shadow-sm">OkHttp</span>
                </div>
              </div>
              <div className="flex justify-center py-2">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                  <div className="w-0.5 h-3 bg-gradient-to-b from-slate-300 to-slate-200"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                </div>
              </div>
            </div>

            {/* 后台层 */}
            <div className="relative">
              <div 
                className="flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200/60 shadow-sm transition-all hover:border-slate-300 hover:shadow-md cursor-pointer group"
                onClick={() => router.push('/study/learn-coding/mobile/junior/android-native/background-layer')}
              >
                <div className="flex-shrink-0 w-20 text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">后台层</div>
                <div className="flex items-center gap-2 flex-1">
                  <span className="px-3 py-1.5 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white rounded-lg text-sm font-medium shadow-sm">WorkManager</span>
                  <span className="text-slate-400">/</span>
                  <span className="px-3 py-1.5 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white rounded-lg text-sm font-medium shadow-sm">Coroutine</span>
                </div>
              </div>
              <div className="flex justify-center py-2">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                  <div className="w-0.5 h-3 bg-gradient-to-b from-slate-300 to-slate-200"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                </div>
              </div>
            </div>

            {/* 调试与发布 */}
            <div className="relative">
              <div 
                className="flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200/60 shadow-sm transition-all hover:border-slate-300 hover:shadow-md cursor-pointer group"
                onClick={() => router.push('/study/learn-coding/mobile/junior/android-native/debug-release')}
              >
                <div className="flex-shrink-0 w-20 text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">调试与发布</div>
                <div className="flex flex-wrap items-center gap-2 flex-1">
                  <span className="px-3 py-1.5 bg-gradient-to-r from-slate-600 to-gray-700 text-white rounded-lg text-sm font-medium shadow-sm">ADB</span>
                  <span className="text-slate-400">/</span>
                  <span className="px-3 py-1.5 bg-gradient-to-r from-slate-600 to-gray-700 text-white rounded-lg text-sm font-medium shadow-sm">Profiler</span>
                  <span className="text-slate-400">/</span>
                  <span className="px-3 py-1.5 bg-gradient-to-r from-slate-600 to-gray-700 text-white rounded-lg text-sm font-medium shadow-sm">App Bundle</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 学习资源 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">推荐学习资源</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resources.map((resource, idx) => (
              <a
                key={idx}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-primary hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-800 group-hover:text-primary transition-colors">
                    {resource.name}
                  </h3>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-sm text-gray-600">{resource.description}</p>
              </a>
            ))}
          </div>
        </Card>

        {/* 底部提示 */}
        <div className="text-center">
          <Card className="inline-block p-4 bg-gradient-to-r from-white/80 to-blue-50/80 backdrop-blur-sm border border-blue-200/50">
            <p className="text-sm text-gray-700">
              💡 建议：从 Kotlin 语言基础开始，逐步学习 Android Studio 和组件开发
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
