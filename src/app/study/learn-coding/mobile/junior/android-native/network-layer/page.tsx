'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Network, BookOpen, Zap, Globe } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function NetworkLayerPage() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: '网络层概览', icon: '🔁' },
    { id: 'retrofit', label: 'Retrofit', icon: '🎯' },
    { id: 'okhttp', label: 'OkHttp', icon: '⚡' },
    { id: 'practice', label: '最佳实践', icon: '🚀' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50 p-4 sm:p-6">
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl shadow-lg mb-4">
            <Network className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            Android 网络层
          </h1>
          <p className="text-gray-600">
            Retrofit + OkHttp：网络请求的完美组合
          </p>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                activeSection === section.id
                  ? 'bg-indigo-600 text-white shadow-md'
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
              <h3 className="text-xl font-bold text-gray-800 mb-4">🧩 核心关系概览</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-3 text-left font-semibold">层级</th>
                      <th className="p-3 text-left font-semibold">名称</th>
                      <th className="p-3 text-left font-semibold">角色定位</th>
                      <th className="p-3 text-left font-semibold">关系说明</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-3 font-semibold text-blue-600">上层</td>
                      <td className="p-3 font-semibold">Retrofit</td>
                      <td className="p-3">网络请求的封装框架（面向接口调用）</td>
                      <td className="p-3">负责定义 API、序列化数据、调用 OkHttp</td>
                    </tr>
                    <tr className="border-t bg-slate-50">
                      <td className="p-3 font-semibold text-green-600">底层</td>
                      <td className="p-3 font-semibold">OkHttp</td>
                      <td className="p-3">实际的 HTTP 客户端（面向网络通信）</td>
                      <td className="p-3">负责连接、缓存、拦截器、请求调度</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>简单来说：</strong>
                </p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>• 🔁 <strong>Retrofit 调用 OkHttp</strong> 来真正执行网络请求</li>
                  <li>• 🧠 <strong>类比：</strong>Retrofit 是「服务员」，OkHttp 是「厨房」</li>
                </ul>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">⚙️ 工作流程（简化版）</h3>
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">假设你定义了一个接口：</p>
                  <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs overflow-x-auto">
{`interface ApiService {
    @GET("users/{id}")
    suspend fun getUser(@Path("id") id: Int): User
}`}
                  </pre>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">Retrofit 解析接口定义</h4>
                      <p className="text-sm text-gray-600">使用反射或动态代理，读取注解（@GET, @Path 等）</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">生成请求描述对象</h4>
                      <p className="text-sm text-gray-600">构造出一个 Request（由 OkHttp 定义的类型）</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">交给 OkHttp 执行请求</h4>
                      <p className="text-sm text-gray-600">Retrofit 调用 OkHttp 的 OkHttpClient.newCall(request)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">OkHttp 负责网络通信</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• 建立 TCP / HTTP2 / QUIC 连接</li>
                        <li>• 执行拦截器链（日志、缓存、重试、Header、Cookie 等）</li>
                        <li>• 发送请求 → 读取响应</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">5</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">返回数据 → Retrofit 解析</h4>
                      <p className="text-sm text-gray-600">拿到 OkHttp 的 ResponseBody，用 Converter 反序列化为 User 对象</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">6</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">最终交给 ViewModel/Repository 层使用</h4>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🧠 职责分工（对比）</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-3 text-left font-semibold">模块</th>
                      <th className="p-3 text-left font-semibold">核心职责</th>
                      <th className="p-3 text-left font-semibold">是否可替换</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">Retrofit</td>
                      <td className="p-3">定义 API 接口，封装请求流程，解析响应</td>
                      <td className="p-3 text-green-600">✅ 可换成 Ktor Client 或 Fuel</td>
                    </tr>
                    <tr className="border-t bg-slate-50">
                      <td className="p-3 font-semibold">OkHttp</td>
                      <td className="p-3">实现 HTTP 请求、连接池、缓存、拦截器</td>
                      <td className="p-3 text-red-600">❌ Android 默认网络栈依赖它</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">Converter</td>
                      <td className="p-3">负责 JSON/XML → Kotlin 对象的序列化</td>
                      <td className="p-3 text-green-600">✅ Gson / Moshi / kotlinx.serialization</td>
                    </tr>
                    <tr className="border-t bg-slate-50">
                      <td className="p-3 font-semibold">Coroutine + Flow</td>
                      <td className="p-3">异步结果传递（挂起函数或流式数据）</td>
                      <td className="p-3 text-green-600">✅ 与 Retrofit 结合很好用</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🚀 生态现状（截至 2025）</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-3 text-left font-semibold">项目</th>
                      <th className="p-3 text-left font-semibold">维护状态</th>
                      <th className="p-3 text-left font-semibold">说明</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">OkHttp</td>
                      <td className="p-3 text-green-600">✅ 非常活跃</td>
                      <td className="p-3">Square 维护，支持 HTTP/3 (QUIC)</td>
                    </tr>
                    <tr className="border-t bg-slate-50">
                      <td className="p-3 font-semibold">Retrofit</td>
                      <td className="p-3 text-green-600">✅ 稳定更新中</td>
                      <td className="p-3">Retrofit 2.x 是事实标准</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">Gson → Moshi → Kotlinx.serialization</td>
                      <td className="p-3 text-orange-600">🔄 生态在迁移</td>
                      <td className="p-3">新项目推荐 Kotlinx.serialization</td>
                    </tr>
                    <tr className="border-t bg-slate-50">
                      <td className="p-3 font-semibold">Ktor Client</td>
                      <td className="p-3 text-blue-600">🌱 新兴替代</td>
                      <td className="p-3">Kotlin 官方多平台网络库</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3 font-semibold">Coroutines + Flow + Retrofit</td>
                      <td className="p-3 text-green-600">🧩 最推荐组合</td>
                      <td className="p-3">官方 sample 也采用这种搭配</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📦 模块关系图</h3>
              <div className="bg-slate-900 text-slate-100 p-6 rounded-lg font-mono text-sm whitespace-pre">
{`ViewModel
   ↓
Repository
   ↓
Retrofit → OkHttp → 网络`}
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">✅ 总结一句话</h3>
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
                <p className="text-lg font-semibold text-indigo-800 text-center">
                  Retrofit 是网络请求的"外壳"，OkHttp 是它的"引擎"
                </p>
              </div>
            </Card>
          </div>
        )}

        {activeSection === 'retrofit' && (
          <div className="space-y-4">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 Retrofit</h3>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                <h4 className="font-semibold text-blue-800 mb-2">定位</h4>
                <p className="text-sm text-gray-700">类型安全的 HTTP 客户端，将 HTTP API 转换为 Kotlin 接口</p>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>核心优势：</strong>声明式 API、类型安全、支持协程、易于测试
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">1. 定义 API 接口</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`interface ApiService {
    // GET 请求
    @GET("users/{id}")
    suspend fun getUser(@Path("id") userId: Int): User
    
    // POST 请求
    @POST("users")
    suspend fun createUser(@Body user: User): User
    
    // 查询参数
    @GET("users")
    suspend fun searchUsers(
        @Query("name") name: String,
        @Query("page") page: Int = 1
    ): List<User>
    
    // Header
    @GET("profile")
    suspend fun getProfile(
        @Header("Authorization") token: String
    ): Profile
    
    // 返回 Flow
    @GET("users")
    fun getUsersFlow(): Flow<List<User>>
}`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">2. 创建 Retrofit 实例</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`val retrofit = Retrofit.Builder()
    .baseUrl("https://api.example.com/")
    .client(okHttpClient)  // 使用自定义的 OkHttpClient
    .addConverterFactory(
        Json.asConverterFactory("application/json".toMediaType())
    )
    .build()

val apiService = retrofit.create(ApiService::class.java)`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">3. 在 Repository 中使用</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`class UserRepository @Inject constructor(
    private val api: ApiService
) {
    suspend fun getUser(userId: Int): Result<User> {
        return try {
            val user = api.getUser(userId)
            Result.success(user)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    fun getUsersFlow(): Flow<List<User>> {
        return api.getUsersFlow()
            .catch { e -> emit(emptyList()) }
            .flowOn(Dispatchers.IO)
    }
}`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Retrofit 常用注解</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 text-sm mb-2">HTTP 方法</h4>
                  <ul className="text-xs text-gray-700 space-y-1 font-mono">
                    <li>• @GET</li>
                    <li>• @POST</li>
                    <li>• @PUT</li>
                    <li>• @DELETE</li>
                    <li>• @PATCH</li>
                  </ul>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 text-sm mb-2">参数注解</h4>
                  <ul className="text-xs text-gray-700 space-y-1 font-mono">
                    <li>• @Path - 路径参数</li>
                    <li>• @Query - 查询参数</li>
                    <li>• @Body - 请求体</li>
                    <li>• @Header - 请求头</li>
                    <li>• @Field - 表单字段</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeSection === 'okhttp' && (
          <div className="space-y-4">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">⚡ OkHttp</h3>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                <h4 className="font-semibold text-green-800 mb-2">定位</h4>
                <p className="text-sm text-gray-700">高效的 HTTP 客户端，处理底层网络通信</p>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>核心优势：</strong>连接池、透明 GZIP、缓存、拦截器、HTTP/2 & HTTP/3 支持
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">创建 OkHttpClient</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`val okHttpClient = OkHttpClient.Builder()
    .connectTimeout(30, TimeUnit.SECONDS)
    .readTimeout(30, TimeUnit.SECONDS)
    .writeTimeout(30, TimeUnit.SECONDS)
    .addInterceptor(loggingInterceptor)
    .addInterceptor(authInterceptor)
    .cache(cache)
    .build()`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">拦截器（Interceptor）</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 text-sm mb-2">日志拦截器</h4>
                  <pre className="bg-slate-900 text-slate-100 p-2 rounded text-xs overflow-x-auto">
{`val loggingInterceptor = HttpLoggingInterceptor().apply {
    level = HttpLoggingInterceptor.Level.BODY
}`}
                  </pre>
                </div>

                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 text-sm mb-2">认证拦截器</h4>
                  <pre className="bg-slate-900 text-slate-100 p-2 rounded text-xs overflow-x-auto">
{`class AuthInterceptor(private val tokenProvider: TokenProvider) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request().newBuilder()
            .addHeader("Authorization", "Bearer \${tokenProvider.getToken()}")
            .build()
        return chain.proceed(request)
    }
}`}
                  </pre>
                </div>

                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 text-sm mb-2">重试拦截器</h4>
                  <pre className="bg-slate-900 text-slate-100 p-2 rounded text-xs overflow-x-auto">
{`class RetryInterceptor(private val maxRetry: Int = 3) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        var attempt = 0
        var response: Response? = null
        
        while (attempt < maxRetry) {
            try {
                response = chain.proceed(chain.request())
                if (response.isSuccessful) return response
            } catch (e: IOException) {
                if (attempt == maxRetry - 1) throw e
            }
            attempt++
        }
        return response!!
    }
}`}
                  </pre>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">缓存配置</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`val cacheSize = 10 * 1024 * 1024 // 10 MB
