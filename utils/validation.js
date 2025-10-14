// utils/validation.js
// 验证逻辑工具类

class Validation {
  constructor() {
    // 有效的打卡点ID列表
    this.validCheckpointIds = [
      'signin',      // 寻根·霜降廉养 - 签到点
      'esports',     // 笃行·电竞廉规
      'coffee',      // 省身·啡香廉思
      'makeup',      // 正容·美妆廉仪
      'sleep',       // 静悟·清风入梦
      'breeze'       // 沁心·清风廉饮
    ]
  }

  /**
   * 解析二维码内容
   * @param {string} qrData 二维码数据
   * @returns {string|null} 打卡点ID
   */
  parseQRCode(qrData) {
    try {
      if (!qrData || typeof qrData !== 'string') {
        return null
      }

      // 去除空格和特殊字符
      const cleanData = qrData.trim().replace(/[^\w\-_]/g, '')
      
      // 直接匹配打卡点ID
      if (this.validCheckpointIds.includes(cleanData)) {
        return cleanData
      }

      // 尝试JSON解析
      try {
        const parsed = JSON.parse(qrData)
        if (parsed.checkpointId && this.validCheckpointIds.includes(parsed.checkpointId)) {
          return parsed.checkpointId
        }
      } catch (e) {
        // JSON解析失败，继续其他验证方式
      }

      // 尝试URL解析
      try {
        const url = new URL(qrData)
        const checkpointId = url.searchParams.get('checkpoint') || 
                           url.searchParams.get('id') ||
                           url.pathname.split('/').pop()
        
        if (checkpointId && this.validCheckpointIds.includes(checkpointId)) {
          return checkpointId
        }
      } catch (e) {
        // URL解析失败，继续其他验证方式
      }

      // 尝试从文本中提取ID
      const match = qrData.match(/(signin|esports|coffee|makeup|sleep|breeze)/i)
      if (match) {
        return match[1].toLowerCase()
      }

      return null
    } catch (error) {
      console.error('解析二维码失败', error)
      return null
    }
  }

  /**
   * 验证扫码逻辑
   * @param {string} checkpointId 打卡点ID
   * @param {Object} userProgress 用户进度
   * @returns {Object} 验证结果
   */
  validateScan(checkpointId, userProgress) {
    try {
      // 检查打卡点ID是否有效
      if (!this.validCheckpointIds.includes(checkpointId)) {
        return {
          valid: false,
          message: '无效的打卡点，请扫描正确的二维码'
        }
      }

      // 检查是否已经完成过这个打卡点
      if (userProgress.completedStamps.includes(checkpointId)) {
        const checkpointName = this.getCheckpointName(checkpointId)
        return {
          valid: false,
          message: `您已经完成过「${checkpointName}」的打卡，请扫描其他点位`
        }
      }

      // 检查签到逻辑
      if (checkpointId !== 'signin' && !userProgress.isSignedIn) {
        return {
          valid: false,
          message: '请首先完成签到，扫描「寻根·霜降廉养」二维码'
        }
      }

      // 检查是否已完成所有打卡
      if (userProgress.completionStatus) {
        return {
          valid: false,
          message: '您已完成所有打卡任务，请到签到处领取奖品'
        }
      }

      return {
        valid: true,
        message: '验证通过'
      }
    } catch (error) {
      console.error('验证扫码逻辑失败', error)
      return {
        valid: false,
        message: '验证失败，请重试'
      }
    }
  }

  /**
   * 获取打卡点名称
   * @param {string} checkpointId 打卡点ID
   * @returns {string} 打卡点名称
   */
  getCheckpointName(checkpointId) {
    const nameMap = {
      'signin': '寻根·霜降廉养',
      'esports': '笃行·电竞廉规',
      'coffee': '省身·啡香廉思',
      'makeup': '正容·美妆廉仪',
      'sleep': '静悟·清风入梦',
      'breeze': '沁心·清风廉饮'
    }
    return nameMap[checkpointId] || '未知点位'
  }

