'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Palette, BookOpen, Code2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function UILayerPage() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: 'UI 层概览', icon: '🌈' },
    { id: 'xml', label: 'XML Layout', icon: '📄' },
    { id: 'compose', label: 'Jetpack Compose', icon: '🎨' },
    { id: 'material', label: 'Material Design', icon: '✨' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-4 sm:p-6">
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg mb-4">
            <Palette className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            Android UI 层
          </h1>
          <p className="text-gray-600">
            XML Layout ←→ Jetpack Compose ←→ Material Design
          </p>
        </div>

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

        {activeSection === 'overview' && (
          <div className="space-y-4">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🌈 三者的本质区别</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-3 text-left font-semibold">名称</th>
                      <th className="p-3 text-left font-semibold">角色</th>
                      <th className="p-3 text-left font-semibold">定义</th>
                      <th className="p-3 text-left font-semibold">类比</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">XML Layout</td>
                      <td className="p-3">UI 描述方式</td>
                      <td className="p-3">用 XML 文件声明界面结构（老式命令式 UI）</td>
                      <td className="p-3 text-gray-600">用「HTML」写静态网页</td>
                    </tr>
                    <tr className="border-t bg-slate-50">
                      <td className="p-3 font-semibold">Jetpack Compose</td>
                      <td className="p-3">UI 框架</td>
                      <td className="p-3">用 Kotlin 代码声明式构建界面，取代 XML</td>
                      <td className="p-3 text-gray-600">用「React」写动态网页</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">Material Design</td>
                      <td className="p-3">设计规范 / 视觉体系</td>
                      <td className="p-3">Google 定义的交互与视觉风格，不是代码实现</td>
                      <td className="p-3 text-gray-600">UI 的"设计哲学"或"装修风格"</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🧩 三者之间的关系（层次结构）</h3>
              <div className="bg-slate-900 text-slate-100 p-6 rounded-lg font-mono text-sm whitespace-pre">
{`┌──────────────────────────────────────────┐
│             Material Design              │  ← 设计理念（样式/交互规范）
└──────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────┐
│  Jetpack Compose    ←→     XML Layout    │  ← 实现方式（UI 技术栈）
│ （声明式编程）         （命令式编程）     │
└──────────────────────────────────────────┘`}
              </div>
              <div className="mt-4 space-y-2 text-sm text-gray-700">
                <p><strong>✅ 解释：</strong></p>
                <ul className="ml-4 space-y-1">
                  <li>• <strong>Material Design：</strong>提供视觉、动效、组件规范，比如按钮、阴影、色板、圆角比例等</li>
                  <li>• <strong>Jetpack Compose 和 XML Layout：</strong>都是实现 Material Design 的手段</li>
                </ul>
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm">
                    <strong>🧠 类比：</strong><br/>
                    Material Design = 建筑设计图<br/>
                    XML Layout / Compose = 施工方式（用砖头砌 vs 用装配式模块）
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">⚙️ 三者的协作关系</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-3 text-left font-semibold">层级</th>
                      <th className="p-3 text-left font-semibold">代表技术</th>
                      <th className="p-3 text-left font-semibold">职责</th>
                      <th className="p-3 text-left font-semibold">关键特征</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">设计规范层</td>
                      <td className="p-3">Material Design 3</td>
                      <td className="p-3">统一视觉体系（颜色、动效、间距、组件规范）</td>
                      <td className="p-3 text-green-600">Google 官方持续迭代</td>
                    </tr>
                    <tr className="border-t bg-slate-50">
                      <td className="p-3 font-semibold">UI 实现层</td>
                      <td className="p-3">Jetpack Compose / XML</td>
                      <td className="p-3">按规范构建 UI 组件</td>
                      <td className="p-3 text-blue-600">Compose 已支持 Material3</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">数据驱动层</td>
                      <td className="p-3">ViewModel + State</td>
                      <td className="p-3">提供状态驱动 UI 更新</td>
                      <td className="p-3 text-purple-600">Compose 与 ViewModel 深度整合</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📱 2025 年生态现状</h3>
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">1️⃣ Jetpack Compose 已成为主流</h4>
                  <p className="text-sm text-gray-700 mb-2">Compose 现在是官方推荐的默认 UI 框架</p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>• 新项目几乎都采用 Compose</li>
                    <li>• Google 自家产品（Play Store、Settings、Gmail）也在迁移</li>
                    <li>• XML 依然可用，但仅用于兼容老项目</li>
                  </ul>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">2️⃣ Material Design 3（Material You）</h4>
                  <p className="text-sm text-gray-700 mb-2">成为统一视觉语言</p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>• 支持动态配色（Material You, Android 12+）</li>
                    <li>• Compose 提供完整的 Material3 组件库</li>
                    <li>• 官方推行 Material Theme Builder 工具</li>
                  </ul>
                </div>

                <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-2">3️⃣ XML Layout 正在逐步淡出</h4>
                  <p className="text-sm text-gray-700">大型老项目仍保留 XML + ViewBinding，但新项目强烈推荐 Compose</p>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">4️⃣ 跨平台趋势：Compose Multiplatform</h4>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>• Compose for Desktop / iOS / Web</li>
                    <li>• Compose for Wear OS / TV / Auto</li>
                    <li>• 统一 UI 技术栈（类似 Flutter）</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🧭 总结表</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-3 text-left font-semibold">名称</th>
                      <th className="p-3 text-left font-semibold">定位</th>
                      <th className="p-3 text-left font-semibold">职责</th>
                      <th className="p-3 text-left font-semibold">2025 年现状</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">XML Layout</td>
                      <td className="p-3">UI 声明方式</td>
                      <td className="p-3">用 XML 描述界面结构</td>
                      <td className="p-3 text-orange-600">逐步被 Compose 取代</td>
                    </tr>
                    <tr className="border-t bg-slate-50">
                      <td className="p-3 font-semibold">Jetpack Compose</td>
                      <td className="p-3">UI 框架</td>
                      <td className="p-3">用 Kotlin 声明 UI，响应状态变化</td>
                      <td className="p-3 text-green-600">官方主推，全平台扩展</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">Material Design</td>
                      <td className="p-3">设计规范</td>
                      <td className="p-3">定义视觉和交互标准</td>
                      <td className="p-3 text-blue-600">发展至 Material 3（Material You）</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeSection === 'xml' && (
          <div className="space-y-4">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📄 XML Layout</h3>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 mb-4">
                <h4 className="font-semibold text-orange-800 mb-2">定位</h4>
                <p className="text-sm text-gray-700">一种 UI 描述方式，用 XML 文件声明界面结构（老式命令式 UI）</p>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>类比：</strong>用「HTML」写静态网页
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">XML Layout 示例</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<!-- res/layout/activity_main.xml -->
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="16dp">
    
    <TextView
        android:id="@+id/titleText"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hello, Android!"
        android:textSize="24sp"
        android:textColor="@color/primary" />
    
    <Button
        android:id="@+id/actionButton"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Click Me"
        android:layout_marginTop="16dp" />
        
</LinearLayout>`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">在 Activity 中使用</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        // findViewById 方式（老式）
        val titleText = findViewById<TextView>(R.id.titleText)
        val button = findViewById<Button>(R.id.actionButton)
        
        button.setOnClickListener {
            titleText.text = "Button Clicked!"
        }
    }
}`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">ViewBinding（改进版）</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        // 类型安全的访问
        binding.actionButton.setOnClickListener {
            binding.titleText.text = "Button Clicked!"
        }
    }
}`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">XML Layout 的特点</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="font-semibold text-green-800 text-sm mb-2">✅ 优势</div>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• 可视化编辑器支持</li>
                    <li>• 成熟稳定，生态完善</li>
                    <li>• 大量第三方库支持</li>
                    <li>• 开发者熟悉度高</li>
                  </ul>
                </div>
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="font-semibold text-red-800 text-sm mb-2">❌ 劣势</div>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• 命令式编程，代码冗长</li>
                    <li>• 需要手动刷新 UI</li>
                    <li>• XML 和 Kotlin 分离</li>
                    <li>• 动画实现复杂</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeSection === 'compose' && (
          <div className="space-y-4">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🎨 Jetpack Compose</h3>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                <h4 className="font-semibold text-blue-800 mb-2">定位</h4>
                <p className="text-sm text-gray-700">一种 UI 框架，用 Kotlin 代码声明式构建界面，取代 XML</p>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>类比：</strong>用「React」写动态网页
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🔸 Compose 的优势</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• <strong>纯 Kotlin，无需 XML</strong></li>
                <li>• <strong>与 ViewModel、Flow、State 深度集成</strong></li>
                <li>• <strong>动画、主题、导航、可访问性、测试都有 Compose 版本</strong></li>
                <li>• <strong>支持多平台（Compose Multiplatform）</strong></li>
              </ul>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📘 Compose 基础示例</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`@Composable
fun Greeting(name: String) {
    Text(
        text = "Hello, $name!",
        style = MaterialTheme.typography.headlineMedium,
        color = MaterialTheme.colorScheme.primary
    )
}

@Preview
@Composable
fun GreetingPreview() {
    Greeting("Android")
}`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">状态管理示例</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Count: $count",
            style = MaterialTheme.typography.headlineLarge
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        Button(onClick = { count++ }) {
            Text("Increment")
        }
    }
}`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">与 ViewModel 集成</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`@Composable
fun UserScreen(viewModel: UserViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsState()
    
    when {
        uiState.loading -> {
            CircularProgressIndicator()
        }
        uiState.error != null -> {
            ErrorMessage(uiState.error)
        }
        uiState.user != null -> {
            UserCard(uiState.user)
        }
    }
}

@Composable
fun UserCard(user: User) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = user.name,
                style = MaterialTheme.typography.titleLarge
            )
            Text(
                text = user.email,
                style = MaterialTheme.typography.bodyMedium
            )
        }
    }
}`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">XML vs Compose 对比</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-3 text-left font-semibold">对比项</th>
                      <th className="p-3 text-left font-semibold">XML Layout</th>
                      <th className="p-3 text-left font-semibold">Jetpack Compose</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">编程范式</td>
                      <td className="p-3">命令式</td>
                      <td className="p-3 text-green-600">声明式</td>
                    </tr>
                    <tr className="border-t bg-slate-50">
                      <td className="p-3 font-semibold">语言</td>
                      <td className="p-3">XML + Java/Kotlin</td>
                      <td className="p-3 text-green-600">全 Kotlin</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">状态管理</td>
                      <td className="p-3">手动刷新 UI</td>
                      <td className="p-3 text-green-600">自动响应 State</td>
                    </tr>
                    <tr className="border-t bg-slate-50">
                      <td className="p-3 font-semibold">性能</td>
                      <td className="p-3">View Hierarchy 较重</td>
                      <td className="p-3 text-green-600">高效 Recomposition</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">动画</td>
                      <td className="p-3">复杂</td>
                      <td className="p-3 text-green-600">简单（内置 API）</td>
                    </tr>
                    <tr className="border-t bg-slate-50">
                      <td className="p-3 font-semibold">官方支持</td>
                      <td className="p-3 text-orange-600">维护但不推荐新项目</td>
                      <td className="p-3 text-green-600">强烈推荐</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeSection === 'material' && (
          <div className="space-y-4">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">✨ Material Design</h3>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-4">
                <h4 className="font-semibold text-purple-800 mb-2">定位</h4>
                <p className="text-sm text-gray-700">一种设计规范 / 视觉体系，Google 定义的交互与视觉风格</p>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>类比：</strong>UI 的"设计哲学"或"装修风格"
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Material Design 3（Material You）</h3>
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">核心特性</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• <strong>动态配色：</strong>Material You（Android 12+），根据壁纸自动生成主题色</li>
                    <li>• <strong>组件库：</strong>Compose 提供完整的 Material3 组件库（material3）</li>
                    <li>• <strong>主题工具：</strong>Material Theme Builder 自动生成主题色板</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Material3 在 Compose 中的使用</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`import androidx.compose.material3.*