val cache = Cache(context.cacheDir, cacheSize.toLong())

val okHttpClient = OkHttpClient.Builder()
    .cache(cache)
    .addNetworkInterceptor { chain ->
        val response = chain.proceed(chain.request())
        response.newBuilder()
            .header("Cache-Control", "public, max-age=60")
            .build()
    }
    .build()`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">OkHttp 核心特性</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 text-sm mb-1">连接池</h4>
                  <p className="text-xs text-gray-600">复用 TCP 连接，提高性能</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 text-sm mb-1">透明 GZIP</h4>
                  <p className="text-xs text-gray-600">自动压缩和解压缩</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 text-sm mb-1">HTTP/2 & HTTP/3</h4>
                  <p className="text-xs text-gray-600">支持最新协议</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 text-sm mb-1">拦截器链</h4>
                  <p className="text-xs text-gray-600">灵活的请求/响应处理</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeSection === 'practice' && (
          <div className="space-y-4">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🚀 现代 Android 网络层推荐架构</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`// Repository 层
class UserRepository @Inject constructor(
    private val api: ApiService
) {
    fun getUserFlow(id: Int): Flow<User> = flow {
        val user = api.getUser(id)
        emit(user)
    }.flowOn(Dispatchers.IO)
}`}
              </pre>
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700">
                  <strong>依赖：</strong>Retrofit + OkHttp + Kotlinx.serialization + Flow + Hilt
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">完整配置示例</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    
    @Provides
    @Singleton
    fun provideOkHttpClient(
        loggingInterceptor: HttpLoggingInterceptor,
        authInterceptor: AuthInterceptor
    ): OkHttpClient {
        return OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .addInterceptor(loggingInterceptor)
            .addInterceptor(authInterceptor)
            .build()
    }
    
    @Provides
    @Singleton
    fun provideRetrofit(
        okHttpClient: OkHttpClient
    ): Retrofit {
        val json = Json {
            ignoreUnknownKeys = true
            coerceInputValues = true
        }
        
        return Retrofit.Builder()
            .baseUrl("https://api.example.com/")
            .client(okHttpClient)
            .addConverterFactory(
                json.asConverterFactory("application/json".toMediaType())
            )
            .build()
    }
    
    @Provides
    @Singleton
    fun provideApiService(retrofit: Retrofit): ApiService {
        return retrofit.create(ApiService::class.java)
    }
}`}
              </pre>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">错误处理最佳实践</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`sealed class ApiResult<out T> {
    data class Success<T>(val data: T) : ApiResult<T>()
    data class Error(val exception: Throwable) : ApiResult<Nothing>()
    object Loading : ApiResult<Nothing>()
}

