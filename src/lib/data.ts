
export interface NewsUpdate {
  id: string;
  date: string;
  company: string;
  logo: string;
  title: string;
  description: string;
  link: string;
  country: '中国' | '美国';
  category: '模型' | '应用' | '算力' | '产业';
  pricing: '免费' | '付费' | '开源';
  imageUrl?: string;
}

export const newsUpdates: NewsUpdate[] = [
  {
    id: '1',
    date: '2024-05-15',
    company: 'OpenAI',
    logo: 'https://placehold.co/40x40/000000/FFFFFF/png?text=O',
    title: 'GPT-4o 正式发布，实现实时多模态交互',
    description: 'OpenAI 发布了其最新的旗舰模型 GPT-4o ("o" 代表 "omni")，能够实时处理音频、视觉和文本的任意组合输入，并生成相应的组合输出。',
    link: 'https://openai.com/index/hello-gpt-4o/',
    country: '美国',
    category: '模型',
    pricing: '免费',
    imageUrl: 'https://storage.googleapis.com/aif-st-images-dev/v1/6764a852-6e10-449e-a616-1f9e23635790'
  },
  {
    id: '2',
    date: '2024-05-15',
    company: 'Google',
    logo: 'https://placehold.co/40x40/EA4335/FFFFFF/png?text=G',
    title: 'Project Astra：AI 代理的未来',
    description: '在 Google I/O 上，Project Astra 惊艳亮相，展示了一个能够通过手机摄像头理解上下文、进行对话并执行任务的通用 AI 代理。',
    link: 'https://deepmind.google/technologies/gemini/project-astra/',
    country: '美国',
    category: '应用',
    pricing: '免费',
    imageUrl: 'https://storage.googleapis.com/aif-st-images-dev/v1/52e5576a-54a8-4e8c-a111-e633d262b9a1'
  },
  {
    id: '3',
    date: '2024-05-14',
    company: '月之暗面',
    logo: 'https://placehold.co/40x40/2C3E50/FFFFFF/png?text=M',
    title: 'Kimi 智能体上线，探索“AGI 理想原型”',
    description: '月之暗面(Moonshot AI)发布了Kimi智能体(Kimi Agent)的内测版，它能够独立完成规划、调用工具、输出结果等一系列复杂任务。',
    link: 'https://kimi.moonshot.cn/',
    country: '中国',
    category: '模型',
    pricing: '免费',
    imageUrl: 'https://storage.googleapis.com/aif-st-images-dev/v1/0858e8b0-516d-4959-9944-b490f84570b5'
  },
  {
    id: '4',
    date: '2024-05-15',
    company: 'Google',
    logo: 'https://placehold.co/40x40/EA4335/FFFFFF/png?text=G',
    title: 'Gemini 1.5 Flash - 更快、更经济的模型',
    description: '谷歌发布了 Gemini 1.5 Flash，一个为大规模、高频任务设计的轻量级模型，兼顾了成本效益和性能。',
    link: 'https://deepmind.google/technologies/gemini/gemini-1-5/',
    country: '美国',
    category: '模型',
    pricing: '付费',
    imageUrl: 'https://storage.googleapis.com/aif-st-images-dev/v1/9483dc87-f823-455b-80ba-3b604e389d04'
  },
  {
    id: '5',
    date: '2024-05-09',
    company: '科大讯飞',
    logo: 'https://placehold.co/40x40/E74C3C/FFFFFF/png?text=IF',
    title: '星火大模型 V4.0 即将发布',
    description: '科大讯飞宣布其星火大模型 V4.0 将于2024年6月27日发布，对标 GPT-4o，旨在提供更强大的多模态能力。',
    link: 'https://www.xfyun.cn/',
    country: '中国',
    category: '模型',
    pricing: '付费',
    imageUrl: 'https://storage.googleapis.com/aif-st-images-dev/v1/a78b54b0-315e-473d-82d8-2a07c13284aa'
  },
  {
    id: '6',
    date: '2024-04-23',
    company: 'Meta',
    logo: 'https://placehold.co/40x40/3498DB/FFFFFF/png?text=M',
    title: 'Llama 3 开源，性能卓越',
    description: 'Meta 发布了 Llama 3 开源大模型，其 8B 和 70B 版本在多个基准测试中表现优异，成为目前最强大的开源模型之一。',
    link: 'https://ai.meta.com/blog/meta-llama-3/',
    country: '美国',
    category: '模型',
    pricing: '开源',
    imageUrl: 'https://storage.googleapis.com/aif-st-images-dev/v1/67634f19-32e6-4277-ac31-897b5e7d1746'
  },
   {
    id: '7',
    date: '2024-05-15',
    company: 'Google',
    logo: 'https://placehold.co/40x40/EA4335/FFFFFF/png?text=G',
    title: '发布第六代 TPU Trillium',
    description: '谷歌推出了其第六代张量处理单元（TPU）——Trillium，与上一代TPU v5e相比，每个芯片的峰值计算性能提升了4.7倍。',
    link: 'https://cloud.google.com/blog/products/ai-machine-learning/google-trillium-tpu-sixth-generation-tpu',
    country: '美国',
    category: '算力',
    pricing: '付费',
    imageUrl: 'https://storage.googleapis.com/aif-st-images-dev/v1/5e54c869-4e55-46e3-82a8-a3f2b6831d1d'
  },
  {
    id: '8',
    date: '2024-03-13',
    company: '零一万物',
    logo: 'https://placehold.co/40x40/1ABC9C/FFFFFF/png?text=01',
    title: 'Yi-Large 模型 API 发布',
    description: '由李开复博士创办的零一万物公司，正式对外开放了其 Yi-Large 闭源模型的 API 服务，进入“MaaS”市场。',
    link: 'https://www.01.ai/',
    country: '中国',
    category: '模型',
    pricing: '付费',
    imageUrl: 'https://storage.googleapis.com/aif-st-images-dev/v1/170f3f2d-986c-4870-9b39-1660d3d52d9c'
  }
];
