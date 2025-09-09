# 云同步问题诊断清单

## 🔍 问题定位步骤

### 1. 检查用户认证状态
- 打开浏览器开发者工具 (F12)
- 在 Console 中输入：`console.log('用户状态:', window.firebase?.auth?.currentUser)`
- 检查是否显示用户信息

### 2. 检查 Firebase 连接
- 在 Console 中输入：`console.log('Firebase 配置:', window.firebase?.app?.options)`
- 确认项目 ID 是否正确

### 3. 检查 Firestore 权限
- 在 Console 中输入以下代码测试写入：
```javascript
// 测试 Firestore 写入
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from './src/lib/firebase';

const testWrite = async () => {
  if (auth.currentUser) {
    try {
      await setDoc(doc(db, 'test', auth.currentUser.uid), { test: 'data' });
      console.log('✅ Firestore 写入成功');
    } catch (error) {
      console.error('❌ Firestore 写入失败:', error);
    }
  } else {
    console.log('❌ 用户未登录');
  }
};
testWrite();
```

### 4. 检查控制台日志
查看是否有以下日志：
- "正在更新 Firestore 字段 xxx"
- "成功更新 Firestore 字段 xxx"
- "用户未登录，跳过 Firestore 更新字段 xxx"

## 🚨 常见问题及解决方案

### 问题1: 用户未登录
**症状**: 控制台显示"用户未登录，跳过 Firestore 更新"
**解决**: 访问 /login 页面进行登录

### 问题2: Firestore 安全规则问题
**症状**: 出现 "permission-denied" 错误
**解决**: 检查 Firebase 控制台的 Firestore 安全规则

### 问题3: 网络连接问题
**症状**: 出现网络相关错误
**解决**: 检查网络连接和 Firebase 服务状态

### 问题4: 数据格式问题
**症状**: 数据写入但格式不正确
**解决**: 检查数据结构是否符合预期
```