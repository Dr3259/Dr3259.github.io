'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Code2, BookOpen, Play } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function KotlinPage() {
  const [activeSection, setActiveSection] = useState('basics');

  const sections = [
    { id: 'basics', label: '基础语法', icon: '📝' },
    { id: 'functions', label: '函数', icon: '⚡' },
    { id: 'classes', label: '类与对象', icon: '🏗️' },
    { id: 'advanced', label: '高级特性', icon: '🚀' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 p-4 sm:p-6">
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl shadow-lg mb-4">
            <Code2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            Kotlin 快速入门
          </h1>
          <p className="text-gray-600">
            简洁、实用、易上手的 Kotlin 学习指南
          </p>
        </div>

        {/* 导航标签 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                activeSection === section.id
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-sm'
              }`}
            >
              <span className="mr-2">{section.icon}</span>
              {section.label}
            </button>
          ))}
        </div>

        {/* 基础语法 */}
        {activeSection === 'basics' && (
          <div className="space-y-4">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Play className="w-5 h-5 text-purple-600" />
                变量声明
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-md font-mono text-sm font-semibold">val</div>
                  <div className="flex-1">
                    <p className="text-gray-700 mb-2">不可变变量（推荐）</p>
                    <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-sm">
{`val name = "Kotlin"
val age: Int = 25`}
                    </pre>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-md font-mono text-sm font-semibold">var</div>
                  <div className="flex-1">
                    <p className="text-gray-700 mb-2">可变变量</p>
                    <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-sm">
{`var count = 0
count = 10  // 可以修改`}
                    </pre>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">基本类型</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="font-mono text-sm text-purple-600 font-semibold mb-1">Int</div>
                  <code className="text-xs text-gray-600">val num = 42</code>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="font-mono text-sm text-purple-600 font-semibold mb-1">Double</div>
                  <code className="text-xs text-gray-600">val pi = 3.14</code>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="font-mono text-sm text-purple-600 font-semibold mb-1">String</div>
                  <code className="text-xs text-gray-600">val text = "Hello"</code>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="font-mono text-sm text-purple-600 font-semibold mb-1">Boolean</div>
                  <code className="text-xs text-gray-600">val flag = true</code>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">字符串模板</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm">
{`val name = "Kotlin"
val version = 1.9

println("Hello, $name!")
println("Version: \${version + 0.1}")`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">条件判断</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-2">if 表达式</p>
                  <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-sm">
{`val max = if (a > b) a else b`}
                  </pre>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">when 表达式（替代 switch）</p>
                  <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-sm">
{`when (x) {
    1 -> println("One")
    2 -> println("Two")
    in 3..10 -> println("3 to 10")
    else -> println("Other")
}`}
                  </pre>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">循环</h3>
              <div className="space-y-3">
                <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-sm">
{`// for 循环
for (i in 1..5) {
    println(i)
}

// 遍历集合
val items = listOf("A", "B", "C")
for (item in items) {
    println(item)
}`}
                </pre>
              </div>
            </Card>
          </div>
        )}

        {/* 函数 */}
        {activeSection === 'functions' && (
          <div className="space-y-4">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">函数定义</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-2">基本函数</p>
                  <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-sm">
{`fun greet(name: String): String {
    return "Hello, $name!"
}

// 单表达式函数
fun add(a: Int, b: Int) = a + b`}
                  </pre>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">默认参数 & 命名参数</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm">
{`fun greet(name: String = "Guest", age: Int = 0) {
    println("Hello $name, age $age")
}

greet()                    // Hello Guest, age 0
greet("Tom")               // Hello Tom, age 0
greet(age = 25, name = "Tom")  // 命名参数`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Lambda 表达式</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm">
{`// Lambda 语法
val sum = { a: Int, b: Int -> a + b }
println(sum(3, 5))  // 8

// 高阶函数
fun calculate(x: Int, y: Int, operation: (Int, Int) -> Int): Int {
    return operation(x, y)
}

val result = calculate(10, 5) { a, b -> a * b }  // 50`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">扩展函数</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm">
{`// 为现有类添加新方法
fun String.lastChar(): Char = this[this.length - 1]

println("Kotlin".lastChar())  // n

fun Int.isEven() = this % 2 == 0
println(4.isEven())  // true`}
              </pre>
            </Card>
          </div>
        )}

        {/* 类与对象 */}
        {activeSection === 'classes' && (
          <div className="space-y-4">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">类定义</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm">
{`// 简洁的类定义
class Person(val name: String, var age: Int)

val person = Person("Tom", 25)
println(person.name)  // Tom
person.age = 26       // 可以修改 var 属性`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">数据类</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm">
{`// 自动生成 equals, hashCode, toString, copy
data class User(val name: String, val age: Int)

val user1 = User("Alice", 30)
val user2 = user1.copy(age = 31)  // 复制并修改

println(user1)  // User(name=Alice, age=30)`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">空安全</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm">
{`// 可空类型
var name: String? = null

// 安全调用
println(name?.length)  // null

// Elvis 操作符
val length = name?.length ?: 0  // 如果为 null 返回 0

// 非空断言（谨慎使用）
val len = name!!.length  // 如果为 null 会抛异常`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">对象声明（单例）</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm">
{`object DatabaseManager {
    fun connect() {
        println("Connected to database")
    }
}

DatabaseManager.connect()  // 直接使用`}
              </pre>
            </Card>
          </div>
        )}

        {/* 高级特性 */}
        {activeSection === 'advanced' && (
          <div className="space-y-4">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">集合操作</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm">
{`val numbers = listOf(1, 2, 3, 4, 5)

// 常用操作
val doubled = numbers.map { it * 2 }        // [2, 4, 6, 8, 10]
val evens = numbers.filter { it % 2 == 0 }  // [2, 4]
val sum = numbers.sum()                      // 15
val first = numbers.first()                  // 1`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">作用域函数</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm">
{`// let - 处理可空对象
val name: String? = "Kotlin"
name?.let {
    println(it.length)
}

// apply - 配置对象
val person = Person("Tom", 25).apply {
    age = 26
}

// also - 附加操作
val numbers = mutableListOf(1, 2, 3).also {
    println("Adding 4")
}.add(4)`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">密封类</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm">
{`sealed class Result
data class Success(val data: String) : Result()
data class Error(val message: String) : Result()
object Loading : Result()

fun handleResult(result: Result) = when (result) {
    is Success -> println(result.data)
    is Error -> println(result.message)
    Loading -> println("Loading...")
}`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">协程基础</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm">
{`import kotlinx.coroutines.*

fun main() = runBlocking {
    launch {
        delay(1000)
        println("World!")
    }
    println("Hello,")
}

// 挂起函数
suspend fun fetchData(): String {
    delay(1000)
    return "Data loaded"
}`}
              </pre>
            </Card>
          </div>
        )}

        {/* 学习资源 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mt-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">推荐资源</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="https://kotlinlang.org/docs/home.html"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-purple-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800 flex items-center gap-2">
                📚 Kotlin 官方文档
              </div>
              <div className="text-sm text-gray-600">最权威的学习资源</div>
            </a>
            <a
              href="https://play.kotlinlang.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-purple-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800 flex items-center gap-2">
                💻 Kotlin Playground
              </div>
              <div className="text-sm text-gray-600">在线练习 Kotlin 代码</div>
            </a>
            <a
              href="https://kotlinlang.org/docs/kotlin-tour-welcome.html"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-purple-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800 flex items-center gap-2">
                🎓 Kotlin Tour
              </div>
              <div className="text-sm text-gray-600">官方互动式教程</div>
            </a>
            <a
              href="https://developer.android.com/kotlin"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-purple-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800 flex items-center gap-2">
                🤖 Android Kotlin 指南
              </div>
              <div className="text-sm text-gray-600">Android 开发中的 Kotlin</div>
            </a>
            <a
              href="https://github.com/JetBrains/kotlin"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-purple-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800 flex items-center gap-2">
                🔧 Kotlin GitHub
              </div>
              <div className="text-sm text-gray-600">源码与示例项目</div>
            </a>
            <a
              href="https://kotlinlang.org/docs/koans.html"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-purple-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800 flex items-center gap-2">
                🥋 Kotlin Koans
              </div>
              <div className="text-sm text-gray-600">通过练习学习 Kotlin</div>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
