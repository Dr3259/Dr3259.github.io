'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Layers, BookOpen, Network, Database, Cpu, Eye } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ArchitectureLayerPage() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: '架构概览', icon: '🏗️' },
    { id: 'view', label: 'Activity/Fragment', icon: '👁️' },
    { id: 'viewmodel', label: 'ViewModel', icon: '🧠' },
    { id: 'repository', label: 'Repository', icon: '📦' },
    { id: 'datasource', label: 'DataSource', icon: '💾' },
  ];

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

        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <Layers className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            Android 架构层
          </h1>
          <p className="text-gray-600">
            现代 Android 应用的核心分层架构：MVVM + Repository 模式
          </p>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                activeSection === section.id
                  ? 'bg-blue-600 text-white shadow-md'
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
              <h3 className="text-xl font-bold text-gray-800 mb-4">架构分层结构</h3>
              <div className="bg-slate-900 text-slate-100 p-6 rounded-lg font-mono text-sm whitespace-pre">
{`┌───────────────────────────────┐
│   Activity / Fragment / UI    │ ← View 层
└──────────────┬────────────────┘
               │ 观察
               ▼
┌───────────────────────────────┐
│          ViewModel            │ ← 业务逻辑层
└──────────────┬────────────────┘
               │ 请求
               ▼
┌───────────────────────────────┐
│          Repository           │ ← 数据层
└──────────────┬────────────────┘
               │ 访问
               ▼
┌───────────────────────────────┐
│  Network / Database / Cache   │ ← 数据源
└───────────────────────────────┘`}
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">⚙️ 关系链总结</h3>
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-3 text-left font-semibold">上层</th>
                      <th className="p-3 text-left font-semibold">调用</th>
                      <th className="p-3 text-left font-semibold">下层</th>
                      <th className="p-3 text-left font-semibold">通信方式</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-3">Activity / Fragment</td>
                      <td className="p-3 text-purple-600 font-semibold">观察</td>
                      <td className="p-3">ViewModel</td>
                      <td className="p-3 font-mono text-xs">LiveData / StateFlow</td>
                    </tr>
                    <tr className="border-t bg-slate-50">
                      <td className="p-3">ViewModel</td>
                      <td className="p-3 text-blue-600 font-semibold">请求</td>
                      <td className="p-3">Repository</td>
                      <td className="p-3 font-mono text-xs">函数调用（挂起函数、Flow）</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3">Repository</td>
                      <td className="p-3 text-green-600 font-semibold">访问</td>
                      <td className="p-3">数据源</td>
                      <td className="p-3 font-mono text-xs">Retrofit / Room / Cache</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📊 现代 Android 架构现状（2025 年）</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">✅ 官方推荐架构：MVVM + Jetpack + Kotlin</h4>
                  <p className="text-sm text-gray-700 mb-2">Android 官方 Architecture Guidelines 明确推荐：</p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>• <strong>View 层：</strong>Activity / Fragment / Compose UI</li>
                    <li>• <strong>ViewModel 层：</strong>AndroidX.lifecycle.ViewModel</li>
                    <li>• <strong>Repository 层：</strong>手动实现 + Hilt 注入依赖</li>
                    <li>• <strong>Data 层：</strong>Room（本地数据库） + Retrofit / OkHttp（网络）</li>
                  </ul>
                  <div className="mt-3 p-2 bg-white rounded text-xs text-gray-600">
                    👉 官方文档里直接画出的标准架构：<strong>View → ViewModel → Repository → DataSource</strong>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">💡 依赖注入（DI）已经标准化</h4>
                  <p className="text-sm text-gray-700 mb-2">以前用 Dagger → 现在多数项目用 <strong>Hilt</strong></p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>• @HiltViewModel 注入 Repository</li>
                    <li>• 提高了架构层之间的可维护性和解耦度</li>
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
                      <th className="p-3 text-left font-semibold">层级</th>
                      <th className="p-3 text-left font-semibold">职责</th>
                      <th className="p-3 text-left font-semibold">依赖方向</th>
                      <th className="p-3 text-left font-semibold">现状趋势</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">Activity / Fragment</td>
                      <td className="p-3">展示 UI、监听 ViewModel</td>
                      <td className="p-3">向下依赖 ViewModel</td>
                      <td className="p-3 text-orange-600">被 Compose 替代</td>
                    </tr>
                    <tr className="border-t bg-slate-50">
                      <td className="p-3 font-semibold">ViewModel</td>
                      <td className="p-3">管理状态、执行业务逻辑</td>
                      <td className="p-3">向下依赖 Repository</td>
                      <td className="p-3 text-green-600">深度整合 Flow & State</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">Repository</td>
                      <td className="p-3">管理数据源、封装数据逻辑</td>
                      <td className="p-3">向下依赖 API / DB</td>
                      <td className="p-3 text-blue-600">与 UseCase 分离趋势</td>
                    </tr>
                    <tr className="border-t bg-slate-50">
                      <td className="p-3 font-semibold">DataSource</td>
                      <td className="p-3">实际提供数据</td>
                      <td className="p-3">无</td>
                      <td className="p-3 text-purple-600">Room、Retrofit、DataStore 成主流</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">各层职责与关系</h3>
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-purple-800">View 层</h4>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>职责：</strong>展示 UI、响应用户交互
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>类比：</strong>前台服务员，只负责"上菜"和"接单"
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-800">ViewModel 层</h4>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>职责：</strong>管理 UI 状态、处理业务逻辑
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>类比：</strong>副厨师长，决定去哪拿菜
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-green-800">Repository 层</h4>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>职责：</strong>统一管理所有数据来源
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>类比：</strong>仓库管理员，负责调度原料
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Network className="w-5 h-5 text-amber-600" />
                    <h4 className="font-semibold text-amber-800">DataSource 层</h4>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>职责：</strong>提供实际数据访问能力
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>类比：</strong>厨房或仓库，原始数据来源
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeSection === 'view' && (
          <div className="space-y-4">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">1️⃣ Activity / Fragment</h3>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-4">
                <h4 className="font-semibold text-purple-800 mb-2">核心职责</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• 展示 UI、响应用户交互</li>
                  <li>• 不做业务逻辑和数据操作，只负责显示</li>
                  <li>• 是整个架构的最上层（View 层），依赖 ViewModel</li>
                </ul>
                <p className="text-sm text-gray-600 mt-3">
                  <strong>🧠 类比：</strong>前台服务员，只负责"上菜"和"接单"，不下厨房
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Activity 示例</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`class UserActivity : AppCompatActivity() {
    private val viewModel: UserViewModel by viewModels()
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user)
        
        // 观察 ViewModel 的状态
        viewModel.uiState.observe(this) { state ->
            when {
                state.loading -> showLoading()
                state.error != null -> showError(state.error)
                state.user != null -> showUser(state.user)
            }
        }
        
        // 用户点击按钮
        findViewById<Button>(R.id.loadButton).setOnClickListener {
            viewModel.loadUser()
        }
    }
}`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🔥 Fragment 正在被 Compose 替代</h3>
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-3 text-left font-semibold">对比项</th>
                      <th className="p-3 text-left font-semibold">Fragment</th>
                      <th className="p-3 text-left font-semibold">Compose</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">状态管理</td>
                      <td className="p-3">手动（ViewModel + LiveData）</td>
                      <td className="p-3 text-green-600">声明式（State + Compose）</td>
                    </tr>
                    <tr className="border-t bg-slate-50">
                      <td className="p-3 font-semibold">视图更新</td>
                      <td className="p-3">XML + findViewById / Binding</td>
                      <td className="p-3 text-green-600">Kotlin 代码中直接构建</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">生命周期</td>
                      <td className="p-3">复杂</td>
                      <td className="p-3 text-green-600">简化（Composable 自动感知）</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700">
                  🔸 Compose 与 ViewModel 深度集成，很多项目甚至去掉 Fragment，只保留单 Activity + Compose
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Compose 示例</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`@Composable
fun UserScreen(viewModel: UserViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsState()
    
    when {
        uiState.loading -> LoadingIndicator()
        uiState.error != null -> ErrorMessage(uiState.error)
        uiState.user != null -> UserCard(uiState.user)
    }
}`}
              </pre>
            </Card>
          </div>
        )}

        {activeSection === 'viewmodel' && (
          <div className="space-y-4">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">2️⃣ ViewModel</h3>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                <h4 className="font-semibold text-blue-800 mb-2">核心职责</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• 管理 UI 状态（UI State）</li>
                  <li>• 处理业务逻辑</li>
                  <li>• 调用 Repository 获取数据</li>
                  <li>• 暴露 LiveData/StateFlow 给 UI 层观察</li>
                </ul>
                <div className="mt-3 text-sm text-gray-700">
                  <strong>关系：</strong>
                  <div className="ml-4 mt-1">
                    <div>• 上层：被 Activity/Fragment 观察</div>
                    <div>• 下层：依赖 Repository</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  <strong>🧠 类比：</strong>副厨师长，接到订单后决定去哪拿菜（数据库、网络），拿好菜后通知前台上菜
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🔄 ViewModel 的边界更清晰</h3>
              <ul className="space-y-2 text-sm text-gray-700 mb-4">
                <li>• ViewModel 不应直接引用 Context（除非 AndroidViewModel）</li>
                <li>• 倾向于使用 UIState 模型化（单向数据流）</li>
                <li>• 与协程（viewModelScope）和 Flow 深度结合</li>
              </ul>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📘 现代推荐：StateFlow + UIState</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`// 定义 UI 状态数据类
data class UiState(val loading: Boolean, val user: User?)

@HiltViewModel
class UserViewModel @Inject constructor(
    private val repo: UserRepository
) : ViewModel() {
    private val _state = MutableStateFlow(UiState(false, null))
    val state = _state.asStateFlow()
    
    fun loadUser() {
        viewModelScope.launch {
            _state.value = UiState(true, null)
            val user = repo.getUser()
            _state.value = UiState(false, user)
        }
    }
}`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">最佳实践</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="font-semibold text-green-800 text-sm mb-2">✅ 推荐做法</div>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• 使用 StateFlow 而不是 LiveData</li>
                    <li>• 使用 UIState 数据类统一管理状态</li>
                    <li>• 使用 viewModelScope 管理协程</li>
                    <li>• 通过 Hilt 注入依赖</li>
                    <li>• 单向数据流</li>
                  </ul>
                </div>
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="font-semibold text-red-800 text-sm mb-2">❌ 避免做法</div>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• 不要引用 View 或 Context</li>
                    <li>• 不要直接访问数据库或网络</li>
                    <li>• 不要处理 UI 逻辑（如导航）</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeSection === 'repository' && (
          <div className="space-y-4">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">3️⃣ Repository</h3>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                <h4 className="font-semibold text-green-800 mb-2">核心职责</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• 管理和统一所有数据来源</li>
                  <li>• 屏蔽底层数据获取的细节（UI 不需要关心是 API 还是本地数据库）</li>
                  <li>• 对外提供统一的接口（suspend 函数 / Flow）</li>
                </ul>
                <div className="mt-3 text-sm text-gray-700">
                  <strong>关系：</strong>
                  <div className="ml-4 mt-1">
                    <div>• 被 ViewModel 调用</div>
                    <div>• 自己依赖各种数据源（DAO、API 等）</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  <strong>🧠 类比：</strong>仓库管理员，知道所有原材料在哪（冷库/供应商），负责调度拿原料
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">基础 Repository 示例</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`class UserRepository @Inject constructor(
    private val remoteDataSource: UserRemoteDataSource,
    private val localDataSource: UserLocalDataSource
) {
    // 先本地，再网络
    suspend fun getUser(userId: String): Result<User> {
        return try {
            // 先尝试从本地获取
            val localUser = localDataSource.getUser(userId)
            if (localUser != null) {
                return Result.success(localUser)
            }
            
            // 本地没有，从网络获取
            val remoteUser = remoteDataSource.getUser(userId)
            
            // 保存到本地
            localDataSource.saveUser(remoteUser)
            
            Result.success(remoteUser)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🧱 Repository 越来越像「Use Case 层」</h3>
              <p className="text-sm text-gray-700 mb-3">
                在更现代的架构（Clean Architecture / MVI）中：
              </p>
              <ul className="space-y-1 text-sm text-gray-700 mb-4">
                <li>• Repository 专注数据访问</li>
                <li>• 中间增加一层 UseCase / Interactor 来封装业务逻辑</li>
              </ul>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-4">
                <p className="text-sm text-gray-700">
                  👉 实际结构：<strong>View → ViewModel → UseCase → Repository → DataSource</strong>
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  这种结构在大型项目中很常见（如 Jetpack 官方 samples）
                </p>
              </div>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`// Repository 专注数据访问
class UserRepository @Inject constructor(
    private val api: UserApi,
    private val dao: UserDao
) {
    suspend fun getUser(userId: String) = api.getUser(userId)
    suspend fun saveUser(user: User) = dao.insertUser(user)
}

// UseCase 封装业务逻辑
class GetUserUseCase @Inject constructor(
    private val repository: UserRepository
) {
    suspend operator fun invoke(userId: String): Result<User> {
        return try {
            val user = repository.getUser(userId)
            repository.saveUser(user)
            Result.success(user)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}`}
              </pre>
            </Card>
          </div>
        )}

        {activeSection === 'datasource' && (
          <div className="space-y-4">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">4️⃣ DataSource（API / DB / Cache）</h3>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-4">
                <h4 className="font-semibold text-amber-800 mb-2">核心职责</h4>
                <p className="text-sm text-gray-700 mb-2">提供实际数据访问能力。比如：</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• <strong>RemoteDataSource</strong> → Retrofit 请求后端 API</li>
                  <li>• <strong>LocalDataSource</strong> → Room 数据库</li>
                  <li>• <strong>CacheDataSource</strong> → 内存或磁盘缓存</li>
                </ul>
                <p className="text-sm text-gray-600 mt-3">
                  <strong>🧠 类比：</strong>厨房或仓库，是原始数据的真正来源
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">RemoteDataSource（网络）</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`// Retrofit API 接口
interface UserApi {
    @GET("users/{id}")
    suspend fun getUser(@Path("id") userId: String): User
    
    @POST("users")
    suspend fun createUser(@Body user: User): User
}

// RemoteDataSource 封装
class UserRemoteDataSource @Inject constructor(
    private val api: UserApi
) {
    suspend fun getUser(userId: String): User {
        return api.getUser(userId)
    }
}`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">LocalDataSource（数据库）</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`// Room Entity
@Entity(tableName = "users")
data class UserEntity(
    @PrimaryKey val id: String,
    val name: String,
    val email: String
)

// Room DAO
@Dao
interface UserDao {
    @Query("SELECT * FROM users WHERE id = :userId")
    suspend fun getUser(userId: String): UserEntity?
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertUser(user: UserEntity)
}

// LocalDataSource 封装
class UserLocalDataSource @Inject constructor(
    private val dao: UserDao
) {
    suspend fun getUser(userId: String): User? {
        return dao.getUser(userId)?.toUser()
    }
    
    suspend fun saveUser(user: User) {
        dao.insertUser(user.toEntity())
    }
}`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">主流技术栈（2025 年）</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">网络请求</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Retrofit</li>
                    <li>• OkHttp</li>
                    <li>• Ktor Client</li>
                  </ul>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">本地数据库</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Room</li>
                    <li>• SQLDelight</li>
                    <li>• Realm</li>
                  </ul>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">缓存存储</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• DataStore</li>
                    <li>• SharedPreferences</li>
                    <li>• 内存缓存</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}

        <Card className="p-6 bg-white/80 backdrop-blur-sm mt-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">推荐资源</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="https://developer.android.com/topic/architecture"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-white border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800">📚 Android 架构指南</div>
              <div className="text-sm text-gray-600">官方架构最佳实践</div>
            </a>
            <a
              href="https://github.com/android/architecture-samples"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-white border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800">💻 Architecture Samples</div>
              <div className="text-sm text-gray-600">官方示例项目</div>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}

