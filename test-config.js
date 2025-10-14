// test-config.js
// 测试配置文件

const testConfig = {
  // 测试用的二维码数据
  testQRCodes: {
    signin: 'signin',
    esports: 'esports', 
    coffee: 'coffee',
    makeup: 'makeup',
    sleep: 'sleep',
    breeze: 'breeze'
  },

  // 测试用的JSON格式二维码
  testJSONQRCodes: {
    signin: JSON.stringify({
      checkpointId: 'signin',
      timestamp: Date.now(),
      version: '1.0',
      app: '廉洁探索之旅'
    }),
    esports: JSON.stringify({
      checkpointId: 'esports',
      timestamp: Date.now(),
      version: '1.0',
      app: '廉洁探索之旅'
    })
  },

  // 测试坐标
  testCoordinates: {
    center: {
      latitude: 39.908823,
      longitude: 116.397470
    },
    checkpoints: [
      { id: 'signin', lat: 39.908823, lng: 116.397470 },
      { id: 'esports', lat: 39.908923, lng: 116.397570 },
      { id: 'coffee', lat: 39.909023, lng: 116.397670 },
      { id: 'makeup', lat: 39.909123, lng: 116.397770 },
      { id: 'sleep', lat: 39.909223, lng: 116.397870 },
      { id: 'breeze', lat: 39.909323, lng: 116.397970 }
    ]
  },

  // 测试用户进度
  testUserProgress: {
    empty: {
      isSignedIn: false,
      completedStamps: [],
      totalStamps: 6,
      completionStatus: false
    },
    partial: {
      isSignedIn: true,
      completedStamps: ['signin', 'esports'],
      totalStamps: 6,
      completionStatus: false
    },
    completed: {
      isSignedIn: true,
      completedStamps: ['signin', 'esports', 'coffee', 'makeup', 'sleep', 'breeze'],
      totalStamps: 6,
      completionStatus: true
    }
  },

  // 测试功能开关
  testFeatures: {
    enableMockScan: true,    // 启用模拟扫码
    enableMockData: true,    // 启用模拟数据
    enableDebugLog: true,    // 启用调试日志
    enableAutoProgress: false // 启用自动进度
  }
}

// 测试工具函数
const testUtils = {
  // 模拟扫码
  mockScan(checkpointId) {
    console.log(`[测试] 模拟扫码: ${checkpointId}`)
    return {
      success: true,
      result: testConfig.testQRCodes[checkpointId] || checkpointId
    }
  },

  // 模拟用户进度
  mockUserProgress(type = 'empty') {
    console.log(`[测试] 模拟用户进度: ${type}`)
    return testConfig.testUserProgress[type] || testConfig.testUserProgress.empty
  },

  // 生成测试二维码
  generateTestQR(checkpointId) {
    return {
      simple: testConfig.testQRCodes[checkpointId],
      json: testConfig.testJSONQRCodes[checkpointId]
    }
  },

  // 重置测试数据
  resetTestData() {
    console.log('[测试] 重置测试数据')
    try {
      wx.removeStorageSync('userProgress')
      wx.removeStorageSync('scanHistory')
      return true
    } catch (error) {
      console.error('[测试] 重置测试数据失败', error)
      return false
    }
  }
}

module.exports = {
  testConfig,
  testUtils
}
