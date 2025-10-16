// quick-test.js - 快速测试脚本
// 在微信开发者工具的调试器中运行此脚本来快速测试不同状态

console.log('🎯 微信小程序打卡集章 - 快速测试脚本')
console.log('=' .repeat(50))

// 打卡点配置
const CHECKPOINTS = [
  'signin',    // 寻根·霜降廉养
  'esports',   // 笃行·电竞廉规
  'coffee',    // 省身·啡香廉思
  'makeup',    // 正容·美妆廉仪
  'sleep',     // 静悟·清风入梦
  'breeze'     // 沁心·清风廉饮
]

// 测试状态配置
const TEST_STATES = {
  reset: {
    name: '重置状态',
    description: '清空所有打卡记录',
    progress: {
      isSignedIn: false,
      completedStamps: [],
      totalStamps: 6,
      completionStatus: false
    }
  },
  signin: {
    name: '仅签到',
    description: '只完成签到，其他点位未完成',
    progress: {
      isSignedIn: true,
      completedStamps: ['signin'],
      totalStamps: 6,
      completionStatus: false
    }
  },
  partial: {
    name: '部分完成',
    description: '完成签到+3个其他点位',
    progress: {
      isSignedIn: true,
      completedStamps: ['signin', 'esports', 'coffee', 'makeup'],
      totalStamps: 6,
      completionStatus: false
    }
  },
  almost: {
    name: '即将完成',
    description: '完成5个点位，还差1个',
    progress: {
      isSignedIn: true,
      completedStamps: ['signin', 'esports', 'coffee', 'makeup', 'sleep'],
      totalStamps: 6,
      completionStatus: false
    }
  },
  completed: {
    name: '全部完成',
    description: '完成所有6个打卡点位',
    progress: {
      isSignedIn: true,
      completedStamps: CHECKPOINTS,
      totalStamps: 6,
      completionStatus: true
    }
  }
}

// 应用测试状态
function applyTestState(stateKey) {
  const state = TEST_STATES[stateKey]
  if (!state) {
    console.error('❌ 无效的测试状态:', stateKey)
    return false
  }

  try {
    // 保存到本地存储
    wx.setStorageSync('userProgress', {
      ...state.progress,
      completionTimes: generateCompletionTimes(state.progress.completedStamps),
      createTime: Date.now() - 24 * 60 * 60 * 1000, // 1天前创建
      lastUpdateTime: Date.now()
    })

    console.log(`✅ 已应用测试状态: ${state.name}`)
    console.log(`📝 描述: ${state.description}`)
    console.log(`📊 完成进度: ${state.progress.completedStamps.length}/${state.progress.totalStamps}`)
    console.log(`🏆 完成状态: ${state.progress.completionStatus ? '已完成' : '进行中'}`)
    
    // 显示提示
    wx.showToast({
      title: `已切换到: ${state.name}`,
      icon: 'success',
      duration: 2000
    })

    return true
  } catch (error) {
    console.error('❌ 应用测试状态失败:', error)
    wx.showToast({
      title: '测试状态应用失败',
      icon: 'error'
    })
    return false
  }
}

// 生成完成时间（模拟数据）
function generateCompletionTimes(completedStamps) {
  const times = {}
  const now = Date.now()
  
  completedStamps.forEach((stamp, index) => {
    // 每个打卡点间隔30分钟
    times[stamp] = new Date(now - (completedStamps.length - index - 1) * 30 * 60 * 1000).toLocaleString()
  })
  
  return times
}

// 显示当前状态
function showCurrentState() {
  try {
    const progress = wx.getStorageSync('userProgress')
    if (!progress) {
      console.log('📊 当前状态: 未初始化')
      return
    }

    console.log('📊 当前状态:')
    console.log(`  - 签到状态: ${progress.isSignedIn ? '✅ 已签到' : '❌ 未签到'}`)
    console.log(`  - 完成进度: ${progress.completedStamps.length}/${progress.totalStamps}`)
    console.log(`  - 完成状态: ${progress.completionStatus ? '🎉 已完成' : '⏳ 进行中'}`)
    console.log(`  - 已完成点位: ${progress.completedStamps.join(', ') || '无'}`)
  } catch (error) {
    console.error('❌ 获取当前状态失败:', error)
  }
}

// 测试所有状态
function testAllStates() {
  console.log('🧪 开始测试所有状态...')
  
  const stateKeys = Object.keys(TEST_STATES)
  let currentIndex = 0
  
  function nextState() {
    if (currentIndex >= stateKeys.length) {
      console.log('🎉 所有状态测试完成！')
      return
    }
    
    const stateKey = stateKeys[currentIndex]
    const state = TEST_STATES[stateKey]
    
    console.log(`\n🔄 测试状态 ${currentIndex + 1}/${stateKeys.length}: ${state.name}`)
    applyTestState(stateKey)
    
    currentIndex++
    setTimeout(nextState, 3000) // 3秒间隔
  }
  
  nextState()
}

// 导出测试函数到全局
if (typeof window !== 'undefined') {
  window.testStates = TEST_STATES
  window.applyTestState = applyTestState
  window.showCurrentState = showCurrentState
  window.testAllStates = testAllStates
}

console.log('\n🚀 可用的测试命令:')
console.log('1. applyTestState("reset")     - 重置状态')
console.log('2. applyTestState("signin")    - 仅签到')
console.log('3. applyTestState("partial")   - 部分完成')
console.log('4. applyTestState("almost")    - 即将完成')
console.log('5. applyTestState("completed") - 全部完成')
console.log('6. showCurrentState()          - 显示当前状态')
console.log('7. testAllStates()             - 测试所有状态')
console.log('\n💡 示例: applyTestState("partial")')

// 自动显示当前状态
showCurrentState()