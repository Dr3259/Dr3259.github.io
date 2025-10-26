'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Server, Sparkles, Zap, Crown, ChevronRight } from 'lucide-react';
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

export default function BackendPage() {
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
    'Node.js': 'https://nodejs.org/',
    'Express.js': 'https://expressjs.com/',
    'Python': 'https://www.python.org/',
    'Flask': 'https://flask.palletsprojects.com/',
    'MySQL': 'https://www.mysql.com/',
    'PostgreSQL': 'https://www.postgresql.org/',
    'Sequelize': 'https://sequelize.org/',
    'SQLAlchemy': 'https://www.sqlalchemy.org/',
    'Git': 'https://git-scm.com/',
    'GitHub': 'https://github.com/',
    // 中级工具
    'NestJS': 'https://nestjs.com/',
    'Django': 'https://www.djangoproject.com/',
    'Spring Boot': 'https://spring.io/projects/spring-boot',
    'Go': 'https://go.dev/',
    'Gin': 'https://gin-gonic.com/',
    'Redis': 'https://redis.io/',
    'GraphQL': 'https://graphql.org/',
    'Apollo Server': 'https://www.apollographql.com/',
    'Docker': 'https://www.docker.com/',
    'Nginx': 'https://nginx.org/',
    'Prometheus': 'https://prometheus.io/',
    'Grafana': 'https://grafana.com/',
    // 高级工具
    'Kubernetes': 'https://kubernetes.io/',
    'Kafka': 'https://kafka.apache.org/',
    'RabbitMQ': 'https://www.rabbitmq.com/',
    'Istio': 'https://istio.io/',
    'Kong': 'https://konghq.com/',
    'AWS Lambda': 'https://aws.amazon.com/lambda/',
    'Rust': 'https://www.rust-lang.org/',
    'Deno': 'https://deno.land/',
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
      name: '初级（打好后端基础）',
      icon: Sparkles,
      color: 'text-green-600',
      bgColor: 'from-green-500 to-emerald-500',
      skills: [
        {
          title: 'HTTP 与 REST 基础',
          items: ['HTTP 协议', '请求响应流程', '状态码', 'Header 与 Cookie', 'RESTful API 设计'],
          slug: 'http-rest',
        },
        {
          title: 'Node.js 开发',
          items: ['Node.js 基础', 'Express.js 框架', '路由与中间件', '异步编程', 'npm 包管理'],
          slug: 'nodejs',
        },
        {
          title: 'Python 后端',
          items: ['Python 基础', 'Flask 微框架', '路由与视图', 'Jinja2 模板', 'Flask 扩展'],
          slug: 'python-backend',
        },
        {
          title: '关系型数据库',
          items: ['MySQL 基础', 'PostgreSQL', 'SQL 查询', '表结构设计', '索引优化'],
          slug: 'relational-db',
        },
        {
          title: 'ORM 框架',
          items: ['Sequelize (Node.js)', 'SQLAlchemy (Python)', '模型定义', '查询构建', '数据迁移'],
          slug: 'orm',
        },
        {
          title: '版本控制',
          items: ['Git 基础', 'GitHub 协作', '分支管理', 'Pull Request', 'Git 工作流'],
          slug: 'version-control',
        },
      ],
      tools: ['Node.js', 'Express.js', 'Python', 'Flask', 'MySQL', 'PostgreSQL', 'Sequelize', 'SQLAlchemy', 'Git', 'GitHub'],
      practices: ['简单 REST API', 'CRUD 应用', '用户认证系统', '博客后端', 'Todo API'],
    },
    {
      id: 'mid',
      name: '中级（进阶工程实践与性能）',
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'from-blue-500 to-cyan-500',
      skills: [
        {
          title: '企业级框架',
          items: ['NestJS (Node.js)', 'Django (Python)', 'Spring Boot (Java)', '依赖注入', '模块化设计'],
          slug: 'enterprise-frameworks',
        },
        {
          title: 'Go 语言后端',
          items: ['Go 基础', 'Gin 框架', 'Fiber 框架', 'Goroutine 并发', 'Go Modules'],
          slug: 'golang',
        },
        {
          title: '缓存与性能',
          items: ['Redis 缓存', '缓存策略', '分布式缓存', 'Session 管理', '性能优化'],
          slug: 'cache-performance',
        },
        {
          title: 'GraphQL',
          items: ['GraphQL 基础', 'Apollo Server', 'Schema 设计', 'Resolver', 'DataLoader'],
          slug: 'graphql',
        },
        {
          title: '容器化',
          items: ['Docker 基础', 'Dockerfile', 'Docker Compose', '镜像管理', '容器网络'],
          slug: 'containerization',
        },
        {
          title: 'CI/CD',
          items: ['GitHub Actions', 'Jenkins', '自动化测试', '自动部署', '流水线配置'],
          slug: 'cicd',
        },
        {
          title: 'Web 服务器',
          items: ['Nginx 配置', '反向代理', '负载均衡', 'SSL/TLS', '静态资源服务'],
          slug: 'web-server',
        },
        {
          title: '监控与日志',
          items: ['Prometheus 监控', 'Grafana 可视化', '日志收集', '性能指标', '告警配置'],
          slug: 'monitoring',
        },
      ],
      tools: ['NestJS', 'Django', 'Spring Boot', 'Go', 'Gin', 'Redis', 'GraphQL', 'Apollo Server', 'Docker', 'Nginx', 'Prometheus', 'Grafana'],
      practices: ['企业级 API 开发', 'GraphQL 服务', 'Docker 部署', 'CI/CD 流水线', '高性能服务'],
    },
    {
      id: 'senior',
      name: '高级（架构设计与分布式系统）',
      icon: Crown,
      color: 'text-yellow-600',
      bgColor: 'from-yellow-400 to-amber-500',
      skills: [
        {
          title: '微服务架构',
          items: ['微服务设计', '服务拆分', '服务通信', 'API Gateway', '服务发现'],
          slug: 'microservices',
        },
        {
          title: '消息队列',
          items: ['Kafka', 'RabbitMQ', 'NATS', '异步通信', '事件驱动架构'],
          slug: 'message-queue',
        },
        {
          title: 'Kubernetes',
          items: ['K8s 基础', 'Pod 与 Deployment', 'Service 与 Ingress', '自动伸缩', 'ConfigMap 与 Secret'],
          slug: 'kubernetes',
        },
        {
          title: 'Service Mesh',
          items: ['Istio', 'Linkerd', '流量管理', '安全策略', '可观测性'],
          slug: 'service-mesh',
        },
        {
          title: 'API Gateway',
          items: ['Kong', 'NGINX Gateway', '鉴权', '限流', '负载均衡'],
          slug: 'api-gateway',
        },
        {
          title: '分布式数据库',
          items: ['CockroachDB', 'TiDB', '分布式事务', '数据分片', '高可用'],
          slug: 'distributed-db',
        },
        {
          title: '事件驱动架构',
          items: ['EDA 设计', '事件溯源', 'CQRS', '最终一致性', '事件总线'],
          slug: 'event-driven',
        },
        {
          title: '云原生与 Serverless',
          items: ['Cloud Native 理念', 'AWS Lambda', 'Cloudflare Workers', 'Serverless 架构', '按需计算'],
          slug: 'cloud-native',
        },
        {
          title: '新一代语言',
          items: ['Rust 后端', 'Elixir/Phoenix', 'Deno', '高性能编程', '并发安全'],
          slug: 'modern-languages',
        },
      ],
      tools: ['Kubernetes', 'Kafka', 'RabbitMQ', 'Istio', 'Kong', 'AWS Lambda', 'Rust', 'Deno', 'CockroachDB'],
      practices: ['微服务架构设计', '分布式系统', 'K8s 集群管理', 'Serverless 应用', '高并发系统'],
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg mb-3">
            <Server className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-900">
            后端开发技术栈
          </h1>
          <p className="text-sm text-gray-600">
            从基础到架构，掌握 Node.js、Python、Java、Go 等多语言后端开发
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
                    `/study/learn-coding/backend?level=${level.id}`
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
                  onClick={() => router.push(`/study/learn-coding/backend/${activeLevel}/${skill.slug}`)}
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
                          router.push(`/study/learn-coding/backend/${activeLevel}/${skill.slug}#section-${i + 1}`);
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
