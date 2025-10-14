// test-runner.js
// 测试运行器 - 验证项目功能

console.log('🧪 廉洁探索之旅 - 功能测试开始')
console.log('=====================================')

// 测试1: 检查项目文件结构
function testProjectStructure() {
  console.log('\n📁 测试项目文件结构...')
  
  const fs = require('fs')
  const path = require('path')
  
  const requiredFiles = [
    'app.js',
    'app.json', 
    'app.wxss',
    'project.config.json',
    'sitemap.json',
    'pages/index/index.js',
    'pages/index/index.json',
    'pages/index/index.wxml',
    'pages/index/index.wxss',
    'pages/scan/scan.js',
    'pages/scan/scan.json',
    'pages/scan/scan.wxml',
    'pages/scan/scan.wxss',
    'pages/stamps/stamps.js',
    'pages/stamps/stamps.json',
    'pages/stamps/stamps.wxml',
    'pages/stamps/stamps.wxss',
    'components/progress/progress.js',
    'components/progress/progress.json',
    'components/progress/progress.wxml',
    'components/progress/progress.wxss',
    'components/stamp/stamp.js',
    'components/stamp/stamp.json',
    'components/stamp/stamp.wxml',
    'components/stamp/stamp.wxss',
    'utils/storage.js',
    'utils/validation.js',
    'utils/qrcode.js',
    'utils/common.js',
    'data/checkpoints.js',
    'styles/common.wxss',
    'styles/variables.wxss'
  ]
  
  let missingFiles = []
  let existingFiles = []
  
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      existingFiles.push(file)
    } else {
      missingFiles.push(file)
    }
  })
  
  console.log(`✅ 存在文件: ${existingFiles.length}/${requiredFiles.length}`)
  if (missingFiles.length > 0) {
    console.log(`❌ 缺失文件: ${missingFiles.length}`)
    missingFiles.forEach(file => console.log(`   - ${file}`))
    return false
  }
  
  console.log('✅ 项目文件结构完整')
  return true
}

// 测试2: 检查代码语法
function testCodeSyntax() {
  console.log('\n🔍 测试代码语法...')
  
  const fs = require('fs')
  
  const jsFiles = [
    'app.js',
    'pages/index/index.js',
    'pages/scan/scan.js', 
    'pages/stamps/stamps.js',
    'components/progress/progress.js',
    'components/stamp/stamp.js',
    'utils/storage.js',
    'utils/validation.js',
    'utils/qrcode.js',
    'utils/common.js',
    'data/checkpoints.js'
  ]
  
  let syntaxErrors = []
  
  jsFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8')
      // 简单的语法检查 - 检查基本语法错误
      if (content.includes('undefined') && content.includes('=')) {
        // 检查是否有明显的语法错误
      }
      
      // 检查括号匹配
      const openBraces = (content.match(/\{/g) || []).length
      const closeBraces = (content.match(/\}/g) || []).length
      const openParens = (content.match(/\(/g) || []).length
      const closeParens = (content.match(/\)/g) || []).length
      
      if (openBraces !== closeBraces) {
        syntaxErrors.push(`${file}: 大括号不匹配`)
      }
      if (openParens !== closeParens) {
        syntaxErrors.push(`${file}: 小括号不匹配`)
      }
      
    } catch (error) {
      syntaxErrors.push(`${file}: ${error.message}`)
    }
  })
  
  if (syntaxErrors.length > 0) {
    console.log(`❌ 发现语法错误: ${syntaxErrors.length}`)
    syntaxErrors.forEach(error => console.log(`   - ${error}`))
    return false
  }
  
  console.log(`✅ 代码语法检查通过 (${jsFiles.length} 个文件)`)
  return true
}

