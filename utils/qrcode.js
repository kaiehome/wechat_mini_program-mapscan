// utils/qrcode.js
// 二维码处理工具类

class QRCode {
  constructor() {
    // 二维码生成配置
    this.config = {
      size: 200,
      margin: 10,
      color: '#000000',
      backgroundColor: '#ffffff'
    }
  }

  /**
   * 生成打卡点二维码数据
   * @param {string} checkpointId 打卡点ID
   * @param {Object} options 可选配置
   * @returns {string} 二维码数据
   */
  generateCheckpointQR(checkpointId, options = {}) {
    try {
      const qrData = {
        checkpointId: checkpointId,
        timestamp: Date.now(),
        version: '1.0',
        app: '廉洁探索之旅',
        ...options
      }

      return JSON.stringify(qrData)
    } catch (error) {
      console.error('生成二维码数据失败', error)
      throw error
    }
  }

  /**
   * 生成所有打卡点的二维码数据
   * @returns {Object} 所有打卡点的二维码数据
   */
  generateAllCheckpointQRs() {
    const checkpoints = [
      { id: 'signin', name: '寻根·霜降廉养', type: 'signin' },
      { id: 'esports', name: '笃行·电竞廉规', type: 'checkpoint' },
      { id: 'coffee', name: '省身·啡香廉思', type: 'checkpoint' },
      { id: 'makeup', name: '正容·美妆廉仪', type: 'checkpoint' },
      { id: 'sleep', name: '静悟·清风入梦', type: 'checkpoint' },
      { id: 'breeze', name: '沁心·清风廉饮', type: 'checkpoint' }
    ]

    const qrDataList = {}
    
    checkpoints.forEach(checkpoint => {
      qrDataList[checkpoint.id] = {
        qrData: this.generateCheckpointQR(checkpoint.id, {
          name: checkpoint.name,
          type: checkpoint.type
        }),
        checkpoint: checkpoint
      }
    })

    return qrDataList
  }

  /**
   * 验证二维码格式
   * @param {string} qrData 二维码数据
   * @returns {boolean} 是否为有效格式
   */
  validateQRFormat(qrData) {
    try {
      if (!qrData || typeof qrData !== 'string') {
        return false
      }

      // 尝试JSON解析
      const parsed = JSON.parse(qrData)
      
      // 检查必要字段
      const requiredFields = ['checkpointId', 'timestamp', 'version', 'app']
      return requiredFields.every(field => field in parsed)
    } catch (error) {
      // JSON解析失败，检查是否为简单的ID
      const simpleIds = ['signin', 'esports', 'coffee', 'makeup', 'sleep', 'breeze']
      return simpleIds.includes(qrData.trim())
    }
  }

  /**
   * 解析二维码数据
   * @param {string} qrData 二维码数据
   * @returns {Object|null} 解析后的数据
   */
  parseQRData(qrData) {
    try {
      if (!qrData) {
        return null
      }

      // 尝试JSON解析
      try {
        const parsed = JSON.parse(qrData)
        if (this.validateQRFormat(qrData)) {
          return parsed
        }
      } catch (e) {
        // JSON解析失败，检查是否为简单ID
        const simpleId = qrData.trim()
        const validIds = ['signin', 'esports', 'coffee', 'makeup', 'sleep', 'breeze']
        
        if (validIds.includes(simpleId)) {
          return {
            checkpointId: simpleId,
            timestamp: Date.now(),
            version: '1.0',
            app: '廉洁探索之旅'
          }
        }
      }

      return null
    } catch (error) {
      console.error('解析二维码数据失败', error)
      return null
    }
  }

  /**
   * 检查二维码是否过期
   * @param {Object} qrData 二维码数据
   * @param {number} expireTime 过期时间（毫秒）
   * @returns {boolean} 是否过期
   */
  isQRExpired(qrData, expireTime = 24 * 60 * 60 * 1000) { // 默认24小时过期
    try {
      if (!qrData || !qrData.timestamp) {
        return false // 没有时间戳，认为不过期
      }

      const currentTime = Date.now()
      const qrTime = qrData.timestamp
      
      return (currentTime - qrTime) > expireTime
    } catch (error) {
      console.error('检查二维码过期时间失败', error)
      return false
    }
  }

  /**
   * 获取二维码信息
   * @param {string} qrData 二维码数据
   * @returns {Object} 二维码信息
   */
  getQRInfo(qrData) {
    try {
      const parsed = this.parseQRData(qrData)
      
      if (!parsed) {
        return {
          valid: false,
          message: '无效的二维码'
        }
      }

      const checkpointNames = {
        'signin': '寻根·霜降廉养',
        'esports': '笃行·电竞廉规',
        'coffee': '省身·啡香廉思',
        'makeup': '正容·美妆廉仪',
        'sleep': '静悟·清风入梦',
        'breeze': '沁心·清风廉饮'
      }

      return {
        valid: true,
        checkpointId: parsed.checkpointId,
        checkpointName: checkpointNames[parsed.checkpointId] || '未知点位',
        type: parsed.type || 'checkpoint',
        timestamp: parsed.timestamp,
        app: parsed.app,
        isExpired: this.isQRExpired(parsed),
        scanTime: Date.now()
      }
    } catch (error) {
      console.error('获取二维码信息失败', error)
      return {
        valid: false,
        message: '解析二维码失败'
      }
    }
  }

  /**
   * 生成二维码分享链接
   * @param {string} checkpointId 打卡点ID
   * @returns {string} 分享链接
   */
  generateShareLink(checkpointId) {
    try {
      const baseUrl = 'https://example.com/checkpoint'
      const params = new URLSearchParams({
        id: checkpointId,
        t: Date.now()
      })
      
      return `${baseUrl}?${params.toString()}`
    } catch (error) {
      console.error('生成分享链接失败', error)
      return ''
    }
  }

  /**
   * 批量生成二维码数据（用于管理后台）
   * @param {Array} checkpoints 打卡点列表
   * @returns {Object} 批量生成的二维码数据
   */
  batchGenerateQRs(checkpoints) {
    try {
      const result = {}
      
      checkpoints.forEach(checkpoint => {
        result[checkpoint.id] = {
          qrData: this.generateCheckpointQR(checkpoint.id, {
            name: checkpoint.name,
            type: checkpoint.type,
            location: checkpoint.location
          }),
          shareLink: this.generateShareLink(checkpoint.id),
          checkpoint: checkpoint
        }
      })

      return result
    } catch (error) {
      console.error('批量生成二维码失败', error)
      throw error
    }
  }

  /**
   * 导出二维码配置
   * @returns {Object} 二维码配置信息
   */
  exportConfig() {
    return {
      config: this.config,
      checkpoints: this.generateAllCheckpointQRs(),
      exportTime: Date.now(),
      version: '1.0'
    }
  }
}

// 创建单例实例
const qrcode = new QRCode()

// 导出
module.exports = { qrcode }
