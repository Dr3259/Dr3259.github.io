'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Zap, BookOpen, Clock, Settings } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function BackgroundLayerPage() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: '后台层概览', icon: '⚙️' },
    { id: 'coroutine', label: 'Coroutine', icon: '⚡' },
    { id: 'workmanager', label: 'WorkManager', icon: '🔄' },
    { id: 'practice', label: '最佳实践', icon: '🚀' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-fuchsia-50 p-4 sm:p-6">
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-2xl shadow-lg mb-4">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            Android 后台层
          </h1>
          <p className="text-gray-600">
            WorkManager / Coroutine：后台任务调度与执行
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
              <h3 className="text-xl font-bold text-gray-800 mb-4">🧩 两者的核心定位</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-3 text-left font-semibold">层级</th>
                      <th className="p-3 text-left font-semibold">名称</th>
                      <th className="p-3 text-left font-semibold">核心角色</th>
                      <th className="p-3 text-left font-semibold">工作场景</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-3 font-semibold text-purple-600">高层框架</td>
                      <td className="p-3 font-semibold">WorkManager</td>
                      <td className="p-3">后台任务调度框架（系统管理级）</td>
                      <td className="p-3">延迟任务、周期任务、后台持久任务</td>
                    </tr>
                    <tr className="border-t bg-slate-50">
                      <td className="p-3 font-semibold text-blue-600">底层并发机制</td>
                      <td className="p-3 font-semibold">Coroutine</td>
                      <td className="p-3">Kotlin 并发模型（协程）</td>
                      <td className="p-3">轻量线程、结构化并发、任务执行逻辑</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-fuchsia-50 rounded-lg border border-purple-200">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>✅ 简化理解：</strong>
                </p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>• <strong>WorkManager</strong> 负责「何时」与「在什么条件下」执行任务</li>
                  <li>• <strong>Coroutine</strong> 负责「任务内部怎么执行」</li>
                </ul>
                <div className="mt-3 p-2 bg-white rounded">
                  <p className="text-sm text-gray-600">
                    <strong>📦 类比：</strong>WorkManager 是"任务调度中心"，Coroutine 是"执行任务的工人"
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">⚙️ 两者协同工作流程</h3>
              <div className="bg-slate-900 text-slate-100 p-6 rounded-lg font-mono text-sm mb-4">
                <pre className="whitespace-pre">
{`WorkManager.enqueue(
    OneTimeWorkRequestBuilder<SyncWorker>().build()
)
 ↓
WorkManager 调度
 ↓
当条件满足（网络可用 / 设备充电中 / 延迟时间到）
 ↓
系统启动 Worker 实例
 ↓
Worker 的 doWork() 内部用 Coroutine 执行异步逻辑`}
                </pre>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-gray-700"><strong>🧠 这里：</strong></p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>• WorkManager 负责任务调度与重启</li>
                  <li>• CoroutineWorker 提供协程支持，使 doWork() 可挂起执行</li>
                  <li>• 协程在后台线程池中执行异步逻辑（网络、数据库等）</li>
                </ul>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🧠 职责分工</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-3 text-left font-semibold">组件</th>
                      <th className="p-3 text-left font-semibold">核心职责</th>
                      <th className="p-3 text-left font-semibold">生命周期控制</th>
                      <th className="p-3 text-left font-semibold">典型使用场景</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">Coroutine</td>
                      <td className="p-3">在内存中执行短期任务（轻量线程）</td>
                      <td className="p-3">与作用域绑定（ViewModel / Lifecycle）</td>
                      <td className="p-3">网络请求、数据库操作</td>
                    </tr>
                    <tr className="border-t bg-slate-50">
                      <td className="p-3 font-semibold">WorkManager</td>
                      <td className="p-3">系统级任务调度器，确保任务在设备重启后仍可执行</td>
                      <td className="p-3">独立于应用生命周期</td>
                      <td className="p-3">上传日志、同步数据、定期清理缓存</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🔁 常见组合方式</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-3 text-left font-semibold">模式</th>
                      <th className="p-3 text-left font-semibold">描述</th>
                      <th className="p-3 text-left font-semibold">示例</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">ViewModel + Coroutine</td>
                      <td className="p-3">界面层轻量异步任务</td>
                      <td className="p-3">刷新列表数据</td>
                    </tr>
                    <tr className="border-t bg-slate-50">
                      <td className="p-3 font-semibold">WorkManager + CoroutineWorker</td>
                      <td className="p-3">持久化后台任务</td>
                      <td className="p-3">上传崩溃日志、离线同步</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">WorkManager + Flow/LiveData</td>
                      <td className="p-3">状态上报</td>
                      <td className="p-3">任务进度展示</td>
                    </tr>
                    <tr className="border-t bg-slate-50">
                      <td className="p-3 font-semibold">Coroutine + Room/Retrofit</td>
                      <td className="p-3">数据访问、网络请求</td>
                      <td className="p-3">Repository 内部异步调用</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🧭 架构层关系图（现代标准）</h3>
              <div className="bg-slate-900 text-slate-100 p-6 rounded-lg font-mono text-sm whitespace-pre">
{`UI 层 (Activity / Fragment / Compose)
   ↓
ViewModel (使用 CoroutineScope)
   ↓
Repository (调用 Retrofit / Room)
   ↓
WorkManager (长期任务调度)
   ↓
CoroutineWorker (挂起任务执行)`}
              </div>
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700">
                  👉 所以 <strong>Coroutine 无处不在</strong>，它是一种执行机制；<br/>
                  而 <strong>WorkManager 是调度与存活机制</strong>。
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📊 生态现状（截至 2025）</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-3 text-left font-semibold">框架</th>
                      <th className="p-3 text-left font-semibold">维护状态</th>
                      <th className="p-3 text-left font-semibold">说明</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">Coroutine</td>
                      <td className="p-3 text-green-600">✅ 核心、成熟、持续优化</td>
                      <td className="p-3">Kotlin 官方并发标准，已完全替代 AsyncTask</td>
                    </tr>
                    <tr className="border-t bg-slate-50">
                      <td className="p-3 font-semibold">WorkManager</td>
                      <td className="p-3 text-green-600">✅ Jetpack 主线库之一</td>
                      <td className="p-3">Android 推荐后台任务解决方案</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">CoroutineWorker</td>
                      <td className="p-3 text-green-600">✅ 标准实现</td>
                      <td className="p-3">结合两者最佳实践</td>
                    </tr>
                    <tr className="border-t bg-slate-50">
                      <td className="p-3 font-semibold">AlarmManager / JobScheduler</td>
                      <td className="p-3 text-orange-600">⚠️ 底层实现已被封装</td>
                      <td className="p-3">不再直接使用</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">ForegroundService</td>
                      <td className="p-3 text-green-600">✅ 特殊长任务</td>
                      <td className="p-3">适合音乐播放、导航等场景</td>
                    </tr>
                    <tr className="border-t bg-slate-50">
                      <td className="p-3 font-semibold">KMP（Kotlin Multiplatform）</td>
                      <td className="p-3 text-blue-600">🌱 新趋势</td>
                      <td className="p-3">Coroutine 已多平台支持</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">✅ 总结一句话</h3>
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-r from-purple-50 to-fuchsia-50 rounded-lg border border-purple-200">
                  <p className="text-lg font-semibold text-purple-800 text-center mb-2">
                    Coroutine 负责"执行"，WorkManager 负责"保证执行"
                  </p>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>• <strong>Coroutine</strong> 是「轻量并发引擎」</p>
                    <p>• <strong>WorkManager</strong> 是「系统级任务调度中心」</p>
                    <p>• <strong>CoroutineWorker</strong> 是二者的「结合体」</p>
                  </div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-700 text-center">
                    这是目前 Android 官方推荐的后台架构组合（稳健且现代）
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeSection === 'coroutine' && (
          <div className="space-y-4">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">⚡ Coroutine（协程）</h3>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                <h4 className="font-semibold text-blue-800 mb-2">定位</h4>
                <p className="text-sm text-gray-700">Kotlin 的轻量级并发解决方案，用于异步编程</p>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>核心优势：</strong>结构化并发、挂起函数、取消支持、异常处理
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">基础用法</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`class UserViewModel(
    private val repository: UserRepository
) : ViewModel() {
    
    fun loadUser(userId: Int) {
        viewModelScope.launch {
            try {
                val user = repository.getUser(userId)
                _uiState.value = UiState.Success(user)
            } catch (e: Exception) {
                _uiState.value = UiState.Error(e.message)
            }
        }
    }
}`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">协程作用域</h3>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 text-sm mb-2">viewModelScope</h4>
                  <p className="text-xs text-gray-600 mb-2">ViewModel 生命周期绑定，ViewModel 清除时自动取消</p>
                  <pre className="bg-slate-900 text-slate-100 p-2 rounded text-xs overflow-x-auto">
{`viewModelScope.launch {
    // 协程代码
}`}
                  </pre>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 text-sm mb-2">lifecycleScope</h4>
                  <p className="text-xs text-gray-600 mb-2">Activity/Fragment 生命周期绑定</p>
                  <pre className="bg-slate-900 text-slate-100 p-2 rounded text-xs overflow-x-auto">
{`lifecycleScope.launch {
    // 协程代码
}`}
                  </pre>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 text-sm mb-2">GlobalScope</h4>
                  <p className="text-xs text-gray-600 mb-2">应用级作用域（不推荐，容易内存泄漏）</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">协程调度器</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 text-sm mb-1">Dispatchers.Main</h4>
                  <p className="text-xs text-gray-600">主线程，更新 UI</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 text-sm mb-1">Dispatchers.IO</h4>
                  <p className="text-xs text-gray-600">IO 操作（网络、文件、数据库）</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 text-sm mb-1">Dispatchers.Default</h4>
                  <p className="text-xs text-gray-600">CPU 密集型任务</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 text-sm mb-1">Dispatchers.Unconfined</h4>
                  <p className="text-xs text-gray-600">不限制线程（不推荐）</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">协程构建器</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`// launch - 启动协程，不返回结果
viewModelScope.launch {
    doSomething()
}

// async - 启动协程，返回 Deferred<T>
val deferred = viewModelScope.async {
    fetchData()
}
val result = deferred.await()

// withContext - 切换调度器
suspend fun loadData() {
    val data = withContext(Dispatchers.IO) {
        // IO 操作
        fetchFromNetwork()
    }
    // 自动切回原调度器
    updateUI(data)
}`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">异常处理</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`viewModelScope.launch {
    try {
        val result = repository.getData()
        _uiState.value = UiState.Success(result)
    } catch (e: IOException) {
        _uiState.value = UiState.Error("网络错误")
    } catch (e: Exception) {
        _uiState.value = UiState.Error("未知错误")
    }
}

// 使用 CoroutineExceptionHandler
val handler = CoroutineExceptionHandler { _, exception ->
    println("Caught $exception")
}

viewModelScope.launch(handler) {
    // 协程代码
}`}
              </pre>
            </Card>
          </div>
        )}

        {activeSection === 'workmanager' && (
          <div className="space-y-4">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🔄 WorkManager</h3>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-4">
                <h4 className="font-semibold text-purple-800 mb-2">定位</h4>
                <p className="text-sm text-gray-700">系统级后台任务调度框架，保证任务可靠执行</p>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>核心优势：</strong>设备重启后仍可执行、支持约束条件、自动重试、链式任务
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">创建 Worker</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`class SyncWorker(
    appContext: Context,
    workerParams: WorkerParameters
) : CoroutineWorker(appContext, workerParams) {
    
    override suspend fun doWork(): Result {
        return try {
            // 执行后台任务
            syncDataFromServer()
            
            // 返回成功
            Result.success()
        } catch (e: Exception) {
            // 返回重试
            Result.retry()
        }
    }
    
    private suspend fun syncDataFromServer() {
        withContext(Dispatchers.IO) {
            // 网络请求
            val data = api.fetchData()
            // 保存到数据库
            database.save(data)
        }
    }
}`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">一次性任务</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`// 创建工作请求
val syncRequest = OneTimeWorkRequestBuilder<SyncWorker>()
    .setConstraints(
        Constraints.Builder()
            .setRequiredNetworkType(NetworkType.CONNECTED)
            .setRequiresBatteryNotLow(true)
            .build()
    )
    .setBackoffCriteria(
        BackoffPolicy.LINEAR,
        OneTimeWorkRequest.MIN_BACKOFF_MILLIS,
        TimeUnit.MILLISECONDS
    )
    .build()

// 加入队列
WorkManager.getInstance(context)
    .enqueue(syncRequest)`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">周期性任务</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`// 每 15 分钟执行一次（最小间隔）
val periodicRequest = PeriodicWorkRequestBuilder<SyncWorker>(
    15, TimeUnit.MINUTES
)
    .setConstraints(
        Constraints.Builder()
            .setRequiredNetworkType(NetworkType.CONNECTED)
            .build()
    )
    .build()

WorkManager.getInstance(context)
    .enqueueUniquePeriodicWork(
        "sync_work",
        ExistingPeriodicWorkPolicy.KEEP,
        periodicRequest
    )`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">链式任务</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`val downloadWork = OneTimeWorkRequestBuilder<DownloadWorker>().build()
val processWork = OneTimeWorkRequestBuilder<ProcessWorker>().build()
val uploadWork = OneTimeWorkRequestBuilder<UploadWorker>().build()

WorkManager.getInstance(context)
    .beginWith(downloadWork)
    .then(processWork)
    .then(uploadWork)
    .enqueue()`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">观察任务状态</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`WorkManager.getInstance(context)
    .getWorkInfoByIdLiveData(syncRequest.id)
    .observe(lifecycleOwner) { workInfo ->
        when (workInfo.state) {
            WorkInfo.State.ENQUEUED -> {
                // 任务已入队
            }
            WorkInfo.State.RUNNING -> {
                // 任务正在执行
            }
            WorkInfo.State.SUCCEEDED -> {
                // 任务成功
            }
            WorkInfo.State.FAILED -> {
                // 任务失败
            }
            WorkInfo.State.CANCELLED -> {
                // 任务取消
            }
            else -> {}
        }
    }`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">WorkManager 约束条件</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 text-sm mb-1">网络类型</h4>
                  <p className="text-xs text-gray-600">CONNECTED / UNMETERED / NOT_ROAMING</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 text-sm mb-1">电池状态</h4>
                  <p className="text-xs text-gray-600">setRequiresBatteryNotLow()</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 text-sm mb-1">充电状态</h4>
                  <p className="text-xs text-gray-600">setRequiresCharging()</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 text-sm mb-1">存储空间</h4>
                  <p className="text-xs text-gray-600">setRequiresStorageNotLow()</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeSection === 'practice' && (
          <div className="space-y-4">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🚀 完整示例：CoroutineWorker</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`class SyncWorker(
    appContext: Context,
    workerParams: WorkerParameters
) : CoroutineWorker(appContext, workerParams) {
    
    override suspend fun doWork(): Result {
        return try {
            // 设置前台通知（可选）
            setForeground(createForegroundInfo())
            
            // 执行同步任务
            val result = syncData()
            
            // 返回结果
            Result.success(
                workDataOf("synced_count" to result.count)
            )
        } catch (e: Exception) {
            if (runAttemptCount < 3) {
                Result.retry()
            } else {
                Result.failure()
            }
        }
    }
    
    private suspend fun syncData(): SyncResult {
        return withContext(Dispatchers.IO) {
            // 网络请求
            val data = api.fetchData()
            // 保存到数据库
            database.insertAll(data)
            SyncResult(data.size)
        }
    }
    
    private fun createForegroundInfo(): ForegroundInfo {
        val notification = NotificationCompat.Builder(
            applicationContext,
            CHANNEL_ID
        )
            .setContentTitle("同步中")
            .setSmallIcon(R.drawable.ic_sync)
            .build()
            
        return ForegroundInfo(NOTIFICATION_ID, notification)
    }
}`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">使用 Hilt 注入依赖</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`@HiltWorker
class SyncWorker @AssistedInject constructor(
    @Assisted appContext: Context,
    @Assisted workerParams: WorkerParameters,
    private val repository: UserRepository,
    private val api: ApiService
) : CoroutineWorker(appContext, workerParams) {
    
    override suspend fun doWork(): Result {
        return try {
            val users = api.getUsers()
            repository.saveUsers(users)
            Result.success()
        } catch (e: Exception) {
            Result.retry()
        }
    }
}`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">最佳实践总结</h3>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 text-sm mb-2">✅ 推荐做法</h4>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• 使用 CoroutineWorker 而不是 Worker</li>
                    <li>• 为长时间任务设置前台通知</li>
                    <li>• 合理设置约束条件（网络、电量等）</li>
                    <li>• 使用唯一工作名称避免重复任务</li>
                    <li>• 通过 Hilt 注入依赖</li>
                    <li>• 观察任务状态并更新 UI</li>
                  </ul>
                </div>
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 text-sm mb-2">❌ 避免做法</h4>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• 不要在 Worker 中执行超过 10 分钟的任务</li>
                    <li>• 不要使用 GlobalScope</li>
                    <li>• 不要忽略任务失败的情况</li>
                    <li>• 不要在 Worker 中直接更新 UI</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">何时使用 Coroutine vs WorkManager</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">使用 Coroutine</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 短期任务（几秒到几分钟）</li>
                    <li>• 与 UI 生命周期绑定</li>
                    <li>• 网络请求、数据库操作</li>
                    <li>• 需要立即执行</li>
                  </ul>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">使用 WorkManager</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 长期任务（需要保证执行）</li>
                    <li>• 独立于应用生命周期</li>
                    <li>• 上传日志、同步数据</li>
                    <li>• 需要在特定条件下执行</li>
                  </ul>
                </div>
              </div>
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
              href="https://developer.android.com/kotlin/coroutines"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-white border border-gray-200 hover:border-purple-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800">⚡ Kotlin Coroutines 文档</div>
              <div className="text-sm text-gray-600">官方协程完整指南</div>
            </a>
            <a
              href="https://developer.android.com/topic/libraries/architecture/workmanager"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-white border border-gray-200 hover:border-purple-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800">🔄 WorkManager 文档</div>
              <div className="text-sm text-gray-600">后台任务调度指南</div>
            </a>
            <a
              href="https://kotlinlang.org/docs/coroutines-guide.html"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-white border border-gray-200 hover:border-purple-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800">📚 Kotlin 协程指南</div>
              <div className="text-sm text-gray-600">Kotlin 官方教程</div>
            </a>
            <a
              href="https://developer.android.com/codelabs/android-workmanager"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-white border border-gray-200 hover:border-purple-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800">🧪 WorkManager Codelab</div>
              <div className="text-sm text-gray-600">实践教程</div>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