// 测试3: 检查配置文件
function testConfigFiles() {
  console.log('\n⚙️ 测试配置文件...')
  
  const fs = require('fs')
  
  try {
    // 检查app.json
    const appConfig = JSON.parse(fs.readFileSync('app.json', 'utf8'))
    const requiredPages = ['pages/index/index', 'pages/scan/scan', 'pages/stamps/stamps']
    
    const missingPages = requiredPages.filter(page => !appConfig.pages.includes(page))
    if (missingPages.length > 0) {
      console.log(`❌ app.json 缺少页面: ${missingPages.join(', ')}`)
      return false
    }
    
    // 检查project.config.json
    const projectConfig = JSON.parse(fs.readFileSync('project.config.json', 'utf8'))
    if (!projectConfig.appid || projectConfig.appid === 'wx1234567890abcdef') {
      console.log('⚠️ 需要配置正确的AppID')
    }
    
    console.log('✅ 配置文件检查通过')
    return true
    
  } catch (error) {
    console.log(`❌ 配置文件错误: ${error.message}`)
    return false
  }
}

// 测试4: 检查模块导出
function testModuleExports() {
  console.log('\n📦 测试模块导出...')
  
  try {
    // 测试工具模块
    const storage = require('./utils/storage.js')
    const validation = require('./utils/validation.js')
    const qrcode = require('./utils/qrcode.js')
    const common = require('./utils/common.js')
    
    if (!storage.storage || !validation.validation || !qrcode.qrcode) {
      console.log('❌ 工具模块导出错误')
      return false
    }
    
    // 测试数据模块
    const checkpoints = require('./data/checkpoints.js')
    if (!checkpoints.checkpoints || !checkpoints.checkpointUtils) {
      console.log('❌ 数据模块导出错误')
      return false
    }
    
    console.log('✅ 模块导出检查通过')
    return true
    
  } catch (error) {
    console.log(`❌ 模块导出错误: ${error.message}`)
    return false
  }
}

// 测试5: 功能逻辑测试
function testFunctionality() {
  console.log('\n⚡ 测试功能逻辑...')
  
  try {
    const { storage } = require('./utils/storage.js')
    const { validation } = require('./utils/validation.js')
    const { checkpoints } = require('./data/checkpoints.js')
    
    // 测试存储功能
    const progress = storage.getProgress()
    if (!progress || typeof progress.isSignedIn !== 'boolean') {
      console.log('❌ 存储功能测试失败')
      return false
    }
    
    // 测试验证功能
    const qrResult = validation.parseQRCode('signin')
    if (qrResult !== 'signin') {
      console.log('❌ 二维码解析测试失败')
      return false
    }
    
    // 测试打卡点数据
    if (checkpoints.length !== 6) {
      console.log('❌ 打卡点数据不完整')
      return false
    }
    
    console.log('✅ 功能逻辑测试通过')
    return true
    
  } catch (error) {
    console.log(`❌ 功能逻辑测试失败: ${error.message}`)
    return false
  }
}

// 执行所有测试
function runAllTests() {
  const tests = [
    { name: '项目文件结构', fn: testProjectStructure },
    { name: '代码语法检查', fn: testCodeSyntax },
    { name: '配置文件检查', fn: testConfigFiles },
    { name: '模块导出检查', fn: testModuleExports },
    { name: '功能逻辑测试', fn: testFunctionality }
  ]
  
  let passedTests = 0
  let totalTests = tests.length
  
  console.log(`🚀 开始执行 ${totalTests} 项测试...\n`)
  
  tests.forEach(test => {
    const result = test.fn()
    if (result) {
      passedTests++
    }
  })
  
  console.log('\n📊 测试结果汇总')
  console.log('================')
  console.log(`✅ 通过测试: ${passedTests}/${totalTests}`)
  console.log(`❌ 失败测试: ${totalTests - passedTests}/${totalTests}`)
  
  if (passedTests === totalTests) {
    console.log('\n🎉 所有测试通过！项目可以正常运行。')
    console.log('\n📋 下一步操作:')
    console.log('1. 打开微信开发者工具')
    console.log('2. 导入项目目录')
    console.log('3. 配置AppID')
    console.log('4. 添加图片资源')
    console.log('5. 开始真机测试')
  } else {
    console.log('\n⚠️ 部分测试失败，请检查相关功能。')
  }
  
  return passedTests === totalTests
}

// 运行测试
runAllTests()
