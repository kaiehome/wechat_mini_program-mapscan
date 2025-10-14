# 部署指南 - 廉洁探索之旅微信小程序

## 🚀 快速部署步骤

### 1. 环境准备

#### 必需工具
- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- 微信小程序开发账号
- 支持微信的设备（用于真机测试）

#### 账号准备
1. 注册微信小程序账号：https://mp.weixin.qq.com/
2. 获取AppID（应用ID）
3. 配置服务器域名（如需要）

### 2. 项目配置

#### 修改AppID
编辑 `project.config.json` 文件：
```json
{
  "appid": "your-app-id-here",
  "projectname": "廉洁探索之旅"
}
```

#### 配置权限
在 `app.json` 中已配置必要的权限：
```json
{
  "permission": {
    "scope.camera": {
      "desc": "用于扫描二维码进行打卡"
    }
  }
}
```

### 3. 图片资源准备

#### 必需的图片文件
确保以下目录包含相应的图片资源：

**印章图片** (`images/stamps/`):
- `signin.png` - 寻根·霜降廉养印章
- `esports.png` - 笃行·电竞廉规印章
- `coffee.png` - 省身·啡香廉思印章
- `makeup.png` - 正容·美妆廉仪印章
- `sleep.png` - 静悟·清风入梦印章
- `breeze.png` - 沁心·清风廉饮印章
- `locked.png` - 未解锁状态印章

**图标资源** (`images/icons/`):
- `map.png` / `map-active.png` - 地图图标
- `scan.png` / `scan-active.png` - 扫码图标
- `progress.png` / `progress-active.png` - 印章图标
- `check.png` - 完成状态图标
- `circle.png` - 未完成状态图标

### 4. 打卡点配置

#### 修改坐标位置
编辑 `data/checkpoints.js` 文件中的坐标：
```javascript
{
  id: 'signin',
  name: '寻根·霜降廉养',
  position: {
    lat: 39.908823,  // 修改为实际纬度
    lng: 116.397470  // 修改为实际经度
  }
}
```

#### 自定义活动信息
在 `data/checkpoints.js` 的 `activityConfig` 中修改：
```javascript
export const activityConfig = {
  name: '您的活动名称',
  description: '您的活动描述',
  completionReward: {
    title: '恭喜完成所有打卡！',
    message: '您的完成提示信息',
    prize: '您的奖品描述'
  }
}
```

### 5. 二维码生成

#### 生成打卡点二维码
使用 `utils/qrcode.js` 中的工具：
```javascript
const { qrcode } = require('./utils/qrcode.js')

// 生成所有打卡点二维码
const allQRs = qrcode.generateAllCheckpointQRs()
console.log(allQRs)
```

#### 二维码内容格式
支持的二维码格式：
1. **简单ID格式**: `signin`, `esports`, `coffee` 等
2. **JSON格式**:
   ```json
   {
     "checkpointId": "signin",
     "timestamp": 1640995200000,
     "version": "1.0",
     "app": "廉洁探索之旅"
   }
   ```

### 6. 本地测试

#### 开发者工具测试
1. 打开微信开发者工具
2. 导入项目目录
3. 点击"预览"生成测试二维码
4. 使用微信扫描二维码测试

#### 真机调试
1. 在开发者工具中点击"真机调试"
2. 用微信扫描二维码
3. 在真机上测试所有功能

### 7. 功能测试清单

#### ✅ 基础功能测试
- [ ] 页面正常加载
- [ ] 地图正确显示
- [ ] 扫码功能正常
- [ ] 印章收集正常
- [ ] 进度跟踪正确

#### ✅ 业务逻辑测试
- [ ] 签到验证（必须先签到）
- [ ] 重复扫码处理
- [ ] 完成状态检测
- [ ] 数据持久化

#### ✅ 用户体验测试
- [ ] 界面响应流畅
- [ ] 动画效果正常
- [ ] 错误提示友好
- [ ] 不同设备适配

### 8. 发布上线

#### 上传代码
1. 在开发者工具中点击"上传"
2. 填写版本号（如：1.0.0）
3. 填写项目备注
4. 点击"上传"

#### 提交审核
1. 登录微信公众平台
2. 进入"开发管理" > "版本管理"
3. 点击"提交审核"
4. 填写审核信息
5. 等待审核结果

#### 发布上线
1. 审核通过后，点击"发布"
2. 确认发布信息
3. 完成上线

### 9. 常见问题解决

#### 扫码无反应
**原因**: 相机权限未授权
**解决**: 检查权限配置，引导用户手动授权

#### 地图显示异常
**原因**: 网络问题或坐标错误
**解决**: 检查网络连接，验证坐标数据

#### 数据丢失
**原因**: 存储异常或用户清除数据
**解决**: 实现数据备份和恢复机制

#### 性能问题
**原因**: 图片过大或代码冗余
**解决**: 优化图片大小，精简代码

### 10. 维护更新

#### 数据备份
定期备份用户数据和配置信息：
```javascript
// 导出用户数据
const userData = storage.exportUserData()
console.log('用户数据备份:', userData)
```

#### 版本更新
1. 修改版本号
2. 测试新功能
3. 上传新版本
4. 提交审核

#### 监控分析
- 使用微信小程序数据分析
- 监控用户行为和错误日志
- 根据数据优化用户体验

## 📞 技术支持

如有问题，请通过以下方式联系：
- 邮箱: support@example.com
- 微信: support-wechat
- 技术文档: https://developers.weixin.qq.com/miniprogram/dev/

---

**祝您部署顺利！** 🎉
