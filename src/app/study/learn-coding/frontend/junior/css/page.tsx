'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Palette, CheckCircle2, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function CSSPage() {
  const sections = [
    {
      title: '1. 选择器',
      description: 'CSS2 到 CSS3 的选择器演进',
      concept: '选择器是 CSS 的核心机制，用于定位 HTML 元素并应用样式。它就像一个"地址系统"，告诉浏览器哪些元素需要被装饰。CSS3 引入了更强大的选择器，可以基于元素位置、状态、属性等动态条件精确选择，大大减少了对 JavaScript 的依赖。',
      evolution: '静态针对 → 动态条件',
      css2Features: ['通用选择器（*）', '类（.class）、ID（#id）', '后代（div p）、子元素（div > p）', '相邻兄弟（h1 + p）、通用兄弟（h1 ~ p）', '属性选择器（[type="text"]）'],
      css3Features: ['伪类：:nth-child()、:nth-of-type()', ':first-of-type、:last-of-type', ':only-child、:empty、:target', ':enabled、:disabled、:checked', ':not() 否定伪类', '属性选择器：[attr^=val]、[attr$=val]、[attr*=val]'],
      comparison: 'CSS2 选择器基础，针对简单结构；CSS3 更精确，支持动态和复杂文档，减少 JS 辅助',
      code: `/* CSS2 基础选择器 */
.class { }
#id { }
div > p { }
h1 + p { }

/* CSS3 高级选择器 */
li:nth-child(2n) { }
input:checked { }
div:not(.active) { }
a[href^="https"] { }`,
    },
    {
      title: '2. 盒模型',
      description: '从内容优先到包含计算',
      concept: '盒模型定义了元素在页面上占据的空间如何计算。每个元素都是一个"盒子"，由内容、内边距（padding）、边框（border）和外边距（margin）组成。CSS3 的 border-box 模型让宽度计算更直观，避免了传统模型中"设置 200px 宽度却实际占据 250px"的困扰。',
      evolution: '内容优先 → 包含计算',
      css2Features: ['内容区、padding、border、margin', 'width、height、min-width、max-width', 'overflow 控制溢出', '默认 content-box 模型'],
      css3Features: ['box-sizing: border-box', '包含 padding 和 border 在宽度中', 'overflow-x、overflow-y 分离控制', '简化尺寸计算'],
      comparison: 'CSS2 默认 content-box 易导致布局计算复杂；CSS3 的 border-box 简化尺寸控制，提升移动端兼容',
      code: `/* CSS2 标准盒模型 */
.box {
  width: 200px;
  padding: 20px;
  border: 5px solid;
  /* 实际宽度 = 200 + 40 + 10 = 250px */
}

/* CSS3 border-box */
.box {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 5px solid;
  /* 实际宽度 = 200px */
}`,
    },
    {
      title: '3. 视觉格式模型',
      description: '定位、浮动、显示',
      concept: '视觉格式模型控制元素在页面上的排列方式。它定义了元素是块级（独占一行）还是内联（并排显示），以及如何通过定位（position）和浮动（float）打破正常文档流。这是实现复杂布局的基础，虽然现代开发更倾向于 Flexbox 和 Grid。',
      evolution: '流式布局 → 叠加控制',
      css2Features: ['display: block、inline、list-item', 'position: static、relative、absolute、fixed', 'float: left、right', 'clear、z-index'],
      css3Features: ['display: inline-block 强化', '继承 CSS2 核心', '转向 Flexbox/Grid', '减少浮动 hacks'],
      comparison: 'CSS2 依赖 float 和 position 实现布局，易导致浮动崩塌；CSS3 继承并优化，转向自动管理',
      code: `/* CSS2 浮动布局 */
.left { float: left; }
.right { float: right; }
.clearfix::after {
  content: "";
  display: table;
  clear: both;
}

/* CSS3 定位增强 */
.sticky {
  position: sticky;
  top: 0;
}`,
    },
    {
      title: '4. 颜色和背景',
      description: '从静态颜色到动态渐变',
      concept: '颜色和背景是视觉设计的基础。CSS3 扩展了颜色表示方式（支持透明度的 rgba、基于色相的 hsl），并引入了渐变功能，让开发者可以用代码创建平滑的颜色过渡效果，无需图片。多背景支持让复杂的视觉效果变得简单。',
      evolution: '静态颜色 → 动态渐变',
      css2Features: ['颜色值：named、RGB、hex', 'background-color、background-image', 'background-repeat、background-position', '单一背景支持'],
      css3Features: ['新增：rgba()、hsl()、hsla()、currentColor', 'background-size、background-clip、background-origin', 'linear-gradient()、radial-gradient()', '多背景支持'],
      comparison: 'CSS2 背景单一；CSS3 支持多层和渐变，减少图像依赖，提升性能',
      code: `/* CSS2 基础背景 */
.box {
  background-color: #ff0000;
  background-image: url('bg.jpg');
}

/* CSS3 渐变和多背景 */
.box {
  background: 
    linear-gradient(to right, #ff0000, #00ff00),
    url('pattern.png');
  background-size: cover, 50px 50px;
}`,
    },
    {
      title: '5. 文本和字体',
      description: '从简单对齐到溢出管理',
      concept: '文本和字体控制着网页上文字的呈现方式。CSS3 增强了文本溢出处理（如省略号显示）、自动换行和自定义字体加载能力。@font-face 让网站可以使用品牌专属字体，不再局限于系统字体，大大提升了设计自由度。',
      evolution: '简单对齐 → 溢出管理',
      css2Features: ['font-family、font-size、font-weight', 'text-align、text-indent、text-decoration', 'letter-spacing、word-spacing', 'line-height、white-space'],
      css3Features: ['text-overflow: ellipsis', 'word-wrap: break-word、word-break', 'font-size-adjust', '@font-face 自定义字体增强'],
      comparison: 'CSS2 文本控制基础；CSS3 改善溢出和断词，支持国际化和长文本，增强品牌一致性',
      code: `/* CSS2 基础文本 */
.text {
  font-family: Arial, sans-serif;
  text-align: center;
  line-height: 1.5;
}

/* CSS3 溢出处理 */
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Web 字体 */
@font-face {
  font-family: 'CustomFont';
  src: url('font.woff2') format('woff2');
}`,
    },
    {
      title: '6. 边框',
      description: '从矩形边界到曲线效果',
      concept: '边框定义了元素的边界线。CSS3 的 border-radius 让圆角设计变得简单，无需切图。border-image 则允许使用图片作为边框，创造出丰富的装饰效果。这些特性让现代 UI 设计（如卡片、按钮）更加美观和灵活。',
      evolution: '矩形边界 → 曲线效果',
      css2Features: ['border-width、border-style、border-color', 'border 速记属性', '直线边框'],
      css3Features: ['border-radius 圆角', 'border-image 图像边框', '丰富 UI 设计'],
      comparison: 'CSS2 边框直线；CSS3 添加圆角和图像，连接卡片和按钮设计，减少图像使用',
      code: `/* CSS2 基础边框 */
.box {
  border: 2px solid #000;
}

/* CSS3 圆角和图像边框 */
.rounded {
  border-radius: 10px;
}

.fancy-border {
  border: 10px solid;
  border-image: url('border.png') 30 round;
}`,
    },
    {
      title: '7. 表格',
      description: '从数据呈现到布局增强',
      concept: '表格样式控制着表格数据的呈现方式。虽然早期开发者曾用表格做页面布局（现已不推荐），但表格仍是展示结构化数据的最佳选择。CSS 提供了边框合并、单元格间距等控制，让数据表格更清晰易读。',
      evolution: '数据呈现 → 布局增强',
      css2Features: ['table-layout: auto、fixed', 'border-collapse、border-spacing', 'caption-side、empty-cells'],
      css3Features: ['继承 CSS2', '与 Grid 模块整合', '推荐 Grid 替代布局'],
      comparison: 'CSS2 表格布局常见但不灵活；CSS3 推荐 Grid 替代，但表格属性仍用于数据表',
      code: `/* CSS2 表格样式 */
table {
  border-collapse: collapse;
  table-layout: fixed;
}

td {
  border: 1px solid #ddd;
  padding: 8px;
}`,
    },
    {
      title: '8. 列表',
      description: '从有序/无序到自定义图标',
      concept: '列表样式控制着有序列表（数字）和无序列表（符号）的标记显示。通过 CSS 可以自定义标记样式、位置，甚至使用图片作为标记。结合伪元素，可以创建完全自定义的列表样式，常用于导航菜单设计。',
      evolution: '有序/无序 → 自定义图标',
      css2Features: ['list-style-type: disc、decimal', 'list-style-image、list-style-position', 'list-style 速记'],
      css3Features: ['继承 CSS2', '与伪元素结合更灵活', '自定义标记支持'],
      comparison: 'CSS2 列表样式基础；CSS3 无大变，但与伪元素结合，连接导航菜单',
      code: `/* CSS2 列表样式 */
ul {
  list-style-type: square;
}

/* CSS3 自定义标记 */
li::before {
  content: "→ ";
  color: blue;
}`,
    },
    {
      title: '9. 生成内容',
      description: '从内容添加到伪元素动画',
      concept: '生成内容通过 CSS 的 ::before 和 ::after 伪元素在 HTML 之外添加装饰性内容。这让开发者可以用纯 CSS 添加图标、引号、装饰线等，无需修改 HTML 结构。CSS3 让伪元素支持动画，进一步扩展了其应用场景。',
      evolution: '内容添加 → 伪元素动画',
      css2Features: ['content 属性（::before、::after）', 'quotes 引用标记', '静态插入'],
      css3Features: ['增强伪元素支持', '与过渡/动画结合', '动态效果'],
      comparison: 'CSS2 生成内容用于插入文本；CSS3 扩展到动态效果，连接图标和工具提示',
      code: `/* CSS2 生成内容 */
.quote::before {
  content: """;
}

/* CSS3 动态伪元素 */
.icon::before {
  content: "★";
  transition: transform 0.3s;
}
.icon:hover::before {
  transform: rotate(360deg);
}`,
    },
    {
      title: '10. 分页媒体',
      description: '从断页管理到媒体适应',
      concept: '分页媒体控制着内容在打印或 PDF 生成时的分页行为。通过 CSS 可以控制哪些元素应该在新页面开始、避免在页面中间断开，以及设置打印专用样式。这对于生成报告、文档等场景非常重要。',
      evolution: '断页管理 → 媒体适应',
      css2Features: ['page-break-before、page-break-after', 'page-break-inside', 'widows、orphans'],
      css3Features: ['继承 CSS2', '与媒体查询结合', '打印优化'],
      comparison: 'CSS2 分页基础；CSS3 无大变，但与媒体查询结合，连接 PDF 生成',
      code: `/* CSS2 分页控制 */
h1 {
  page-break-before: always;
}

@media print {
  .no-print {
    display: none;
  }
}`,
    },
    {
      title: '11. 媒体查询',
      description: '从静态媒体到动态适应',
      concept: '媒体查询是响应式设计的核心技术，让网页能够根据设备特性（屏幕宽度、方向、分辨率等）应用不同样式。一套代码可以适配手机、平板、桌面，无需为每种设备单独开发。这是现代 Web 开发的必备技能。',
      evolution: '静态媒体 → 动态适应',
      css2Features: ['@media 类型：screen、print', '基本设备区分'],
      css3Features: ['条件查询：min-width、max-width', '设备特性：orientation、resolution', '响应式设计支持'],
      comparison: 'CSS2 媒体类型有限；CSS3 支持响应式条件，连接移动优先设计',
      code: `/* CSS2 基础媒体 */
@media screen {
  body { font-size: 16px; }
}

/* CSS3 响应式查询 */
@media screen and (min-width: 768px) {
  .container { width: 750px; }
}

@media (orientation: landscape) {
  .sidebar { display: block; }
}`,
    },
    {
      title: '12. 动画与过渡',
      description: '从固定状态到时间变化',
      concept: '动画与过渡让网页元素能够平滑地改变状态，而不是生硬地跳变。transition 用于简单的状态变化（如悬停效果），@keyframes 动画则可以创建复杂的多步骤动画。CSS 动画性能优于 JavaScript，因为浏览器可以优化其执行。',
      evolution: '固定状态 → 时间变化',
      css2Features: ['无原生动画', '依赖 JavaScript'],
      css3Features: ['transition: property duration timing-function', '@keyframes 关键帧动画', 'animation: name duration iteration-count', '平滑变化和复杂动画'],
      comparison: 'CSS2 无动画；CSS3 引入平滑变化和关键帧，连接交互 UI，提升性能',
      code: `/* CSS3 过渡 */
.button {
  transition: background-color 0.3s ease;
}
.button:hover {
  background-color: blue;
}

/* CSS3 关键帧动画 */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}
.ball {
  animation: bounce 1s infinite;
}`,
    },
    {
      title: '13. 变换',
      description: '从静态位置到动态变形',
      concept: '变换允许对元素进行 2D 和 3D 的几何变换，如旋转、缩放、倾斜、移动。这些变换不影响文档流，且可以利用 GPU 加速，性能优异。结合动画使用，可以创造出卡片翻转、缩放特效等丰富的视觉效果。',
      evolution: '静态位置 → 动态变形',
      css2Features: ['无变换支持', '依赖图像 hack'],
      css3Features: ['transform: translate()、rotate()、scale()、skew()', 'transform-origin 变换原点', '2D 和 3D 变换'],
      comparison: 'CSS2 无 2D/3D；CSS3 启用元素变形，连接卡片翻转和缩放',
      code: `/* CSS3 2D 变换 */
.card {
  transform: rotate(45deg) scale(1.2);
  transform-origin: center;
}

/* CSS3 3D 变换 */
.flip {
  transform: rotateY(180deg);
  transform-style: preserve-3d;
}`,
    },
    {
      title: '14. Flexbox 和 Grid',
      description: '从手动对齐到自动分布',
      concept: 'Flexbox 和 Grid 是现代 CSS 的两大布局系统。Flexbox 擅长一维布局（一行或一列），自动分配空间和对齐元素。Grid 则是二维布局系统，可以同时控制行和列。它们彻底改变了 Web 布局方式，让复杂布局变得简单直观。',
      evolution: '手动对齐 → 自动分布',
      css2Features: ['无 Flexbox/Grid', '依赖 float/position', '手动布局'],
      css3Features: ['Flexbox: display: flex、flex-direction、justify-content', 'Grid: display: grid、grid-template-columns、grid-gap', '一维/二维布局系统'],
      comparison: 'CSS2 布局手动；CSS3 提供一维/二维系统，连接复杂响应式设计，提升代码简洁',
      code: `/* CSS3 Flexbox */
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* CSS3 Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}`,
    },
  ];

  const resources = [
    { name: 'MDN CSS 教程', url: 'https://developer.mozilla.org/zh-CN/docs/Web/CSS', description: '最权威的 CSS 文档' },
    { name: 'CSS-Tricks', url: 'https://css-tricks.com', description: 'CSS 技巧和最佳实践' },
    { name: 'Can I Use', url: 'https://caniuse.com/', description: '检查 CSS 属性兼容性' },
    { name: 'Flexbox Froggy', url: 'https://flexboxfroggy.com', description: 'Flexbox 游戏教程' },
    { name: 'Grid Garden', url: 'https://cssgridgarden.com', description: 'Grid 游戏教程' },
    { name: 'CSS Spec', url: 'https://www.w3.org/Style/CSS/', description: 'CSS 官方规范' },
  ];

  const summary = {
    css2Coverage: '约 40% 现代功能覆盖',
    css3Coverage: '约 60% 新增功能',
    trend: 'CSS3 与变量、嵌套等现代特性整合，推动无 JS 交互',
    suggestion: '新项目优先 CSS3；遗留系统可渐进添加模块',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link href="/study/learn-coding/frontend?level=junior" passHref>
            <Button variant="outline" size="sm" className="hover:bg-white/80 shadow-sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回前端开发
            </Button>
          </Link>
        </div>

        {/* 页面标题 */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl shadow-lg mb-4">
            <Palette className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            CSS 基础
          </h1>
          <p className="text-gray-600">
            掌握 CSS2 到 CSS3 的演进，从基础样式到现代布局
          </p>
        </div>

        {/* 内容区域 */}
        <div className="space-y-6 mb-8">
          {sections.map((section, idx) => (
            <Card key={idx} id={`section-${idx + 1}`} className="p-6 bg-white/80 backdrop-blur-sm scroll-mt-20">
              {/* 标题和描述 */}
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{section.title}</h2>
                  <p className="text-gray-600 mb-2">{section.description}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    <span className="text-purple-600 font-medium">演进路径：{section.evolution}</span>
                  </div>
                </div>
              </div>

              {/* 概念解释 */}
              {section.concept && (
                <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-purple-600">💡</span>
                    什么是{section.title.replace(/^\d+\.\s*/, '')}？
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{section.concept}</p>
                </div>
              )}

              {/* CSS2 vs CSS3 对比 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded">CSS2</span>
                    传统方式
                  </h3>
                  <ul className="space-y-2">
                    {section.css2Features.map((feature, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="px-2 py-1 bg-pink-600 text-white text-xs rounded">CSS3</span>
                    现代方式
                  </h3>
                  <ul className="space-y-2">
                    {section.css3Features.map((feature, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-pink-600 mt-1">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 对比总结 */}
              <div className="p-4 rounded-lg bg-purple-50 border border-purple-200 mb-4">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-purple-700">对比：</span>
                  {section.comparison}
                </p>
              </div>

              {/* 代码示例 */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">代码示例</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{section.code}</code>
                </pre>
              </div>
            </Card>
          ))}
        </div>

        {/* 学习资源 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-6 h-6 text-pink-600" />
            <h2 className="text-2xl font-bold text-gray-800">推荐学习资源</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resources.map((resource, idx) => (
              <a
                key={idx}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-primary hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-800 group-hover:text-primary transition-colors">
                    {resource.name}
                  </h3>
                  <TrendingUp className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-sm text-gray-600">{resource.description}</p>
              </a>
            ))}
          </div>
        </Card>

        {/* 总结对比 */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">总体对比与演进趋势</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-white rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">CSS2（传统）</h3>
              <p className="text-sm text-gray-600">{summary.css2Coverage}</p>
              <p className="text-sm text-gray-600 mt-2">适合基础静态样式</p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">CSS3（现代）</h3>
              <p className="text-sm text-gray-600">{summary.css3Coverage}</p>
              <p className="text-sm text-gray-600 mt-2">支持动态和响应式</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-purple-700">演进趋势（2025）：</span>
                {summary.trend}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-pink-700">使用建议：</span>
                {summary.suggestion}
              </p>
            </div>
          </div>
        </Card>

        {/* 底部提示 */}
        <div className="text-center">
          <Card className="inline-block p-4 bg-gradient-to-r from-white/80 to-pink-50/80 backdrop-blur-sm border border-pink-200/50">
            <p className="text-sm text-gray-700">
              💡 建议：从 CSS2 基础开始，逐步掌握 CSS3 的 14 大核心范畴
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