  /**
   * 验证用户权限
   * @param {Object} userProgress 用户进度
   * @returns {Object} 权限验证结果
   */
  validateUserPermission(userProgress) {
    try {
      // 检查数据完整性
      if (!userProgress || typeof userProgress !== 'object') {
        return {
          valid: false,
          message: '用户数据异常，请重新启动小程序'
        }
      }

      // 检查必要字段
      const requiredFields = ['isSignedIn', 'completedStamps', 'totalStamps', 'completionStatus']
      for (const field of requiredFields) {
        if (!(field in userProgress)) {
          return {
            valid: false,
            message: '用户数据不完整，正在初始化...'
          }
        }
      }

      return {
        valid: true,
        message: '权限验证通过'
      }
    } catch (error) {
      console.error('验证用户权限失败', error)
      return {
        valid: false,
        message: '权限验证失败'
      }
    }
  }

  /**
   * 验证打卡顺序
   * @param {string} checkpointId 当前打卡点ID
   * @param {Array} completedStamps 已完成的打卡点列表
   * @returns {Object} 顺序验证结果
   */
  validateCheckpointOrder(checkpointId, completedStamps) {
    try {
      // 签到点必须第一个完成
      if (checkpointId === 'signin') {
        if (completedStamps.length > 0) {
          return {
            valid: false,
            message: '签到只能完成一次'
          }
        }
      } else {
        // 其他打卡点需要先完成签到
        if (!completedStamps.includes('signin')) {
          return {
            valid: false,
            message: '请先完成签到'
          }
        }
      }

      return {
        valid: true,
        message: '顺序验证通过'
      }
    } catch (error) {
      console.error('验证打卡顺序失败', error)
      return {
        valid: false,
        message: '顺序验证失败'
      }
    }
  }

  /**
   * 验证时间间隔
   * @param {number} lastScanTime 上次扫描时间
   * @param {number} minInterval 最小间隔时间（毫秒）
   * @returns {Object} 时间验证结果
   */
  validateTimeInterval(lastScanTime, minInterval = 1000) {
    try {
      if (!lastScanTime) {
        return {
          valid: true,
          message: '首次扫描'
        }
      }

      const currentTime = Date.now()
      const timeDiff = currentTime - lastScanTime

      if (timeDiff < minInterval) {
        return {
          valid: false,
          message: `扫描过于频繁，请等待 ${Math.ceil((minInterval - timeDiff) / 1000)} 秒后再试`
        }
      }

      return {
        valid: true,
        message: '时间验证通过'
      }
    } catch (error) {
      console.error('验证时间间隔失败', error)
      return {
        valid: false,
        message: '时间验证失败'
      }
    }
  }

  /**
   * 综合验证扫码
   * @param {string} qrData 二维码数据
   * @param {Object} userProgress 用户进度
   * @returns {Object} 综合验证结果
   */
  validateScanComprehensive(qrData, userProgress) {
    try {
      // 解析二维码
      const checkpointId = this.parseQRCode(qrData)
      if (!checkpointId) {
        return {
          valid: false,
          message: '无法识别的二维码，请扫描正确的打卡码'
        }
      }

      // 验证扫码逻辑
      const scanValidation = this.validateScan(checkpointId, userProgress)
      if (!scanValidation.valid) {
        return scanValidation
      }

      // 验证用户权限
      const permissionValidation = this.validateUserPermission(userProgress)
      if (!permissionValidation.valid) {
        return permissionValidation
      }

      // 验证打卡顺序
      const orderValidation = this.validateCheckpointOrder(checkpointId, userProgress.completedStamps)
      if (!orderValidation.valid) {
        return orderValidation
      }

      // 验证时间间隔
      const timeValidation = this.validateTimeInterval(userProgress.lastScanTime)
      if (!timeValidation.valid) {
        return timeValidation
      }

      return {
        valid: true,
        message: '验证通过',
        checkpointId: checkpointId
      }
    } catch (error) {
      console.error('综合验证失败', error)
      return {
        valid: false,
        message: '验证失败，请重试'
      }
    }
  }
}

// 创建单例实例
const validation = new Validation()

// 导出
module.exports = { validation }
