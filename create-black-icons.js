// create-black-icons.js - 生成黑色未选中TabBar图标
// 写入有效的黑色PNG到 map.png / scan.png / stamp.png

const fs = require('fs');
const path = require('path');

// 1x1 纯黑 PNG 的 base64（有效PNG）
const blackPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAoMBAQWBtMsAAAAASUVORK5CYII=';
const buffer = Buffer.from(blackPngBase64, 'base64');

const targets = ['map.png', 'scan.png', 'stamp.png'];
const iconsDir = path.join(__dirname, 'images', 'icons');

targets.forEach((name) => {
  const outPath = path.join(iconsDir, name);
  try {
    fs.writeFileSync(outPath, buffer);
    console.log(`✅ 写入黑色图标: ${outPath}`);
  } catch (err) {
    console.error(`❌ 写入失败: ${outPath}`, err.message);
  }
});

console.log('🎯 已完成黑色未选中图标写入');