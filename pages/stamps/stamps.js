// pages/stamps/stamps.js
const { storage } = require('../../utils/storage.js')
const { checkpoints } = require('../../data/checkpoints.js')

Page({
  data: {
    userProgress: {
      isSignedIn: false,
      completedStamps: [],
      totalStamps: 6,
      completionStatus: false
    },
    stamps: [],
    showStampDetail: false,
    selectedStamp: null,
    checkpoints: []
  },

  onLoad() {
    this.loadUserProgress()
    this.initStamps()
    this.setData({ checkpoints })
  },

  onShow() {
    this.loadUserProgress()
    this.initStamps()
  },

  // 加载用户打卡进度
  loadUserProgress() {
    const progress = storage.getProgress()
    this.setData({ userProgress: progress })
  },

  // 初始化印章数据
  initStamps() {
    const stamps = checkpoints.map(checkpoint => ({
      ...checkpoint,
      isCompleted: this.data.userProgress.completedStamps.includes(checkpoint.id),
      completionTime: this.getCompletionTime(checkpoint.id)
    }))

    this.setData({ stamps })
  },

  // 获取完成时间（模拟数据）
  getCompletionTime(checkpointId) {
    // 这里可以从存储中获取实际的完成时间
    const isCompleted = this.data.userProgress.completedStamps.includes(checkpointId)
    return isCompleted ? new Date().toLocaleString() : null
  },

  // 印章点击事件
  onStampTap(e) {
    const stampId = e.currentTarget.dataset.id
    const stamp = this.data.stamps.find(s => s.id === stampId)
    
    if (stamp) {
      this.setData({
        selectedStamp: stamp,
        showStampDetail: true
      })
    }
  },

  // 关闭印章详情
  closeStampDetail() {
    this.setData({
      showStampDetail: false,
      selectedStamp: null
    })
  },

  // 返回地图页面
  goToMap() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  // 开始扫码
  startScan() {
    wx.switchTab({
      url: '/pages/scan/scan'
    })
  },

  // 分享功能
  onShareAppMessage() {
    const progress = this.data.userProgress
    const completedCount = progress.completedStamps.length
    const totalCount = progress.totalStamps

    return {
      title: `我在廉洁探索之旅中已收集 ${completedCount}/${totalCount} 个电子印章！`,
      path: '/pages/index/index',
      imageUrl: '/images/share-bg.png'
    }
  },

  // 重置进度（仅用于测试）
  resetProgress() {
    wx.showModal({
      title: '确认重置',
      content: '确定要重置所有打卡进度吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          storage.resetProgress()
          this.loadUserProgress()
          this.initStamps()
          wx.showToast({
            title: '进度已重置',
            icon: 'success'
          })
        }
      }
    })
  },

  // 导出进度
  exportProgress() {
    const progress = this.data.userProgress
    const progressData = {
      completedStamps: progress.completedStamps,
      totalStamps: progress.totalStamps,
      completionStatus: progress.completionStatus,
      exportTime: new Date().toLocaleString()
    }

    // 这里可以实现进度导出功能
    wx.showToast({
      title: '进度导出功能开发中',
      icon: 'none'
    })
  }
})
