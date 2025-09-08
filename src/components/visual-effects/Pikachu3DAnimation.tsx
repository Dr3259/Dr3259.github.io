"use client";

import React, { useEffect, useRef } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Face {
  vertices: number[];
  color: string;
  normal?: Point3D;
}

interface Model3D {
  vertices: Point3D[];
  faces: Face[];
  position: Point3D;
  rotation: Point3D;
  scale: number;
}

export const Pikachu3DAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const pikachuRef = useRef<Model3D | null>(null);
  const timeRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initializePikachu();
    };

    const initializePikachu = () => {
      // 创建真正可爱的皮卡丘3D模型 - 圆润版本！
      const vertices: Point3D[] = [];
      
      // 生成圆形头部 (球体近似)
      const headRadius = 25;
      const headSegments = 12;
      for (let i = 0; i < headSegments; i++) {
        const angle = (Math.PI * 2 * i) / headSegments;
        const y = -10; // 头部中心
        
        // 外圈顶点
        vertices.push({
          x: Math.cos(angle) * headRadius,
          y: y - 15, // 头部上方
          z: Math.sin(angle) * headRadius
        });
        
        // 中圈顶点  
        vertices.push({
          x: Math.cos(angle) * headRadius * 0.9,
          y: y,
          z: Math.sin(angle) * headRadius * 0.9
        });
        
        // 下圈顶点
        vertices.push({
          x: Math.cos(angle) * headRadius * 0.7,
          y: y + 12,
          z: Math.sin(angle) * headRadius * 0.7
        });
      }
      
      const headVertexCount = vertices.length;
      
      // 生成圆润身体 (椭圆体)
      const bodyRadius = 18;
      const bodyHeight = 30;
      const bodySegments = 10;
      const bodyStartIndex = vertices.length;
      
      for (let i = 0; i < bodySegments; i++) {
        const angle = (Math.PI * 2 * i) / bodySegments;
        
        // 身体上部
        vertices.push({
          x: Math.cos(angle) * bodyRadius * 0.8,
          y: 15, // 身体顶部
          z: Math.sin(angle) * bodyRadius * 0.8
        });
        
        // 身体中部
        vertices.push({
          x: Math.cos(angle) * bodyRadius,
          y: 25,
          z: Math.sin(angle) * bodyRadius
        });
        
        // 身体下部
        vertices.push({
          x: Math.cos(angle) * bodyRadius * 0.9,
          y: 35,
          z: Math.sin(angle) * bodyRadius * 0.9
        });
      }
      
      // 可爱的尖耳朵 (三角形)
      const earHeight = 20;
      const earBase = 8;
      
      // 左耳朵
      vertices.push({ x: -15, y: -25, z: 5 });    // 左耳根部
      vertices.push({ x: -12, y: -25 - earHeight, z: 8 }); // 左耳尖
      vertices.push({ x: -18, y: -20, z: 10 });   // 左耳外侧
      
      // 右耳朵  
      vertices.push({ x: 15, y: -25, z: 5 });     // 右耳根部
      vertices.push({ x: 12, y: -25 - earHeight, z: 8 });  // 右耳尖
      vertices.push({ x: 18, y: -20, z: 10 });    // 右耳外侧
      
      // 圆润的小手臂
      vertices.push({ x: -22, y: 20, z: 12 });    // 左手
      vertices.push({ x: 22, y: 20, z: 12 });     // 右手
      
      // 小脚脚
      vertices.push({ x: -8, y: 45, z: 18 });     // 左脚
      vertices.push({ x: 8, y: 45, z: 18 });      // 右脚
      
      // 闪电尾巴 (更准确的形状)
      const tailVertices = [
        { x: 0, y: 25, z: -20 },      // 尾巴根部
        { x: -8, y: 15, z: -28 },     // 尾巴第一段
        { x: 5, y: 8, z: -35 },       // 尾巴转折点
        { x: -3, y: 0, z: -42 },      // 尾巴第二段
        { x: 8, y: -8, z: -48 },      // 尾巴尖端
        { x: 0, y: -5, z: -45 },      // 尾巴分叉1
        { x: -5, y: -10, z: -50 },    // 尾巴分叉2
      ];
      vertices.push(...tailVertices);
      
      // 脸部特征点
      vertices.push({ x: -8, y: -5, z: 23 });     // 左眼
      vertices.push({ x: 8, y: -5, z: 23 });      // 右眼
      vertices.push({ x: 0, y: 2, z: 25 });       // 小鼻子
      vertices.push({ x: -13, y: 3, z: 22 });     // 左脸颊
      vertices.push({ x: 13, y: 3, z: 22 });      // 右脸颊

      // 动态生成头部面片 (圆润的球形)
      const faces: Face[] = [];
      
      // 头部面片 - 创建圆润的头部
      for (let i = 0; i < headSegments; i++) {
        const next = (i + 1) % headSegments;
        
        // 上层三角面
        faces.push({
          vertices: [i * 3, next * 3, i * 3 + 1],
          color: '#FFD700'
        });
        faces.push({
          vertices: [next * 3, next * 3 + 1, i * 3 + 1],
          color: '#FFD700'
        });
        
        // 中层四边形面
        faces.push({
          vertices: [i * 3 + 1, next * 3 + 1, next * 3 + 2, i * 3 + 2],
          color: '#FFDE00'
        });
      }
      
      // 身体面片 - 圆润的椭圆体
      for (let i = 0; i < bodySegments; i++) {
        const next = (i + 1) % bodySegments;
        const baseIdx = bodyStartIndex;
        
        // 身体上层
        faces.push({
          vertices: [baseIdx + i * 3, baseIdx + next * 3, baseIdx + i * 3 + 1],
          color: '#FFDE00'
        });
        faces.push({
          vertices: [baseIdx + next * 3, baseIdx + next * 3 + 1, baseIdx + i * 3 + 1],
          color: '#FFDE00'
        });
        
        // 身体下层
        faces.push({
          vertices: [baseIdx + i * 3 + 1, baseIdx + next * 3 + 1, baseIdx + next * 3 + 2, baseIdx + i * 3 + 2],
          color: '#FFDE00'
        });
      }
      
      const earStartIdx = bodyStartIndex + bodySegments * 3;
      
      // 左耳朵 (三角形)
      faces.push({
        vertices: [earStartIdx, earStartIdx + 1, earStartIdx + 2],
        color: '#FFD700'
      });
      
      // 右耳朵 (三角形)  
      faces.push({
        vertices: [earStartIdx + 3, earStartIdx + 4, earStartIdx + 5],
        color: '#FFD700'
      });
      
      // 耳朵尖端黑色部分
      faces.push({
        vertices: [earStartIdx + 1], // 左耳尖
        color: '#2C1810'
      });
      faces.push({
        vertices: [earStartIdx + 4], // 右耳尖
        color: '#2C1810'
      });
      
      const handStartIdx = earStartIdx + 6;
      const footStartIdx = handStartIdx + 2;
      const tailStartIdx = footStartIdx + 2;
      
      // 闪电尾巴面片
      for (let i = 0; i < 6; i++) {
        if (i < 5) {
          faces.push({
            vertices: [tailStartIdx + i, tailStartIdx + i + 1],
            color: '#FFD700'
          });
        }
      }
      
      const faceStartIdx = tailStartIdx + 7;
      
      // 脸部特征（作为特殊渲染点）
      faces.push({ vertices: [faceStartIdx], color: '#000000' });     // 左眼
      faces.push({ vertices: [faceStartIdx + 1], color: '#000000' }); // 右眼  
      faces.push({ vertices: [faceStartIdx + 2], color: '#000000' }); // 鼻子
      faces.push({ vertices: [faceStartIdx + 3], color: '#FF6B6B' }); // 左脸颊
      faces.push({ vertices: [faceStartIdx + 4], color: '#FF6B6B' }); // 右脸颊

      pikachuRef.current = {
        vertices,
        faces,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: 3
      };
    };

    const project3D = (point: Point3D, model: Model3D): { x: number, y: number, z: number } => {
      // 应用模型变换
      let x = point.x * model.scale;
      let y = point.y * model.scale;
      let z = point.z * model.scale;

      // 旋转 Y 轴
      const cosY = Math.cos(model.rotation.y);
      const sinY = Math.sin(model.rotation.y);
      const tempX = x * cosY - z * sinY;
      z = x * sinY + z * cosY;
      x = tempX;

      // 旋转 X 轴
      const cosX = Math.cos(model.rotation.x);
      const sinX = Math.sin(model.rotation.x);
      const tempY = y * cosX - z * sinX;
      z = y * sinX + z * cosX;
      y = tempY;

      // 透视投影
      const perspective = 400;
      const scale = perspective / (perspective + z + 200);
      
      return {
        x: (x * scale) + canvas.width / 2 + model.position.x,
        y: (y * scale) + canvas.height / 2 + model.position.y,
        z: z
      };
    };

    const drawBackground = () => {
      // 可爱的背景渐变
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#87CEEB');   // 天空蓝
      gradient.addColorStop(0.3, '#98FB98'); // 淡绿色
      gradient.addColorStop(0.7, '#FFE4B5'); // 奶油色
      gradient.addColorStop(1, '#FFEFD5');   // 乳白色
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 添加一些装饰性的云朵
      drawClouds();
      
      // 添加闪烁的星星
      drawSparkles();
    };

    const drawClouds = () => {
      const clouds = [
        { x: canvas.width * 0.2, y: canvas.height * 0.2, size: 40 },
        { x: canvas.width * 0.7, y: canvas.height * 0.15, size: 50 },
        { x: canvas.width * 0.9, y: canvas.height * 0.3, size: 35 }
      ];

      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      clouds.forEach(cloud => {
        for (let i = 0; i < 5; i++) {
          const offsetX = (i - 2) * cloud.size * 0.3;
          const offsetY = Math.sin(i) * cloud.size * 0.2;
          ctx.beginPath();
          ctx.arc(cloud.x + offsetX, cloud.y + offsetY, cloud.size * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    };

    const drawSparkles = () => {
      for (let i = 0; i < 15; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height * 0.6;
        const size = 2 + Math.random() * 3;
        const alpha = 0.3 + Math.sin(timeRef.current * 0.05 + i) * 0.3;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#FFD700';
        ctx.translate(x, y);
        ctx.rotate(timeRef.current * 0.02 + i);
        
        // 绘制星形
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(size * 0.3, -size * 0.3);
        ctx.lineTo(size, 0);
        ctx.lineTo(size * 0.3, size * 0.3);
        ctx.lineTo(0, size);
        ctx.lineTo(-size * 0.3, size * 0.3);
        ctx.lineTo(-size, 0);
        ctx.lineTo(-size * 0.3, -size * 0.3);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
      }
    };

    const drawFace = (model: Model3D, projectedVertices: Array<{ x: number, y: number, z: number }>) => {
      // 计算脸部特征的索引
      const faceStartIdx = projectedVertices.length - 5;
      const leftEye = projectedVertices[faceStartIdx];
      const rightEye = projectedVertices[faceStartIdx + 1];
      const nose = projectedVertices[faceStartIdx + 2];
      const leftCheek = projectedVertices[faceStartIdx + 3];
      const rightCheek = projectedVertices[faceStartIdx + 4];
      
      if (!leftEye || !rightEye || !nose || !leftCheek || !rightCheek) return;

      // 绘制超可爱的大眼睛 (添加眨眼效果)
      const eyeSize = 12;
      const pupilSize = 8;
      const blinkTime = Math.sin(timeRef.current * 0.005); // 缓慢的眨眼
      const isBlinking = blinkTime > 0.95; // 偶尔眨眼
      const eyeHeight = isBlinking ? 2 : eyeSize;
      
      // 左眼外圈 (白色) - 添加眨眼效果
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(leftEye.x, leftEye.y, eyeSize, eyeHeight, 0, 0, Math.PI * 2);
      ctx.fill();
      
      if (!isBlinking) {
        // 左眼瞳孔
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(leftEye.x, leftEye.y, pupilSize, 0, Math.PI * 2);
        ctx.fill();
        
        // 左眼高光 (让眼睛更有神)
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(leftEye.x - 3, leftEye.y - 3, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(leftEye.x + 2, leftEye.y + 2, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 右眼外圈 (白色) - 添加眨眼效果
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(rightEye.x, rightEye.y, eyeSize, eyeHeight, 0, 0, Math.PI * 2);
      ctx.fill();
      
      if (!isBlinking) {
        // 右眼瞳孔
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(rightEye.x, rightEye.y, pupilSize, 0, Math.PI * 2);
        ctx.fill();
        
        // 右眼高光
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(rightEye.x + 3, rightEye.y - 3, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(rightEye.x - 2, rightEye.y + 2, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 可爱的小三角鼻子
      ctx.fillStyle = '#2C1810';
      ctx.beginPath();
      ctx.moveTo(nose.x, nose.y - 2);
      ctx.lineTo(nose.x - 3, nose.y + 2);
      ctx.lineTo(nose.x + 3, nose.y + 2);
      ctx.closePath();
      ctx.fill();

      // 温暖的笑容嘴巴
      ctx.strokeStyle = '#2C1810';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(nose.x, nose.y + 6, 6, 0.3, Math.PI - 0.3);
      ctx.stroke();
      
      // 小酒窝
      ctx.fillStyle = 'rgba(255, 107, 107, 0.3)';
      ctx.beginPath();
      ctx.arc(nose.x - 10, nose.y + 8, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(nose.x + 10, nose.y + 8, 3, 0, Math.PI * 2);
      ctx.fill();

      // 超可爱的红脸颊 (电力囊)
      const cheekPulse = 0.9 + Math.sin(timeRef.current * 0.08) * 0.15;
      const cheekSize = 10;
      
      // 左脸颊渐变
      const leftCheekGradient = ctx.createRadialGradient(
        leftCheek.x, leftCheek.y, 0,
        leftCheek.x, leftCheek.y, cheekSize * cheekPulse
      );
      leftCheekGradient.addColorStop(0, 'rgba(255, 80, 80, 0.9)');
      leftCheekGradient.addColorStop(0.7, 'rgba(255, 120, 120, 0.6)');
      leftCheekGradient.addColorStop(1, 'rgba(255, 160, 160, 0.2)');
      
      ctx.fillStyle = leftCheekGradient;
      ctx.beginPath();
      ctx.arc(leftCheek.x, leftCheek.y, cheekSize * cheekPulse, 0, Math.PI * 2);
      ctx.fill();
      
      // 右脸颊渐变
      const rightCheekGradient = ctx.createRadialGradient(
        rightCheek.x, rightCheek.y, 0,
        rightCheek.x, rightCheek.y, cheekSize * cheekPulse
      );
      rightCheekGradient.addColorStop(0, 'rgba(255, 80, 80, 0.9)');
      rightCheekGradient.addColorStop(0.7, 'rgba(255, 120, 120, 0.6)');
      rightCheekGradient.addColorStop(1, 'rgba(255, 160, 160, 0.2)');
      
      ctx.fillStyle = rightCheekGradient;
      ctx.beginPath();
      ctx.arc(rightCheek.x, rightCheek.y, cheekSize * cheekPulse, 0, Math.PI * 2);
      ctx.fill();
      
      // 电力闪烁效果
      if (Math.random() < 0.03) {
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(leftCheek.x - 5, leftCheek.y);
        ctx.lineTo(leftCheek.x + 5, leftCheek.y - 3);
        ctx.lineTo(leftCheek.x + 2, leftCheek.y + 3);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(rightCheek.x - 5, rightCheek.y);
        ctx.lineTo(rightCheek.x + 5, rightCheek.y - 3);
        ctx.lineTo(rightCheek.x + 2, rightCheek.y + 3);
        ctx.stroke();
      }
    };

    const drawModel = (model: Model3D) => {
      if (!model) return;

      // 投影所有顶点
      const projectedVertices = model.vertices.map(vertex => project3D(vertex, model));

      // 按深度排序面
      const facesWithDepth = model.faces.map(face => {
        const avgZ = face.vertices.reduce((sum, vertexIndex) => {
          return sum + projectedVertices[vertexIndex].z;
        }, 0) / face.vertices.length;
        return { face, depth: avgZ };
      });

      facesWithDepth.sort((a, b) => b.depth - a.depth);

      // 绘制面
      facesWithDepth.forEach(({ face }) => {
        if (face.vertices.length === 1) {
          // 特殊渲染单点（脸部特征）
          return;
        }

        // 更加立体的面片渲染
        ctx.fillStyle = face.color;
        
        // 添加边框和阴影效果
        if (face.color === '#FFDE00' || face.color === '#FFD700') {
          // 为皮卡丘的身体添加深度阴影
          const centerX = face.vertices.reduce((sum, vi) => sum + projectedVertices[vi].x, 0) / face.vertices.length;
          const centerY = face.vertices.reduce((sum, vi) => sum + projectedVertices[vi].y, 0) / face.vertices.length;
          const centerZ = face.vertices.reduce((sum, vi) => sum + projectedVertices[vi].z, 0) / face.vertices.length;
          
          // 根据Z深度调整阴影
          const shadowIntensity = Math.max(0, (centerZ + 100) / 200);
          const shadowColor = `rgba(218, 165, 32, ${0.3 * shadowIntensity})`;
          
          ctx.fillStyle = face.color;
          ctx.strokeStyle = shadowColor;
          ctx.lineWidth = 1.5;
        } else {
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
          ctx.lineWidth = 1;
        }

        ctx.beginPath();
        face.vertices.forEach((vertexIndex, i) => {
          const vertex = projectedVertices[vertexIndex];
          if (i === 0) {
            ctx.moveTo(vertex.x, vertex.y);
          } else {
            ctx.lineTo(vertex.x, vertex.y);
          }
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 添加更自然的高光效果
        if (face.color === '#FFDE00' || face.color === '#FFD700') {
          const centerX = face.vertices.reduce((sum, vi) => sum + projectedVertices[vi].x, 0) / face.vertices.length;
          const centerY = face.vertices.reduce((sum, vi) => sum + projectedVertices[vi].y, 0) / face.vertices.length;
          
          // 模拟光照效果
          const lightX = canvas.width * 0.3;
          const lightY = canvas.height * 0.3;
          const distance = Math.sqrt(Math.pow(centerX - lightX, 2) + Math.pow(centerY - lightY, 2));
          const maxDistance = Math.sqrt(Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2));
          const lightIntensity = 1 - (distance / maxDistance);
          
          const highlightGradient = ctx.createRadialGradient(
            centerX - 10, centerY - 10, 0,
            centerX, centerY, 25
          );
          highlightGradient.addColorStop(0, `rgba(255, 255, 255, ${0.4 * lightIntensity})`);
          highlightGradient.addColorStop(0.6, `rgba(255, 255, 255, ${0.2 * lightIntensity})`);
          highlightGradient.addColorStop(1, 'transparent');
          
          ctx.fillStyle = highlightGradient;
          ctx.fill();
        }
      });

      // 绘制脸部特征
      drawFace(model, projectedVertices);
    };

    const addFloatingHearts = () => {
      // 添加飘浮的爱心
      for (let i = 0; i < 8; i++) {
        const x = Math.random() * canvas.width;
        const y = canvas.height + (timeRef.current * 2 + i * 50) % (canvas.height + 100) - 100;
        const size = 10 + Math.random() * 15;
        const alpha = 0.3 + Math.sin(timeRef.current * 0.03 + i) * 0.2;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#FF69B4';
        ctx.translate(x, y);
        ctx.rotate(Math.sin(timeRef.current * 0.02 + i) * 0.3);
        
        // 绘制爱心
        ctx.beginPath();
        ctx.moveTo(0, size * 0.3);
        ctx.bezierCurveTo(-size * 0.5, -size * 0.2, -size, -size * 0.2, -size * 0.5, size * 0.1);
        ctx.bezierCurveTo(-size * 0.5, size * 0.4, 0, size * 0.7, 0, size);
        ctx.bezierCurveTo(0, size * 0.7, size * 0.5, size * 0.4, size * 0.5, size * 0.1);
        ctx.bezierCurveTo(size, -size * 0.2, size * 0.5, -size * 0.2, 0, size * 0.3);
        ctx.fill();
        
        ctx.restore();
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = event.clientX - rect.left;
      mouseRef.current.y = event.clientY - rect.top;
    };

    const animate = () => {
      timeRef.current += 1;

      if (pikachuRef.current) {
        // 鼠标交互 - 皮卡丘会跟随鼠标转动
        const mouseInfluence = 0.0005;
        const targetRotationY = (mouseRef.current.x - canvas.width / 2) * mouseInfluence;
        const targetRotationX = (mouseRef.current.y - canvas.height / 2) * mouseInfluence;
        
        pikachuRef.current.rotation.y += (targetRotationY - pikachuRef.current.rotation.y) * 0.05;
        pikachuRef.current.rotation.x += (targetRotationX - pikachuRef.current.rotation.x) * 0.05;

        // 呼吸效果和自然摆动
        pikachuRef.current.rotation.y += Math.sin(timeRef.current * 0.008) * 0.005;
        pikachuRef.current.position.y = Math.sin(timeRef.current * 0.015) * 8;

        // 呼吸效果 (更轻微)
        pikachuRef.current.scale = 3 + Math.sin(timeRef.current * 0.025) * 0.08;
      }

      drawBackground();
      addFloatingHearts();
      
      if (pikachuRef.current) {
        drawModel(pikachuRef.current);
      }

      // 添加"皮卡皮卡"文字效果
      if (Math.random() < 0.002) {
        drawPikaPika();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    const drawPikaPika = () => {
      const texts = ['皮卡皮卡!', 'Pika Pika!', '⚡', '✨'];
      const text = texts[Math.floor(Math.random() * texts.length)];
      const x = canvas.width * 0.1 + Math.random() * canvas.width * 0.8;
      const y = canvas.height * 0.1 + Math.random() * canvas.height * 0.3;
      
      ctx.save();
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = '#FFD700';
      ctx.strokeStyle = '#FF6B00';
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';
      ctx.strokeText(text, x, y);
      ctx.fillText(text, x, y);
      ctx.restore();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer"
        style={{ display: 'block' }}
      />
      <div className="absolute bottom-4 left-4 text-sm text-gray-600 bg-white/80 px-3 py-1 rounded-full">
        💡 移动鼠标与皮卡丘互动！
      </div>
    </div>
  );
};