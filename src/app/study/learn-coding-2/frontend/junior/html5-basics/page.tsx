'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, BookOpen, ExternalLink, CheckCircle2, ArrowUp, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

export default function Html5BasicsPage() {
  // 页面加载时检查URL锚点并滚动到对应位置
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash) {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      }
    }
  }, []);
  // 折叠状态管理
  const [collapsedSections, setCollapsedSections] = useState<Set<number>>(new Set());

  const toggleSection = (index: number) => {
    const newCollapsed = new Set(collapsedSections);
    if (newCollapsed.has(index)) {
      newCollapsed.delete(index);
    } else {
      newCollapsed.add(index);
    }
    setCollapsedSections(newCollapsed);
  };

  const sections = [
    {
      title: '发展史',
      description: 'HTML从文档到应用平台的30年史诗演进',
      keyPoints: [
        '1991年：HTML诞生，仅18个标签的超文本革命',
        '1995年：HTML 2.0标准化，表单让网页可交互',
        '1997年：HTML 4.01奠定现代Web基础架构',
        '2000年：XHTML理想主义实验，最终宣告失败',
        '2004年：WHATWG反叛，HTML5革命开始酝酿',
        '2014年：HTML5正式标准，Web应用平台诞生'
      ]
    },
    {
      title: '设计美学',
      description: '',
      keyPoints: [
        '极简主义原则：用最简单的方式解决问题，就像用筷子吃饭比用刀叉更直接',
        '声明式编程思维：告诉电脑你要什么结果，而不是教它怎么做，就像点菜而不是教厨师做菜',
        '关注点分离架构：HTML管结构，CSS管样式，JS管交互，各司其职不添乱',
        '渐进增强策略：先保证基本功能能用，再慢慢加花哨的效果，就像盖房子先打地基',
        '语义化优先原则：标签要表达内容的真实含义，不是为了好看，就像给东西贴正确的标签',
        '容错性设计哲学：即使代码写错了也要努力显示，不能因为一个错误就全部崩溃',
        '无障碍设计理念：要考虑视力不好、用键盘操作的用户，技术要为所有人服务'
      ]
    },
    {
      title: '学习资源',
      description: '深入学习HTML的权威资源和实用工具',
      isResourceSection: true
    },
    {
      title: '按功能分类',
      description: 'HTML标签的完整功能分类体系和代码示例',
      isFunctionalSection: true,
      functionalCategories: [
        {
          name: '文档结构标签',
          subtitle: 'Document Structure - 根元素与元数据',
          code: `<!DOCTYPE html>        <!-- 文档类型声明 -->
<html>                 <!-- 根元素 -->
<head>                 <!-- 元数据容器 -->
  <title>页面标题</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="页面描述">
  <link rel="stylesheet" href="style.css">
  <style>/* 内部样式 */</style>
  <script src="app.js"></script>
  <base href="https://example.com/">
</head>
<body>                 <!-- 文档主体 -->
</body>
</html>`,
          tags: ['html', 'head', 'title', 'base', 'link', 'meta', 'style', 'body']
        },
        {
          name: '内容分区标签',
          subtitle: 'Content Sectioning - HTML5语义化结构',
          code: `<header>
  <nav>
    <ul>
      <li><a href="#home">首页</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <header>
      <h1>文章标题</h1>
    </header>
    
    <section>
      <h2>章节1</h2>
      <p>内容...</p>
    </section>
    
    <aside>
      <h3>相关链接</h3>
    </aside>
    
    <footer>
      <p>发布日期</p>
    </footer>
  </article>
</main>

<footer>
  <address>联系方式</address>
</footer>`,
          tags: ['header', 'nav', 'main', 'article', 'section', 'aside', 'footer', 'address', 'h1-h6']
        },
        {
          name: '文本内容标签',
          subtitle: 'Text Content - 段落与列表',
          code: `<!-- 段落 -->
<p>普通段落文本</p>

<!-- 引用 -->
<blockquote cite="https://example.com">
  <p>长篇引用内容</p>
</blockquote>

<!-- 预格式化 -->
<pre>
  保留    空格
  和换行
</pre>

<!-- 列表 -->
<ul>                    <!-- 无序列表 -->
  <li>项目1</li>
  <li>项目2</li>
</ul>

<ol>                    <!-- 有序列表 -->
  <li>第一步</li>
  <li>第二步</li>
</ol>

<dl>                    <!-- 描述列表 -->
  <dt>术语</dt>
  <dd>定义</dd>
</dl>

<!-- 分组 -->
<div>通用块级容器</div>
<figure>              <!-- 图文组合 -->
  <img src="pic.jpg">
  <figcaption>图片说明</figcaption>
</figure>

<!-- 水平线 -->
<hr>`,
          tags: ['p', 'hr', 'pre', 'blockquote', 'ol', 'ul', 'li', 'dl', 'dt', 'dd', 'div', 'figure', 'figcaption']
        },
        {
          name: '内联文本语义标签',
          subtitle: 'Inline Text Semantics - 强调与重要性',
          code: `<!-- 强调层次 -->
<strong>重要内容</strong>      <!-- 结构性重要 -->
<em>强调内容</em>              <!-- 语气强调 -->
<b>加粗文本</b>                <!-- 视觉突出 -->
<i>斜体文本</i>                <!-- 视觉区分 -->
<mark>高亮文本</mark>          <!-- 标记/高亮 -->
<small>附属细则</small>        <!-- 免责声明等 -->

<!-- 编程相关 -->
<code>console.log('code')</code>  <!-- 代码片段 -->
<kbd>Ctrl+C</kbd>                 <!-- 键盘输入 -->
<samp>输出结果</samp>             <!-- 程序输出 -->
<var>x</var>                      <!-- 变量 -->

<!-- 引用与定义 -->
<cite>《书名》</cite>             <!-- 作品引用 -->
<q>短引用</q>                     <!-- 行内引用 -->
<abbr title="HyperText Markup Language">HTML</abbr>  <!-- 缩写 -->

<!-- 上下标 -->
H<sub>2</sub>O                    <!-- 下标 -->
x<sup>2</sup>                     <!-- 上标 -->

<!-- 其他 -->
<span>通用内联容器</span>
<a href="#">超链接</a>
<time datetime="2025-11-03">今天</time>`,
          tags: ['strong', 'em', 'b', 'i', 'mark', 'small', 'code', 'kbd', 'samp', 'var', 'cite', 'q', 'abbr', 'sub', 'sup', 'span', 'a', 'time']
        }
      ]
    },
    {
      title: '按显示类型分类',
      description: 'HTML元素的显示特性分类和布局行为',
      isDisplayTypeSection: true,
      displayTypes: [
        {
          name: '块级元素',
          subtitle: 'Block-level Elements',
          characteristics: [
            '独占一行',
            '可设置宽高',
            '默认宽度 100%'
          ],
          code: `<!-- 块级元素示例 -->
<div>块级容器</div>
<p>段落文本</p>
<h1>一级标题</h1>
<ul>
  <li>列表项</li>
</ul>
<header>页面头部</header>
<section>内容区块</section>`,
          tags: ['div', 'p', 'h1-h6', 'ul', 'ol', 'li', 'dl', 'table', 'form', 'fieldset', 'blockquote', 'pre', 'hr', 'header', 'footer', 'section', 'article', 'aside', 'nav', 'main', 'figure', 'figcaption', 'address', 'details']
        },
        {
          name: '内联元素',
          subtitle: 'Inline Elements',
          characteristics: [
            '在一行内显示',
            '不可设置宽高',
            '宽度由内容决定'
          ],
          code: `<!-- 内联元素示例 -->
<span>内联容器</span>
<a href="#">链接</a>
<strong>重要文本</strong>
<em>强调文本</em>
<code>代码片段</code>
<time>时间标记</time>`,
          tags: ['span', 'a', 'strong', 'em', 'b', 'i', 'u', 's', 'mark', 'small', 'abbr', 'cite', 'code', 'kbd', 'samp', 'var', 'sub', 'sup', 'q', 'time', 'data', 'br', 'wbr']
        },
        {
          name: '内联块元素',
          subtitle: 'Inline-block Elements',
          characteristics: [
            '在一行内显示',
            '可设置宽高',
            '结合两者优点'
          ],
          code: `<!-- 内联块元素示例 -->
<img src="image.jpg" width="100" height="100">
<input type="text" style="width: 200px;">
<button style="width: 120px; height: 40px;">按钮</button>
<select style="width: 150px;">
  <option>选项</option>
</select>`,
          tags: ['img', 'input', 'button', 'select', 'textarea', 'label', 'iframe']
        },
        {
          name: '替换元素',
          subtitle: 'Replaced Elements',
          characteristics: [
            '内容由外部资源决定',
            '具有固有尺寸',
            '可被CSS替换'
          ],
          code: `<!-- 替换元素示例 -->
<img src="photo.jpg" alt="图片">
<video src="movie.mp4" controls></video>
<audio src="music.mp3" controls></audio>
<iframe src="https://example.com"></iframe>
<canvas width="300" height="200"></canvas>`,
          tags: ['img', 'video', 'audio', 'iframe', 'embed', 'object', 'canvas']
        }
      ]
    },
    {
      title: '按内容模型分类',
      description: 'HTML5内容模型分类体系和语义规范',
      isContentModelSection: true,
      contentModels: [
        {
          name: '流式内容',
          subtitle: 'Flow Content',
          description: '大多数body内的元素，构成文档的主要内容流',
          code: `<!-- 流式内容示例 -->
<div>
  <p>段落是流式内容</p>
  <ul>
    <li>列表也是流式内容</li>
  </ul>
  <section>
    <h2>章节标题</h2>
    <article>文章内容</article>
  </section>
</div>`,
          tags: ['div', 'p', 'h1-h6', 'ul', 'ol', 'li', 'section', 'article', 'header', 'footer', 'nav', 'aside', 'main', 'blockquote', 'pre', 'table', 'form', 'figure']
        },
        {
          name: '章节内容',
          subtitle: 'Sectioning Content',
          description: '定义文档结构和大纲的元素',
          code: `<!-- 章节内容示例 -->
<article>
  <header>
    <h1>文章标题</h1>
  </header>
  
  <section>
    <h2>第一章节</h2>
    <p>章节内容...</p>
  </section>
  
  <aside>
    <h3>相关信息</h3>
    <p>侧边栏内容...</p>
  </aside>
</article>

<nav>
  <ul>
    <li><a href="#section1">章节1</a></li>
    <li><a href="#section2">章节2</a></li>
  </ul>
</nav>`,
          tags: ['article', 'aside', 'nav', 'section']
        },
        {
          name: '标题内容',
          subtitle: 'Heading Content',
          description: '定义章节标题的元素',
          code: `<!-- 标题内容示例 -->
<h1>一级标题</h1>
<h2>二级标题</h2>
<h3>三级标题</h3>
<h4>四级标题</h4>
<h5>五级标题</h5>
<h6>六级标题</h6>

<!-- HTML5.1 中的 hgroup（已废弃） -->
<hgroup>
  <h1>主标题</h1>
  <h2>副标题</h2>
</hgroup>`,
          tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hgroup']
        },
        {
          name: '短语内容',
          subtitle: 'Phrasing Content',
          description: '文档中的文本和内联级别的标记',
          code: `<!-- 短语内容示例 -->
<p>
  这是一个包含
  <a href="#">链接</a>、
  <strong>重要文本</strong>、
  <em>强调文本</em>和
  <span>普通内联元素</span>的段落。
</p>

<p>
  还可以包含
  <img src="icon.png" alt="图标">、
  <input type="text" placeholder="输入框">和
  <button>按钮</button>等元素。
</p>`,
          tags: ['a', 'span', 'strong', 'em', 'img', 'input', 'button', 'code', 'kbd', 'mark', 'small', 'time', 'br', 'wbr']
        },
        {
          name: '嵌入内容',
          subtitle: 'Embedded Content',
          description: '从外部资源导入内容的元素',
          code: `<!-- 嵌入内容示例 -->
<img src="photo.jpg" alt="照片">

<video controls>
  <source src="movie.mp4" type="video/mp4">
</video>

<audio controls>
  <source src="music.mp3" type="audio/mpeg">
</audio>

<iframe src="https://example.com" 
        width="800" height="600">
</iframe>

<canvas id="myCanvas" width="400" height="300">
</canvas>

<svg width="100" height="100">
  <circle cx="50" cy="50" r="40" fill="blue" />
</svg>`,
          tags: ['img', 'video', 'audio', 'iframe', 'embed', 'object', 'canvas', 'svg']
        },
        {
          name: '交互内容',
          subtitle: 'Interactive Content',
          description: '用户可以交互的元素',
          code: `<!-- 交互内容示例 -->
<a href="#section">可点击链接</a>

<button onclick="alert('点击了按钮')">
  点击按钮
</button>

<input type="text" placeholder="输入文本">
<textarea placeholder="多行文本"></textarea>

<select>
  <option>选项1</option>
  <option>选项2</option>
</select>

<details>
  <summary>点击展开</summary>
  <p>隐藏的详细内容</p>
</details>

<label for="checkbox">
  <input type="checkbox" id="checkbox">
  复选框标签
</label>`,
          tags: ['a', 'button', 'input', 'textarea', 'select', 'details', 'label', 'audio', 'video', 'iframe']
        },
        {
          name: '元数据内容',
          subtitle: 'Metadata Content',
          description: '设置文档信息和行为的元素',
          code: `<!-- 元数据内容示例 -->
<!DOCTYPE html>
<html>
<head>
  <title>页面标题</title>
  
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="页面描述">
  
  <link rel="stylesheet" href="styles.css">
  <link rel="icon" href="favicon.ico">
  
  <style>
    body { font-family: Arial, sans-serif; }
  </style>
  
  <script src="app.js"></script>
  
  <base href="https://example.com/">
</head>`,
          tags: ['title', 'meta', 'link', 'style', 'base', 'script']
        }
      ]
    },
    {
      title: '按使用频率分类',
      description: 'HTML标签的使用频率分类和学习优先级',
      isFrequencySection: true,
      frequencyCategories: [
        {
          name: '高频标签',
          subtitle: 'Top 20 - 日常开发必备',
          description: '这些标签在实际开发中使用频率最高，是HTML学习的重点',
          code: `<!-- 高频标签示例 -->
<div class="container">
  <header>
    <nav>
      <ul>
        <li><a href="#home">首页</a></li>
      </ul>
    </nav>
  </header>
  
  <main>
    <section>
      <article>
        <h1>文章标题</h1>
        <p>段落内容 <span>内联文本</span></p>
        <img src="image.jpg" alt="图片">
      </article>
    </section>
    
    <form>
      <label for="name">姓名：</label>
      <input type="text" id="name">
      <button type="submit">提交</button>
    </form>
  </main>
  
  <footer>
    <p>页脚内容</p>
  </footer>
</div>

<script src="app.js"></script>
<link rel="stylesheet" href="style.css">
<meta name="viewport" content="width=device-width, initial-scale=1.0">`,
          tags: [
            { tag: 'div', desc: '布局容器' },
            { tag: 'span', desc: '内联容器' },
            { tag: 'p', desc: '段落' },
            { tag: 'a', desc: '链接' },
            { tag: 'img', desc: '图片' },
            { tag: 'ul', desc: '无序列表' },
            { tag: 'li', desc: '列表项' },
            { tag: 'h1-h6', desc: '标题' },
            { tag: 'form', desc: '表单' },
            { tag: 'input', desc: '输入框' },
            { tag: 'button', desc: '按钮' },
            { tag: 'label', desc: '标签' },
            { tag: 'header', desc: '头部' },
            { tag: 'footer', desc: '尾部' },
            { tag: 'nav', desc: '导航' },
            { tag: 'section', desc: '章节' },
            { tag: 'article', desc: '文章' },
            { tag: 'main', desc: '主内容' },
            { tag: 'script', desc: '脚本' },
            { tag: 'link', desc: '外部资源' },
            { tag: 'meta', desc: '元数据' }
          ]
        },
        {
          name: '中频标签',
          subtitle: 'Medium Frequency - 特定场景常用',
          description: '在特定功能开发中经常使用的标签',
          code: `<!-- 中频标签示例 -->
<table>
  <thead>
    <tr>
      <th>姓名</th>
      <th>年龄</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>张三</td>
      <td>25</td>
    </tr>
  </tbody>
</table>

<select>
  <option value="1">选项1</option>
  <option value="2">选项2</option>
</select>

<textarea placeholder="多行文本"></textarea>

<video controls>
  <source src="movie.mp4" type="video/mp4">
</video>

<audio controls>
  <source src="music.mp3" type="audio/mpeg">
</audio>

<canvas width="400" height="300"></canvas>

<svg width="100" height="100">
  <circle cx="50" cy="50" r="40" fill="blue" />
</svg>

<iframe src="https://example.com"></iframe>

<p>
  这是<strong>重要文本</strong>和<em>强调文本</em>，
  还有<code>代码片段</code>。
</p>

<pre>
  预格式化文本
  保持原有格式
</pre>`,
          tags: [
            { tag: 'table', desc: '表格' },
            { tag: 'tr', desc: '表格行' },
            { tag: 'td', desc: '数据单元格' },
            { tag: 'th', desc: '表头单元格' },
            { tag: 'select', desc: '下拉选择' },
            { tag: 'option', desc: '选项' },
            { tag: 'textarea', desc: '多行文本' },
            { tag: 'video', desc: '视频' },
            { tag: 'audio', desc: '音频' },
            { tag: 'canvas', desc: '画布' },
            { tag: 'svg', desc: '矢量图形' },
            { tag: 'iframe', desc: '内嵌框架' },
            { tag: 'strong', desc: '重要文本' },
            { tag: 'em', desc: '强调文本' },
            { tag: 'code', desc: '代码' },
            { tag: 'pre', desc: '预格式化' }
          ]
        },
        {
          name: '低频标签',
          subtitle: 'Low Frequency - 特殊用途',
          description: '在特殊场景或高级功能中使用的标签',
          code: `<!-- 低频标签示例 -->
<address>
  联系方式：<a href="mailto:contact@example.com">contact@example.com</a>
</address>

<p>
  <abbr title="HyperText Markup Language">HTML</abbr>
  是网页标记语言。
</p>

<blockquote>
  <p>这是一个引用</p>
  <cite>—— 引用来源</cite>
</blockquote>

<p>
  <dfn>术语定义</dfn>是对专业词汇的解释。
  按<kbd>Ctrl+C</kbd>复制，
  输出结果是<samp>Hello World</samp>，
  变量<var>x</var>的值为10。
</p>

<details>
  <summary>点击展开详情</summary>
  <p>这是隐藏的详细内容</p>
</details>

<dialog id="myDialog">
  <p>这是一个对话框</p>
</dialog>

<p>
  进度：<progress value="70" max="100">70%</progress><br>
  评分：<meter value="0.8" min="0" max="1">80%</meter><br>
  时间：<time datetime="2025-11-03">今天</time><br>
  数据：<data value="12345">产品编号</data>
</p>

<p>这是一个很长的单词<wbr>可以在这里换行</p>`,
          tags: [
            { tag: 'abbr', desc: '缩写' },
            { tag: 'address', desc: '联系信息' },
            { tag: 'cite', desc: '引用来源' },
            { tag: 'dfn', desc: '术语定义' },
            { tag: 'kbd', desc: '键盘输入' },
            { tag: 'samp', desc: '程序输出' },
            { tag: 'var', desc: '变量' },
            { tag: 'details', desc: '折叠详情' },
            { tag: 'summary', desc: '详情摘要' },
            { tag: 'dialog', desc: '对话框' },
            { tag: 'meter', desc: '度量器' },
            { tag: 'progress', desc: '进度条' },
            { tag: 'time', desc: '时间' },
            { tag: 'data', desc: '数据' },
            { tag: 'wbr', desc: '换行机会' }
          ]
        }
      ]
    },
    {
      title: '按HTML版本分类',
      description: 'HTML标签的历史演进和版本差异',
      isVersionSection: true,
      versionCategories: [
        {
          name: 'HTML4时代的核心标签',
          subtitle: 'HTML 4.01 - 经典基础标签',
          description: '这些标签构成了传统Web开发的基础，至今仍是HTML的核心',
          code: `<!-- HTML4 经典结构 -->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" 
  "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
  <title>HTML4 页面</title>
</head>
<body>
  <div id="header">
    <h1>网站标题</h1>
    <ul>
      <li><a href="#home">首页</a></li>
      <li><a href="#about">关于</a></li>
    </ul>
  </div>
  
  <div id="content">
    <div class="post">
      <h2>文章标题</h2>
      <p>这是一个段落，包含<span>内联元素</span>。</p>
      <img src="photo.jpg" alt="图片">
      
      <table>
        <tr>
          <th>姓名</th>
          <th>年龄</th>
        </tr>
        <tr>
          <td>张三</td>
          <td>25</td>
        </tr>
      </table>
      
      <form action="/submit" method="post">
        <input type="text" name="username">
        <input type="submit" value="提交">
      </form>
    </div>
  </div>
  
  <div id="footer">
    <p>版权信息</p>
  </div>
</body>
</html>`,
          tags: ['div', 'span', 'p', 'a', 'img', 'table', 'form', 'input', 'h1-h6', 'ul', 'ol', 'li', 'tr', 'td', 'th', 'thead', 'tbody', 'select', 'option', 'textarea', 'button']
        },
        {
          name: 'HTML5新增的语义标签',
          subtitle: 'HTML5 - 语义化革命',
          description: 'HTML5引入的新标签让网页结构更有语义，功能更强大',
          code: `<!-- HTML5 语义化结构 -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HTML5 页面</title>
</head>
<body>
  <!-- 结构标签 -->
  <header>
    <nav>
      <ul>
        <li><a href="#home">首页</a></li>
      </ul>
    </nav>
  </header>
  
  <main>
    <section>
      <article>
        <header>
          <h1>文章标题</h1>
          <time datetime="2025-11-03">2025年11月3日</time>
        </header>
        
        <p>文章内容包含<mark>高亮文本</mark>和<data value="123">数据</data>。</p>
        
        <figure>
          <picture>
            <source media="(min-width: 800px)" srcset="large.jpg">
            <img src="small.jpg" alt="响应式图片">
          </picture>
          <figcaption>图片说明</figcaption>
        </figure>
        
        <!-- 多媒体标签 -->
        <video controls>
          <source src="movie.mp4" type="video/mp4">
          <track kind="subtitles" src="subs.vtt" srclang="zh">
        </video>
        
        <audio controls>
          <source src="music.mp3" type="audio/mpeg">
        </audio>
        
        <canvas width="400" height="300"></canvas>
        
        <svg width="100" height="100">
          <circle cx="50" cy="50" r="40" fill="blue" />
        </svg>
        
        <!-- 表单增强 -->
        <form>
          <input list="browsers" name="browser">
          <datalist id="browsers">
            <option value="Chrome">
            <option value="Firefox">
          </datalist>
          
          <output name="result"></output>
          <progress value="70" max="100">70%</progress>
          <meter value="0.8" min="0" max="1">80%</meter>
        </form>
        
        <!-- 交互元素 -->
        <details>
          <summary>点击展开</summary>
          <p>隐藏内容</p>
        </details>
        
        <dialog id="myDialog">
          <p>对话框内容</p>
        </dialog>
        
        <p>长单词可以在这里<wbr>换行。</p>
      </article>
    </section>
    
    <aside>
      <h2>侧边栏</h2>
    </aside>
  </main>
  
  <footer>
    <address>联系信息</address>
  </footer>
</body>
</html>`,
          subcategories: [
            {
              name: '结构标签',
              tags: ['header', 'footer', 'nav', 'main', 'section', 'article', 'aside', 'figure', 'figcaption']
            },
            {
              name: '多媒体标签',
              tags: ['video', 'audio', 'canvas', 'svg', 'source', 'track', 'picture']
            },
            {
              name: '表单增强',
              tags: ['datalist', 'output', 'progress', 'meter']
            },
            {
              name: '交互元素',
              tags: ['details', 'summary', 'dialog']
            },
            {
              name: '文本语义',
              tags: ['mark', 'time', 'data', 'wbr']
            }
          ]
        }
      ]
    },
    {
      title: '按设计用途分类',
      description: 'HTML标签按实际设计用途的功能分类',
      isPurposeSection: true,
      purposeCategories: [
        {
          name: '布局类',
          subtitle: 'Layout Elements - 页面结构组织',
          description: '用于构建页面整体结构和布局的标签',
          code: `<!-- 布局类标签示例 -->
<div class="container">
  <header class="site-header">
    <div class="logo">网站Logo</div>
    <nav class="main-nav">
      <ul>
        <li><a href="#home">首页</a></li>
        <li><a href="#about">关于</a></li>
      </ul>
    </nav>
  </header>
  
  <main class="main-content">
    <section class="hero-section">
      <div class="hero-content">
        <h1>欢迎来到我们的网站</h1>
      </div>
    </section>
    
    <section class="features-section">
      <article class="feature-card">
        <h2>特色功能1</h2>
        <p>功能描述...</p>
      </article>
      
      <article class="feature-card">
        <h2>特色功能2</h2>
        <p>功能描述...</p>
      </article>
    </section>
    
    <aside class="sidebar">
      <div class="widget">
        <h3>侧边栏内容</h3>
        <p>相关信息...</p>
      </div>
    </aside>
  </main>
  
  <footer class="site-footer">
    <div class="footer-content">
      <p>&copy; 2025 版权所有</p>
    </div>
  </footer>
</div>`,
          tags: ['div', 'header', 'footer', 'main', 'section', 'article', 'aside', 'nav']
        },
        {
          name: '文本类',
          subtitle: 'Text Elements - 文本内容处理',
          description: '用于处理各种文本内容和文本语义的标签',
          code: `<!-- 文本类标签示例 -->
<article class="blog-post">
  <header>
    <h1>文章主标题</h1>
    <h2>文章副标题</h2>
  </header>
  
  <div class="content">
    <h3>章节标题</h3>
    <p>
      这是一个普通段落，包含
      <strong>重要文本</strong>、
      <em>强调文本</em>和
      <span class="highlight">特殊标记</span>。
    </p>
    
    <p>
      文本还可以包含
      <mark>高亮标记</mark>、
      <small>附属说明</small>，
      以及编辑标记如
      <del>删除的文本</del>
      <ins>插入的文本</ins>。
    </p>
    
    <h4>四级标题</h4>
    <p>更多段落内容...</p>
    
    <h5>五级标题</h5>
    <p>详细说明内容...</p>
    
    <h6>六级标题</h6>
    <p>最小层级的标题内容...</p>
  </div>
</article>`,
          tags: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'strong', 'em', 'mark', 'small', 'del', 'ins']
        },
        {
          name: '媒体类',
          subtitle: 'Media Elements - 多媒体内容',
          description: '用于嵌入和展示各种多媒体内容的标签',
          code: `<!-- 媒体类标签示例 -->
<section class="media-gallery">
  <!-- 图片展示 -->
  <div class="image-section">
    <img src="photo1.jpg" alt="风景照片" width="400" height="300">
    
    <!-- 响应式图片 -->
    <picture>
      <source media="(min-width: 800px)" srcset="large.jpg">
      <source media="(min-width: 400px)" srcset="medium.jpg">
      <img src="small.jpg" alt="响应式图片">
    </picture>
  </div>
  
  <!-- 视频内容 -->
  <div class="video-section">
    <video controls width="640" height="360" poster="poster.jpg">
      <source src="movie.mp4" type="video/mp4">
      <source src="movie.webm" type="video/webm">
      您的浏览器不支持视频播放
    </video>
  </div>
  
  <!-- 音频内容 -->
  <div class="audio-section">
    <audio controls>
      <source src="music.mp3" type="audio/mpeg">
      <source src="music.ogg" type="audio/ogg">
      您的浏览器不支持音频播放
    </audio>
  </div>
  
  <!-- 画布绘图 -->
  <div class="canvas-section">
    <canvas id="myCanvas" width="400" height="300">
      您的浏览器不支持Canvas
    </canvas>
  </div>
  
  <!-- SVG图形 -->
  <div class="svg-section">
    <svg width="200" height="200">
      <circle cx="100" cy="100" r="80" fill="lightblue" stroke="navy" stroke-width="2" />
      <text x="100" y="105" text-anchor="middle" fill="navy">SVG图形</text>
    </svg>
  </div>
</section>`,
          tags: ['img', 'video', 'audio', 'picture', 'canvas', 'svg']
        },
        {
          name: '表单类',
          subtitle: 'Form Elements - 用户交互表单',
          description: '用于创建用户输入和交互界面的标签',
          code: `<!-- 表单类标签示例 -->
<form class="contact-form" action="/submit" method="POST">
  <fieldset class="personal-info">
    <legend>个人信息</legend>
    
    <div class="form-group">
      <label for="name">姓名：</label>
      <input type="text" id="name" name="name" required>
    </div>
    
    <div class="form-group">
      <label for="email">邮箱：</label>
      <input type="email" id="email" name="email" required>
    </div>
    
    <div class="form-group">
      <label for="phone">电话：</label>
      <input type="tel" id="phone" name="phone">
    </div>
  </fieldset>
  
  <fieldset class="preferences">
    <legend>偏好设置</legend>
    
    <div class="form-group">
      <label for="country">国家：</label>
      <select id="country" name="country">
        <option value="">请选择</option>
        <option value="cn">中国</option>
        <option value="us">美国</option>
        <option value="jp">日本</option>
      </select>
    </div>
    
    <div class="form-group">
      <label for="message">留言：</label>
      <textarea id="message" name="message" rows="5" cols="40" 
                placeholder="请输入您的留言..."></textarea>
    </div>
  </fieldset>
  
  <div class="form-actions">
    <button type="submit">提交表单</button>
    <button type="reset">重置表单</button>
    <button type="button" onclick="preview()">预览</button>
  </div>
</form>`,
          tags: ['form', 'input', 'button', 'select', 'textarea', 'label', 'fieldset', 'legend', 'option', 'optgroup']
        },
        {
          name: '数据展示类',
          subtitle: 'Data Display Elements - 结构化数据',
          description: '用于展示结构化数据和信息列表的标签',
          code: `<!-- 数据展示类标签示例 -->
<section class="data-display">
  <!-- 表格数据 -->
  <div class="table-section">
    <h3>员工信息表</h3>
    <table class="employee-table">
      <thead>
        <tr>
          <th>姓名</th>
          <th>部门</th>
          <th>职位</th>
          <th>入职时间</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>张三</td>
          <td>技术部</td>
          <td>前端工程师</td>
          <td>2023-01-15</td>
        </tr>
        <tr>
          <td>李四</td>
          <td>设计部</td>
          <td>UI设计师</td>
          <td>2023-03-20</td>
        </tr>
      </tbody>
    </table>
  </div>
  
  <!-- 无序列表 -->
  <div class="list-section">
    <h3>产品特性</h3>
    <ul class="feature-list">
      <li>响应式设计</li>
      <li>跨浏览器兼容</li>
      <li>高性能优化</li>
      <li>安全可靠</li>
    </ul>
  </div>
  
  <!-- 有序列表 -->
  <div class="steps-section">
    <h3>操作步骤</h3>
    <ol class="step-list">
      <li>注册账户</li>
      <li>验证邮箱</li>
      <li>完善资料</li>
      <li>开始使用</li>
    </ol>
  </div>
  
  <!-- 描述列表 -->
  <div class="definition-section">
    <h3>术语解释</h3>
    <dl class="term-list">
      <dt>HTML</dt>
      <dd>超文本标记语言，用于创建网页结构</dd>
      
      <dt>CSS</dt>
      <dd>层叠样式表，用于控制网页样式和布局</dd>
      
      <dt>JavaScript</dt>
      <dd>编程语言，用于实现网页交互功能</dd>
    </dl>
  </div>
</section>`,
          tags: ['table', 'thead', 'tbody', 'tr', 'th', 'td', 'ul', 'ol', 'li', 'dl', 'dt', 'dd']
        }
      ]
    },
    {
      title: '学习路线图',
      description: 'HTML标签的渐进式学习路径和完整速查表',
      isRoadmapSection: true,
      roadmapStages: [
        {
          stage: '第一阶段',
          title: '必学标签',
          count: '10个',
          description: 'HTML学习的基础，掌握这些标签就能创建基本网页',
          priority: 'high',
          tags: ['html', 'head', 'body', 'div', 'p', 'a', 'img', 'h1', 'ul', 'li']
        },
        {
          stage: '第二阶段',
          title: '常用标签',
          count: '20个',
          description: '在第一阶段基础上，增加常用的语义化和表单标签',
          priority: 'medium',
          tags: ['span', 'form', 'input', 'button', 'label', 'header', 'footer', 'nav', 'section', 'article', 'table', 'tr', 'td', 'strong', 'em']
        },
        {
          stage: '第三阶段',
          title: '进阶标签',
          count: '30个',
          description: '掌握多媒体、高级表单和现代HTML5功能标签',
          priority: 'medium',
          tags: ['video', 'audio', 'canvas', 'select', 'textarea', 'main', 'aside', 'figure', 'details', 'time', 'code', 'pre', 'blockquote', 'abbr']
        },
        {
          stage: '第四阶段',
          title: '专业标签',
          count: '全部',
          description: '掌握所有HTML标签，成为HTML专家',
          priority: 'low',
          isComplete: true
        }
      ],
      completeTagList: [
        {
          range: 'A-C',
          tags: ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup']
        },
        {
          range: 'D-H',
          tags: ['data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1-h6', 'head', 'header', 'hgroup', 'hr', 'html']
        },
        {
          range: 'I-M',
          tags: ['i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'meta', 'meter']
        },
        {
          range: 'N-S',
          tags: ['nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'slot', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'svg']
        },
        {
          range: 'T-Z',
          tags: ['table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr']
        }
      ]
    },
    {
      title: '使用建议',
      description: 'HTML标签使用的最佳实践和常见误区',
      isBestPracticeSection: true,
      bestPractices: [
        {
          title: '语义化优先',
          subtitle: 'Semantic First - 选择有意义的标签',
          description: '优先使用语义化标签，而不是通用的div和span',
          examples: [
            {
              type: 'wrong',
              label: '不推荐',
              code: `<div class="header">
  <div class="nav">
    <div class="nav-item">链接</div>
  </div>
</div>

<div class="main">
  <div class="article">
    <div class="title">标题</div>
    <div class="content">内容</div>
  </div>
</div>

<div class="footer">
  <div class="copyright">版权信息</div>
</div>`
            },
            {
              type: 'right',
              label: '推荐',
              code: `<header>
  <nav>
    <a href="#">链接</a>
  </nav>
</header>

<main>
  <article>
    <h1>标题</h1>
    <p>内容</p>
  </article>
</main>

<footer>
  <p>版权信息</p>
</footer>`
            }
          ]
        },
        {
          title: '选择合适的标签',
          subtitle: 'Right Tag for Right Purpose - 标签语义匹配',
          description: '根据内容的语义选择最合适的标签，而不是视觉效果',
          examples: [
            {
              type: 'comparison',
              label: '语义对比',
              code: `<!-- 强调标签的正确使用 -->
<strong>重要警告</strong>  ← 结构性重要，不是 <b>
<em>语气强调</em>        ← 语调强调，不是 <i>

<!-- 引用标签的正确使用 -->
<cite>《HTML权威指南》</cite>  ← 作品引用，不是 <i>
<q>这是一个短引用</q>        ← 行内引用，不是引号

<!-- 代码标签的正确使用 -->
<code>console.log()</code>    ← 代码片段，不是 <pre>
<kbd>Ctrl+C</kbd>            ← 键盘输入，不是 <code>
<samp>Hello World</samp>     ← 程序输出，不是 <code>

<!-- 文本标记的正确使用 -->
<mark>高亮文本</mark>        ← 标记重点，不是 <span>
<small>附属说明</small>      ← 免责声明，不是 <span>
<time datetime="2025-11-03">今天</time>  ← 时间标记`
            }
          ]
        },
        {
          title: '可访问性考虑',
          subtitle: 'Accessibility Matters - 为所有用户设计',
          description: '确保网页对所有用户都可访问，包括使用辅助技术的用户',
          examples: [
            {
              type: 'accessibility',
              label: '可访问性最佳实践',
              code: `<!-- 图片可访问性 -->
<img src="chart.jpg" alt="2025年销售数据图表，显示第一季度增长15%">

<!-- 表单可访问性 -->
<label for="username">用户名：</label>
<input id="username" type="text" 
       aria-describedby="username-help" required>
<div id="username-help">请输入3-20个字符</div>

<!-- 表格可访问性 -->
<table>
  <caption>员工信息表</caption>
  <thead>
    <tr>
      <th scope="col">姓名</th>
      <th scope="col">部门</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">张三</th>
      <td>技术部</td>
    </tr>
  </tbody>
</table>

<!-- 链接可访问性 -->
<a href="report.pdf" 
   aria-label="下载2025年度报告PDF文件">
  下载报告
</a>

<!-- 按钮可访问性 -->
<button type="button" 
        aria-expanded="false" 
        aria-controls="menu">
  菜单
</button>`
            }
          ]
        }
      ]
    }
  ];

  const resources = [
    { 
      name: 'MDN HTML 教程', 
      url: 'https://developer.mozilla.org/zh-CN/docs/Web/HTML', 
      description: '最权威的HTML文档和教程' 
    },
    { 
      name: 'W3Schools HTML', 
      url: 'https://www.w3schools.com/html/', 
      description: '交互式HTML学习平台' 
    },
    { 
      name: 'HTML验证器', 
      url: 'https://validator.w3.org/', 
      description: '检查HTML代码是否符合标准' 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50" style={{ scrollBehavior: 'smooth' }}>
      <style jsx>{`
        @media (max-width: 768px) {
          .responsive-flex-col {
            flex-direction: column !important;
          }
          .responsive-w-full {
            width: 100% !important;
          }
        }
      `}</style>
      <div className="container-responsive py-6">


        {/* 头部导航 */}
        <div className="mb-6">
          <Link href="/study/learn-coding-2/frontend/junior">
            <Button variant="outline" size="sm" className="btn-responsive">
              <ArrowLeft className="mr-2 icon-responsive-sm" />
              <span className="hidden xs:inline">返回初级前端</span>
              <span className="xs:hidden">返回</span>
            </Button>
          </Link>
        </div>



        {/* 学习内容 */}
        <div className="space-y-8 mb-8">
          {sections.map((section, idx) => (
            <Card key={idx} id={encodeURIComponent(section.title)} className="p-6 bg-white/80 backdrop-blur-sm scroll-mt-20">
              {/* 标题 - 可点击折叠 */}
              <div 
                className="flex items-start gap-3 mb-4 cursor-pointer hover:bg-gray-50/50 transition-colors rounded-lg p-2 -m-2"
                onClick={() => toggleSection(idx)}
              >
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{section.title}</h2>
                  <p className="text-gray-600">{section.description}</p>
                </div>
                <div className="flex-shrink-0 mt-1">
                  {collapsedSections.has(idx) ? (
                    <ChevronDown className="w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <ChevronUp className="w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </div>
              </div>

              {/* 内容区域 - 可折叠 */}
              {!collapsedSections.has(idx) && (
                <>
                  {/* 代码示例 */}
                  {section.code && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-800 mb-2">代码示例</h3>
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{section.code}</code>
                      </pre>
                    </div>
                  )}

                  {/* 关键点 - 发展史特殊布局 */}
                  <div>
                    {section.title !== '发展史' && section.title !== '设计美学' && section.title !== '学习资源' && section.title !== '按功能分类' && section.title !== '按显示类型分类' && section.title !== '按内容模型分类' && section.title !== '按使用频率分类' && section.title !== '按HTML版本分类' && section.title !== '按设计用途分类' && section.title !== '学习路线图' && section.title !== '核心内容' && (
                      <h3 className="font-semibold text-gray-800 mb-2">核心：</h3>
                    )}
                {section.title === '发展史' ? (
                  <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                    {/* 左侧：紧凑时间线 - 自适应宽度 */}
                    <div className="md:flex-shrink-0 md:w-auto md:min-w-[280px] lg:min-w-[320px] lg:max-w-[400px] relative bg-gradient-to-br from-green-50/50 to-emerald-50/50 p-3 sm:p-4 rounded-lg border border-green-200/50">
                      {/* 时间线 */}
                      <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gradient-to-b from-green-400 to-green-600"></div>
                      <div className="space-y-6 h-full flex flex-col justify-between">
                        {section.keyPoints.map((point, i) => {
                          const [year, ...rest] = point.split('：');
                          const description = rest.join('：');
                          return (
                            <div key={i} className="relative flex items-start gap-4 flex-1">
                              {/* 时间点 */}
                              <div className="relative z-10 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                                <div className="w-3 h-3 bg-white rounded-full"></div>
                              </div>
                              {/* 扩展内容 */}
                              <div className="flex-1 min-h-[80px] flex items-center">
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200 w-full">
                                  <div className="font-semibold text-green-700 text-sm mb-1">{year}</div>
                                  <div className="text-sm text-gray-800 leading-relaxed">{description}</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* 右侧：扩展解释面板 - 占据剩余空间 */}
                    <div className="md:flex-1 md:min-w-0">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-lg border border-blue-200 h-full">

                        
                        <div className="space-y-6 text-sm text-gray-700 h-full flex flex-col justify-between">
                          <div className="bg-white/70 p-4 rounded-lg border border-blue-100 flex-1 flex flex-col justify-center">
                            <div className="font-semibold text-blue-700 mb-2">诞生期 (1991-1995)</div>
                            <div className="leading-relaxed">蒂姆·伯纳斯-李在CERN工作时，为了让科学家们能互相分享文档，发明了HTML。最开始只有18个标签，超级简单！</div>
                          </div>
                          
                          <div className="bg-white/70 p-4 rounded-lg border border-blue-100 flex-1 flex flex-col justify-center">
                            <div className="font-semibold text-blue-700 mb-2">浏览器大战 (1995-2000)</div>
                            <div className="leading-relaxed">网景和IE两个浏览器公司开始竞争，各自添加新功能。网页从只能看变成了能填表单、能交互。</div>
                          </div>
                          
                          <div className="bg-white/70 p-4 rounded-lg border border-blue-100 flex-1 flex flex-col justify-center">
                            <div className="font-semibold text-blue-700 mb-2">XHTML实验 (2000-2004)</div>
                            <div className="leading-relaxed">有人想让HTML变得超级严格规范，结果太难用了，程序员们都不愿意用，最后失败了。</div>
                          </div>
                          
                          <div className="bg-white/70 p-4 rounded-lg border border-blue-100 flex-1 flex flex-col justify-center">
                            <div className="font-semibold text-blue-700 mb-2">HTML5革命 (2004-2014)</div>
                            <div className="leading-relaxed">一群公司联合起来重新设计HTML，加了视频、音频、游戏功能，网页变得像手机App一样强大。</div>
                          </div>
                          
                          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200 flex-1 flex flex-col justify-center">
                            <div className="font-semibold text-indigo-700 mb-2">Living Standard时代</div>
                            <div className="leading-relaxed">HTML现在不再发布新版本了，而是像微信一样持续更新。每年都会有新功能，让网页越来越厉害。</div>
                          </div>
                          
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200 flex-1 flex flex-col justify-center">
                            <div className="font-semibold text-green-700 mb-2">核心启示</div>
                            <div className="leading-relaxed">技术要好用才能成功，太复杂的东西没人愿意学。HTML能火30年，就是因为简单、包容、实用。</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : section.title === '设计美学' ? (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                    <div className="space-y-3">
                      {section.keyPoints.map((point, i) => {
                        const [title, ...content] = point.split('：');
                        const description = content.join('：');
                        
                        return (
                          <div key={i} className="bg-white/70 p-3 rounded-lg border border-blue-100 hover:bg-white hover:shadow-sm transition-all">
                            <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                              <h4 className="font-semibold text-blue-700 text-sm sm:w-1/3 flex-shrink-0">
                                {title}
                              </h4>
                              <p className="text-sm text-gray-800 leading-relaxed sm:w-2/3">
                                {description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                ) : section.isCoreContentSection ? (
                  <div className="space-y-4">
                    {section.categories.map((category, idx) => (
                      <div key={idx} className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                          <div className="sm:w-1/4">
                            <h4 className="font-semibold text-green-700 text-sm mb-1">
                              {category.name}
                            </h4>
                            <p className="text-xs text-gray-600 leading-relaxed">
                              {category.description}
                            </p>
                          </div>
                          
                          <div className="sm:w-1/2">
                            <div className="flex flex-wrap gap-1 mb-2">
                              {category.tags.map((tag, tagIdx) => (
                                <span key={tagIdx} className="inline-block px-2 py-1 bg-white/80 text-xs text-green-700 rounded border border-green-300 font-mono">
                                  &lt;{tag}&gt;
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="sm:w-1/4">
                            <p className="text-xs text-gray-700 leading-relaxed">
                              {category.usage}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 mt-6">
                      <h4 className="font-semibold text-blue-700 text-sm mb-2">💡 学习建议</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div className="bg-white/70 p-3 rounded border border-blue-100">
                          <div className="font-medium text-blue-600 mb-1">第一阶段</div>
                          <div className="text-gray-700">掌握文档结构和基础文本标签（10个核心标签）</div>
                        </div>
                        <div className="bg-white/70 p-3 rounded border border-blue-100">
                          <div className="font-medium text-blue-600 mb-1">第二阶段</div>
                          <div className="text-gray-700">学习语义化标签和表单控件（20个常用标签）</div>
                        </div>
                        <div className="bg-white/70 p-3 rounded border border-blue-100">
                          <div className="font-medium text-blue-600 mb-1">第三阶段</div>
                          <div className="text-gray-700">掌握多媒体和交互元素（全部标签体系）</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : section.isFunctionalSection ? (
                  <div className="space-y-6">
                    {section.functionalCategories.map((category, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-gray-50 to-slate-50 p-6 rounded-lg border border-gray-200">
                        {/* 分类标题 */}
                        <div className="mb-4">
                          <h4 className="text-lg font-bold text-gray-800 mb-1">
                            {idx + 1}. {category.name}
                          </h4>
                          <p className="text-sm text-gray-600 italic">
                            {category.subtitle}
                          </p>
                        </div>
                        
                        {/* 代码示例和标签列表 - 左右布局 */}
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* 左侧：代码示例 */}
                          <div className="lg:w-2/3">
                            <h5 className="font-semibold text-gray-700 mb-2 text-sm">代码示例</h5>
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm leading-relaxed">
                              <code>{category.code}</code>
                            </pre>
                          </div>
                          
                          {/* 右侧：标签列表 */}
                          <div className="lg:w-1/3">
                            <h5 className="font-semibold text-gray-700 mb-2 text-sm">完整列表（点击查看MDN文档）</h5>
                          <div className="flex flex-wrap gap-2">
                            {category.tags.map((tag, tagIdx) => {
                              // 处理特殊标签名称，生成正确的MDN链接
                              const getTagUrl = (tagName) => {
                                const baseUrl = 'https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/';
                                // 处理特殊情况
                                if (tagName === 'h1-h6') return baseUrl + 'Heading_Elements';
                                if (tagName.includes('-')) return baseUrl + tagName.split('-')[0];
                                return baseUrl + tagName;
                              };
                              
                              return (
                                <a
                                  key={tagIdx}
                                  href={getTagUrl(tag)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block px-3 py-1 bg-white text-xs text-gray-700 rounded-full border border-gray-300 font-mono hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all cursor-pointer"
                                  title={`查看 <${tag}> 标签的MDN文档`}
                                >
                                  &lt;{tag}&gt;
                                </a>
                              );
                            })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : section.isDisplayTypeSection ? (
                  <div className="space-y-6">
                    {section.displayTypes.map((type, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200">
                        {/* 类型标题和特点 */}
                        <div className="mb-4">
                          <h4 className="text-lg font-bold text-indigo-800 mb-1">
                            {idx + 1}. {type.name}
                          </h4>
                          <p className="text-sm text-indigo-600 italic mb-3">
                            {type.subtitle}
                          </p>
                          <div className="space-y-1">
                            <h5 className="font-semibold text-gray-700 text-sm">特点：</h5>
                            <div className="flex flex-wrap gap-4">
                              {type.characteristics.map((char, charIdx) => (
                                <div key={charIdx} className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full flex-shrink-0"></div>
                                  <span className="text-xs text-gray-700">{char}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* 代码示例和标签列表 - 左右布局 */}
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* 左侧：代码示例 */}
                          <div className="lg:w-2/3">
                            <h5 className="font-semibold text-gray-700 mb-2 text-sm">代码示例</h5>
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm leading-relaxed">
                              <code>{type.code}</code>
                            </pre>
                          </div>
                          
                          {/* 右侧：标签列表 */}
                          <div className="lg:w-1/3">
                          <h5 className="font-semibold text-gray-700 mb-2 text-sm">包含标签（点击查看MDN文档）</h5>
                          <div className="flex flex-wrap gap-2">
                            {type.tags.map((tag, tagIdx) => {
                              // 处理特殊标签名称，生成正确的MDN链接
                              const getTagUrl = (tagName) => {
                                const baseUrl = 'https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/';
                                // 处理特殊情况
                                if (tagName === 'h1-h6') return baseUrl + 'Heading_Elements';
                                if (tagName.includes('-')) return baseUrl + tagName.split('-')[0];
                                return baseUrl + tagName;
                              };
                              
                              return (
                                <a
                                  key={tagIdx}
                                  href={getTagUrl(tag)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block px-3 py-1 bg-white/80 text-xs text-indigo-700 rounded-full border border-indigo-300 font-mono hover:bg-indigo-100 hover:border-indigo-400 hover:text-indigo-800 transition-all cursor-pointer"
                                  title={`查看 <${tag}> 标签的MDN文档`}
                                >
                                  &lt;{tag}&gt;
                                </a>
                              );
                            })}
                          </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : section.isContentModelSection ? (
                  <div className="space-y-6">
                    {section.contentModels.map((model, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-lg border border-emerald-200">
                        {/* 模型标题和描述 */}
                        <div className="mb-4">
                          <h4 className="text-lg font-bold text-emerald-800 mb-1">
                            {idx + 1}. {model.name}
                          </h4>
                          <p className="text-sm text-emerald-600 italic mb-2">
                            {model.subtitle}
                          </p>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {model.description}
                          </p>
                        </div>
                        
                        {/* 代码示例和标签列表 - 左右布局 */}
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* 左侧：代码示例 */}
                          <div className="lg:w-2/3">
                            <h5 className="font-semibold text-gray-700 mb-2 text-sm">代码示例</h5>
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm leading-relaxed">
                              <code>{model.code}</code>
                            </pre>
                          </div>
                          
                          {/* 右侧：标签列表 */}
                          <div className="lg:w-1/3">
                            <h5 className="font-semibold text-gray-700 mb-2 text-sm">包含标签（点击查看MDN文档）</h5>
                          <div className="flex flex-wrap gap-2">
                            {model.tags.map((tag, tagIdx) => {
                              // 处理特殊标签名称，生成正确的MDN链接
                              const getTagUrl = (tagName) => {
                                const baseUrl = 'https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/';
                                // 处理特殊情况
                                if (tagName === 'h1-h6') return baseUrl + 'Heading_Elements';
                                if (tagName.includes('-')) return baseUrl + tagName.split('-')[0];
                                return baseUrl + tagName;
                              };
                              
                              return (
                                <a
                                  key={tagIdx}
                                  href={getTagUrl(tag)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block px-3 py-1 bg-white/80 text-xs text-emerald-700 rounded-full border border-emerald-300 font-mono hover:bg-emerald-100 hover:border-emerald-400 hover:text-emerald-800 transition-all cursor-pointer"
                                  title={`查看 <${tag}> 标签的MDN文档`}
                                >
                                  &lt;{tag}&gt;
                                </a>
                              );
                            })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : section.isFrequencySection ? (
                  <div className="space-y-6">
                    {section.frequencyCategories.map((category, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-lg border border-amber-200">
                        {/* 分类标题和描述 */}
                        <div className="mb-4">
                          <h4 className="text-lg font-bold text-amber-800 mb-1">
                            {idx + 1}. {category.name}
                          </h4>
                          <p className="text-sm text-amber-600 italic mb-2">
                            {category.subtitle}
                          </p>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {category.description}
                          </p>
                        </div>
                        
                        {/* 代码示例和标签列表 - 左右布局 */}
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* 左侧：代码示例 */}
                          <div className="lg:w-1/2">
                            <h5 className="font-semibold text-gray-700 mb-2 text-sm">代码示例</h5>
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm leading-relaxed">
                              <code>{category.code}</code>
                            </pre>
                          </div>
                          
                          {/* 右侧：标签列表 */}
                          <div className="lg:w-1/2">
                            <h5 className="font-semibold text-gray-700 mb-2 text-sm">标签列表（点击查看MDN文档）</h5>
                            <div className="space-y-2">
                              {category.tags.map((item, tagIdx) => {
                                // 处理特殊标签名称，生成正确的MDN链接
                                const getTagUrl = (tagName) => {
                                  const baseUrl = 'https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/';
                                  // 处理特殊情况
                                  if (tagName === 'h1-h6') return baseUrl + 'Heading_Elements';
                                  if (tagName.includes('-')) return baseUrl + tagName.split('-')[0];
                                  return baseUrl + tagName;
                                };
                                
                                return (
                                  <div key={tagIdx} className="flex items-center justify-between bg-white/80 p-2 rounded border border-amber-200 hover:bg-amber-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                      <span className="text-xs text-amber-600 font-semibold w-6 text-center">
                                        {tagIdx + 1}.
                                      </span>
                                      <a
                                        href={getTagUrl(item.tag)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-mono text-sm text-amber-700 hover:text-amber-800 hover:underline"
                                        title={`查看 <${item.tag}> 标签的MDN文档`}
                                      >
                                        &lt;{item.tag}&gt;
                                      </a>
                                    </div>
                                    <span className="text-xs text-gray-600">
                                      {item.desc}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : section.isVersionSection ? (
                  <div className="space-y-6">
                    {section.versionCategories.map((category, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-violet-50 to-purple-50 p-6 rounded-lg border border-violet-200">
                        {/* 版本标题和描述 */}
                        <div className="mb-4">
                          <h4 className="text-lg font-bold text-violet-800 mb-1">
                            {idx + 1}. {category.name}
                          </h4>
                          <p className="text-sm text-violet-600 italic mb-2">
                            {category.subtitle}
                          </p>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {category.description}
                          </p>
                        </div>
                        
                        {/* 代码示例和标签列表 - 左右布局 */}
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* 左侧：代码示例 */}
                          <div className="lg:w-2/3">
                            <h5 className="font-semibold text-gray-700 mb-2 text-sm">代码示例</h5>
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm leading-relaxed max-h-96 overflow-y-auto">
                              <code>{category.code}</code>
                            </pre>
                          </div>
                          
                          {/* 右侧：标签列表 */}
                          <div className="lg:w-1/3">
                            <h5 className="font-semibold text-gray-700 mb-2 text-sm">包含标签（点击查看MDN文档）</h5>
                            
                            {/* HTML4 标签列表 */}
                            {category.tags && (
                              <div className="flex flex-wrap gap-2">
                                {category.tags.map((tag, tagIdx) => {
                                  const getTagUrl = (tagName) => {
                                    const baseUrl = 'https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/';
                                    if (tagName === 'h1-h6') return baseUrl + 'Heading_Elements';
                                    if (tagName.includes('-')) return baseUrl + tagName.split('-')[0];
                                    return baseUrl + tagName;
                                  };
                                  
                                  return (
                                    <a
                                      key={tagIdx}
                                      href={getTagUrl(tag)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-block px-3 py-1 bg-white/80 text-xs text-violet-700 rounded-full border border-violet-300 font-mono hover:bg-violet-100 hover:border-violet-400 hover:text-violet-800 transition-all cursor-pointer"
                                      title={`查看 <${tag}> 标签的MDN文档`}
                                    >
                                      &lt;{tag}&gt;
                                    </a>
                                  );
                                })}
                              </div>
                            )}
                            
                            {/* HTML5 分类标签列表 */}
                            {category.subcategories && (
                              <div className="space-y-3">
                                {category.subcategories.map((subcat, subcatIdx) => (
                                  <div key={subcatIdx} className="bg-white/60 p-3 rounded-lg border border-violet-200">
                                    <h6 className="font-semibold text-violet-700 text-xs mb-2">
                                      {subcat.name}
                                    </h6>
                                    <div className="flex flex-wrap gap-1">
                                      {subcat.tags.map((tag, tagIdx) => {
                                        const getTagUrl = (tagName) => {
                                          const baseUrl = 'https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/';
                                          if (tagName === 'h1-h6') return baseUrl + 'Heading_Elements';
                                          if (tagName.includes('-')) return baseUrl + tagName.split('-')[0];
                                          return baseUrl + tagName;
                                        };
                                        
                                        return (
                                          <a
                                            key={tagIdx}
                                            href={getTagUrl(tag)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block px-2 py-1 bg-white text-xs text-violet-600 rounded border border-violet-200 font-mono hover:bg-violet-50 hover:text-violet-700 transition-all cursor-pointer"
                                            title={`查看 <${tag}> 标签的MDN文档`}
                                          >
                                            &lt;{tag}&gt;
                                          </a>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : section.isPurposeSection ? (
                  <div className="space-y-6">
                    {section.purposeCategories.map((category, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-rose-50 to-pink-50 p-6 rounded-lg border border-rose-200">
                        {/* 用途标题和描述 */}
                        <div className="mb-4">
                          <h4 className="text-lg font-bold text-rose-800 mb-1">
                            {idx + 1}. {category.name}
                          </h4>
                          <p className="text-sm text-rose-600 italic mb-2">
                            {category.subtitle}
                          </p>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {category.description}
                          </p>
                        </div>
                        
                        {/* 代码示例和标签列表 - 左右布局 */}
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* 左侧：代码示例 */}
                          <div className="lg:w-2/3">
                            <h5 className="font-semibold text-gray-700 mb-2 text-sm">代码示例</h5>
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm leading-relaxed max-h-80 overflow-y-auto">
                              <code>{category.code}</code>
                            </pre>
                          </div>
                          
                          {/* 右侧：标签列表 */}
                          <div className="lg:w-1/3">
                            <h5 className="font-semibold text-gray-700 mb-2 text-sm">相关标签（点击查看MDN文档）</h5>
                            <div className="flex flex-wrap gap-2">
                              {category.tags.map((tag, tagIdx) => {
                                // 处理特殊标签名称，生成正确的MDN链接
                                const getTagUrl = (tagName) => {
                                  const baseUrl = 'https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/';
                                  // 处理特殊情况
                                  if (tagName === 'h1-h6') return baseUrl + 'Heading_Elements';
                                  if (tagName.includes('-')) return baseUrl + tagName.split('-')[0];
                                  return baseUrl + tagName;
                                };
                                
                                return (
                                  <a
                                    key={tagIdx}
                                    href={getTagUrl(tag)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-3 py-1 bg-white/80 text-xs text-rose-700 rounded-full border border-rose-300 font-mono hover:bg-rose-100 hover:border-rose-400 hover:text-rose-800 transition-all cursor-pointer"
                                    title={`查看 <${tag}> 标签的MDN文档`}
                                  >
                                    &lt;{tag}&gt;
                                  </a>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : section.isRoadmapSection ? (
                  <div className="space-y-6">
                    {/* 学习阶段 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {section.roadmapStages.map((stage, idx) => (
                        <div key={idx} className={`p-5 rounded-lg border-2 transition-all hover:shadow-md ${
                          stage.priority === 'high' 
                            ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200 hover:border-red-300' 
                            : stage.priority === 'medium'
                            ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300'
                            : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:border-green-300'
                        }`}>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className={`font-bold text-lg ${
                              stage.priority === 'high' 
                                ? 'text-red-800' 
                                : stage.priority === 'medium'
                                ? 'text-blue-800'
                                : 'text-green-800'
                            }`}>
                              {stage.stage}：{stage.title}
                            </h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              stage.priority === 'high' 
                                ? 'bg-red-100 text-red-700' 
                                : stage.priority === 'medium'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {stage.count}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                            {stage.description}
                          </p>
                          
                          {!stage.isComplete && (
                            <div className="flex flex-wrap gap-2">
                              {stage.tags.map((tag, tagIdx) => {
                                const getTagUrl = (tagName) => {
                                  const baseUrl = 'https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/';
                                  if (tagName === 'h1-h6') return baseUrl + 'Heading_Elements';
                                  if (tagName.includes('-')) return baseUrl + tagName.split('-')[0];
                                  return baseUrl + tagName;
                                };
                                
                                return (
                                  <a
                                    key={tagIdx}
                                    href={getTagUrl(tag)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-block px-2 py-1 text-xs font-mono rounded border transition-all cursor-pointer ${
                                      stage.priority === 'high' 
                                        ? 'bg-white/80 text-red-700 border-red-200 hover:bg-red-50 hover:border-red-300' 
                                        : stage.priority === 'medium'
                                        ? 'bg-white/80 text-blue-700 border-blue-200 hover:bg-blue-50 hover:border-blue-300'
                                        : 'bg-white/80 text-green-700 border-green-200 hover:bg-green-50 hover:border-green-300'
                                    }`}
                                    title={`查看 <${tag}> 标签的MDN文档`}
                                  >
                                    &lt;{tag}&gt;
                                  </a>
                                );
                              })}
                            </div>
                          )}
                          
                          {stage.isComplete && (
                            <div className="text-center py-4">
                              <div className="text-4xl mb-2">🎯</div>
                              <p className="text-sm text-green-700 font-medium">
                                完整标签列表见下方速查表
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* 完整标签速查表 */}
                    <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-6 rounded-lg border border-gray-200">
                      <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">
                        📚 完整标签速查表
                      </h4>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {section.completeTagList.map((group, idx) => (
                          <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200">
                            <h5 className="font-semibold text-gray-700 mb-3 text-center">
                              {group.range}
                            </h5>
                            <div className="flex flex-wrap gap-1">
                              {group.tags.map((tag, tagIdx) => {
                                const getTagUrl = (tagName) => {
                                  const baseUrl = 'https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/';
                                  if (tagName === 'h1-h6') return baseUrl + 'Heading_Elements';
                                  if (tagName.includes('-')) return baseUrl + tagName.split('-')[0];
                                  return baseUrl + tagName;
                                };
                                
                                return (
                                  <a
                                    key={tagIdx}
                                    href={getTagUrl(tag)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-2 py-1 text-xs font-mono bg-gray-100 text-gray-700 rounded border border-gray-200 hover:bg-gray-200 hover:text-gray-800 transition-all cursor-pointer"
                                    title={`查看 <${tag}> 标签的MDN文档`}
                                  >
                                    &lt;{tag}&gt;
                                  </a>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : section.isBestPracticeSection ? (
                  <div className="space-y-6">
                    {section.bestPractices.map((practice, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-lg border border-teal-200">
                        {/* 建议标题和描述 */}
                        <div className="mb-4">
                          <h4 className="text-lg font-bold text-teal-800 mb-1">
                            {idx + 1}. {practice.title}
                          </h4>
                          <p className="text-sm text-teal-600 italic mb-2">
                            {practice.subtitle}
                          </p>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {practice.description}
                          </p>
                        </div>
                        
                        {/* 示例代码 */}
                        <div className="space-y-4">
                          {practice.examples.map((example, exampleIdx) => (
                            <div key={exampleIdx}>
                              <h5 className="font-semibold text-gray-700 mb-2 text-sm flex items-center gap-2">
                                {example.type === 'wrong' && <span className="text-red-500">❌</span>}
                                {example.type === 'right' && <span className="text-green-500">✅</span>}
                                {example.type === 'comparison' && <span className="text-blue-500">🔄</span>}
                                {example.type === 'accessibility' && <span className="text-purple-500">♿</span>}
                                {example.label}
                              </h5>
                              
                              <div className={`rounded-lg border-2 ${
                                example.type === 'wrong' 
                                  ? 'border-red-200 bg-red-50/50' 
                                  : example.type === 'right'
                                  ? 'border-green-200 bg-green-50/50'
                                  : example.type === 'comparison'
                                  ? 'border-blue-200 bg-blue-50/50'
                                  : 'border-purple-200 bg-purple-50/50'
                              }`}>
                                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm leading-relaxed m-2">
                                  <code>{example.code}</code>
                                </pre>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* 总结提示 */}
                        <div className="mt-4 bg-white/60 p-3 rounded-lg border border-teal-200">
                          <div className="flex items-start gap-2">
                            <span className="text-teal-600 text-lg">💡</span>
                            <div className="text-sm text-teal-700">
                              <strong>记住：</strong>
                              {practice.title === '语义化优先' && '语义化标签不仅让代码更易读，还能提升SEO和可访问性。'}
                              {practice.title === '选择合适的标签' && '选择标签时要考虑内容的含义，而不是视觉效果。CSS负责样式，HTML负责语义。'}
                              {practice.title === '可访问性考虑' && '可访问性不是可选项，而是Web开发的基本要求。为所有用户创造平等的体验。'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* 总体建议 */}
                    <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-6 rounded-lg border border-gray-200">
                      <h4 className="text-lg font-bold text-gray-800 mb-4 text-center flex items-center justify-center gap-2">
                        <span className="text-2xl">🎯</span>
                        HTML使用的黄金法则
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                          <div className="text-2xl mb-2">📝</div>
                          <div className="font-semibold text-gray-700 mb-2">内容优先</div>
                          <div className="text-gray-600">先考虑内容的含义，再选择合适的标签</div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                          <div className="text-2xl mb-2">🎨</div>
                          <div className="font-semibold text-gray-700 mb-2">样式分离</div>
                          <div className="text-gray-600">HTML负责结构，CSS负责样式，JS负责行为</div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                          <div className="text-2xl mb-2">♿</div>
                          <div className="font-semibold text-gray-700 mb-2">人人可用</div>
                          <div className="text-gray-600">考虑所有用户，包括使用辅助技术的用户</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : section.isResourceSection ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {resources.map((resource, idx) => (
                      <a
                        key={idx}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group p-4 rounded-lg bg-gradient-to-br from-white to-green-50 border border-green-200 hover:border-green-400 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                            {resource.name}
                          </h3>
                          <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                        </div>
                        <p className="text-sm text-gray-600">{resource.description}</p>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {section.keyPoints.map((point, i) => (
                      <div key={i} className="text-sm text-gray-600 flex items-center gap-2">
                        <div className="w-1 h-1 bg-green-500 rounded-full flex-shrink-0" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                )}
                  </div>
                </>
              )}
            </Card>
          ))}
        </div>


      </div>

      {/* 返回顶部按钮 */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          size="sm"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-lg bg-green-500 hover:bg-green-600 text-white border-0 p-0"
          title="返回顶部"
        >
          <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      </div>
    </div>
  );
}