@Composable
fun MyApp() {
    MaterialTheme(
        colorScheme = dynamicColorScheme(LocalContext.current),
        typography = Typography,
        content = {
            Scaffold(
                topBar = {
                    TopAppBar(
                        title = { Text("My App") },
                        colors = TopAppBarDefaults.topAppBarColors(
                            containerColor = MaterialTheme.colorScheme.primaryContainer
                        )
                    )
                }
            ) { paddingValues ->
                Column(
                    modifier = Modifier
                        .padding(paddingValues)
                        .padding(16.dp)
                ) {
                    Button(onClick = { /* ... */ }) {
                        Text("Material 3 Button")
                    }
                    
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 16.dp)
                    ) {
                        Text(
                            text = "Material 3 Card",
                            modifier = Modifier.padding(16.dp)
                        )
                    }
                }
            }
        }
    )
}`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Material Design 核心组件</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">基础组件</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Button / IconButton</li>
                    <li>• Card / Surface</li>
                    <li>• TextField / OutlinedTextField</li>
                    <li>• Checkbox / Switch / RadioButton</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">布局组件</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Scaffold / TopAppBar</li>
                    <li>• NavigationBar / NavigationRail</li>
                    <li>• ModalDrawer / BottomSheet</li>
                    <li>• Snackbar / Dialog</li>
                  </ul>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">列表组件</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• LazyColumn / LazyRow</li>
                    <li>• LazyVerticalGrid</li>
                    <li>• ListItem</li>
                  </ul>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-2">其他组件</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• FloatingActionButton</li>
                    <li>• Chip / Badge</li>
                    <li>• ProgressIndicator</li>
                    <li>• Slider / RangeSlider</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Material Design 色彩系统</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`// Material 3 色彩角色
