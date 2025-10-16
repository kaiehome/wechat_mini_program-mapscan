// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  
  globalData: {
    userInfo: null,
    // 打卡点配置
    checkpoints: [
      {
        id: 'signin',
        name: '寻根·霜降廉养',
        area: '手工区',
        type: 'signin',
        position: { lat: 30.2741, lng: 120.1551 }, // 杭州坐标示例
        stampImage: '/images/stamps/signin.png',
        description: '用户在手工区扫描二维码打卡，加盖"寻根·霜降廉养"电子印章，正式开启廉洁探索之旅。'
      },
      {
        id: 'esports',
        name: '笃行·电竞廉规',
        area: '电竞区',
        type: 'checkpoint',
        position: { lat: 30.2742, lng: 120.1552 },
        stampImage: '/images/stamps/esports.png',
        description: '用户在电竞区扫描二维码打卡，加盖"笃行·电竞廉规"电子印章，强化对廉洁规则的践行意识。'
      },
      {
        id: 'coffee',
        name: '省身·啡香廉思',
        area: '咖啡区',
        type: 'checkpoint',
        position: { lat: 30.2743, lng: 120.1553 },
        stampImage: '/images/stamps/coffee.png',
        description: '用户在咖啡区扫描二维码打卡，加盖"省身·啡香廉思"电子印章。'
      },
      {
        id: 'makeup',
        name: '正容·美妆廉仪',
        area: '美妆区',
        type: 'checkpoint',
        position: { lat: 30.2744, lng: 120.1554 },
        stampImage: '/images/stamps/makeup.png',
        description: '用户在美妆区扫描二维码打卡，加盖"正容·美妆廉仪"电子印章，展现廉洁风采。'
      },
      {
        id: 'sleep',
        name: '静悟·清风入梦',
        area: '睡眠区',
        type: 'checkpoint',
        position: { lat: 30.2745, lng: 120.1555 },
        stampImage: '/images/stamps/sleep.png',
        description: '用户在睡眠区扫描二维码打卡，加盖"静悟·清风入梦"电子印章，在宁静中领悟廉洁真谛。'
      },
      {
        id: 'breeze',
        name: '沁心·清风廉饮',
        area: '空调区',
        type: 'checkpoint',
        position: { lat: 30.2746, lng: 120.1556 },
        stampImage: '/images/stamps/breeze.png',
        description: '用户在清风区扫描二维码打卡，加盖"沁心·清风廉饮"电子印章，完成所有打卡行程。'
      }
    ]
  }
})