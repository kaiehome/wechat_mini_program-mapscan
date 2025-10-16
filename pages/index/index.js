// pages/index/index.js
const app = getApp()
const { CHECKPOINTS_DATA } = require('../../data/checkpoints.js')

Page({
  data: {
    // 地图相关
    latitude: 30.2741,
    longitude: 120.1551,
    scale: 16,
    markers: [],
    
    // 打卡进度
    userProgress: {
      isSignedIn: false,
      completedStamps: [],
      totalStamps: 6,
      completionStatus: false
    },
    
    // 进度条
    progressPercentage: 0,
    completedCount: 0,
    totalCount: 6,
    
    // 打卡点数据
    checkpoints: [],
    // 地图图片实际高度（px），用于让覆盖层完整覆盖图片）
    mapImageHeight: 0,
    
    // 动画
    mapAnimation: {},
    progressBarAnimation: {}
  },

  onLoad() {
    this.initData()
    this.loadUserProgress()
    // 不再使用<map>组件，改为图片背景 + 覆盖圆圈
    this.updateMapDisplay()
  },

  onShow() {
    // 页面显示时刷新进度
    this.loadUserProgress()
    this.updateMapDisplay()
  },

  onUnload() {
    // 页面卸载时清理事件监听
    this.removeEventListener && this.removeEventListener()
  },

  // 初始化数据
  initData() {
    this.setData({
      checkpoints: CHECKPOINTS_DATA
    })
  },

  // 加载用户进度
  loadUserProgress() {
    try {
      const progress = wx.getStorageSync('userProgress') || {
        completedStamps: [],
        totalStamps: 6,
        completionStatus: false
      }
      
      // 计算进度百分比
      const completedCount = progress.completedStamps.length
      const progressPercentage = Math.round((completedCount / progress.totalStamps) * 100)
      
      this.setData({
        userProgress: progress,
        completedCount: completedCount,
        totalCount: progress.totalStamps,
        progressPercentage: progressPercentage
      })
    } catch (error) {
      console.error('加载用户进度失败:', error)
    }
  },

  // 更新地图显示（改为仅同步进度数据，避免使用<map>标记）
  updateMapDisplay() {
    const completedCount = this.data.userProgress.completedStamps.length
    const totalCount = this.data.userProgress.totalStamps
    this.setData({
      completedCount,
      totalCount,
      progressPercentage: (completedCount / totalCount) * 100,
      markers: [] // 不再渲染任何map标记
    })
  },

  // 图片加载完成后，获取图片的真实渲染高度，使覆盖层与图片高度一致
  onMapImageLoad() {
    console.log('地图图片加载成功')
    try {
      const query = wx.createSelectorQuery()
      query.in(this).select('.map-image').boundingClientRect()
      query.exec(res => {
        const rect = res && res[0]
        if (rect && rect.height) {
          this.setData({ mapImageHeight: rect.height })
          console.log('地图图片高度:', rect.height)
        }
      })
    } catch (error) {
      console.error('获取地图图片高度失败:', error)
    }
  },

  // 图片加载失败处理
  onMapImageError(e) {
    console.error('地图图片加载失败:', e.detail)
    wx.showToast({
      title: '图片加载失败',
      icon: 'error',
      duration: 2000
    })
  },

  // 打卡点圆圈点击事件
  onCheckpointTap(e) {
    const checkpointId = e.currentTarget.dataset.checkpointId
    const checkpoint = this.data.checkpoints.find(cp => cp.id === checkpointId)
    
    if (checkpoint) {
      this.showCheckpointInfo(checkpoint)
    }
  },

  // 地图标记点击事件（兼容旧版本，直接忽略）
  onMarkerTap() {},

  // 显示打卡点信息
  showCheckpointInfo(checkpoint) {
    const isCompleted = this.data.userProgress.completedStamps.includes(checkpoint.id)
    const statusText = isCompleted ? '已完成' : '待打卡'
    const statusColor = isCompleted ? '#4CAF50' : '#FF9800'

    wx.showModal({
      title: checkpoint.name,
      content: `${checkpoint.description}\n\n状态: ${statusText}`,
      showCancel: true,
      cancelText: '关闭',
      confirmText: isCompleted ? '查看印章' : '去扫码',
      success: (res) => {
        if (res.confirm) {
          if (isCompleted) {
            // 跳转到印章页面
            wx.switchTab({
              url: '/pages/stamps/stamps'
            })
          } else {
            // 跳转到扫码页面
            wx.switchTab({
              url: '/pages/scan/scan'
            })
          }
        }
      }
    })
  }
})