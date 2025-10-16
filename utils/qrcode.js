// utils/qrcode.js

/**
 * 二维码处理工具类
 */
class QRCodeUtils {
  constructor() {
    // 二维码内容格式定义
    this.QR_FORMATS = {
      CHECKPOINT: 'checkpoint',  // 标准格式: checkpoint:id
      DIRECT: 'direct',          // 直接格式: id
      JSON: 'json'              // JSON格式: {"type":"checkpoint","id":"signin"}
    }

    // 支持的打卡点ID列表
    this.VALID_CHECKPOINT_IDS = [
      'signin',    // 签到点
      'esports',   // 电竞区
      'coffee',    // 咖啡区
      'makeup',    // 美妆区
      'sleep',     // 睡眠区
      'breeze'     // 清风区
    ]
  }

  /**
   * 解析二维码内容
   */
  parseQRCode(qrContent) {
    if (!qrContent || typeof qrContent !== 'string') {
      return this.createErrorResult('无效的二维码内容')
    }

    try {
      // 尝试JSON格式解析
      if (this.isJSONFormat(qrContent)) {
        return this.parseJSONFormat(qrContent)
      }

      // 尝试标准格式解析
      if (this.isStandardFormat(qrContent)) {
        return this.parseStandardFormat(qrContent)
      }

      // 尝试直接格式解析
      if (this.isDirectFormat(qrContent)) {
        return this.parseDirectFormat(qrContent)
      }

      return this.createErrorResult('不支持的二维码格式')

    } catch (error) {
      console.error('解析二维码失败:', error)
      return this.createErrorResult('解析二维码时发生错误')
    }
  }

  /**
   * 检查是否为JSON格式
   */
  isJSONFormat(content) {
    try {
      const parsed = JSON.parse(content)
      return parsed && typeof parsed === 'object'
    } catch {
      return false
    }
  }

  /**
   * 解析JSON格式
   */
  parseJSONFormat(content) {
    try {
      const data = JSON.parse(content)
      
      if (data.type === 'checkpoint' && data.id) {
        return this.validateCheckpoint(data.id)
      }
      
      return this.createErrorResult('无效的JSON格式')
    } catch (error) {
      return this.createErrorResult('JSON解析失败')
    }
  }

  /**
   * 检查是否为标准格式 (checkpoint:id)
   */
  isStandardFormat(content) {
    return content.includes(':') && content.split(':').length === 2
  }

  /**
   * 解析标准格式
   */
  parseStandardFormat(content) {
    const parts = content.split(':')
    const type = parts[0].toLowerCase()
    const id = parts[1]

    if (type === 'checkpoint') {
      return this.validateCheckpoint(id)
    }

    return this.createErrorResult('不支持的二维码类型')
  }

  /**
   * 检查是否为直接格式 (直接是ID)
   */
  isDirectFormat(content) {
    return this.VALID_CHECKPOINT_IDS.includes(content.toLowerCase())
  }

  /**
   * 解析直接格式
   */
  parseDirectFormat(content) {
    return this.validateCheckpoint(content)
  }

  /**
   * 验证打卡点ID
   */
  validateCheckpoint(checkpointId) {
    const id = checkpointId.toLowerCase().trim()
    
    if (!this.VALID_CHECKPOINT_IDS.includes(id)) {
      return this.createErrorResult(`无效的打卡点ID: ${checkpointId}`)
    }

    return this.createSuccessResult({
      type: 'checkpoint',
      id: id,
      format: this.detectFormat(checkpointId)
    })
  }

  /**
   * 检测二维码格式
   */
  detectFormat(content) {
    if (this.isJSONFormat(content)) return this.QR_FORMATS.JSON
    if (this.isStandardFormat(content)) return this.QR_FORMATS.CHECKPOINT
    if (this.isDirectFormat(content)) return this.QR_FORMATS.DIRECT
    return 'unknown'
  }

  /**
   * 生成二维码内容
   */
  generateQRContent(checkpointId, format = this.QR_FORMATS.STANDARD) {
    if (!this.VALID_CHECKPOINT_IDS.includes(checkpointId)) {
      throw new Error('无效的打卡点ID')
    }

    switch (format) {
      case this.QR_FORMATS.CHECKPOINT:
        return `checkpoint:${checkpointId}`
      
      case this.QR_FORMATS.JSON:
        return JSON.stringify({
          type: 'checkpoint',
          id: checkpointId,
          timestamp: Date.now(),
          app: 'wechat_mini_program-mapscan'
        })
      
      case this.QR_FORMATS.DIRECT:
        return checkpointId
      
      default:
        return `checkpoint:${checkpointId}`
    }
  }

  /**
   * 创建成功结果
   */
  createSuccessResult(data) {
    return {
      success: true,
      data: data,
      error: null
    }
  }

  /**
   * 创建错误结果
   */
  createErrorResult(message) {
    return {
      success: false,
      data: null,
      error: message
    }
  }

  /**
   * 获取打卡点信息
   */
  getCheckpointInfo(checkpointId) {
    const checkpointMap = {
      signin: {
        name: '寻根·霜降廉养',
        area: '手工区',
        description: '用户在手工区扫描二维码打卡，加盖"寻根·霜降廉养"电子印章，正式开启廉洁探索之旅。'
      },
      esports: {
        name: '笃行·电竞廉规',
        area: '电竞区',
        description: '用户在电竞区扫描二维码打卡，加盖"笃行·电竞廉规"电子印章，强化对廉洁规则的践行意识。'
      },
      coffee: {
        name: '省身·啡香廉思',
        area: '咖啡区',
        description: '用户在咖啡区扫描二维码打卡，加盖"省身·啡香廉思"电子印章。'
      },
      makeup: {
        name: '正容·美妆廉仪',
        area: '美妆区',
        description: '用户在美妆区扫描二维码打卡，加盖"正容·美妆廉仪"电子印章，展现廉洁风采。'
      },
      sleep: {
        name: '静悟·清风入梦',
        area: '睡眠区',
        description: '用户在睡眠区扫描二维码打卡，加盖"静悟·清风入梦"电子印章，在宁静中领悟廉洁真谛。'
      },
      breeze: {
        name: '沁心·清风廉饮',
        area: '空调区',
        description: '用户在清风区扫描二维码打卡，加盖"沁心·清风廉饮"电子印章，完成所有打卡行程。'
      }
    }

    return checkpointMap[checkpointId] || null
  }

  /**
   * 验证用户是否可以扫描该二维码
   */
  validateScanPermission(checkpointId, userProgress) {
    // 如果已扫描过该点位
    if (userProgress.completedStamps.includes(checkpointId)) {
      return {
        valid: false,
        message: '您已经完成该点位的打卡'
      }
    }

    // 如果扫描的不是签到点，但用户未签到
    if (checkpointId !== 'signin' && !userProgress.isSignedIn) {
      return {
        valid: false,
        message: '请首先扫描签到二维码完成签到'
      }
    }

    return {
      valid: true,
      message: '可以扫描'
    }
  }
}

// 创建单例实例
const qrCodeUtils = new QRCodeUtils()

module.exports = qrCodeUtils