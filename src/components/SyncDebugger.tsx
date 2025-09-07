"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePlannerStore } from '@/hooks/usePlannerStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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