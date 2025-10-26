'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Database, Sparkles, Zap, Crown, ChevronRight } from 'lucide-react';
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

export default function DatabasePage() {
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
    'SQLite': 'https://www.sqlite.org/',
    'MySQL': 'https://www.mysql.com/',
    'PostgreSQL': 'https://www.postgresql.org/',
    'Sequelize': 'https://sequelize.org/',
    'SQLAlchemy': 'https://www.sqlalchemy.org/',
    'DBeaver': 'https://dbeaver.io/',
    'TablePlus': 'https://tableplus.com/',
    // 中级工具
    'Redis': 'https://redis.io/',
    'MongoDB': 'https://www.mongodb.com/',
    'ElasticSearch': 'https://www.elastic.co/elasticsearch',
    'MariaDB': 'https://mariadb.org/',
    'Prisma': 'https://www.prisma.io/',
    'TypeORM': 'https://typeorm.io/',
    // 高级工具
    'TiDB': 'https://www.pingcap.com/',
    'CockroachDB': 'https://www.cockroachlabs.com/',
    'InfluxDB': 'https://www.influxdata.com/',
    'TimescaleDB': 'https://www.timescale.com/',
    'Neo4j': 'https://neo4j.com/',
    'ClickHouse': 'https://clickhouse.com/',
    'Snowflake': 'https://www.snowflake.com/',
    'BigQuery': 'https://cloud.google.com/bigquery',
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
      name: '初级（关系型数据库与 SQL）',
      icon: Sparkles,
      color: 'text-green-600',
      bgColor: 'from-green-500 to-emerald-500',
      skills: [
        {
          title: 'SQL 基础',
          items: ['SELECT 查询', 'INSERT/UPDATE/DELETE', 'WHERE 条件', 'JOIN 连接', 'GROUP BY 聚合', 'ORDER BY 排序'],
          slug: 'sql-basics',
        },
        {
          title: 'SQLite',
          items: ['SQLite 基础', '嵌入式数据库', '单文件存储', '移动端应用', 'Python/Node.js 集成'],
          slug: 'sqlite',
        },
        {
          title: 'MySQL',
          items: ['MySQL 安装配置', '数据类型', '表操作', '用户权限', '备份恢复'],
          slug: 'mysql',
        },
        {
          title: 'PostgreSQL',
          items: ['PostgreSQL 基础', 'JSON 支持', '高级查询', '扩展功能', '地理数据'],
          slug: 'postgresql',
        },
        {
          title: 'ER 模型设计',
          items: ['实体关系图', '主键外键', '表关系设计', '数据库规范化', '1NF/2NF/3NF'],
          slug: 'er-model',
        },
        {
          title: 'ORM 框架',
          items: ['Sequelize (Node.js)', 'SQLAlchemy (Python)', '模型定义', '关联关系', '查询构建'],
          slug: 'orm',
        },
        {
          title: '数据库工具',
          items: ['DBeaver', 'TablePlus', 'MySQL Workbench', 'pgAdmin', '可视化管理'],
          slug: 'db-tools',
        },
      ],
      tools: ['SQLite', 'MySQL', 'PostgreSQL', 'Sequelize', 'SQLAlchemy', 'DBeaver', 'TablePlus'],
      practices: ['设计用户表结构', '电商数据库设计', 'SQL 查询练习', '数据库备份恢复', 'ORM 实践项目'],
    },
    {
      id: 'mid',
      name: '中级（多样化与性能优化）',
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'from-blue-500 to-cyan-500',
      skills: [
        {
          title: '索引优化',
          items: ['B+ 树索引', '哈希索引', '复合索引', '查询计划分析', '避免全表扫描'],
          slug: 'index-optimization',
        },
        {
          title: '事务与隔离',
          items: ['ACID 特性', '事务隔离级别', '并发控制', '锁机制', '死锁处理'],
          slug: 'transaction',
        },
        {
          title: '连接池',
          items: ['连接池原理', '连接复用', '性能优化', '配置调优', '连接泄漏'],
          slug: 'connection-pool',
        },
        {
          title: 'Redis 缓存',
          items: ['Redis 数据类型', '缓存策略', 'Session 存储', '消息队列', '持久化'],
          slug: 'redis',
        },
        {
          title: 'MongoDB',
          items: ['文档型数据库', 'BSON 格式', '集合操作', '聚合管道', '索引优化'],
          slug: 'mongodb',
        },
        {
          title: 'ElasticSearch',
          items: ['全文搜索', '倒排索引', '查询 DSL', '聚合分析', '日志分析'],
          slug: 'elasticsearch',
        },
        {
          title: '现代 ORM',
          items: ['Prisma', 'TypeORM', '类型安全', '自动迁移', 'Query Builder'],
          slug: 'modern-orm',
        },
        {
          title: '数据库迁移',
          items: ['Schema 版本管理', '迁移脚本', '回滚机制', '团队协作', 'CI/CD 集成'],
          slug: 'migrations',
        },
      ],
      tools: ['Redis', 'MongoDB', 'ElasticSearch', 'MariaDB', 'Prisma', 'TypeORM'],
      practices: ['缓存架构设计', 'NoSQL 应用', '全文搜索实现', '性能调优', '数据迁移方案'],
    },
    {
      id: 'senior',
      name: '高级（分布式与多模态）',
      icon: Crown,
      color: 'text-yellow-600',
      bgColor: 'from-yellow-400 to-amber-500',
      skills: [
        {
          title: '分库分表',
          items: ['Sharding 策略', '水平分表', '垂直分表', '分布式 ID', '跨库查询'],
          slug: 'sharding',
        },
        {
          title: '读写分离',
          items: ['主从复制', '读写分离架构', '数据同步', '故障转移', '负载均衡'],
          slug: 'read-write-split',
        },
        {
          title: '分布式数据库',
          items: ['TiDB', 'CockroachDB', '分布式事务', '强一致性', '跨区域部署'],
          slug: 'distributed-db',
        },
        {
          title: '时序数据库',
          items: ['InfluxDB', 'TimescaleDB', '时间序列数据', 'IoT 数据', '监控指标'],
          slug: 'time-series',
        },
        {
          title: '图数据库',
          items: ['Neo4j', 'ArangoDB', '图查询语言', '关系网络', '路径分析'],
          slug: 'graph-db',
        },
        {
          title: '列式数据库',
          items: ['ClickHouse', 'Apache Doris', 'OLAP 分析', '列存储', '数据压缩'],
          slug: 'columnar-db',
        },
        {
          title: 'NewSQL',
          items: ['NewSQL 概念', 'Google Spanner', 'ACID + 分布式', '混合架构', 'CAP 理论'],
          slug: 'newsql',
        },
        {
          title: '云数据库',
          items: ['AWS RDS', 'Azure Cosmos DB', 'GCP Cloud SQL', '自动伸缩', '托管服务'],
          slug: 'cloud-db',
        },
        {
          title: '数据仓库',
          items: ['Snowflake', 'BigQuery', 'Redshift', 'BI 分析', '大数据处理'],
          slug: 'data-warehouse',
        },
      ],
      tools: ['TiDB', 'CockroachDB', 'InfluxDB', 'TimescaleDB', 'Neo4j', 'ClickHouse', 'Snowflake', 'BigQuery'],
      practices: ['分布式数据库架构', '时序数据处理', '图数据分析', 'OLAP 系统', '数据仓库建设'],
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-lg mb-3">
            <Database className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-900">
            数据库技术栈
          </h1>
          <p className="text-sm text-gray-600">
            从 SQL 到 NoSQL，从关系型到分布式，掌握完整数据存储体系
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
                    `/study/learn-coding/database?level=${level.id}`
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
                  onClick={() => router.push(`/study/learn-coding/database/${activeLevel}/${skill.slug}`)}
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
                          router.push(`/study/learn-coding/database/${activeLevel}/${skill.slug}#section-${i + 1}`);
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
            <h2 className="text-xl font-bold text-gray-800 mb-4">常用数据库与工具</h2>
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
