'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Palette, BookOpen, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function JetpackComposePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50 p-4 sm:p-6">
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-500 to-cyan-600 rounded-2xl shadow-lg mb-4">
            <Palette className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            Jetpack Compose
          </h1>
          <p className="text-gray-600">
            Android 现代化声明式 UI 工具包
          </p>
        </div>

        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-sky-600" />
            技术概述
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Jetpack Compose 是 Google 推出的现代化 Android UI 工具包，采用声明式编程范式，
              让开发者可以用更少的代码构建美观、响应式的用户界面。
            </p>
            <p>
              与传统的 XML 布局相比，Compose 完全使用 Kotlin 代码编写 UI，提供了更好的类型安全、
              更强的可组合性和更简单的状态管理。
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-sky-600" />
            核心优势
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-sky-50 to-cyan-50 rounded-xl border border-sky-200">
              <h3 className="font-semibold text-sky-800 mb-2">声明式 UI</h3>
              <p className="text-sm text-gray-600">描述 UI 应该是什么样子，而不是如何构建</p>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">更少代码</h3>
              <p className="text-sm text-gray-600">相比 XML 减少约 30-40% 的代码量</p>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-2">实时预览</h3>
              <p className="text-sm text-gray-600">在 Android Studio 中即时查看 UI 效果</p>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">Material Design 3</h3>
              <p className="text-sm text-gray-600">原生支持最新的 Material Design 规范</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">代码示例</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">简单的 Composable 函数</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`@Composable
fun Greeting(name: String) {
    Text(
        text = "Hello, $name!",
        style = MaterialTheme.typography.headlineMedium,
        color = MaterialTheme.colorScheme.primary
    )
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">状态管理</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }
    
    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("Count: $count")
        Button(onClick = { count++ }) {
            Text("Increment")
        }
    }
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">列表渲染</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`@Composable
fun ItemList(items: List<String>) {
    LazyColumn {
        items(items) { item ->
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(8.dp)
            ) {
                Text(
                    text = item,
                    modifier = Modifier.padding(16.dp)
                )
            }
        }
    }
}`}
              </pre>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">学习资源</h2>
          <div className="space-y-3">
            <a href="https://developer.android.com/jetpack/compose" target="_blank" rel="noopener noreferrer" 
               className="block p-4 bg-gradient-to-r from-sky-50 to-cyan-50 rounded-lg border border-sky-200 hover:border-sky-300 hover:shadow-md transition-all">
              <h3 className="font-semibold text-sky-800">Jetpack Compose 官方文档</h3>
              <p className="text-sm text-gray-600 mt-1">Google 官方完整教程和 API 文档</p>
            </a>
            
            <a href="https://developer.android.com/courses/pathways/compose" target="_blank" rel="noopener noreferrer"
               className="block p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all">
              <h3 className="font-semibold text-blue-800">Compose 学习路径</h3>
              <p className="text-sm text-gray-600 mt-1">官方提供的系统化学习课程</p>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
