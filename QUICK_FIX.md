# 快速修复指南

## 🚨 图标文件缺失问题

### 问题描述
微信开发者工具报错：`app.json` 中配置的图标文件未找到

### 已修复的文件
✅ `images/icons/map-selected.png` - 地图页面选中图标  
✅ `images/icons/scan-selected.png` - 扫码页面选中图标  
✅ `images/icons/stamp.png` - 印章页面图标  
✅ `images/icons/stamp-selected.png` - 印章页面选中图标  

### 修复方法
已通过复制现有图标文件创建了缺失的文件：
```bash
cp images/icons/map.png images/icons/map-selected.png
cp images/icons/scan.png images/icons/scan-selected.png
cp images/icons/completed.png images/icons/stamp.png
cp images/icons/completed.png images/icons/stamp-selected.png
```

## 🔧 如果再次遇到类似问题

### 方法1: 使用修复脚本
```bash
node fix-icons.js
```

### 方法2: 手动创建缺失文件
1. 检查错误信息中的具体文件路径
2. 复制相似的图标文件到指定位置
3. 重新编译项目

### 方法3: 更新 app.json 配置
如果不想创建新文件，可以修改 `app.json` 中的 `tabBar` 配置：
```json
{
  "tabBar": {
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "地图",
        "iconPath": "images/icons/map.png",
        "selectedIconPath": "images/icons/map.png"
      }
    ]
  }
}
```

## ✅ 验证修复结果

现在应该可以正常启动小程序了：

1. **重新编译项目** - 在微信开发者工具中点击"编译"
2. **检查控制台** - 确认没有图标文件错误
3. **查看TabBar** - 确认底部导航栏图标正常显示

## 🎯 下一步

图标问题已修复，现在可以：
1. 开始测试渐进式地图显示功能
2. 使用 `quick-test.js` 脚本快速测试不同状态
3. 验证所有功能是否正常工作

## 📝 注意事项

- 当前使用的是临时图标文件
- 建议后续添加更精美的图标设计
- 图标尺寸建议：64x64px 或 128x128px
- 格式：PNG（支持透明背景）

---

**状态**: ✅ 已修复，可以正常启动小程序