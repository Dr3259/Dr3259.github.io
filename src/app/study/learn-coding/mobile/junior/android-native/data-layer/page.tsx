'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Database, BookOpen, Waves, Eye } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function DataLayerPage() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: '数据层概览', icon: '🌊' },
    { id: 'room', label: 'Room', icon: '💾' },
    { id: 'livedata', label: 'LiveData', icon: '👁️' },
    { id: 'flow', label: 'Flow', icon: '🌊' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-50 p-4 sm:p-6">
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl shadow-lg mb-4">
            <Database className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            Android 数据层
          </h1>
          <p className="text-gray-600">
            Room / LiveData / Flow：数据存储与响应式数据流
          </p>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                activeSection === section.id
                  ? 'bg-teal-600 text-white shadow-md'
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
              <h3 className="text-xl font-bold text-gray-800 mb-4">🌊 三者的定位与职责</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-3 text-left font-semibold">名称</th>
                      <th className="p-3 text-left font-semibold">所在层</th>
                      <th className="p-3 text-left font-semibold">职责</th>
                      <th className="p-3 text-left font-semibold">本质类型</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">Room</td>
                      <td className="p-3">数据层（Storage）</td>
                      <td className="p-3">ORM（对象关系映射），访问 SQLite</td>
                      <td className="p-3 text-blue-600">数据访问库</td>
                    </tr>
                    <tr className="border-t bg-slate-50">
                      <td className="p-3 font-semibold">LiveData</td>
                      <td className="p-3">ViewModel 与 UI 之间</td>
                      <td className="p-3">生命周期感知的可观察数据容器</td>
                      <td className="p-3 text-green-600">UI 层数据桥梁</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">Flow</td>
                      <td className="p-3">数据层 / ViewModel 层</td>
                      <td className="p-3">异步数据流（基于 Kotlin 协程）</td>
                      <td className="p-3 text-purple-600">响应式数据流</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700">
                  <strong>核心理解：</strong>Room → 数据存储 | LiveData → UI 可观察数据容器 | Flow → 现代化的响应式数据流
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🧩 三者之间的关系图</h3>
              <div className="bg-slate-900 text-slate-100 p-6 rounded-lg font-mono text-sm whitespace-pre">
{`┌───────────────────────────────┐
│  UI 层 (Activity / Compose)   │
│     ↑         ↑               │
│  观察 LiveData 或 Flow         │
└─────┬─────────┬───────────────┘
      │         │
      ▼         ▼
┌───────────────────────────────┐
│         ViewModel             │
│   LiveData ← collect Flow     │
└─────┬─────────────────────────┘
      │
      ▼
┌───────────────────────────────┐
│          Repository            │
│  suspend / Flow 调用 Room      │
└─────┬─────────────────────────┘
      │
      ▼
┌───────────────────────────────┐
│            Room               │
│   @Query 返回 Flow / LiveData │
└───────────────────────────────┘`}
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">⚙️ 关系详解</h3>
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">1️⃣ Room → LiveData</h4>
                  <p className="text-sm text-gray-700 mb-2">早期版本中，Room 直接支持返回 LiveData</p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>• Room 自动在数据库变更时通知 LiveData 更新</li>
                    <li>• <strong>好处：</strong>UI 观察 LiveData 时自动刷新界面</li>
                    <li>• <strong>局限：</strong>只能在主线程感知；不支持背压控制；不易组合流</li>
                  </ul>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">2️⃣ Room → Flow</h4>
                  <p className="text-sm text-gray-700 mb-2">自 Room 2.2+ 起，官方推荐使用 Flow</p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>• Room 会在数据库表变化时自动 emit 新数据</li>
                    <li>• 可与 Kotlin 协程完美结合</li>
                    <li>• 可在 Repository 层进行变换、过滤、合并等操作</li>
                  </ul>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">3️⃣ Flow → LiveData</h4>
                  <p className="text-sm text-gray-700 mb-2">ViewModel 通常把 Flow 转为 LiveData 暴露给旧的 UI</p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>• asLiveData() 是官方扩展函数</li>
                    <li>• 便于过渡旧项目（Fragment + XML）</li>
                    <li>• 在 Compose 里则直接使用 Flow，无需转换</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🔁 三者的演化关系（历史→现状）</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-3 text-left font-semibold">阶段</th>
                      <th className="p-3 text-left font-semibold">主流技术</th>
                      <th className="p-3 text-left font-semibold">数据监听方式</th>
                      <th className="p-3 text-left font-semibold">特点</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">过去 (2017~2020)</td>
                      <td className="p-3">Room + LiveData</td>
                      <td className="p-3">生命周期感知，但非协程</td>
                      <td className="p-3 text-gray-600">简单但笨重</td>
                    </tr>
                    <tr className="border-t bg-slate-50">
                      <td className="p-3 font-semibold">过渡期 (2020~2022)</td>
                      <td className="p-3">Room + Flow + LiveData</td>
                      <td className="p-3">Room 支持 Flow，ViewModel 仍用 LiveData</td>
                      <td className="p-3 text-orange-600">双栈并存</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">现在 (2023~2025)</td>
                      <td className="p-3">Room + Flow + Compose</td>
                      <td className="p-3">全异步、响应式数据流</td>
                      <td className="p-3 text-green-600">官方推荐路线</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📈 2025 年生态现状</h3>
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">✅ 1. Flow 已成为主流标准</h4>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>• LiveData 基本被 Flow 替代</li>
                    <li>• Flow 支持：背压、数据变换、异常处理、多源合并</li>
                    <li>• Compose 原生支持 Flow.collectAsState()</li>
                  </ul>
                </div>

                <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-2">⚠️ 2. LiveData 仍在维护，但已是兼容层</h4>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>• 官方未弃用，但明确指出 Flow 是首选</li>
                    <li>• 主要用于老项目和 Fragment + XML 项目</li>
                  </ul>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">🧱 3. Room 成为核心数据访问入口</h4>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>• 支持 Kotlin 协程挂起函数</li>
                    <li>• 支持 Flow 观察</li>
                    <li>• 支持关系型查询（@Relation）</li>
                    <li>• 与 Paging 3（分页库）无缝结合</li>
                  </ul>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">🔄 4. 整体数据流趋势</h4>
                  <p className="text-sm text-gray-700 mb-2">现代架构（以 Jetpack Compose 为例）：</p>
                  <div className="bg-white p-3 rounded text-xs font-mono">
                    Room (Flow) → Repository (Flow) → ViewModel (Flow → State) → Compose (collectAsState)
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🧭 总结表</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-3 text-left font-semibold">组件</th>
                      <th className="p-3 text-left font-semibold">职责</th>
                      <th className="p-3 text-left font-semibold">所在层</th>
                      <th className="p-3 text-left font-semibold">现状（2025）</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">Room</td>
                      <td className="p-3">ORM 框架，访问 SQLite</td>
                      <td className="p-3">数据存储层</td>
                      <td className="p-3 text-green-600">持续主流，支持协程和 Flow</td>
                    </tr>
                    <tr className="border-t bg-slate-50">
                      <td className="p-3 font-semibold">LiveData</td>
                      <td className="p-3">可观察、生命周期感知容器</td>
                      <td className="p-3">ViewModel ↔ UI 层</td>
                      <td className="p-3 text-orange-600">兼容层，逐渐被 Flow 替代</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">Flow</td>
                      <td className="p-3">Kotlin 协程的数据流</td>
                      <td className="p-3">数据层 & 逻辑层</td>
                      <td className="p-3 text-green-600">官方推荐标准，Compose 原生支持</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeSection === 'room' && (
          <div className="space-y-4">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">💾 Room</h3>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                <h4 className="font-semibold text-blue-800 mb-2">定位</h4>
                <p className="text-sm text-gray-700">ORM（对象关系映射）框架，提供 SQLite 数据库的抽象层</p>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>核心优势：</strong>编译时验证 SQL、减少样板代码、支持协程和 Flow
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Room 三大组件</h3>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 text-sm mb-1">@Entity - 数据表</h4>
                  <p className="text-xs text-gray-600">定义数据库表结构</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 text-sm mb-1">@Dao - 数据访问对象</h4>
                  <p className="text-xs text-gray-600">定义数据库操作方法</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 text-sm mb-1">@Database - 数据库</h4>
                  <p className="text-xs text-gray-600">数据库持有者，包含所有 Entity 和 Dao</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">1. Entity 示例</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`@Entity(tableName = "users")
data class User(
    @PrimaryKey(autoGenerate = true)
    val id: Int = 0,
    
    @ColumnInfo(name = "user_name")
    val name: String,
    
    val email: String,
    
    @ColumnInfo(name = "created_at")
    val createdAt: Long = System.currentTimeMillis()
)`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">2. Dao 示例（支持 Flow）</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`@Dao
interface UserDao {
    // 返回 Flow，自动监听数据库变化
    @Query("SELECT * FROM users")
    fun getAllUsers(): Flow<List<User>>
    
    @Query("SELECT * FROM users WHERE id = :userId")
    fun getUserById(userId: Int): Flow<User?>
    
    // 挂起函数，用于写操作
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertUser(user: User)
    
    @Update
    suspend fun updateUser(user: User)
    
    @Delete
    suspend fun deleteUser(user: User)
    
    @Query("DELETE FROM users WHERE id = :userId")
    suspend fun deleteUserById(userId: Int)
}`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">3. Database 示例</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`@Database(
    entities = [User::class],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao
    
    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null
        
        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "app_database"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Room 高级特性</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 text-sm mb-2">关系查询（@Relation）</h4>
                  <pre className="bg-slate-900 text-slate-100 p-2 rounded text-xs overflow-x-auto">
{`data class UserWithPosts(
    @Embedded val user: User,
    @Relation(
        parentColumn = "id",
        entityColumn = "userId"
    )
    val posts: List<Post>
)`}
                  </pre>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 text-sm mb-2">数据库迁移</h4>
                  <pre className="bg-slate-900 text-slate-100 p-2 rounded text-xs overflow-x-auto">
{`val MIGRATION_1_2 = object : Migration(1, 2) {
    override fun migrate(database: SupportSQLiteDatabase) {
        database.execSQL("ALTER TABLE users ADD COLUMN age INTEGER")
    }
}`}
                  </pre>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeSection === 'livedata' && (
          <div className="space-y-4">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">👁️ LiveData</h3>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                <h4 className="font-semibold text-green-800 mb-2">定位</h4>
                <p className="text-sm text-gray-700">生命周期感知的可观察数据容器，连接 ViewModel 和 UI</p>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>核心特性：</strong>自动管理订阅、防止内存泄漏、只在活跃状态更新 UI
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">LiveData 基础用法</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`class UserViewModel(private val repository: UserRepository) : ViewModel() {
    // 私有可变 LiveData
    private val _users = MutableLiveData<List<User>>()
    
    // 公开不可变 LiveData
    val users: LiveData<List<User>> = _users
    
    fun loadUsers() {
        viewModelScope.launch {
            val userList = repository.getUsers()
            _users.value = userList
        }
    }
}

// Activity 中观察
class MainActivity : AppCompatActivity() {
    private val viewModel: UserViewModel by viewModels()
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        viewModel.users.observe(this) { users ->
            // UI 自动更新
            updateUI(users)
        }
    }
}`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">LiveData 转换操作</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`class UserViewModel : ViewModel() {
    private val _userId = MutableLiveData<Int>()
    
    // map 转换
    val userName: LiveData<String> = _userId.map { id ->
        "User #$id"
    }
    
    // switchMap 切换数据源
    val user: LiveData<User> = _userId.switchMap { id ->
        repository.getUserById(id)
    }
    
    // MediatorLiveData 合并多个源
    val combinedData = MediatorLiveData<String>().apply {
        addSource(source1) { value = it }
        addSource(source2) { value = it }
    }
}`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">LiveData 的优劣势</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="font-semibold text-green-800 text-sm mb-2">✅ 优势</div>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• 生命周期感知，自动取消订阅</li>
                    <li>• 防止内存泄漏</li>
                    <li>• 简单易用，学习曲线平缓</li>
                    <li>• 与 Room 无缝集成</li>
                  </ul>
                </div>
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="font-semibold text-red-800 text-sm mb-2">❌ 劣势</div>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• 只能在主线程观察</li>
                    <li>• 不支持背压控制</li>
                    <li>• 数据转换能力有限</li>
                    <li>• 不易组合多个数据流</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeSection === 'flow' && (
          <div className="space-y-4">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🌊 Flow</h3>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-4">
                <h4 className="font-semibold text-purple-800 mb-2">定位</h4>
                <p className="text-sm text-gray-700">基于 Kotlin 协程的异步数据流，现代 Android 开发的首选</p>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>核心优势：</strong>冷流、背压支持、丰富的操作符、完美的协程集成
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Flow 基础用法</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`// DAO 返回 Flow
@Dao
interface UserDao {
    @Query("SELECT * FROM users")
    fun getAllUsers(): Flow<List<User>>
}

// Repository 传递 Flow
class UserRepository(private val dao: UserDao) {
    fun getUsers(): Flow<List<User>> = dao.getAllUsers()
}

// ViewModel 处理 Flow
class UserViewModel(private val repo: UserRepository) : ViewModel() {
    val users: StateFlow<List<User>> = repo.getUsers()
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )
}

// Compose UI 收集 Flow
@Composable
fun UserList(viewModel: UserViewModel = hiltViewModel()) {
    val users by viewModel.users.collectAsState()
    
    LazyColumn {
        items(users) { user ->
            Text(user.name)
        }
    }
}`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Flow 操作符</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`repository.getAllUsers()
    .map { list -> list.filter { it.active } }  // 转换
    .filter { it.isNotEmpty() }                 // 过滤
    .debounce(300)                              // 防抖
    .distinctUntilChanged()                     // 去重
    .flowOn(Dispatchers.IO)                     // 切换线程
    .catch { e -> emit(emptyList()) }           // 异常处理
    .collect { users ->                         // 收集
        _uiState.value = users
    }`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Flow 合并操作</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`// combine - 合并多个 Flow
val combinedFlow = combine(
    flow1,
    flow2,
    flow3
) { a, b, c ->
    "$a $b $c"
}

// zip - 配对元素
val zippedFlow = flow1.zip(flow2) { a, b ->
    a to b
}

// flatMapLatest - 切换到最新的 Flow
val searchResults = searchQuery
    .debounce(300)
    .flatMapLatest { query ->
        repository.search(query)
    }`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">StateFlow vs SharedFlow</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">StateFlow</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 热流，始终有值</li>
                    <li>• 保存最新状态</li>
                    <li>• 适合 UI 状态管理</li>
                    <li>• 类似 LiveData</li>
                  </ul>
                  <pre className="bg-slate-900 text-slate-100 p-2 rounded text-xs mt-2 overflow-x-auto">
{`val _state = MutableStateFlow(0)
val state = _state.asStateFlow()`}
                  </pre>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">SharedFlow</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 热流，可能无初始值</li>
                    <li>• 支持多播</li>
                    <li>• 适合事件流</li>
                    <li>• 可配置缓存</li>
                  </ul>
                  <pre className="bg-slate-900 text-slate-100 p-2 rounded text-xs mt-2 overflow-x-auto">
{`val _events = MutableSharedFlow<Event>()
val events = _events.asSharedFlow()`}
                  </pre>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📘 完整示例：现代数据流</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`// DAO
@Dao
interface UserDao {
    @Query("SELECT * FROM user")
    fun getAll(): Flow<List<User>>
}

// Repository
class UserRepository(private val dao: UserDao) {
    fun getUsers() = dao.getAll()
}

// ViewModel
class UserViewModel(private val repo: UserRepository): ViewModel() {
    val users = repo.getUsers().stateIn(
        viewModelScope, 
        SharingStarted.Eagerly, 
        emptyList()
    )
}

// UI (Compose)
@Composable
fun UserList(viewModel: UserViewModel) {
    val users by viewModel.users.collectAsState()
    LazyColumn {
        items(users) { user -> 
            Text(user.name) 
        }
    }
}`}
              </pre>
            </Card>
          </div>
        )}

        <Card className="p-6 bg-white/80 backdrop-blur-sm mt-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-teal-600" />
            <h2 className="text-xl font-bold text-gray-800">推荐资源</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="https://developer.android.com/training/data-storage/room"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-white border border-gray-200 hover:border-teal-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800">💾 Room 官方文档</div>
              <div className="text-sm text-gray-600">完整的 Room 使用指南</div>
            </a>
            <a
              href="https://developer.android.com/kotlin/flow"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-white border border-gray-200 hover:border-teal-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800">🌊 Kotlin Flow 文档</div>
              <div className="text-sm text-gray-600">Flow 完整学习资源</div>
            </a>
            <a
              href="https://developer.android.com/topic/libraries/architecture/livedata"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-white border border-gray-200 hover:border-teal-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800">👁️ LiveData 文档</div>
              <div className="text-sm text-gray-600">LiveData 使用指南</div>
            </a>
            <a
              href="https://developer.android.com/codelabs/android-room-with-a-view-kotlin"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-white border border-gray-200 hover:border-teal-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800">🧪 Room Codelab</div>
              <div className="text-sm text-gray-600">实践教程</div>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
