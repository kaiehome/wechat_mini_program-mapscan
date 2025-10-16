// fix-icons.js - 图标文件修复脚本
// 用于创建缺失的图标文件，避免 app.json 配置错误

const fs = require('fs');
const path = require('path');

console.log('🔧 开始修复图标文件...');

const iconsDir = path.join(__dirname, 'images', 'icons');

// 需要创建的图标文件映射
const iconMappings = [
  // TabBar 图标
  { from: 'map.png', to: 'map-selected.png' },
  { from: 'scan.png', to: 'scan-selected.png' },
  { from: 'completed.png', to: 'stamp.png' },
  { from: 'completed.png', to: 'stamp-selected.png' },
  
  // 其他可能需要的图标
  { from: 'map.png', to: 'map-active.png' },
  { from: 'scan.png', to: 'scan-active.png' },
  { from: 'completed.png', to: 'progress.png' },
  { from: 'completed.png', to: 'progress-active.png' },
  
  // 功能图标
  { from: 'completed.png', to: 'check.png' },
  { from: 'pending.png', to: 'circle.png' },
  
  // 印章图标（复制到stamps目录）
  { from: 'completed.png', to: '../stamps/signin.png' },
  { from: 'completed.png', to: '../stamps/esports.png' },
  { from: 'completed.png', to: '../stamps/coffee.png' },
  { from: 'completed.png', to: '../stamps/makeup.png' },
  { from: 'completed.png', to: '../stamps/sleep.png' },
  { from: 'completed.png', to: '../stamps/breeze.png' },
  { from: 'pending.png', to: '../stamps/placeholder.png' },
  { from: 'pending.png', to: '../stamps/locked.png' }
];

// 检查并创建图标文件
function createIconFile(fromFile, toFile) {
  const fromPath = path.join(iconsDir, fromFile);
  const toPath = path.join(iconsDir, toFile);
  
  if (fs.existsSync(fromPath)) {
    if (!fs.existsSync(toPath)) {
      try {
        fs.copyFileSync(fromPath, toPath);
        console.log(`✅ 创建: ${toFile} (基于 ${fromFile})`);
        return true;
      } catch (error) {
        console.error(`❌ 创建失败: ${toFile}`, error.message);
        return false;
      }
    } else {
      console.log(`⚠️  已存在: ${toFile}`);
      return true;
    }
  } else {
    console.error(`❌ 源文件不存在: ${fromFile}`);
    return false;
  }
}

// 创建占位符图标（如果源文件不存在）
function createPlaceholderIcon(fileName) {
  const filePath = path.join(iconsDir, fileName);
  
  if (!fs.existsSync(filePath)) {
    // 创建一个简单的占位符文本文件
    const placeholderContent = `# 图标占位符
# 请替换为实际的图标文件
# 建议尺寸: 64x64px 或 128x128px
# 格式: PNG (支持透明背景)
`;
    
    try {
      fs.writeFileSync(filePath.replace('.png', '.txt'), placeholderContent);
      console.log(`📝 创建占位符: ${fileName.replace('.png', '.txt')}`);
    } catch (error) {
      console.error(`❌ 创建占位符失败: ${fileName}`, error.message);
    }
  }
}

// 执行修复
let successCount = 0;
let totalCount = iconMappings.length;

console.log(`📋 需要处理的图标文件: ${totalCount} 个\n`);

iconMappings.forEach(({ from, to }) => {
  if (createIconFile(from, to)) {
    successCount++;
  }
});

// 创建缺失的占位符
const requiredIcons = [
  'map.png', 'scan.png', 'stamp.png', 'completed.png', 'pending.png'
];

console.log('\n📋 检查必需的图标文件...');
requiredIcons.forEach(createPlaceholderIcon);

// 输出结果
console.log(`\n🎉 图标修复完成!`);
console.log(`✅ 成功: ${successCount}/${totalCount}`);
console.log(`❌ 失败: ${totalCount - successCount}/${totalCount}`);

if (successCount === totalCount) {
  console.log('\n🚀 所有图标文件已准备就绪，可以启动小程序了！');
} else {
  console.log('\n⚠️  部分图标文件创建失败，请检查源文件是否存在。');
}

// 列出当前所有图标文件
console.log('\n📁 当前图标文件列表:');
try {
  const files = fs.readdirSync(iconsDir);
  const iconFiles = files.filter(file => file.endsWith('.png'));
  iconFiles.forEach(file => {
    console.log(`  - ${file}`);
  });
} catch (error) {
  console.error('❌ 无法读取图标目录:', error.message);
}