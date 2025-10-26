'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Rocket, CheckCircle2, TrendingUp, Sparkles, BookOpen, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function CrossPlatformPage() {
  const sections = [
    {
      title: '1. PWA（Progressive Web App）',
      category: '渐进式应用',
      what: '让网页具备原生 App 的体验：可离线使用、可安装到桌面、支持推送',
      why: '提升 Web 应用留存率和性能，使其在无网络或低速网络下也能使用',
      how: '关键技术：Service Worker（缓存+离线）、Web App Manifest（安装图标与启动配置）、HTTPS（安全上下文要求）',
      sugar: 'Service Worker',
      scenarios: ['新闻网站', '社交平台', '轻量电商', '小型 SaaS'],
      relations: ['PWA ←→ 缓存策略', 'PWA ←→ CDN 优化', 'PWA ←→ Web Vitals'],
      code: `// Service Worker 注册
// main.js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('SW registered', reg))
    .catch(err => console.log('SW error', err));
}

// Service Worker 实现
// sw.js
const CACHE_NAME = 'my-app-v1';
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/script/main.js'
];

// 安装事件
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// 拦截请求
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// Web App Manifest
// manifest.json
{
  "name": "My PWA App",
  "short_name": "PWA",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [{
    "src": "/icon-192.png",
    "sizes": "192x192",
    "type": "image/png"
  }]
}

// HTML 引用
<link rel="manifest" href="/manifest.json">`,
    },
    {
      title: '2. WebAssembly（WASM）',
      category: '高性能计算',
      what: '一种可在浏览器运行的二进制格式，比 JS 更接近机器码，性能高',
      why: '用于计算密集型任务（图像处理、AI 推理、游戏引擎），提高运行速度',
      how: '通过工具链将 C/C++/Rust 编译为 .wasm 文件，然后在 JS 中加载运行',
      sugar: 'WebAssembly.instantiate',
      scenarios: ['Web 端视频编辑', 'CAD', '3D 渲染', 'AI 模型前端推理', '游戏或仿真引擎'],
      relations: ['WASM ←→ WebGPU/WebGL', 'WASM ←→ AI 推理', 'WASM ←→ 游戏引擎'],
      code: `// 加载 WASM 模块
const response = await fetch('app.wasm');
const buffer = await response.arrayBuffer();
const wasm = await WebAssembly.instantiate(buffer);

// 调用 WASM 函数
const result = wasm.instance.exports.add(5, 3);
console.log(result); // 8

// 使用 instantiateStreaming（更高效）
const wasmModule = await WebAssembly.instantiateStreaming(
  fetch('app.wasm')
);
wasmModule.instance.exports.main();

// Rust 编译为 WASM
// lib.rs
#[no_mangle]
pub extern "C" fn add(a: i32, b: i32) -> i32 {
    a + b
}

// 编译命令
// rustc --target wasm32-unknown-unknown -O --crate-type=cdylib lib.rs

// C++ 编译为 WASM（使用 Emscripten）
// hello.cpp
#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
int add(int a, int b) {
    return a + b;
}

// 编译命令
// emcc hello.cpp -o hello.js -s EXPORTED_FUNCTIONS='["_add"]'

// AssemblyScript（TypeScript-like 语法）
export function fibonacci(n: i32): i32 {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`,
    },
    {
      title: '3. WebGPU（取代 WebGL）',
      category: '图形渲染',
      what: '浏览器原生的 GPU 编程接口，取代 WebGL，支持并行计算与现代图形渲染',
      why: 'WebGL 设计老旧，性能瓶颈明显；WebGPU 更贴近 Metal/Vulkan/DX12',
      how: '通过 navigator.gpu.requestAdapter() 获取 GPU 设备资源进行渲染',
      sugar: 'navigator.gpu',
      scenarios: ['3D 可视化', '游戏开发', 'AI 前端推理（结合 TensorFlow.js、ONNX Runtime）'],
      relations: ['WebGPU ←→ WASM', 'WebGPU ←→ WebXR', 'WebGPU ←→ AI 计算'],
      code: `// WebGPU 初始化
const adapter = await navigator.gpu.requestAdapter();
const device = await adapter.requestDevice();

// 创建画布上下文
const canvas = document.querySelector('canvas');
const context = canvas.getContext('webgpu');
const format = navigator.gpu.getPreferredCanvasFormat();

context.configure({
  device,
  format,
});

// 创建渲染管线
const pipeline = device.createRenderPipeline({
  layout: 'auto',
  vertex: {
    module: device.createShaderModule({
      code: \`
        @vertex
        fn main(@builtin(vertex_index) VertexIndex : u32) -> @builtin(position) vec4<f32> {
          var pos = array<vec2<f32>, 3>(
            vec2(0.0, 0.5),
            vec2(-0.5, -0.5),
            vec2(0.5, -0.5)
          );
          return vec4<f32>(pos[VertexIndex], 0.0, 1.0);
        }
      \`
    }),
    entryPoint: 'main',
  },
  fragment: {
    module: device.createShaderModule({
      code: \`
        @fragment
        fn main() -> @location(0) vec4<f32> {
          return vec4<f32>(1.0, 0.0, 0.0, 1.0);
        }
      \`
    }),
    entryPoint: 'main',
    targets: [{ format }],
  },
  primitive: {
    topology: 'triangle-list',
  },
});

// 渲染
const commandEncoder = device.createCommandEncoder();
const renderPass = commandEncoder.beginRenderPass({
  colorAttachments: [{
    view: context.getCurrentTexture().createView(),
    loadOp: 'clear',
    storeOp: 'store',
  }],
});

renderPass.setPipeline(pipeline);
renderPass.draw(3);
renderPass.end();

device.queue.submit([commandEncoder.finish()]);`,
    },
    {
      title: '4. WebXR（AR/VR）',
      category: '沉浸式体验',
      what: '浏览器端访问虚拟现实（VR）和增强现实（AR）的统一 API',
      why: '让 Web 能直接与硬件交互，构建沉浸式体验',
      how: '通过 navigator.xr.requestSession() 创建 VR/AR 会话',
      sugar: 'navigator.xr',
      scenarios: ['3D 展厅', '教育仿真', '远程协作', '元宇宙项目'],
      relations: ['WebXR ←→ WebGPU', 'WebXR ←→ WASM', 'WebXR ←→ Three.js'],
      code: `// 检查 WebXR 支持
if (navigator.xr) {
  const isSupported = await navigator.xr.isSessionSupported('immersive-vr');
  console.log('VR supported:', isSupported);
}

// 创建 VR 会话
const session = await navigator.xr.requestSession('immersive-vr', {
  requiredFeatures: ['local-floor']
});

// 设置渲染循环
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl', { xrCompatible: true });
const xrLayer = new XRWebGLLayer(session, gl);

session.updateRenderState({ baseLayer: xrLayer });

// 参考空间
const referenceSpace = await session.requestReferenceSpace('local-floor');

// 渲染循环
function onXRFrame(time, frame) {
  session.requestAnimationFrame(onXRFrame);
  
  const pose = frame.getViewerPose(referenceSpace);
  if (pose) {
    const view = pose.views[0];
    
    // 渲染场景
    gl.bindFramebuffer(gl.FRAMEBUFFER, xrLayer.framebuffer);
    // ... 渲染代码
  }
}

session.requestAnimationFrame(onXRFrame);

// 使用 Three.js + WebXR
import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.xr.enabled = true;
document.body.appendChild(VRButton.createButton(renderer));

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);

renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);
});`,
    },
    {
      title: '5. Web3 / DApp',
      category: '去中心化应用',
      what: '运行在去中心化网络（区块链）上的应用，前端通过钱包交互智能合约',
      why: '确保数据可验证、不可篡改，提升透明度与用户掌控',
      how: '使用 ethers.js 或 web3.js 与以太坊交互',
      sugar: 'ethers.js',
      scenarios: ['NFT', 'DeFi', 'DAO 平台', '链上游戏'],
      relations: ['Web3 ←→ Token 认证', 'Web3 ←→ 签名机制', 'Web3 ←→ DID'],
      code: `// 连接钱包（MetaMask）
import { ethers } from 'ethers';

// 请求连接
const provider = new ethers.BrowserProvider(window.ethereum);
await provider.send('eth_requestAccounts', []);

// 获取账户
const signer = await provider.getSigner();
const address = await signer.getAddress();
console.log('Connected:', address);

// 获取余额
const balance = await provider.getBalance(address);
console.log('Balance:', ethers.formatEther(balance), 'ETH');

// 智能合约交互
const contractAddress = '0x...';
const abi = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint amount) returns (bool)'
];

const contract = new ethers.Contract(contractAddress, abi, signer);

// 读取数据
const balance = await contract.balanceOf(address);

// 写入数据（发送交易）
const tx = await contract.transfer('0x...', ethers.parseEther('1.0'));
await tx.wait();

// 监听事件
contract.on('Transfer', (from, to, amount) => {
  console.log(\`Transfer: \${from} -> \${to}: \${amount}\`);
});

// 签名消息
const message = 'Hello Web3';
const signature = await signer.signMessage(message);

// 验证签名
const recoveredAddress = ethers.verifyMessage(message, signature);
console.log('Verified:', recoveredAddress === address);

// IPFS 存储
import { create } from 'ipfs-http-client';

const ipfs = create({ url: 'https://ipfs.infura.io:5001' });
const { cid } = await ipfs.add('Hello IPFS');
console.log('IPFS CID:', cid.toString());`,
    },
    {
      title: '6. AI 前端集成（Web ML / Edge AI）',
      category: '机器学习',
      what: '在浏览器端加载和运行机器学习模型',
      why: '保护隐私、降低延迟、离线可用',
      how: 'TensorFlow.js、ONNX Runtime Web、WebGPU + WebAssembly 加速',
      sugar: 'TensorFlow.js',
      scenarios: ['图像识别', '语音识别', 'NLP 推理', '智能推荐'],
      relations: ['AI ←→ WASM/WebGPU', 'AI ←→ PWA', 'AI ←→ Edge Computing'],
      code: `// TensorFlow.js 图像分类
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

// 加载预训练模型
const model = await mobilenet.load();

// 图像分类
const img = document.getElementById('image');
const predictions = await model.classify(img);
console.log('Predictions:', predictions);

// 自定义模型训练
const model = tf.sequential({
  layers: [
    tf.layers.dense({ inputShape: [784], units: 128, activation: 'relu' }),
    tf.layers.dense({ units: 10, activation: 'softmax' })
  ]
});

model.compile({
  optimizer: 'adam',
  loss: 'categoricalCrossentropy',
  metrics: ['accuracy']
});

await model.fit(xs, ys, { epochs: 10 });

// ONNX Runtime Web
import * as ort from 'onnxruntime-web';

// 加载模型
const session = await ort.InferenceSession.create('model.onnx');

// 推理
const input = new ort.Tensor('float32', [1, 2, 3, 4], [1, 4]);
const results = await session.run({ input });
console.log('Output:', results.output.data);

// MediaPipe（姿态检测）
import { PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

const vision = await FilesetResolver.forVisionTasks(
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm'
);

const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
  baseOptions: {
    modelAssetPath: 'pose_landmarker.task'
  }
});

// 检测姿态
const video = document.getElementById('video');
const result = poseLandmarker.detect(video);
console.log('Landmarks:', result.landmarks);`,
    },
    {
      title: '7. 跨平台框架',
      category: '多端开发',
      what: '统一代码，输出多端（Web、App、Desktop、小程序）',
      why: '减少多端重复开发，统一逻辑与组件',
      how: '利用中间层封装原生能力 + JS 框架渲染层；主流：Electron/Tauri（桌面）、React Native/Flutter Web（移动）、Capacitor/Ionic（混合）',
      sugar: 'Electron / Tauri',
      scenarios: ['多端 SaaS', 'IM 工具', '企业管理系统', '跨平台应用'],
      relations: ['跨平台 ←→ Monorepo', '跨平台 ←→ 模块联邦', '跨平台 ←→ CI/CD'],
      code: `// Electron 桌面应用
// main.js
const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });
  
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

// Tauri（Rust + Web）
// src-tauri/src/main.rs
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// 前端调用
import { invoke } from '@tauri-apps/api/tauri';
const greeting = await invoke('greet', { name: 'World' });

// React Native
import React from 'react';
import { View, Text, Button } from 'react-native';

export default function App() {
  return (
    <View>
      <Text>Hello React Native!</Text>
      <Button title="Click me" onPress={() => alert('Pressed')} />
    </View>
  );
}

// Capacitor（Web to Native）
import { Capacitor } from '@capacitor/core';
import { Camera } from '@capacitor/camera';

const takePicture = async () => {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: 'uri'
  });
  
  return image.webPath;
};

// Flutter Web
import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        body: Center(child: Text('Hello Flutter Web')),
      ),
    );
  }
}`,
    },
    {
      title: '8. Edge Runtime / Edge Functions',
      category: '边缘计算',
      what: '在 CDN 边缘节点运行 JavaScript/TypeScript，无需传统服务器（如 Cloudflare Workers、Vercel Edge）',
      why: '延迟更低、部署更快、无服务器架构',
      how: '在边缘节点执行轻量级函数，处理请求和响应',
      sugar: 'Cloudflare Workers',
      scenarios: ['A/B 测试', '动态渲染', '边缘缓存', '轻量 API'],
      relations: ['Edge ←→ Serverless', 'Edge ←→ CI/CD', 'Edge ←→ CDN'],
      code: `// Cloudflare Workers
export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // A/B 测试
    const variant = Math.random() < 0.5 ? 'A' : 'B';
    
    return new Response(\`Hello from variant \${variant}!\`, {
      headers: {
        'Content-Type': 'text/plain',
        'X-Variant': variant
      }
    });
  }
};

// Vercel Edge Functions
export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name') || 'World';
  
  return new Response(\`Hello, \${name}!\`, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}

// 边缘缓存
export default {
  async fetch(request, env, ctx) {
    const cache = caches.default;
    
    // 检查缓存
    let response = await cache.match(request);
    
    if (!response) {
      // 获取数据
      response = await fetch(request);
      
      // 缓存响应
      ctx.waitUntil(cache.put(request, response.clone()));
    }
    
    return response;
  }
};

// 地理位置路由
export default {
  async fetch(request) {
    const country = request.cf.country;
    
    const urls = {
      'US': 'https://us.example.com',
      'CN': 'https://cn.example.com',
      'default': 'https://global.example.com'
    };
    
    const targetUrl = urls[country] || urls.default;
    return fetch(targetUrl);
  }
};

// Next.js Edge Runtime
export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  return new Response(
    JSON.stringify({ message: 'Hello from Edge' }),
    {
      headers: { 'content-type': 'application/json' },
    }
  );
}`,
    },
  ];

  const technologyLayers = [
    { name: '展示层', desc: 'WebXR、WebGPU、Canvas', icon: '🎨', value: '渲染体验' },
    { name: '逻辑层', desc: 'WASM、WebWorker、Edge', icon: '⚡', value: '并行计算' },
    { name: '网络层', desc: 'Web3、DApp、Token', icon: '🔗', value: '去中心化' },
    { name: '分发层', desc: 'CDN、PWA、Edge Functions', icon: '🌐', value: '高速访问' },
    { name: '跨平台层', desc: 'Electron、React Native', icon: '📱', value: '多端运行' },
  ];

  const technologyRelations = [
    'WASM ←→ WebGPU ←→ 高性能计算',
    'PWA ←→ Service Worker ←→ 离线体验',
    'WebXR ←→ WebGPU ←→ 沉浸式渲染',
    'Web3 ←→ 钱包 ←→ 智能合约',
    'Edge Functions ←→ CDN ←→ 低延迟',
  ];

  const deprecatedTech = [
    { name: 'Cordova / PhoneGap', status: '⚠️ 已过时', reason: '被 Capacitor / Flutter Web 取代' },
    { name: 'WebRTC DataChannel（直接传文件）', status: '⚠️ 局限性大', reason: 'WebTransport / WebRTC Unified Plan' },
    { name: 'Silverlight / Flash / Java Applet', status: '❌ 废弃', reason: '被 WebAssembly / WebGPU 取代' },
    { name: 'WebSQL', status: '❌ 废弃', reason: '被 IndexedDB / LocalForage 取代' },
    { name: 'AMP（加速移动页面）', status: '⚠️ 逐步淘汰', reason: 'PWA + SSR 优化方案' },
  ];

  const resources = [
    { name: 'PWA 官方文档', url: 'https://web.dev/progressive-web-apps/', description: '渐进式 Web 应用指南' },
    { name: 'WebAssembly', url: 'https://webassembly.org/', description: 'WASM 官方网站' },
    { name: 'WebGPU', url: 'https://gpuweb.github.io/gpuweb/', description: 'WebGPU 规范文档' },
    { name: 'Electron', url: 'https://www.electronjs.org/', description: '跨平台桌面应用框架' },
    { name: 'ethers.js', url: 'https://docs.ethers.org/', description: 'Web3 开发库' },
    { name: 'TensorFlow.js', url: 'https://www.tensorflow.org/js', description: '浏览器端机器学习' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link href="/study/learn-coding/frontend?level=senior" passHref>
            <Button variant="outline" size="sm" className="hover:bg-white/80 shadow-sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回前端开发
            </Button>
          </Link>
        </div>

        {/* 页面标题 */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl shadow-lg mb-4">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            跨平台与新技术
          </h1>
          <p className="text-gray-600">
            探索 WASM、WebGPU、Edge、AI 等前沿技术，模糊 Web 与原生的界限
          </p>
        </div>

        {/* 技术体系总览 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">技术体系总览</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {technologyLayers.map((layer, index) => (
              <div key={index} className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-gray-200">
                <div className="text-3xl mb-2">{layer.icon}</div>
                <div className="font-semibold text-gray-800 mb-1">{layer.name}</div>
                <div className="text-sm text-gray-600 mb-2">{layer.desc}</div>
                <div className="text-xs text-blue-600 font-medium">{layer.value}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* 技术关系图谱 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-800">技术关系图谱</h2>
          </div>
          <div className="space-y-2">
            {technologyRelations.map((relation, index) => (
              <div key={index} className="flex items-center gap-2 text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="font-mono text-sm">{relation}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* 过时/废弃技术 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-gray-800">⚠️ 过时 / 被取代的技术</h2>
          </div>
          <div className="space-y-3">
            {deprecatedTech.map((tech, index) => (
              <div key={index} className="p-4 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">{tech.name}</h3>
                  <span className="px-3 py-1 bg-white rounded-full text-sm font-medium">{tech.status}</span>
                </div>
                <p className="text-sm text-gray-600">{tech.reason}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          {sections.map((section, index) => (
            <Card key={index} id={`section-${index + 1}`} className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{section.title}</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {section.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <span className="text-lg">📌</span>
                    是什么（点）
                  </h4>
                  <p className="text-gray-700">{section.what}</p>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
                  <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                    <span className="text-lg">💡</span>
                    为什么
                  </h4>
                  <p className="text-gray-700">{section.why}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <span className="text-lg">✅</span>
                    怎么样
                  </h4>
                  <p className="text-gray-700">{section.how}</p>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                    语法糖：{section.sugar}
                  </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-lg">🎯</span>
                    使用场景（面）
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {section.scenarios.map((scenario, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-700">
                        {scenario}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                    <span className="text-lg">🔗</span>
                    关系（线）
                  </h4>
                  <div className="space-y-1">
                    {section.relations.map((relation, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                        <span className="text-sm font-mono">{relation}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm text-gray-100 font-mono whitespace-pre-wrap">
                    {section.code}
                  </pre>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 学习资源 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-blue-600" />
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
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-sm text-gray-600">{resource.description}</p>
              </a>
            ))}
          </div>
        </Card>

        {/* 底部提示 */}
        <div className="text-center">
          <Card className="inline-block p-4 bg-gradient-to-r from-white/80 to-blue-50/80 backdrop-blur-sm border border-blue-200/50">
            <p className="text-sm text-gray-700">
              💡 总结：跨平台与新技术不再只是"让 Web 跑在 App 上"，而是以 WASM + WebGPU + Edge + AI 为核心的新时代前端栈
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
