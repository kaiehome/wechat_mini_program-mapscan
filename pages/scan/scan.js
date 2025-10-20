// pages/scan/scan.js
const { CHECKPOINTS_DATA } = require('../../data/checkpoints.js')
const qrCodeUtils = require('../../utils/qrcode.js')
const storage = require('../../utils/storage.js')
Page({
  data: {
    statusBarHeight: 20,
    navBarHeight: 44,
    isScanning: false,
    scanResult: '',
    stamps: [],
    userProgress: {
      completedStamps: [],
      totalStamps: 6,
      completionStatus: false
    },
    progressPercentage: 0,
    completionModalVisible: false
  },

  onLoad() {
    const sys = wx.getSystemInfoSync();
    const statusBarHeight = sys.statusBarHeight || 20;
    const navBarBase = 44; // iOS 常见导航栏高度
    const navBarHeight = statusBarHeight + navBarBase;
    this.setData({ statusBarHeight, navBarHeight });

    // 使用真实点位数据，展示 6 个印章（根据完成状态选择彩色或-Ash）
    const savedProgress = storage.getUserProgress()
    this.setData({
      userProgress: {
        ...savedProgress,
        totalStamps: CHECKPOINTS_DATA.length
      }
    })
    this.refreshStampsImages()
    this.updateProgress()
  },

  updateProgress() {
    const completed = this.data.userProgress.completedStamps.length
    const total = this.data.userProgress.totalStamps
    const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0
    this.setData({ progressPercentage })
  },

  // 根据完成状态返回对应的素材路径（彩色或-Ash）
  computeStampImage(id, isCompleted) {
    const color = `/images/stamps/${id}.png`
    const ash = `/images/stamps/${id}-Ash.png`
    return isCompleted ? color : ash
  },

  // 刷新 stamps 数组中的 stampImage，使其与完成状态同步
  refreshStampsImages() {
    const completedSet = new Set(this.data.userProgress.completedStamps || [])
    const stamps = CHECKPOINTS_DATA.map(cp => ({
      id: cp.id,
      name: cp.name,
      stampImage: this.computeStampImage(cp.id, completedSet.has(cp.id))
    }))
    this.setData({ stamps })
  },

  // 使用微信扫码能力读取二维码并解析为点位ID
  startScan() {
    if (this.data.isScanning) return;
    this.setData({ isScanning: true });

    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode'],
      success: (res) => {
        const prevCompletedCount = this.data.userProgress.completedStamps.length;
        const raw = res.result || res.path || ''
        // 解析二维码内容
        const parsed = qrCodeUtils.parseQRCode(raw)
        if (!parsed.success || !parsed.data || parsed.data.type !== 'checkpoint') {
          this.setData({ isScanning: false, scanResult: raw })
          wx.showToast({ title: '二维码无效', icon: 'none' })
          return
        }
        const checkpointId = parsed.data.id

        // 验证是否允许打卡（需先签到）
        const permission = qrCodeUtils.validateScanPermission(checkpointId, this.data.userProgress)
        if (!permission.valid) {
          this.setData({ isScanning: false })
          wx.showModal({ title: '无法打卡', content: permission.message, showCancel: false })
          return
        }

        // 更新本地存储中的进度
        storage.updateCheckpoint(checkpointId, Date.now())
        const updatedProgress = storage.getUserProgress()

        const info = qrCodeUtils.getCheckpointInfo(checkpointId)
        this.setData({
          isScanning: false,
          scanResult: `识别成功：${info ? info.name : checkpointId}`,
          userProgress: updatedProgress
        })
        this.refreshStampsImages()
        this.updateProgress()
        wx.showToast({ title: '打卡成功', icon: 'success' })
        const newCompletedCount = updatedProgress.completedStamps.length
        if (newCompletedCount === updatedProgress.totalStamps && newCompletedCount !== prevCompletedCount) {
           this.setData({ completionModalVisible: true })
         }
      },
      fail: (err) => {
        console.error('扫码失败:', err)
        this.setData({ isScanning: false })
        wx.showToast({ title: '扫码失败', icon: 'none' })
      }
    })
  },

  onStampTap(e) {
    const id = e.currentTarget.dataset.stampId;
    const isCompleted = this.data.userProgress.completedStamps.includes(id)
    wx.showToast({ title: `${isCompleted ? '已完成' : '未完成'}：${id}`, icon: 'none' });
  },

  closeCompletionModal() {
    this.setData({ completionModalVisible: false })
  }
})