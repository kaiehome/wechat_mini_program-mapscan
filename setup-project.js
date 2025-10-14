// setup-project.js
// 项目快速配置脚本

const fs = require('fs')
const path = require('path')

console.log('🚀 廉洁探索之旅 - 项目快速配置')
console.log('=====================================')

// 配置信息
const config = {
  appId: 'wx1234567890abcdef', // 默认测试AppID
  projectName: '廉洁探索之旅',
  mapCenter: {
    latitude: 39.908823,
    longitude: 116.397470
  }
}

// 1. 配置AppID
function setupAppId() {
  console.log('\n📱 配置微信小程序AppID...')
  
  const projectConfigPath = 'project.config.json'
  
  try {
    const projectConfig = JSON.parse(fs.readFileSync(projectConfigPath, 'utf8'))
    
    if (projectConfig.appid === 'wx1234567890abcdef') {
      console.log('⚠️ 当前使用的是默认测试AppID')
      console.log('   请在微信公众平台获取真实AppID后手动修改 project.config.json')
      console.log('   或者运行: node setup-project.js --appid=your-real-appid')
    } else {
      console.log(`✅ AppID已配置: ${projectConfig.appid}`)
    }
    
    return true
  } catch (error) {
    console.log(`❌ 配置文件读取失败: ${error.message}`)
    return false
  }
}

// 2. 检查图片资源
function checkImageResources() {
  console.log('\n🖼️ 检查图片资源...')
  
  const imageDirs = [
    'images/stamps',
    'images/icons', 
    'images/backgrounds'
  ]
  
  const requiredImages = {
    'images/stamps': [
      'signin.png',
      'esports.png',
      'coffee.png',
      'makeup.png',
      'sleep.png',
      'breeze.png',
      'locked.png'
    ],
    'images/icons': [
      'map.png',
      'map-active.png',
      'scan.png',
      'scan-active.png',
      'progress.png',
      'progress-active.png',
      'check.png',
      'circle.png'
    ]
  }
  
  let missingImages = []
  
  Object.keys(requiredImages).forEach(dir => {
    if (!fs.existsSync(dir)) {
      missingImages.push(`${dir}/ 目录不存在`)
    } else {
      requiredImages[dir].forEach(image => {
        if (!fs.existsSync(path.join(dir, image))) {
          missingImages.push(`${dir}/${image}`)
        }
      })
    }
  })
  
  if (missingImages.length > 0) {
    console.log(`⚠️ 缺少图片资源 (${missingImages.length}个):`)
    missingImages.forEach(image => console.log(`   - ${image}`))
    console.log('\n📋 请添加以下图片资源:')
    console.log('   1. 印章图片 - 200x200像素，PNG格式')
    console.log('   2. 图标资源 - 64x64像素，PNG格式')
    console.log('   3. 背景图片 - 750x1334像素，PNG/JPG格式')
  } else {
    console.log('✅ 所有图片资源已准备')
  }
  
  return missingImages.length === 0
}

// 3. 检查打卡点配置
function checkCheckpointsConfig() {
  console.log('\n📍 检查打卡点配置...')
  
  try {
    const { checkpoints } = require('./data/checkpoints.js')
    
    if (checkpoints.length !== 6) {
      console.log(`❌ 打卡点数量不正确: ${checkpoints.length}/6`)
      return false
    }
    
    console.log('✅ 打卡点配置正确:')
    checkpoints.forEach((point, index) => {
      console.log(`   ${index + 1}. ${point.name} (${point.id})`)
    })
    
    console.log('\n⚠️ 请确认打卡点坐标是否正确:')
    checkpoints.forEach(point => {
      console.log(`   ${point.name}: lat=${point.position.lat}, lng=${point.position.lng}`)
    })
    
    return true
  } catch (error) {
    console.log(`❌ 打卡点配置检查失败: ${error.message}`)
    return false
  }
}

