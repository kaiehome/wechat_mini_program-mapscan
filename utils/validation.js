// utils/validation.js

/**
 * 验证工具类
 */
class Validation {
  constructor() {
    // 打卡点配置
    this.CHECKPOINTS = {
      signin: {
        name: '寻根·霜降廉养',
        type: 'signin',
        required: true,
        order: 1
      },
      esports: {
        name: '笃行·电竞廉规',
        type: 'checkpoint',
        required: true,
        order: 2
      },
      coffee: {
        name: '省身·啡香廉思',
        type: 'checkpoint',
        required: true,
        order: 3
      },
      makeup: {
        name: '正容·美妆廉仪',
        type: 'checkpoint',
        required: true,
        order: 4
      },
      sleep: {
        name: '静悟·清风入梦',
        type: 'checkpoint',
        required: true,
        order: 5
      },
      breeze: {
        name: '沁心·清风廉饮',
        type: 'checkpoint',
        required: true,
        order: 6
      }
    }

    // 验证规则
    this.VALIDATION_RULES = {
      // 用户进度验证
      userProgress: {
        isSignedIn: { type: 'boolean', required: true },
        completedStamps: { type: 'array', required: true },
        totalStamps: { type: 'number', required: true, min: 0, max: 6 },
        completionStatus: { type: 'boolean', required: true }
      },

      // 打卡点验证
      checkpoint: {
        id: { type: 'string', required: true },
        name: { type: 'string', required: true },
        area: { type: 'string', required: true },
        type: { type: 'string', required: true, enum: ['signin', 'checkpoint'] },
        position: { type: 'object', required: true },
        stampImage: { type: 'string', required: true }
      }
    }
  }

  /**
   * 验证用户进度数据
   */
  validateUserProgress(progress) {
    const errors = []

    // 检查必需字段
    if (!progress || typeof progress !== 'object') {
      errors.push('用户进度数据无效')
      return { valid: false, errors }
    }

    // 验证各个字段
    const rules = this.VALIDATION_RULES.userProgress
    for (const [field, rule] of Object.entries(rules)) {
      const error = this.validateField(progress[field], rule, field)
      if (error) {
        errors.push(error)
      }
    }

    // 验证业务逻辑
    const businessErrors = this.validateBusinessLogic(progress)
    errors.push(...businessErrors)

    return {
      valid: errors.length === 0,
      errors: errors
    }
  }

