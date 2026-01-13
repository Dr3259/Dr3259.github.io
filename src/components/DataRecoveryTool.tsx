"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePlannerStore } from '@/hooks/usePlannerStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { dataProvider } from '@/lib/data-provider';

export const DataRecoveryTool = () => {
  const { user } = useAuth();
  const store = usePlannerStore();
  const [backupData, setBackupData] = useState('');
  const [status, setStatus] = useState('');
  const [serverData, setServerData] = useState('');

  const createBackup = () => {
    const currentData = {
      allTodos: store.allTodos,
      allMeetingNotes: store.allMeetingNotes,
      allShareLinks: store.allShareLinks,
      allReflections: store.allReflections,
      allDailyNotes: store.allDailyNotes,
      allRatings: store.allRatings,
      customInspirationTags: store.customInspirationTags,
      lastTodoMigrationDate: store.lastTodoMigrationDate,
      timestamp: new Date().toISOString()
    };
    
    const backupString = JSON.stringify(currentData, null, 2);
    setBackupData(backupString);
    setStatus('✅ 备份已创建');
  };

  const viewServerData = async () => {
    if (!user) {
      setStatus('❌ 用户未登录');
      return;
    }

    try {
      setStatus('🔄 正在查看服务器数据...');
      const data = await dataProvider.getData(user.uid);
      
      if (data) {
        console.log('=== 服务器数据详细分析 ===');
        console.log('完整数据对象:', data);
        console.log('数据对象的所有键:', Object.keys(data));
        
        // 分析每个字段
        Object.keys(data).forEach(key => {
          const value = data[key as keyof typeof data];
          console.log(`${key}:`, {
            type: typeof value,
            isObject: typeof value === 'object' && value !== null,
            isArray: Array.isArray(value),
            keys: typeof value === 'object' && value !== null ? Object.keys(value) : 'N/A',
            length: typeof value === 'object' && value !== null ? Object.keys(value).length : 'N/A',
            sample: value
          });
        });
        
        const dataString = JSON.stringify(data, null, 2);
        setServerData(dataString);
        setStatus('✅ 服务器数据已加载到下方，请查看控制台详细分析');
      } else {
        setServerData('');
        setStatus('⚠️ 服务器上没有数据');
      }
    } catch (error: any) {
      setStatus(`❌ 查看失败: ${error.message}`);
    }
  };

  const migrateData = async () => {
    if (!user) {
      setStatus('❌ 用户未登录');
      return;
    }

    try {
      setStatus('🔄 正在迁移数据...');
      const serverData = await dataProvider.getData(user.uid);
      
      if (serverData) {
        console.log('开始数据迁移，原始数据:', serverData);
        
        const migratedData: any = { ...serverData };
        
        // 检查是否有旧的字段名需要迁移
        if ((serverData as any).allInspirations && !serverData.allReflections) {
          console.log('发现旧字段 allInspirations，迁移到 allReflections');
          migratedData.allReflections = (serverData as any).allInspirations;
          delete (migratedData as any).allInspirations;
        }
        
        // 确保所有必需的字段都存在
        const requiredFields = [
          'allTodos', 'allReflections', 'allDailyNotes', 
          'allMeetingNotes', 'allShareLinks', 'allRatings'
        ];
        
        requiredFields.forEach(field => {
          if (!migratedData[field]) {
            console.log(`添加缺失字段: ${field}`);
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
        
        console.log('迁移后的数据:', migratedData);
        
        // 保存迁移后的数据到服务器
        await dataProvider.saveData(user.uid, migratedData);
        
        // 设置到本地store
        store._setStore(migratedData);
        
        setStatus('✅ 数据迁移完成，请刷新页面查看效果');
      } else {
        setStatus('⚠️ 服务器上没有数据');
      }
    } catch (error: any) {
      console.error('数据迁移失败:', error);
      setStatus(`❌ 迁移失败: ${error.message}`);
    }
  };

  const getDataStats = () => {
    const stats = {
      todos: Object.keys(store.allTodos).length,
      reflections: Object.keys(store.allReflections).length,
      notes: Object.keys(store.allDailyNotes).length,
      meetings: Object.keys(store.allMeetingNotes).length,
      links: Object.keys(store.allShareLinks).length
    };
    return stats;
  };

  const stats = getDataStats();

  return (
    <Card className="w-full max-w-4xl mx-auto mt-4">
      <CardHeader>
        <CardTitle>🔧 数据恢复工具</CardTitle>
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
            <strong>连接状态:</strong>
            <Badge variant={store.isFirebaseConnected ? "default" : "destructive"}>
              {store.isFirebaseConnected ? '已连接' : '未连接'}
            </Badge>
          </div>
        </div>

        <div>
          <strong>当前数据统计:</strong>
          <div className="grid grid-cols-5 gap-2 text-sm">
            <div>待办: {stats.todos}</div>
            <div>反思: {stats.reflections}</div>
            <div>笔记: {stats.notes}</div>
            <div>会议: {stats.meetings}</div>
            <div>链接: {stats.links}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button onClick={createBackup} variant="outline">
            创建备份
          </Button>
          <Button onClick={viewServerData} disabled={!user} variant="secondary">
            查看服务器数据
          </Button>
          <Button onClick={migrateData} disabled={!user} className="bg-green-600 hover:bg-green-700">
            迁移数据
          </Button>
        </div>

        {serverData && (
          <div>
            <strong>服务器数据:</strong>
            <Textarea
              value={serverData}
              readOnly
              className="h-32 text-xs font-mono"
              placeholder="服务器数据将显示在这里..."
            />
          </div>
        )}

        {status && (
          <div className="p-3 bg-muted rounded-md">
            <strong>状态:</strong> {status}
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <strong>问题分析:</strong>
          <p>根据您的日志，服务器数据存在但所有字段都是空对象。可能原因：</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>数据结构变更：可能有旧字段名如 allInspirations</li>
            <li>数据被错误保存为空对象</li>
            <li>Firebase权限或安全规则问题</li>
          </ol>
          <p className="mt-2"><strong>建议：</strong>先点击"查看服务器数据"分析数据结构，再点击"迁移数据"修复问题。</p>
        </div>
      </CardContent>
    </Card>
  );
};