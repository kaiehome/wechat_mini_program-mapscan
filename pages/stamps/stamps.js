// pages/stamps/stamps.js
const app = getApp()

Page({
  data: {
    // 用户进度
    userProgress: {
      isSignedIn: false,
      completedStamps: [],
      totalStamps: 6,
      completionStatus: false
    },
    
    // 打卡点数据
    checkpoints: [],
    
    // 印章展示相关
    stamps: [],
    showAnimation: false,
    animationStamp: null,
    
    // 统计信息
    statistics: {
      completed: 0,
      remaining: 6,
      completionRate: 0
    }
  },

  onLoad() {
    this.initData()
    this.loadUserProgress()
  },

  onShow() {
    this.loadUserProgress()
    this.updateStampsDisplay()
  },

  // 初始化数据
  initData() {
    this.setData({
      checkpoints: app.globalData.checkpoints
    })
  },

  // 加载用户进度
  loadUserProgress() {
    try {
      const progress = wx.getStorageSync('userProgress')
      if (progress) {
        this.setData({ userProgress: progress })
        this.updateStatistics(progress)
      }
    } catch (error) {
      console.error('加载用户进度失败:', error)
    }
  },

  // 更新统计信息
  updateStatistics(progress) {
    const completed = progress.completedStamps.length
    const remaining = progress.totalStamps - completed
    const completionRate = (completed / progress.totalStamps) * 100

    this.setData({
      statistics: {
        completed,
        remaining,
        completionRate
      }
    })
  },

  // 更新印章展示
  updateStampsDisplay() {
    const stamps = this.data.checkpoints.map(checkpoint => {
      const isCompleted = this.data.userProgress.completedStamps.includes(checkpoint.id)
      return {
        ...checkpoint,
        isCompleted,
        completionTime: this.getCompletionTime(checkpoint.id)
      }
    })

    this.setData({ stamps })
  },

  // 获取完成时间
  getCompletionTime(checkpointId) {
    try {
      const progressData = wx.getStorageSync('userProgress')
      // 这里可以从更详细的数据中获取时间，暂时返回模拟数据
      return new Date().toLocaleString()
    } catch (error) {
      return '未知时间'
    }
  },

  // 印章点击事件
  onStampTap(e) {
    const stampId = e.currentTarget.dataset.stampId
    const stamp = this.data.stamps.find(s => s.id === stampId)

    if (stamp) {
      this.showStampDetail(stamp)
    }
  },

  // 显示印章详情
  showStampDetail(stamp) {
    const statusText = stamp.isCompleted ? '已收集' : '未收集'
    const statusColor = stamp.isCompleted ? '#4CAF50' : '#FF9800'
    
    wx.showModal({
      title: stamp.name,
      content: `${stamp.description}\n\n状态: ${statusText}\n${stamp.isCompleted ? `完成时间: ${stamp.completionTime}` : ''}`,
      showCancel: stamp.isCompleted,
      cancelText: stamp.isCompleted ? '分享' : '',
      confirmText: stamp.isCompleted ? '确定' : '去打卡',
      success: (res) => {
        if (res.confirm && !stamp.isCompleted) {
          // 跳转到扫码页面
          wx.switchTab({
            url: '/pages/scan/scan'
          })
        } else if (res.cancel && stamp.isCompleted) {
          // 分享印章
          this.shareStamp(stamp)
        }
      }
    })
  },

  // 分享印章
  shareStamp(stamp) {
    wx.showActionSheet({
      itemList: ['分享到微信', '保存到相册'],
      success: (res) => {
        if (res.tapIndex === 0) {
          // 分享到微信
          this.shareToWeChat(stamp)
        } else if (res.tapIndex === 1) {
          // 保存到相册
          this.saveToAlbum(stamp)
        }
      }
    })
  },

  // 分享到微信
  shareToWeChat(stamp) {
    wx.showToast({
      title: '分享功能开发中',
      icon: 'none'
    })
  },

  // 保存到相册
  saveToAlbum(stamp) {
    wx.showToast({
      title: '保存功能开发中',
      icon: 'none'
    })
  },

  // 播放印章动画
  playStampAnimation(stamp) {
    this.setData({
      showAnimation: true,
      animationStamp: stamp
    })

    // 3秒后隐藏动画
    setTimeout(() => {
      this.setData({
        showAnimation: false,
        animationStamp: null
      })
    }, 3000)
  },

  // 查看完成情况
  viewCompletionStatus() {
    const progress = this.data.userProgress
    
    if (progress.completionStatus) {
      wx.showModal({
        title: '🏆 恭喜完成！',
        content: '您已成功集齐所有电子印章！\n\n请前往签到处（手工区）领取奖品。',
        confirmText: '我知道了',
        showCancel: false
      })
    } else {
      const remaining = progress.totalStamps - progress.completedStamps.length
      wx.showModal({
        title: '继续努力',
        content: `您已完成 ${progress.completedStamps.length} 个点位\n还有 ${remaining} 个点位等待探索`,
        confirmText: '去打卡',
        cancelText: '查看地图',
        success: (res) => {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/scan/scan'
            })
          } else if (res.cancel) {
            wx.switchTab({
              url: '/pages/index/index'
            })
          }
        }
      })
    }
  },

  // 重置进度
  resetProgress() {
    wx.showModal({
      title: '重置进度',
      content: '确定要重置所有打卡进度吗？此操作不可撤销。',
      success: (res) => {
        if (res.confirm) {
          try {
            wx.removeStorageSync('userProgress')
            this.setData({
              userProgress: {
                isSignedIn: false,
                completedStamps: [],
                totalStamps: 6,
                completionStatus: false
              }
            })
            this.updateStatistics(this.data.userProgress)
            this.updateStampsDisplay()
            wx.showToast({
              title: '重置成功',
              icon: 'success'
            })
          } catch (error) {
            console.error('重置失败:', error)
            wx.showToast({
              title: '重置失败',
              icon: 'error'
            })
          }
        }
      }
    })
  },

  // 跳转到地图
  goToMap() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  // 跳转到扫码
  goToScan() {
    wx.switchTab({
      url: '/pages/scan/scan'
    })
  }
})