  /**
   * 验证打卡点数据
   */
  validateCheckpoint(checkpoint) {
    const errors = []

    if (!checkpoint || typeof checkpoint !== 'object') {
      errors.push('打卡点数据无效')
      return { valid: false, errors }
    }

    const rules = this.VALIDATION_RULES.checkpoint
    for (const [field, rule] of Object.entries(rules)) {
      const error = this.validateField(checkpoint[field], rule, field)
      if (error) {
        errors.push(error)
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors
    }
  }

  /**
   * 验证单个字段
   */
  validateField(value, rule, fieldName) {
    // 检查必需字段
    if (rule.required && (value === undefined || value === null)) {
      return `${fieldName} 是必需字段`
    }

    // 如果值为空且不是必需的，跳过其他验证
    if (value === undefined || value === null) {
      return null
    }

    // 类型验证
    if (rule.type && !this.checkType(value, rule.type)) {
      return `${fieldName} 类型错误，期望 ${rule.type}`
    }

    // 枚举验证
    if (rule.enum && !rule.enum.includes(value)) {
      return `${fieldName} 值无效，允许的值: ${rule.enum.join(', ')}`
    }

    // 数值范围验证
    if (rule.type === 'number') {
      if (rule.min !== undefined && value < rule.min) {
        return `${fieldName} 不能小于 ${rule.min}`
      }
      if (rule.max !== undefined && value > rule.max) {
        return `${fieldName} 不能大于 ${rule.max}`
      }
    }

    // 字符串长度验证
    if (rule.type === 'string' && rule.minLength !== undefined && value.length < rule.minLength) {
      return `${fieldName} 长度不能少于 ${rule.minLength} 个字符`
    }
    if (rule.type === 'string' && rule.maxLength !== undefined && value.length > rule.maxLength) {
      return `${fieldName} 长度不能超过 ${rule.maxLength} 个字符`
    }

    // 数组长度验证
    if (rule.type === 'array') {
      if (rule.minLength !== undefined && value.length < rule.minLength) {
        return `${fieldName} 数组长度不能少于 ${rule.minLength}`
      }
      if (rule.maxLength !== undefined && value.length > rule.maxLength) {
        return `${fieldName} 数组长度不能超过 ${rule.maxLength}`
      }
    }

    return null
  }

  /**
   * 检查数据类型
   */
  checkType(value, expectedType) {
    const actualType = Array.isArray(value) ? 'array' : typeof value
    return actualType === expectedType
  }

  /**
   * 验证业务逻辑
   */
  validateBusinessLogic(progress) {
    const errors = []

    // 验证已完成印章数量
    if (progress.completedStamps.length > progress.totalStamps) {
      errors.push('已完成印章数量不能超过总数')
    }

    // 验证签到状态与印章一致性
    const hasSigninStamp = progress.completedStamps.includes('signin')
    if (progress.isSignedIn && !hasSigninStamp) {
      errors.push('签到状态与印章记录不一致')
    }

    // 验证完成状态
    const expectedCompletion = progress.completedStamps.length === progress.totalStamps
    if (progress.completionStatus !== expectedCompletion) {
      errors.push('完成状态计算错误')
    }

    // 验证印章ID有效性
    const validIds = Object.keys(this.CHECKPOINTS)
    for (const stampId of progress.completedStamps) {
      if (!validIds.includes(stampId)) {
        errors.push(`无效的印章ID: ${stampId}`)
      }
    }

    return errors
  }

  /**
   * 验证扫码权限
   */
  validateScanPermission(checkpointId, userProgress) {
    const errors = []

    // 检查打卡点是否存在
    if (!this.CHECKPOINTS[checkpointId]) {
      errors.push(`无效的打卡点ID: ${checkpointId}`)
      return { valid: false, errors }
    }

    // 检查是否已打卡
    if (userProgress.completedStamps.includes(checkpointId)) {
      errors.push('您已经完成该点位的打卡')
      return { valid: false, errors }
    }

    // 检查签到要求
    const checkpoint = this.CHECKPOINTS[checkpointId]
    if (checkpoint.type === 'checkpoint' && !userProgress.isSignedIn) {
      errors.push('请首先完成签到')
      return { valid: false, errors }
    }

    return { valid: true, errors: [] }
  }

  /**
   * 验证扫码结果
   */
  validateScanResult(scanResult) {
    const errors = []

    if (!scanResult) {
      errors.push('扫码结果为空')
      return { valid: false, errors }
    }

    if (typeof scanResult !== 'string') {
      errors.push('扫码结果格式错误')
      return { valid: false, errors }
    }

    if (scanResult.trim().length === 0) {
      errors.push('扫码结果内容为空')
      return { valid: false, errors }
    }

    return { valid: true, errors: [] }
  }

  /**
   * 验证位置数据
   */
  validatePosition(position) {
    const errors = []

    if (!position || typeof position !== 'object') {
      errors.push('位置数据无效')
      return { valid: false, errors }
    }

    if (typeof position.lat !== 'number' || typeof position.lng !== 'number') {
      errors.push('位置坐标格式错误')
      return { valid: false, errors }
    }

    if (position.lat < -90 || position.lat > 90) {
      errors.push('纬度值超出范围 (-90 到 90)')
    }

    if (position.lng < -180 || position.lng > 180) {
      errors.push('经度值超出范围 (-180 到 180)')
    }

    return { valid: errors.length === 0, errors }
  }

  /**
   * 清理和标准化数据
   */
  sanitizeUserProgress(progress) {
    if (!progress) return this.getDefaultProgress()

    return {
      isSignedIn: Boolean(progress.isSignedIn),
      completedStamps: Array.isArray(progress.completedStamps) ? progress.completedStamps : [],
      totalStamps: Number(progress.totalStamps) || 6,
      completionStatus: Boolean(progress.completionStatus),
      completionTimes: progress.completionTimes || {},
      createTime: Number(progress.createTime) || Date.now(),
      lastUpdateTime: Date.now()
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
}

// 创建单例实例
const validation = new Validation()

module.exports = validation