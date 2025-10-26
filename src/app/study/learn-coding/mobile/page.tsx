'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Smartphone, Sparkles, Zap, Crown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Skill {
  title: string;
  items: string[];
  slug: string;
}

interface Level {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  skills: Skill[];
  tools: string[];
  practices: string[];
}

export default function MobilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeLevel, setActiveLevel] = useState<string>('junior');

  useEffect(() => {
    const level = searchParams.get('level');
    if (level && ['junior', 'mid', 'senior'].includes(level)) {
      setActiveLevel(level);
    }
  }, [searchParams]);

  const toolUrls: Record<string, string> = {
    // 初级工具
    'Kotlin': 'https://kotlinlang.org/',
    'Swift': 'https://developer.apple.com/swift/',
    'Android Studio': 'https://developer.android.com/studio',
    'Xcode': 'https://developer.apple.com/xcode/',
    'SwiftUI': 'https://developer.apple.com/xcode/swiftui/',
    'Jetpack Compose': 'https://developer.android.com/jetpack/compose',
    // 中级工具
    'React Native': 'https://reactnative.dev/',
    'Flutter': 'https://flutter.dev/',
    'Ionic': 'https://ionicframework.com/',
    'Capacitor': 'https://capacitorjs.com/',
    'Gradle': 'https://gradle.org/',
    'CocoaPods': 'https://cocoapods.org/',
    'Redux': 'https://redux.js.org/',
    'MobX': 'https://mobx.js.org/',
    // 高级工具
    'Fastlane': 'https://fastlane.tools/',
    'GitHub Actions': 'https://github.com/features/actions',
    'Bitrise': 'https://www.bitrise.io/',
    'Firebase': 'https://firebase.google.com/',
    'App Center': 'https://appcenter.ms/',
  };

  const handleToolClick = (tool: string) => {
    const url = toolUrls[tool] || 'https://www.google.com/search?q=' + encodeURIComponent(tool);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handlePracticeClick = (practice: string) => {
    const url = 'https://www.google.com/search?q=' + encodeURIComponent(practice + ' 教程');
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const levels: Level[] = [
    {
      id: 'junior',
      name: '初级（入门与基础技能）',
      icon: Sparkles,
      color: 'text-green-600',
      bgColor: 'from-green-500 to-emerald-500',
      skills: [
        {
          title: 'Android 原生开发',
          items: ['Kotlin 语言基础', 'Android Studio 使用', 'Activity 与 Fragment', 'XML Layout 布局', 'Material Design'],
          slug: 'android-native',
        },
        {
          title: 'iOS 原生开发',
          items: ['Swift 语言基础', 'Xcode 使用', 'UIKit 框架', 'SwiftUI 声明式 UI', 'Auto Layout'],
          slug: 'ios-native',
        },
        {
          title: 'UI 组件与布局',
          items: ['基础控件（Button/TextView/ImageView）', '布局管理（LinearLayout/ConstraintLayout）', '列表视图（RecyclerView/UITableView）', '导航组件'],
          slug: 'ui-components',
        },
        {
          title: '开发环境配置',
          items: ['Android 模拟器', 'iOS 模拟器', '真机调试', 'Gradle 构建', 'CocoaPods 依赖管理'],
          slug: 'dev-environment',
        },
      ],
      tools: ['Kotlin', 'Swift', 'Android Studio', 'Xcode', 'SwiftUI', 'Jetpack Compose'],
      practices: ['简单计算器 App', 'Todo List 应用', '图片浏览器', '基础表单应用'],
    },
    {
      id: 'mid',
      name: '中级（跨平台与生态扩展）',
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'from-blue-500 to-cyan-500',
      skills: [
        {
          title: '跨平台框架',
          items: ['React Native 开发', 'Flutter 开发', 'Ionic/Capacitor', '原生模块桥接', '平台差异处理'],
          slug: 'cross-platform',
        },
        {
          title: '状态管理',
          items: ['Redux/Redux Toolkit', 'MobX', 'Provider (Flutter)', 'Riverpod', '状态持久化'],
          slug: 'state-management',
        },
        {
          title: '网络与数据',
          items: ['HTTP 请求（Axios/Dio）', 'RESTful API 集成', 'GraphQL', '本地存储（SharedPreferences/UserDefaults）', 'SQLite 数据库'],
          slug: 'network-data',
        },
        {
          title: '构建与打包',
          items: ['Gradle 配置', 'CocoaPods/Swift Package Manager', '多环境配置', '代码签名', 'App 图标与启动屏'],
          slug: 'build-package',
        },
        {
          title: '调试与测试',
          items: ['断点调试', '日志输出', '单元测试', 'Widget 测试', '性能分析工具'],
          slug: 'debug-test',
        },
        {
          title: '第三方集成',
          items: ['地图服务（Google Maps/高德）', '推送通知', '社交登录', '支付集成', '分享功能'],
          slug: 'third-party',
        },
      ],
      tools: ['React Native', 'Flutter', 'Ionic', 'Capacitor', 'Gradle', 'CocoaPods', 'Redux', 'MobX'],
      practices: ['新闻阅读 App', '电商应用', '社交媒体客户端', '地图导航应用', '音乐播放器'],
    },
    {
      id: 'senior',
      name: '高级（工程化、性能与发布）',
      icon: Crown,
      color: 'text-yellow-600',
      bgColor: 'from-yellow-400 to-amber-500',
      skills: [
        {
          title: '架构设计',
          items: ['MVVM 架构', 'Clean Architecture', 'MVI 模式', '模块化设计', '依赖注入（Dagger/Hilt）'],
          slug: 'architecture',
        },
        {
          title: '性能优化',
          items: ['启动时间优化', '内存管理', '渲染性能优化', '包体积优化', '电量优化', 'Flutter DevTools/Android Profiler'],
          slug: 'performance',
        },
        {
          title: 'CI/CD 与自动化',
          items: ['Fastlane 自动化', 'GitHub Actions', 'Bitrise', '自动化测试', '自动发布流程'],
          slug: 'cicd',
        },
        {
          title: '原生能力扩展',
          items: ['Kotlin Multiplatform', 'Swift Package', 'React Native 原生模块', 'Flutter Platform Channel', 'FFI 调用'],
          slug: 'native-extension',
        },
        {
          title: '安全与隐私',
          items: ['数据加密', 'Keychain/Keystore', 'HTTPS 证书校验', 'OAuth2 认证', '代码混淆'],
          slug: 'security',
        },
        {
          title: '发布与运营',
          items: ['Google Play 发布', 'App Store 发布', '版本管理', 'A/B 测试', '崩溃监控（Sentry/Firebase Crashlytics）', '用户分析'],
          slug: 'release-ops',
        },
        {
          title: '新技术探索',
          items: ['Jetpack Compose', 'SwiftUI', 'Kotlin Multiplatform Mobile', 'Flutter Web/Desktop', 'AR/VR 集成'],
          slug: 'new-tech',
        },
      ],
      tools: ['Fastlane', 'GitHub Actions', 'Bitrise', 'Firebase', 'App Center', 'Sentry', 'Kotlin Multiplatform'],
      practices: ['大型应用架构', 'CI/CD 流水线', '性能调优项目', '企业级应用开发', '跨平台解决方案'],
    },
  ];

  const currentLevel = levels.find((l) => l.id === activeLevel) || levels[0];
  const Icon = currentLevel.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link href="/study/learn-coding" passHref>
            <Button variant="outline" size="sm" className="hover:bg-white/80 shadow-sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回学习编程
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg mb-3">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-900">
            移动端开发技术栈
          </h1>
          <p className="text-sm text-gray-600">
            从原生到跨平台，掌握 iOS、Android 及混合开发技能
          </p>
        </div>

        {/* 级别选择器 */}
        <div className="flex justify-center gap-3 mb-8">
          {levels.map((level) => {
            const LevelIcon = level.icon;
            return (
              <Button
                key={level.id}
                variant={activeLevel === level.id ? 'default' : 'outline'}
                onClick={() => {
                  setActiveLevel(level.id);
                  window.history.replaceState(
                    null,
                    '',
                    `/study/learn-coding/mobile?level=${level.id}`
                  );
                }}
                className={`${
                  activeLevel === level.id
                    ? `bg-gradient-to-r ${level.bgColor} text-white hover:opacity-90`
                    : 'hover:bg-gray-100'
                }`}
              >
                <LevelIcon className="w-4 h-4 mr-2" />
                {level.name}
              </Button>
            );
          })}
        </div>

        {/* 内容区域 */}
        <div className="space-y-6">
          {/* 核心技能 */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <Icon className={`w-6 h-6 ${currentLevel.color}`} />
              <h2 className="text-2xl font-bold text-gray-800">核心技能</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
              {currentLevel.skills.map((skill, idx) => (
                <Card 
                  key={idx} 
                  className="group p-4 bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer h-fit"
                  onClick={() => router.push(`/study/learn-coding/mobile/${activeLevel}/${skill.slug}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2 group-hover:text-primary transition-colors">
                      <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentLevel.bgColor}`} />
                      {skill.title}
                    </h3>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                  <ul className="space-y-1.5">
                    {skill.items.map((item, i) => (
                      <li 
                        key={i} 
                        className="text-sm text-gray-600 flex items-start gap-2 hover:text-primary transition-colors cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/study/learn-coding/mobile/${activeLevel}/${skill.slug}#section-${i + 1}`);
                        }}
                      >
                        <span className="text-gray-400 flex-shrink-0 mt-0.5">•</span>
                        <span className="flex-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </Card>

          {/* 工具与框架 */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">常用工具与框架</h2>
            <div className="flex flex-wrap gap-2">
              {currentLevel.tools.map((tool, idx) => (
                <button
                  key={idx}
                  onClick={() => handleToolClick(tool)}
                  className={`px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${currentLevel.bgColor} text-white shadow-sm hover:opacity-90 hover:scale-105 transition-all cursor-pointer`}
                >
                  {tool}
                </button>
              ))}
            </div>
          </Card>

          {/* 实践经验 */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">实践项目与最佳实践</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentLevel.practices.map((practice, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePracticeClick(practice)}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 hover:shadow-md transition-all cursor-pointer text-left"
                >
                  <span className={`w-6 h-6 rounded-full bg-gradient-to-r ${currentLevel.bgColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {idx + 1}
                  </span>
                  <span className="text-sm text-gray-700">{practice}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* 底部提示 */}
        <div className="mt-8 text-center">
          <Card className="inline-block p-4 bg-gradient-to-r from-white/80 to-blue-50/80 backdrop-blur-sm border border-blue-200/50">
            <p className="text-sm text-gray-700">
              💡 提示：点击任意技能卡片，查看详细学习内容和资源
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