suspend fun <T> safeApiCall(
    apiCall: suspend () -> T
): ApiResult<T> {
    return try {
        ApiResult.Success(apiCall())
    } catch (e: HttpException) {
        ApiResult.Error(e)
    } catch (e: IOException) {
        ApiResult.Error(e)
    } catch (e: Exception) {
        ApiResult.Error(e)
    }
}

// 使用
class UserRepository @Inject constructor(
    private val api: ApiService
) {
    suspend fun getUser(id: Int): ApiResult<User> {
        return safeApiCall { api.getUser(id) }
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
                    <li>• 使用 Retrofit + OkHttp 组合</li>
                    <li>• 使用 Kotlinx.serialization 而不是 Gson</li>
                    <li>• 使用协程和 Flow 处理异步</li>
                    <li>• 通过 Hilt 注入网络依赖</li>
                    <li>• 添加日志拦截器（仅 Debug 模式）</li>
                    <li>• 统一错误处理</li>
                    <li>• 配置合理的超时时间</li>
                  </ul>
                </div>
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 text-sm mb-2">❌ 避免做法</h4>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• 不要在主线程执行网络请求</li>
                    <li>• 不要硬编码 API 地址</li>
                    <li>• 不要忽略错误处理</li>
                    <li>• 不要在 Release 版本打印敏感日志</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}

        <Card className="p-6 bg-white/80 backdrop-blur-sm mt-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-800">推荐资源</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="https://square.github.io/retrofit/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-white border border-gray-200 hover:border-indigo-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800">🎯 Retrofit 官方文档</div>
              <div className="text-sm text-gray-600">完整的 Retrofit 使用指南</div>
            </a>
            <a
              href="https://square.github.io/okhttp/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-white border border-gray-200 hover:border-indigo-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800">⚡ OkHttp 官方文档</div>
              <div className="text-sm text-gray-600">OkHttp 完整学习资源</div>
            </a>
            <a
              href="https://github.com/square/retrofit"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-white border border-gray-200 hover:border-indigo-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800">💻 Retrofit GitHub</div>
              <div className="text-sm text-gray-600">源码和示例</div>
            </a>
            <a
              href="https://github.com/square/okhttp"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-white border border-gray-200 hover:border-indigo-400 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-800">🔧 OkHttp GitHub</div>
              <div className="text-sm text-gray-600">源码和示例</div>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
