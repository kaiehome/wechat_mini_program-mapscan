// pages/stamps/stamps.js
const { CHECKPOINTS_DATA, checkpointsUtils } = require('../../data/checkpoints.js')

Page({
  data: {
    statusBarHeight: 20,
    navBarHeight: 44,
    statistics: {
      completed: 0,
      remaining: 6,
      completionRate: 0
    },
    stamps: [],
    userProgress: {
      completedStamps: [],
      totalStamps: 6,
      completionStatus: false
    },
    showAnimation: false,
    animationStamp: {
      stampImage: '/images/stamps/signin.png'
    }
  },

  onLoad() {
    // 计算自定义导航栏高度
    try {
      const sys = wx.getSystemInfoSync()
      const statusBarHeight = sys.statusBarHeight || 20
      const navBarBase = 44
      const navBarHeight = statusBarHeight + navBarBase
      this.setData({ statusBarHeight, navBarHeight })
    } catch (e) {
      this.setData({ statusBarHeight: 20, navBarHeight: 64 })
    }

    // 初始化进度与印章列表
    this.loadUserProgress()
    this.initStampsGrid()
    this.refreshStampsImages()
  },

  onShow() {
    // 页面返回时刷新进度与图标
    this.loadUserProgress()
    this.refreshStampsImages()
  },

  // 读取本地进度
  loadUserProgress() {
    const progress = wx.getStorageSync('userProgress') || {
      completedStamps: [],
      totalStamps: 6,
      completionStatus: false
    }

    const completed = progress.completedStamps.length
    const total = progress.totalStamps
    const completionRate = Math.round((completed / total) * 100)

    this.setData({
      userProgress: progress,
      statistics: {
        completed,
        remaining: total - completed,
        completionRate
      }
    })
  },

  // 初始化印章网格数据
  initStampsGrid() {
    const stamps = CHECKPOINTS_DATA.map(cp => ({
      id: cp.id,
      name: cp.name,
      area: cp.area,
      isCompleted: false,
      stampImage: `/images/stamps/${cp.id}-Ash.png`,
      completionTime: ''
    }))
    this.setData({ stamps })
  },

  // 根据完成状态返回彩色或 -Ash 图
  computeStampImage(id, isCompleted) {
    const base = `/images/stamps/${id}.png`
    const ash = `/images/stamps/${id}-Ash.png`
    return isCompleted ? base : ash
  },

  // 刷新 stamps 列表中的 stampImage 与完成状态
  refreshStampsImages() {
    const completedStamps = this.data.userProgress.completedStamps || []
    const stamps = this.data.stamps.map(item => {
      const isCompleted = completedStamps.includes(item.id)
      return {
        ...item,
        isCompleted,
        stampImage: this.computeStampImage(item.id, isCompleted),
        completionTime: isCompleted ? checkpointsUtils.getCompletionTime(item.id) : ''
      }
    })
    this.setData({ stamps })
  },

  viewCompletionStatus() {
    wx.showToast({ title: '查看完成情况', icon: 'none' })
  },

  goToScan() {
    wx.switchTab({ url: '/pages/scan/scan' })
  },

  resetProgress() {
    wx.showModal({
      title: '重置进度',
      content: '确定要重置吗？',
      success: (res) => {
        if (res.confirm) {
          const total = this.data.userProgress.totalStamps
          // 清空进度
          this.setData({
            userProgress: { completedStamps: [], totalStamps: total, completionStatus: false }
          })
          this.refreshStampsImages()
          this.setData({
            statistics: { completed: 0, remaining: total, completionRate: 0 }
          })
          wx.showToast({ title: '已重置', icon: 'success' })
        }
      }
    })
  },

  onStampTap(e) {
    const id = e.currentTarget.dataset.stampId
    wx.showToast({ title: `点击印章 ${id}`, icon: 'none' })
  }
})