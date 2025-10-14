// utils/storage.js
// 数据存储工具类

const STORAGE_KEYS = {
  USER_PROGRESS: 'userProgress',
  SCAN_HISTORY: 'scanHistory',
  USER_SETTINGS: 'userSettings'
}

class Storage {
  constructor() {
    this.defaultProgress = {
      isSignedIn: false,
      completedStamps: [],
      totalStamps: 6,
      lastScanTime: null,
      completionStatus: false,
      createTime: Date.now(),
      updateTime: Date.now()
    }
  }

  /**
   * 获取用户打卡进度
   * @returns {Object} 用户进度数据
   */
  getProgress() {
    try {
      const progress = wx.getStorageSync(STORAGE_KEYS.USER_PROGRESS)
      if (!progress) {
        return this.defaultProgress
      }
      
      // 确保数据结构完整
      return {
        ...this.defaultProgress,
        ...progress,
        updateTime: Date.now()
      }
    } catch (error) {
      console.error('获取用户进度失败', error)
      return this.defaultProgress
    }
  }

  /**
   * 保存用户打卡进度
   * @param {Object} progress 进度数据
   */
  saveProgress(progress) {
    try {
      const progressData = {
        ...progress,
        updateTime: Date.now()
      }
      wx.setStorageSync(STORAGE_KEYS.USER_PROGRESS, progressData)
      console.log('用户进度已保存', progressData)
    } catch (error) {
      console.error('保存用户进度失败', error)
      throw error
    }
  }

  /**
   * 更新单个打卡点状态
   * @param {string} checkpointId 打卡点ID
   * @returns {Object} 更新后的进度数据
   */
  updateCheckpoint(checkpointId) {
    try {
      const progress = this.getProgress()
      
      // 如果是签到点
      if (checkpointId === 'signin') {
        progress.isSignedIn = true
      }
      
      // 添加到已完成列表（避免重复）
      if (!progress.completedStamps.includes(checkpointId)) {
        progress.completedStamps.push(checkpointId)
        
        // 记录扫描历史
        this.addScanHistory(checkpointId)
      }
      
      // 检查完成状态
      progress.completionStatus = progress.completedStamps.length === progress.totalStamps
      progress.lastScanTime = Date.now()
      
      this.saveProgress(progress)
      return progress
    } catch (error) {
      console.error('更新打卡点状态失败', error)
      throw error
    }
  }

  /**
   * 添加扫描历史记录
   * @param {string} checkpointId 打卡点ID
   */
  addScanHistory(checkpointId) {
    try {
      const history = wx.getStorageSync(STORAGE_KEYS.SCAN_HISTORY) || []
      const scanRecord = {
        checkpointId,
        scanTime: Date.now(),
        timestamp: new Date().toLocaleString()
      }
      
      history.unshift(scanRecord)
      
      // 只保留最近50条记录
      if (history.length > 50) {
        history.splice(50)
      }
      
      wx.setStorageSync(STORAGE_KEYS.SCAN_HISTORY, history)
    } catch (error) {
      console.error('添加扫描历史失败', error)
    }
  }

  /**
   * 获取扫描历史
   * @returns {Array} 扫描历史记录
   */
  getScanHistory() {
    try {
      return wx.getStorageSync(STORAGE_KEYS.SCAN_HISTORY) || []
    } catch (error) {
      console.error('获取扫描历史失败', error)
      return []
    }
  }

  /**
   * 检查打卡点是否已完成
   * @param {string} checkpointId 打卡点ID
   * @returns {boolean} 是否已完成
   */
  isCheckpointCompleted(checkpointId) {
    const progress = this.getProgress()
    return progress.completedStamps.includes(checkpointId)
  }

  /**
   * 检查用户是否已签到
   * @returns {boolean} 是否已签到
   */
  isSignedIn() {
    const progress = this.getProgress()
    return progress.isSignedIn
  }

  /**
   * 检查是否完成所有打卡
   * @returns {boolean} 是否已完成
   */
  isCompleted() {
    const progress = this.getProgress()
    return progress.completionStatus
  }

  /**
   * 重置所有进度
   */
  resetProgress() {
    try {
      wx.removeStorageSync(STORAGE_KEYS.USER_PROGRESS)
      wx.removeStorageSync(STORAGE_KEYS.SCAN_HISTORY)
      console.log('用户进度已重置')
    } catch (error) {
      console.error('重置进度失败', error)
      throw error
    }
  }

  /**
   * 获取进度统计
   * @returns {Object} 进度统计信息
   */
  getProgressStats() {
    const progress = this.getProgress()
    return {
      totalStamps: progress.totalStamps,
      completedCount: progress.completedStamps.length,
      remainingCount: progress.totalStamps - progress.completedStamps.length,
      percentage: Math.round((progress.completedStamps.length / progress.totalStamps) * 100),
      isCompleted: progress.completionStatus,
      isSignedIn: progress.isSignedIn
    }
  }

  /**
   * 导出用户数据
   * @returns {Object} 导出的用户数据
   */
  exportUserData() {
    try {
      const progress = this.getProgress()
      const history = this.getScanHistory()
      
      return {
        progress,
        scanHistory: history,
        exportTime: Date.now(),
        exportTimestamp: new Date().toLocaleString()
      }
    } catch (error) {
      console.error('导出用户数据失败', error)
      throw error
    }
  }

  /**
   * 导入用户数据
   * @param {Object} userData 用户数据
   */
  importUserData(userData) {
    try {
      if (userData.progress) {
        this.saveProgress(userData.progress)
      }
      
      if (userData.scanHistory) {
        wx.setStorageSync(STORAGE_KEYS.SCAN_HISTORY, userData.scanHistory)
      }
      
      console.log('用户数据导入成功')
    } catch (error) {
      console.error('导入用户数据失败', error)
      throw error
    }
  }
}

// 创建单例实例
const storage = new Storage()

// 导出
module.exports = { storage }
