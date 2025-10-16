// pages/scan/scan.js
const app = getApp()

Page({
  data: {
    // 扫码相关
    scanResult: null,
    isScanning: false,
    
    // 用户进度
    userProgress: {
      isSignedIn: false,
      completedStamps: [],
      totalStamps: 6,
      completionStatus: false
    },
    progressPercentage: 0,
    
    // 打卡点数据
    checkpoints: [],
    stamps: [],
    
    // 当前扫描的打卡点
    currentCheckpoint: null
  },

  onLoad() {
    this.initData()
    this.loadUserProgress()
  },

  onShow() {
    this.loadUserProgress()
  },

  // 初始化数据
  initData() {
    const checkpoints = app.globalData.checkpoints;
    this.setData({
      checkpoints: checkpoints,
      stamps: checkpoints,
    })
  },

  // 加载用户进度
  loadUserProgress() {
    try {
      const progress = wx.getStorageSync('userProgress')
      if (progress) {
        const progressPercentage = (progress.completedStamps.length / progress.totalStamps) * 100;
        this.setData({ 
          userProgress: progress,
          progressPercentage: progressPercentage
        })
      }
    } catch (error) {
      console.error('加载用户进度失败:', error)
    }
  },

  // 开始扫码
  startScan() {
    if (this.data.isScanning) return

    this.setData({ isScanning: true })

    wx.scanCode({
      success: (res) => {
        console.log('扫码成功:', res)
        this.handleScanResult(res.result)
      },
      fail: (error) => {
        console.error('扫码失败:', error)
        this.setData({ isScanning: false })
        
        if (error.errMsg.includes('cancel')) {
          // 用户取消扫码
          return
        }
        
        wx.showToast({
          title: '扫码失败，请重试',
          icon: 'error'
        })
      }
    })
  },

  // 处理扫码结果
  handleScanResult(scanResult) {
    this.setData({ 
      isScanning: false,
      scanResult: scanResult
    })

    try {
      // 解析二维码内容（假设二维码内容是打卡点ID）
      const checkpointId = this.parseQRCodeContent(scanResult)
      const checkpoint = this.data.checkpoints.find(cp => cp.id === checkpointId)

      if (!checkpoint) {
        wx.showModal({
          title: '无效二维码',
          content: '请扫描正确的打卡二维码',
          showCancel: false,
          confirmText: '重新扫码'
        })
        return
      }

      // 检查是否已打卡
      if (this.data.userProgress.completedStamps.includes(checkpointId)) {
        wx.showModal({
          title: '已打卡',
          content: `您已经完成「${checkpoint.name}」的打卡`,
          showCancel: false,
          confirmText: '确定'
        })
        return
      }

      // 检查签到状态
      if (checkpointId !== 'signin' && !this.data.userProgress.isSignedIn) {
        wx.showModal({
          title: '请先签到',
          content: '请首先扫描签到二维码完成签到',
          showCancel: false,
          confirmText: '重新扫码'
        })
        return
      }

      // 执行打卡
      this.performCheckIn(checkpoint)

    } catch (error) {
      console.error('处理扫码结果失败:', error)
      wx.showToast({
        title: '处理失败，请重试',
        icon: 'error'
      })
    }
  },

  // 解析二维码内容
  parseQRCodeContent(qrContent) {
    // 这里可以根据实际的二维码格式进行解析
    // 示例：假设二维码内容是 "checkpoint:signin" 或直接是 "signin"
    if (qrContent.includes(':')) {
      return qrContent.split(':')[1]
    }
    return qrContent
  },

  // 执行打卡
  performCheckIn(checkpoint) {
    try {
      // 更新用户进度
      const newProgress = { ...this.data.userProgress }
      
      if (checkpoint.id === 'signin') {
        newProgress.isSignedIn = true
      }
      
      if (!newProgress.completedStamps.includes(checkpoint.id)) {
        newProgress.completedStamps.push(checkpoint.id)
      }
      
      newProgress.completionStatus = newProgress.completedStamps.length === newProgress.totalStamps
      const progressPercentage = (newProgress.completedStamps.length / newProgress.totalStamps) * 100;

      // 保存到本地存储
      wx.setStorageSync('userProgress', newProgress)
      
      // 更新页面数据
      this.setData({ 
        userProgress: newProgress,
        currentCheckpoint: checkpoint,
        progressPercentage: progressPercentage
      })

      // 显示打卡成功提示
      this.showCheckInSuccess(checkpoint, newProgress)
      
      // 触发地图更新事件（如果从地图页面跳转过来）
      this.triggerMapUpdate()

    } catch (error) {
      console.error('打卡失败:', error)
      wx.showToast({
        title: '打卡失败，请重试',
        icon: 'error'
      })
    }
  },

  // 显示打卡成功提示
  showCheckInSuccess(checkpoint, progress) {
    const remaining = progress.totalStamps - progress.completedStamps.length
    
    wx.showModal({
      title: '🎉 打卡成功！',
      content: `恭喜您获得「${checkpoint.name}」电子印章！\n\n${checkpoint.description}\n\n${remaining > 0 ? `还有 ${remaining} 个点位等待探索` : '恭喜！您已完成所有打卡'}`,
      showCancel: false,
      confirmText: remaining > 0 ? '继续探索' : '查看印章',
      success: (res) => {
        if (res.confirm) {
          if (remaining === 0) {
            // 完成所有打卡，跳转到印章页面
            setTimeout(() => {
              this.showCompletionModal()
            }, 500)
          } else {
            // 继续扫码
            this.setData({ currentCheckpoint: null })
          }
        }
      }
    })
  },

  // 显示完成提示
  showCompletionModal() {
    wx.showModal({
      title: '🏆 恭喜完成！',
      content: '行程已完成，电子印章已集齐，请到签到处领取奖品！',
      confirmText: '去领取奖品',
      cancelText: '查看印章',
      success: (res) => {
        if (res.confirm) {
          // 跳转到奖品页面或显示联系方式
          this.showPrizeInfo()
        } else {
          // 跳转到印章页面
          wx.switchTab({
            url: '/pages/stamps/stamps'
          })
        }
      }
    })
  },

  // 显示奖品信息
  showPrizeInfo() {
    wx.showModal({
      title: '奖品领取',
      content: '请前往签到处（手工区）向工作人员出示您的电子印章，即可领取精美奖品！',
      showCancel: false,
      confirmText: '我知道了'
    })
  },

  // 触发地图更新
  triggerMapUpdate() {
    // 通过事件总线通知地图页面更新
    try {
      const eventChannel = this.getOpenerEventChannel()
      if (eventChannel) {
        eventChannel.emit('checkpointUpdated', {
          timestamp: Date.now(),
          progress: this.data.userProgress
        })
      }
    } catch (error) {
      console.log('事件通道不可用，使用存储更新')
    }
  }
})