MaterialTheme.colorScheme.primary          // 主色
MaterialTheme.colorScheme.onPrimary        // 主色上的文字
MaterialTheme.colorScheme.primaryContainer // 主色容器
MaterialTheme.colorScheme.secondary        // 次要色
MaterialTheme.colorScheme.tertiary         // 第三色
MaterialTheme.colorScheme.surface          // 表面色
MaterialTheme.colorScheme.background       // 背景色
MaterialTheme.colorScheme.error            // 错误色

// 使用示例
Button(
    colors = ButtonDefaults.buttonColors(
        containerColor = MaterialTheme.colorScheme.primary,
        contentColor = MaterialTheme.colorScheme.onPrimary
    )
) {
    Text("Primary Button")
}`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Material Design 排版系统</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`// Material 3 排版角色
MaterialTheme.typography.displayLarge      // 超大标题
MaterialTheme.typography.displayMedium
MaterialTheme.typography.displaySmall
MaterialTheme.typography.headlineLarge     // 大标题
MaterialTheme.typography.headlineMedium
MaterialTheme.typography.headlineSmall
MaterialTheme.typography.titleLarge        // 标题
MaterialTheme.typography.titleMedium
MaterialTheme.typography.titleSmall
MaterialTheme.typography.bodyLarge         // 正文
MaterialTheme.typography.bodyMedium
MaterialTheme.typography.bodySmall
MaterialTheme.typography.labelLarge        // 标签
MaterialTheme.typography.labelMedium
MaterialTheme.typography.labelSmall

// 使用示例
Text(
    text = "Headline",
    style = MaterialTheme.typography.headlineLarge
)`}
              </pre>
            </Card>
          </div>
        )}

        <Card className="p-6 bg-white/80 backdrop-blur-sm mt-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">推荐资源</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="https://developer.android.com/jetpack/compose"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-white border border-gray-200 hover:border-purple-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800">🎨 Jetpack Compose 官方文档</div>
              <div className="text-sm text-gray-600">完整的 Compose 学习资源</div>
            </a>
            <a
              href="https://m3.material.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-white border border-gray-200 hover:border-purple-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800">✨ Material Design 3</div>
              <div className="text-sm text-gray-600">Material You 设计规范</div>
            </a>
            <a
              href="https://developer.android.com/courses/pathways/compose"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-white border border-gray-200 hover:border-purple-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800">📚 Compose 学习路径</div>
              <div className="text-sm text-gray-600">官方系统化课程</div>
            </a>
            <a
              href="https://material-foundation.github.io/material-theme-builder/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-white border border-gray-200 hover:border-purple-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800">🎨 Material Theme Builder</div>
              <div className="text-sm text-gray-600">自动生成主题色板工具</div>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
