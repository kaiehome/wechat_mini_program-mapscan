// utils/storage.js

/**
 * 数据存储工具类
 */
class Storage {
  constructor() {
    this.STORAGE_KEYS = {
      USER_PROGRESS: 'userProgress',
      USER_INFO: 'userInfo',
      SCAN_HISTORY: 'scanHistory',
      APP_SETTINGS: 'appSettings'
    }
  }

  /**
   * 获取用户打卡进度
   */
  getUserProgress() {
    try {
      const progress = wx.getStorageSync(this.STORAGE_KEYS.USER_PROGRESS)
      return progress || this.getDefaultProgress()
    } catch (error) {
      console.error('获取用户进度失败:', error)
      return this.getDefaultProgress()
    }
  }

  /**
   * 保存用户打卡进度
   */
  saveUserProgress(progress) {
    try {
      const progressData = {
        ...progress,
        lastUpdateTime: Date.now(),
        version: '1.0.0'
      }
      wx.setStorageSync(this.STORAGE_KEYS.USER_PROGRESS, progressData)
      return true
    } catch (error) {
      console.error('保存用户进度失败:', error)
      return false
    }
  }

  /**
   * 更新单个打卡点状态
   */
  updateCheckpoint(checkpointId, completionTime = null) {
    try {
      const progress = this.getUserProgress()
      
      // 如果是签到点
      if (checkpointId === 'signin') {
        progress.isSignedIn = true
      }
      
      // 添加到已完成列表（避免重复）
      if (!progress.completedStamps.includes(checkpointId)) {
        progress.completedStamps.push(checkpointId)
      }
      
      // 更新完成时间
      if (completionTime) {
        progress.completionTimes = progress.completionTimes || {}
        progress.completionTimes[checkpointId] = completionTime
      }
      
      // 检查完成状态
      progress.completionStatus = progress.completedStamps.length === progress.totalStamps
      
      return this.saveUserProgress(progress)
    } catch (error) {
      console.error('更新打卡点状态失败:', error)
      return false
    }
  }

  /**
   * 重置用户进度
   */
  resetUserProgress() {
    try {
      wx.removeStorageSync(this.STORAGE_KEYS.USER_PROGRESS)
      return true
    } catch (error) {
      console.error('重置用户进度失败:', error)
      return false
    }
  }

  /**
   * 获取默认进度数据
   */
  getDefaultProgress() {
    return {
      isSignedIn: false,
      completedStamps: [],
      totalStamps: 6,
      completionStatus: false,
      completionTimes: {},
      createTime: Date.now(),
      lastUpdateTime: Date.now()
    }
  }

  /**
   * 获取扫码历史
   */
  getScanHistory() {
    try {
      return wx.getStorageSync(this.STORAGE_KEYS.SCAN_HISTORY) || []
    } catch (error) {
      console.error('获取扫码历史失败:', error)
      return []
    }
  }

  /**
   * 添加扫码记录
   */
  addScanRecord(scanData) {
    try {
      const history = this.getScanHistory()
      const record = {
        ...scanData,
        timestamp: Date.now(),
        id: Date.now().toString()
      }
      
      history.unshift(record)
      
      // 只保留最近100条记录
      if (history.length > 100) {
        history.splice(100)
      }
      
      wx.setStorageSync(this.STORAGE_KEYS.SCAN_HISTORY, history)
      return true
    } catch (error) {
      console.error('添加扫码记录失败:', error)
      return false
    }
  }

  /**
   * 获取应用设置
   */
  getAppSettings() {
    try {
      return wx.getStorageSync(this.STORAGE_KEYS.APP_SETTINGS) || this.getDefaultSettings()
    } catch (error) {
      console.error('获取应用设置失败:', error)
      return this.getDefaultSettings()
    }
  }

  /**
   * 保存应用设置
   */
  saveAppSettings(settings) {
    try {
      wx.setStorageSync(this.STORAGE_KEYS.APP_SETTINGS, settings)
      return true
    } catch (error) {
      console.error('保存应用设置失败:', error)
      return false
    }
  }

  /**
   * 获取默认设置
   */
  getDefaultSettings() {
    return {
      enableVibration: true,
      enableSound: true,
      enableNotification: true,
      theme: 'light',
      language: 'zh-CN'
    }
  }

  /**
   * 清除所有数据
   */
  clearAllData() {
    try {
      Object.values(this.STORAGE_KEYS).forEach(key => {
        wx.removeStorageSync(key)
      })
      return true
    } catch (error) {
      console.error('清除数据失败:', error)
      return false
    }
  }

  /**
   * 获取存储信息
   */
  getStorageInfo() {
    try {
      const info = wx.getStorageInfoSync()
      return {
        keys: info.keys,
        currentSize: info.currentSize,
        limitSize: info.limitSize,
        usage: (info.currentSize / info.limitSize * 100).toFixed(2) + '%'
      }
    } catch (error) {
      console.error('获取存储信息失败:', error)
      return null
    }
  }
}

// 创建单例实例
const storage = new Storage()

module.exports = storage