// 4. 生成测试二维码
function generateTestQRCodes() {
  console.log('\n🎯 生成测试二维码...')
  
  try {
    const { qrcode } = require('./utils/qrcode.js')
    
    const testQRCodes = qrcode.generateAllCheckpointQRs()
    
    console.log('✅ 测试二维码数据已生成:')
    Object.keys(testQRCodes).forEach(checkpointId => {
      const qrData = testQRCodes[checkpointId].qrData
      console.log(`   ${checkpointId}: ${qrData}`)
    })
    
    console.log('\n📱 使用说明:')
    console.log('   1. 使用二维码生成器生成二维码')
    console.log('   2. 二维码内容使用上面的JSON数据')
    console.log('   3. 或者使用简单的ID作为二维码内容')
    
    return true
  } catch (error) {
    console.log(`❌ 二维码生成失败: ${error.message}`)
    return false
  }
}

// 5. 验证项目完整性
function validateProjectIntegrity() {
  console.log('\n🔍 验证项目完整性...')
  
  const requiredFiles = [
    'app.js',
    'app.json',
    'app.wxss',
    'project.config.json',
    'pages/index/index.js',
    'pages/scan/scan.js',
    'pages/stamps/stamps.js',
    'utils/storage.js',
    'utils/validation.js',
    'data/checkpoints.js'
  ]
  
  let missingFiles = []
  
  requiredFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      missingFiles.push(file)
    }
  })
  
  if (missingFiles.length > 0) {
    console.log(`❌ 缺少必要文件: ${missingFiles.length}个`)
    missingFiles.forEach(file => console.log(`   - ${file}`))
    return false
  }
  
  console.log('✅ 项目文件完整')
  return true
}

// 6. 生成部署检查清单
function generateDeploymentChecklist() {
  console.log('\n📋 部署检查清单:')
  console.log('================')
  console.log('□ 1. 配置正确的AppID')
  console.log('□ 2. 添加所有图片资源')
  console.log('□ 3. 调整打卡点坐标')
  console.log('□ 4. 生成测试二维码')
  console.log('□ 5. 在微信开发者工具中测试')
  console.log('□ 6. 真机测试所有功能')
  console.log('□ 7. 性能优化和调试')
  console.log('□ 8. 提交审核发布')
}

// 主函数
function main() {
  const checks = [
    { name: 'AppID配置', fn: setupAppId },
    { name: '图片资源', fn: checkImageResources },
    { name: '打卡点配置', fn: checkCheckpointsConfig },
    { name: '测试二维码', fn: generateTestQRCodes },
    { name: '项目完整性', fn: validateProjectIntegrity }
  ]
  
  let passedChecks = 0
  let totalChecks = checks.length
  
  checks.forEach(check => {
    const result = check.fn()
    if (result) {
      passedChecks++
    }
  })
  
  console.log('\n📊 配置检查结果')
  console.log('================')
  console.log(`✅ 通过检查: ${passedChecks}/${totalChecks}`)
  console.log(`❌ 需要修复: ${totalChecks - passedChecks}/${totalChecks}`)
  
  if (passedChecks === totalChecks) {
    console.log('\n🎉 项目配置完成！可以开始测试了。')
  } else {
    console.log('\n⚠️ 请完成上述配置后再开始测试。')
  }
  
  generateDeploymentChecklist()
  
  console.log('\n🚀 下一步:')
  console.log('1. 打开微信开发者工具')
  console.log('2. 导入项目目录')
  console.log('3. 开始测试功能')
  console.log('4. 参考 WEIXIN_TEST_GUIDE.md 进行详细测试')
}

// 处理命令行参数
if (process.argv.length > 2) {
  const args = process.argv.slice(2)
  args.forEach(arg => {
    if (arg.startsWith('--appid=')) {
      const appId = arg.split('=')[1]
      config.appId = appId
      console.log(`🔧 设置AppID: ${appId}`)
    }
  })
}

// 运行主函数
main()
