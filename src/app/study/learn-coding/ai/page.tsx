'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Brain, Sparkles, Zap, Crown, ChevronRight } from 'lucide-react';
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

export default function AIPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeLevel, setActiveLevel] = useState<string>('junior');

  // 从 URL 参数中读取级别
  useEffect(() => {
    const level = searchParams.get('level');
    if (level && ['junior', 'mid', 'senior'].includes(level)) {
      setActiveLevel(level);
    }
  }, [searchParams]);

  // 工具与框架的 URL 映射
  const toolUrls: Record<string, string> = {
    // 初级工具
    'Python': 'https://www.python.org/',
    'Jupyter Notebook': 'https://jupyter.org/',
    'NumPy': 'https://numpy.org/',
    'Pandas': 'https://pandas.pydata.org/',
    'Matplotlib': 'https://matplotlib.org/',
    'Seaborn': 'https://seaborn.pydata.org/',
    'Scikit-learn': 'https://scikit-learn.org/',
    // 中级工具
    'TensorFlow': 'https://www.tensorflow.org/',
    'PyTorch': 'https://pytorch.org/',
    'Keras': 'https://keras.io/',
    'fastai': 'https://www.fast.ai/',
    'Apache Spark': 'https://spark.apache.org/',
    'Dask': 'https://www.dask.org/',
    'Flask': 'https://flask.palletsprojects.com/',
    'FastAPI': 'https://fastapi.tiangolo.com/',
    'Docker': 'https://www.docker.com/',
    'MLflow': 'https://mlflow.org/',
    'Weights & Biases': 'https://wandb.ai/',
    // 高级工具
    'Hugging Face': 'https://huggingface.co/',
    'Chroma': 'https://www.trychroma.com/',
    'Pinecone': 'https://www.pinecone.io/',
    'NVIDIA Triton': 'https://developer.nvidia.com/triton-inference-server',
    'ONNX': 'https://onnx.ai/',
    'TensorRT': 'https://developer.nvidia.com/tensorrt',
    'Kubeflow': 'https://www.kubeflow.org/',
    'TinyML': 'https://www.tinyml.org/',
    'CUDA': 'https://developer.nvidia.com/cuda-toolkit',
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
      name: '初级（基础技能层）',
      icon: Sparkles,
      color: 'text-green-600',
      bgColor: 'from-green-500 to-emerald-500',
      skills: [
        {
          title: 'Python 编程',
          items: ['基础语法', '数据类型与结构', '函数与模块', '面向对象编程', '文件操作', '异常处理'],
          slug: 'python',
        },
        {
          title: '数据处理库',
          items: ['NumPy 数组操作', 'Pandas 数据分析', 'CSV/JSON 处理', '缺失值处理', '数据清洗技巧'],
          slug: 'data-processing',
        },
        {
          title: '数据可视化',
          items: ['Matplotlib 基础', 'Seaborn 统计图表', '图表类型选择', '可视化最佳实践'],
          slug: 'visualization',
        },
        {
          title: '机器学习基础',
          items: ['Scikit-Learn 入门', '分类与回归', '聚类算法', '模型评估指标', '交叉验证'],
          slug: 'ml-basics',
        },
        {
          title: '数学与统计基础',
          items: ['线性代数', '概率论', '统计学基础', '微积分基础'],
          slug: 'math-stats',
        },
      ],
      tools: ['Python', 'Jupyter Notebook', 'NumPy', 'Pandas', 'Matplotlib', 'Seaborn', 'Scikit-learn'],
      practices: ['数据清洗项目', '探索性数据分析（EDA）', '简单分类/回归任务', 'Kaggle 入门竞赛'],
    },
    {
      id: 'mid',
      name: '中级（模型开发与工程化层）',
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'from-blue-500 to-cyan-500',
      skills: [
        {
          title: '深度学习框架',
          items: ['TensorFlow 基础', 'PyTorch 核心概念', 'Keras 快速开发', 'fastai 高级抽象'],
          slug: 'dl-frameworks',
        },
        {
          title: '模型训练与调优',
          items: ['神经网络架构', '超参数调优', '学习率策略', '正则化技术', '批归一化', 'Dropout'],
          slug: 'model-training',
        },
        {
          title: '数据管道与特征工程',
          items: ['Apache Spark', 'Dask 并行计算', '特征选择', '特征构造', '数据增强'],
          slug: 'data-pipeline',
        },
        {
          title: '模型部署基础',
          items: ['Flask API', 'FastAPI 服务', 'Docker 容器化', '模型序列化', 'REST API 设计'],
          slug: 'model-deployment',
        },
        {
          title: '模型评估与验证',
          items: ['混淆矩阵', 'ROC/AUC', '准确率/召回率/F1', '交叉验证策略', 'A/B 测试'],
          slug: 'model-evaluation',
        },
        {
          title: '实验管理',
          items: ['MLflow 实验追踪', 'Weights & Biases', '版本控制', '超参数记录', '模型注册'],
          slug: 'experiment-management',
        },
      ],
      tools: ['TensorFlow', 'PyTorch', 'Keras', 'fastai', 'Apache Spark', 'Dask', 'Flask', 'FastAPI', 'Docker', 'MLflow', 'Weights & Biases'],
      practices: ['端到端模型开发', 'API 服务部署', '实验追踪与管理', '模型性能优化', '生产环境部署'],
    },
    {
      id: 'senior',
      name: '高级（架构、规模化与前沿能力层）',
      icon: Crown,
      color: 'text-yellow-600',
      bgColor: 'from-yellow-400 to-amber-500',
      skills: [
        {
          title: '大语言模型（LLM）',
          items: ['GPT/BERT 架构', 'Prompt Engineering', 'Fine-tuning 技术', 'Hugging Face Transformers', 'LLM 应用开发'],
          slug: 'llm',
        },
        {
          title: '向量数据库与 RAG',
          items: ['Chroma 向量数据库', 'Pinecone', '检索增强生成（RAG）', '语义搜索', '知识库构建'],
          slug: 'vector-db-rag',
        },
        {
          title: '模型服务化与推理优化',
          items: ['NVIDIA Triton Inference Server', 'ONNX Runtime', '模型量化', '模型剪枝', 'TensorRT 加速'],
          slug: 'model-serving',
        },
        {
          title: 'MLOps 与 AI 工程化',
          items: ['CI/CD for ML', 'Kubernetes 部署', '模型监控', '数据漂移检测', 'A/B 测试框架', '模型版本管理'],
          slug: 'mlops',
        },
        {
          title: '边缘 AI 与 IoT',
          items: ['TinyML', 'Edge TPU', '模型压缩', '移动端部署', 'TensorFlow Lite'],
          slug: 'edge-ai',
        },
        {
          title: '专用硬件与加速',
          items: ['GPU 编程（CUDA）', 'TPU 使用', '分布式训练', '混合精度训练', '硬件选型'],
          slug: 'hardware-acceleration',
        },
        {
          title: 'AI 治理与可解释性',
          items: ['模型可解释性（SHAP/LIME）', 'AI 伦理', '偏见检测', '隐私保护（联邦学习）', '模型审计'],
          slug: 'ai-governance',
        },
      ],
      tools: ['Hugging Face', 'Chroma', 'Pinecone', 'NVIDIA Triton', 'ONNX', 'TensorRT', 'Kubeflow', 'TinyML', 'CUDA'],
      practices: ['大规模模型部署', 'RAG 系统构建', 'MLOps 流水线', '边缘 AI 应用', '企业级 AI 架构'],
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl shadow-lg mb-3">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-900">
            人工智能技术栈
          </h1>
          <p className="text-sm text-gray-600">
            从机器学习到大语言模型，系统掌握 AI 技能
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
                    `/study/learn-coding/ai?level=${level.id}`
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
                  onClick={() => router.push(`/study/learn-coding/ai/${activeLevel}/${skill.slug}`)}
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
                          router.push(`/study/learn-coding/ai/${activeLevel}/${skill.slug}#section-${i + 1}`);
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
