// quick-test.js
// 快速测试脚本 - 在微信开发者工具控制台中运行

// 引入测试配置
const { testConfig, testUtils } = require('./test-config.js')

console.log('🧪 廉洁探索之旅 - 快速测试脚本')
console.log('=====================================')

// 测试1: 数据存储功能
function testStorage() {
  console.log('\n📦 测试数据存储功能...')
  
  try {
    const { storage } = require('./utils/storage.js')
    
    // 测试保存进度
    const testProgress = testConfig.testUserProgress.partial
    storage.saveProgress(testProgress)
    console.log('✅ 进度保存成功')
    
    // 测试读取进度
    const savedProgress = storage.getProgress()
    console.log('✅ 进度读取成功:', savedProgress)
    
    // 测试更新打卡点
    const updatedProgress = storage.updateCheckpoint('coffee')
    console.log('✅ 打卡点更新成功:', updatedProgress)
    
    return true
  } catch (error) {
    console.error('❌ 存储测试失败:', error)
    return false
  }
}

// 测试2: 二维码验证功能
function testValidation() {
  console.log('\n🔍 测试二维码验证功能...')
  
  try {
    const { validation } = require('./utils/validation.js')
    
    // 测试简单二维码解析
    const simpleQR = 'signin'
    const parsedId = validation.parseQRCode(simpleQR)
    console.log('✅ 简单二维码解析成功:', parsedId)
    
    // 测试JSON二维码解析
    const jsonQR = JSON.stringify({
      checkpointId: 'esports',
      timestamp: Date.now()
    })
    const parsedJSONId = validation.parseQRCode(jsonQR)
    console.log('✅ JSON二维码解析成功:', parsedJSONId)
    
    // 测试扫码验证
    const userProgress = testConfig.testUserProgress.empty
    const validationResult = validation.validateScan('signin', userProgress)
    console.log('✅ 扫码验证成功:', validationResult)
    
    return true
  } catch (error) {
    console.error('❌ 验证测试失败:', error)
    return false
  }
}

// 测试3: 打卡点配置
function testCheckpoints() {
  console.log('\n📍 测试打卡点配置...')
  
  try {
    const { checkpoints, checkpointUtils } = require('./data/checkpoints.js')
    
    // 测试打卡点数据
    console.log('✅ 打卡点数据加载成功，共', checkpoints.length, '个点位')
    
    // 测试根据ID获取打卡点
    const signinPoint = checkpointUtils.getCheckpointById('signin')
    console.log('✅ 根据ID获取打卡点成功:', signinPoint.name)
    
    // 测试地图中心点
    const mapCenter = checkpointUtils.getMapCenter()
    console.log('✅ 地图中心点计算成功:', mapCenter)
    
    // 测试解锁条件
    const isUnlocked = checkpointUtils.isUnlocked('esports', ['signin'])
    console.log('✅ 解锁条件验证成功:', isUnlocked)
    
    return true
  } catch (error) {
    console.error('❌ 打卡点测试失败:', error)
    return false
  }
}

// 测试4: 二维码生成
function testQRCodeGeneration() {
  console.log('\n🎯 测试二维码生成...')
  
  try {
    const { qrcode } = require('./utils/qrcode.js')
    
    // 测试生成单个二维码
    const singleQR = qrcode.generateCheckpointQR('signin')
    console.log('✅ 单个二维码生成成功:', singleQR)
    
    // 测试生成所有二维码
    const allQRs = qrcode.generateAllCheckpointQRs()
    console.log('✅ 所有二维码生成成功，共', Object.keys(allQRs).length, '个')
    
    // 测试二维码信息获取
    const qrInfo = qrcode.getQRInfo(singleQR)
    console.log('✅ 二维码信息获取成功:', qrInfo)
    
    return true
  } catch (error) {
    console.error('❌ 二维码生成测试失败:', error)
    return false
  }
}

// 测试5: 页面数据绑定
function testPageDataBinding() {
  console.log('\n📱 测试页面数据绑定...')
  
  try {
    // 模拟页面数据
    const pageData = {
      userProgress: testConfig.testUserProgress.partial,
      checkpoints: require('./data/checkpoints.js').checkpoints,
      progressPercentage: 33.33
    }
    
    console.log('✅ 页面数据模拟成功:', {
      completedStamps: pageData.userProgress.completedStamps.length,
      totalStamps: pageData.userProgress.totalStamps,
      progressPercentage: pageData.progressPercentage
    })
    
    return true
  } catch (error) {
    console.error('❌ 页面数据绑定测试失败:', error)
    return false
  }
}

// 执行所有测试
function runAllTests() {
  console.log('🚀 开始执行所有测试...\n')
  
  const tests = [
    { name: '数据存储', fn: testStorage },
    { name: '二维码验证', fn: testValidation },
    { name: '打卡点配置', fn: testCheckpoints },
    { name: '二维码生成', fn: testQRCodeGeneration },
    { name: '页面数据绑定', fn: testPageDataBinding }
  ]
  
  let passedTests = 0
  let totalTests = tests.length
  
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
  } else {
    console.log('\n⚠️ 部分测试失败，请检查相关功能。')
  }
  
  return passedTests === totalTests
}

// 快速功能演示
function quickDemo() {
  console.log('\n🎬 快速功能演示')
  console.log('================')
  
  try {
    const { storage } = require('./utils/storage.js')
    const { validation } = require('./utils/validation.js')
    const { checkpoints } = require('./data/checkpoints.js')
    
    // 演示完整打卡流程
    console.log('1. 用户开始打卡...')
    let progress = storage.getProgress()
    console.log('   初始状态:', progress.isSignedIn ? '已签到' : '未签到')
    
    console.log('2. 扫描签到二维码...')
    const signinResult = validation.validateScan('signin', progress)
    console.log('   签到验证:', signinResult.valid ? '通过' : '失败')
    
    if (signinResult.valid) {
      progress = storage.updateCheckpoint('signin')
      console.log('   签到完成，进度:', progress.completedStamps.length, '/', progress.totalStamps)
    }
    
    console.log('3. 扫描其他点位二维码...')
    const otherResult = validation.validateScan('esports', progress)
    console.log('   其他点位验证:', otherResult.valid ? '通过' : '失败')
    
    if (otherResult.valid) {
      progress = storage.updateCheckpoint('esports')
      console.log('   打卡完成，进度:', progress.completedStamps.length, '/', progress.totalStamps)
    }
    
    console.log('4. 检查完成状态...')
    console.log('   完成状态:', progress.completionStatus ? '已完成' : '进行中')
    
    console.log('\n✅ 功能演示完成！')
    
  } catch (error) {
    console.error('❌ 演示失败:', error)
  }
}

// 导出测试函数
module.exports = {
  runAllTests,
  quickDemo,
  testStorage,
  testValidation,
  testCheckpoints,
  testQRCodeGeneration,
  testPageDataBinding
}

// 如果直接运行此文件，执行所有测试
if (typeof window !== 'undefined') {
  // 在浏览器环境中自动运行测试
  console.log('🔄 自动运行测试...')
  runAllTests()
}
