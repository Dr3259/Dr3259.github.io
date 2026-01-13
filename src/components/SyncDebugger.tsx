
"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePlannerStore } from '@/hooks/usePlannerStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { dataProvider } from '@/lib/data-provider';

export const SyncDebugger = () => {
  const { user } = useAuth();
  const { isFirebaseConnected, allTodos, allDailyNotes } = usePlannerStore();
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testFirestoreWrite = async () => {
    setIsLoading(true);
    setTestResult('');
    
    try {
      if (!user) {
        setTestResult('❌ 用户未登录');
        return;
      }

      // 测试写入
      const testData = { 
        test: '测试数据', 
        timestamp: new Date().toISOString(),
        userId: user.uid 
      };
      
      const docRef = doc(db, 'plannerData', user.uid);
      await setDoc(docRef, { testField: testData }, { merge: true });
      
      // 测试读取
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTestResult(`✅ 写入和读取成功！数据: ${JSON.stringify(data.testField)}`);
      } else {
        setTestResult('⚠️ 写入成功但读取失败');
      }
    } catch (error: any) {
      setTestResult(`❌ 错误: ${error.message}`);
      console.error('Firestore 测试错误:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testDataUpdate = () => {
    const testDateKey = new Date().toISOString().split('T')[0];
    const testNote = `测试笔记 ${new Date().toLocaleTimeString()}`;
    
    usePlannerStore.getState().setDailyNote(testDateKey, testNote);
    setTestResult(`✅ 已尝试更新今日笔记: ${testNote}`);
  };

  const fixDataStructure = async () => {
    setIsLoading(true);
    setTestResult('');
    
    try {
      if (!user) {
        setTestResult('❌ 用户未登录');
        return;
      }

      setTestResult('🔄 正在修复数据结构...');
      
      // 获取服务器数据
      const serverData = await dataProvider.getData(user.uid);
      console.log('服务器原始数据:', serverData);
      
      if (serverData) {
        const migratedData: any = { ...serverData };
        
        // 检查并修复数据结构 - 迁移所有可能的旧字段
        if ((serverData as any).allInspirations) {
          console.log('迁移 allInspirations 到 allReflections');
          migratedData.allReflections = { 
            ...(migratedData.allReflections || {}),
            ...((serverData as any).allInspirations || {})
          };
          console.log('allInspirations 数据:', (serverData as any).allInspirations);
          console.log('迁移后 allReflections:', migratedData.allReflections);
        }
        
        // 检查其他可能的旧字段名
        const fieldMappings = [
          { old: 'todos', new: 'allTodos' },
          { old: 'notes', new: 'allDailyNotes' },
          { old: 'meetings', new: 'allMeetingNotes' },
          { old: 'links', new: 'allShareLinks' },
          { old: 'ratings', new: 'allRatings' },
          { old: 'reflections', new: 'allReflections' },
          { old: 'inspirations', new: 'allReflections' }
        ];
        
        fieldMappings.forEach(({ old, new: newField }) => {
          if ((serverData as any)[old] && typeof (serverData as any)[old] === 'object') {
            console.log(`迁移 ${old} 到 ${newField}`);
            migratedData[newField] = {
              ...(migratedData[newField] || {}),
              ...((serverData as any)[old] || {})
            };
          }
        });
        
        // 确保所有字段存在
        const requiredFields = ['allTodos', 'allReflections', 'allDailyNotes', 'allMeetingNotes', 'allShareLinks', 'allRatings'];
        requiredFields.forEach(field => {
          if (!migratedData[field]) {
            migratedData[field] = {};
          }
        });
        
        if (!migratedData.customInspirationTags) {
          migratedData.customInspirationTags = [
            { id: 'idea', name: '想法', emoji: '💡', color: '#fbbf24' },
            { id: 'thought', name: '思考', emoji: '🤔', color: '#8b5cf6' },
            { id: 'quote', name: '摘录', emoji: '📝', color: '#06b6d4' },
            { id: 'reminder', name: '提醒', emoji: '⏰', color: '#f59e0b' },
            { id: 'other', name: '其他', emoji: '📌', color: '#6b7280' }
          ];
        }
        
        console.log('修复后的数据:', migratedData);
        console.log('所有数据字段统计:');
        requiredFields.forEach(field => {
          const fieldData = migratedData[field] || {};
          const dateKeys = Object.keys(fieldData);
          console.log(`${field}: ${dateKeys.length} 个日期 [${dateKeys.join(', ')}]`);
          
          // 显示每个日期的数据量
          dateKeys.forEach(dateKey => {
            const dayData = fieldData[dateKey] || {};
            const slotKeys = Object.keys(dayData);
            console.log(`  ${dateKey}: ${slotKeys.length} 个时间段 [${slotKeys.join(', ')}]`);
          });
        });
        
        // 保存到服务器
        await dataProvider.saveData(user.uid, migratedData);
        
        // 设置到本地store
        usePlannerStore.getState()._setStore(migratedData);
        
        // 统计迁移结果
        const totalDates = requiredFields.reduce((sum, field) => {
          return sum + Object.keys(migratedData[field] || {}).length;
        }, 0);
        
        setTestResult(`✅ 数据结构修复完成！共迁移 ${totalDates} 个日期的数据。请刷新页面查看效果。`);
      } else {
        setTestResult('⚠️ 服务器上没有数据');
      }
    } catch (error: any) {
      setTestResult(`❌ 修复失败: ${error.message}`);
      console.error('数据修复错误:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-4">
      <CardHeader>
        <CardTitle>🔧 云同步调试器</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>用户状态:</strong>
            <Badge variant={user ? "default" : "destructive"}>
              {user ? `已登录 (${user.email})` : '未登录'}
            </Badge>
          </div>
          <div>
            <strong>Firebase 连接:</strong>
            <Badge variant={isFirebaseConnected ? "default" : "destructive"}>
              {isFirebaseConnected ? '已连接' : '未连接'}
            </Badge>
          </div>
        </div>

        <div>
          <strong>本地数据统计:</strong>
          <ul className="text-sm text-muted-foreground">
            <li>待办事项日期数: {Object.keys(allTodos).length}</li>
            <li>日记条目数: {Object.keys(allDailyNotes).length}</li>
          </ul>
        </div>

        <div className="space-y-2">
          <Button 
            onClick={testFirestoreWrite} 
            disabled={isLoading || !user}
            className="w-full"
          >
            {isLoading ? '测试中...' : '测试 Firestore 读写'}
          </Button>
          
          <Button 
            onClick={testDataUpdate} 
            disabled={!user}
            variant="outline"
            className="w-full"
          >
            测试数据更新
          </Button>
          
          <Button 
            onClick={fixDataStructure} 
            disabled={isLoading || !user}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isLoading ? '修复中...' : '修复数据结构'}
          </Button>
        </div>

        {testResult && (
          <div className="p-3 bg-muted rounded-md">
            <strong>测试结果:</strong>
            <pre className="text-sm mt-1 whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <strong>调试提示:</strong>
          <ol className="list-decimal list-inside space-y-1">
            <li>确保已登录账户</li>
            <li>检查浏览器控制台是否有错误信息</li>
            <li>确认 Firebase 项目配置正确</li>
            <li>检查 Firestore 安全规则是否允许读写</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};
