// pages/scan/scan.js
const { storage } = require('../../utils/storage.js')
const { validation } = require('../../utils/validation.js')
const { checkpoints } = require('../../data/checkpoints.js')

Page({
  data: {
    scanResult: null,
    isScanning: false,
    userProgress: {
      isSignedIn: false,
      completedStamps: [],
      totalStamps: 6,
      completionStatus: false
    },
    checkpoints: []
  },

  onLoad() {
    this.loadUserProgress()
    this.setData({ checkpoints })
  },

  onShow() {
    this.loadUserProgress()
  },

  // 加载用户打卡进度
  loadUserProgress() {
    const progress = storage.getProgress()
    this.setData({ userProgress: progress })
  },

  // 开始扫码
  startScan() {
    if (this.data.isScanning) return

    this.setData({ isScanning: true })

    wx.scanCode({
      success: (res) => {
        console.log('扫码成功', res)
        this.handleScanResult(res.result)
      },
      fail: (err) => {
        console.error('扫码失败', err)
        this.handleScanError(err)
      },
      complete: () => {
        this.setData({ isScanning: false })
      }
    })
  },

  // 处理扫码结果
  handleScanResult(scanData) {
    try {
      // 解析二维码内容
      const checkpointId = validation.parseQRCode(scanData)
      
      if (!checkpointId) {
        this.showError('无效的二维码，请扫描正确的打卡码')
        return
      }

      // 验证扫码逻辑
      const validationResult = validation.validateScan(checkpointId, this.data.userProgress)
      
      if (!validationResult.valid) {
        this.showError(validationResult.message)
        return
      }

      // 更新打卡状态
      this.updateCheckpointStatus(checkpointId)

    } catch (error) {
      console.error('处理扫码结果失败', error)
      this.showError('处理扫码结果失败，请重试')
    }
  },

  // 处理扫码错误
  handleScanError(error) {
    let message = '扫码失败，请重试'
    
    if (error.errMsg.includes('cancel')) {
      message = '已取消扫码'
    } else if (error.errMsg.includes('permission')) {
      message = '需要相机权限才能扫码'
    }

    this.showError(message)
  },

  // 更新打卡点状态
  updateCheckpointStatus(checkpointId) {
    // 更新本地存储
    const newProgress = storage.updateCheckpoint(checkpointId)
    
    // 更新页面数据
    this.setData({
      userProgress: newProgress,
      scanResult: checkpointId
    })

    // 显示成功提示和印章动画
    this.showSuccessAnimation(checkpointId)

    // 检查完成状态
    setTimeout(() => {
      this.checkCompletionStatus()
    }, 1500)
  },

  // 显示成功动画
  showSuccessAnimation(checkpointId) {
    const checkpoint = checkpoints.find(point => point.id === checkpointId)
    
    if (!checkpoint) return

    // 显示成功弹窗
    wx.showModal({
      title: '🎉 打卡成功！',
      content: `恭喜您获得「${checkpoint.name}」电子印章`,
      showCancel: false,
      confirmText: '继续探索',
      success: () => {
        // 触发印章动画
        this.triggerStampAnimation(checkpoint)
      }
    })
  },

  // 触发印章动画
  triggerStampAnimation(checkpoint) {
    // 这里可以添加印章动画逻辑
    console.log('触发印章动画', checkpoint.name)
    
    // 跳转到印章页面查看
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/stamps/stamps'
      })
    }, 1000)
  },

  // 检查完成状态
  checkCompletionStatus() {
    const progress = this.data.userProgress
    
    if (progress.completedStamps.length === progress.totalStamps) {
      // 延迟显示完成提示
      setTimeout(() => {
        this.showCompletionModal()
      }, 500)
    } else {
      // 显示当前进度
      const remaining = progress.totalStamps - progress.completedStamps.length
      wx.showToast({
        title: `还有 ${remaining} 个点位等待探索`,
        icon: 'none',
        duration: 2000
      })
    }
  },

  // 显示完成弹窗
  showCompletionModal() {
    wx.showModal({
      title: '🎉 恭喜完成！',
      content: '行程已完成，电子印章已集齐，请到签到处领取奖品！',
      confirmText: '去领取奖品',
      cancelText: '查看印章',
      success: (res) => {
        if (res.confirm) {
          // 跳转到奖品页面（如果有的话）
          wx.showToast({
            title: '请到签到处领取奖品',
            icon: 'none'
          })
        } else {
          // 跳转到印章页面
          wx.switchTab({
            url: '/pages/stamps/stamps'
          })
        }
      }
    })
  },

  // 显示错误信息
  showError(message) {
    wx.showModal({
      title: '提示',
      content: message,
      showCancel: false,
      confirmText: '知道了'
    })
  },

  // 返回地图页面
  goBack() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  // 查看当前进度
  viewProgress() {
    wx.switchTab({
      url: '/pages/stamps/stamps'
    })
  }
})
