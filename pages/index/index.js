// pages/index/index.js
const { storage } = require('../../utils/storage.js')
const { checkpoints } = require('../../data/checkpoints.js')

Page({
  data: {
    mapCenter: {
      latitude: 39.908823,
      longitude: 116.397470
    },
    markers: [],
    userProgress: {
      isSignedIn: false,
      completedStamps: [],
      totalStamps: 6,
      completionStatus: false
    },
    progressPercentage: 0,
    showProgress: true,
    checkpoints: []
  },

  onLoad() {
    this.loadUserProgress()
    this.initMapMarkers()
    this.setData({ checkpoints })
  },

  onShow() {
    // 每次显示页面时刷新进度
    this.loadUserProgress()
    this.updateMapDisplay()
  },

  // 加载用户打卡进度
  loadUserProgress() {
    const progress = storage.getProgress()
    this.setData({
      userProgress: progress,
      progressPercentage: (progress.completedStamps.length / progress.totalStamps) * 100
    })
  },

  // 初始化地图标记点
  initMapMarkers() {
    const markers = checkpoints.map(point => ({
      id: point.id,
      latitude: point.position.lat,
      longitude: point.position.lng,
      iconPath: this.getMarkerIcon(point.id),
      width: 30,
      height: 30,
      callout: {
        content: point.name,
        color: this.getMarkerColor(point.id),
        fontSize: 14,
        borderRadius: 8,
        bgColor: '#ffffff',
        padding: 8
      }
    }))

    this.setData({ markers })
  },

  // 更新地图显示
  updateMapDisplay() {
    this.initMapMarkers()
  },

  // 获取标记点图标
  getMarkerIcon(checkpointId) {
    const isCompleted = this.data.userProgress.completedStamps.includes(checkpointId)
    return isCompleted ? '/images/icons/completed.png' : '/images/icons/pending.png'
  },

  // 获取标记点颜色
  getMarkerColor(checkpointId) {
    const isCompleted = this.data.userProgress.completedStamps.includes(checkpointId)
    return isCompleted ? '#4CAF50' : '#FF9800'
  },

  // 跳转到扫码页面
  goToScan() {
    wx.navigateTo({
      url: '/pages/scan/scan'
    })
  },

  // 跳转到印章页面
  goToStamps() {
    wx.navigateTo({
      url: '/pages/stamps/stamps'
    })
  },

  // 地图标记点击事件
  onMarkerTap(e) {
    const markerId = e.detail.markerId
    const checkpoint = checkpoints.find(point => point.id === markerId)
    
    if (checkpoint) {
      const isCompleted = this.data.userProgress.completedStamps.includes(markerId)
      const status = isCompleted ? '已完成' : '待完成'
      
      wx.showModal({
        title: checkpoint.name,
        content: `状态：${status}\n\n${checkpoint.description}`,
        showCancel: false,
        confirmText: '知道了'
      })
    }
  },

  // 地图区域变化事件
  onRegionChange(e) {
    console.log('地图区域变化', e.detail)
  }
})
