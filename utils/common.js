// utils/common.js

/**
 * 公共工具函数
 */
class CommonUtils {
  constructor() {
    this.DEBUG = false // 调试模式
  }

  /**
   * 开启调试模式
   */
  enableDebug() {
    this.DEBUG = true
  }

  /**
   * 调试日志
   */
  debug(...args) {
    if (this.DEBUG) {
      console.log('[DEBUG]', ...args)
    }
  }

  /**
   * 错误日志
   */
  error(...args) {
    console.error('[ERROR]', ...args)
  }

  /**
   * 信息日志
   */
  info(...args) {
    console.info('[INFO]', ...args)
  }

  /**
   * 警告日志
   */
  warn(...args) {
    console.warn('[WARN]', ...args)
  }

  /**
   * 格式化时间
   */
  formatTime(timestamp, format = 'YYYY-MM-DD HH:mm:ss') {
    if (!timestamp) return ''
    
    const date = new Date(timestamp)
    if (isNaN(date.getTime())) return ''

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds)
  }

  /**
   * 相对时间格式化
   */
  formatRelativeTime(timestamp) {
    if (!timestamp) return ''
    
    const now = Date.now()
    const diff = now - timestamp
    
    if (diff < 60000) { // 1分钟内
      return '刚刚'
    } else if (diff < 3600000) { // 1小时内
      const minutes = Math.floor(diff / 60000)
      return `${minutes}分钟前`
    } else if (diff < 86400000) { // 1天内
      const hours = Math.floor(diff / 3600000)
      return `${hours}小时前`
    } else if (diff < 2592000000) { // 30天内
      const days = Math.floor(diff / 86400000)
      return `${days}天前`
    } else {
      return this.formatTime(timestamp, 'MM-DD')
    }
  }

  /**
   * 显示Toast提示
   */
  showToast(title, icon = 'none', duration = 2000) {
    wx.showToast({
      title: title,
      icon: icon,
      duration: duration
    })
  }

  /**
   * 显示加载提示
   */
  showLoading(title = '加载中...') {
    wx.showLoading({
      title: title,
      mask: true
    })
  }

  /**
   * 隐藏加载提示
   */
  hideLoading() {
    wx.hideLoading()
  }

  /**
   * 显示模态对话框
   */
  showModal(options) {
    return new Promise((resolve, reject) => {
      wx.showModal({
        title: options.title || '提示',
        content: options.content || '',
        showCancel: options.showCancel !== false,
        cancelText: options.cancelText || '取消',
        confirmText: options.confirmText || '确定',
        success: (res) => {
          resolve(res)
        },
        fail: (error) => {
          reject(error)
        }
      })
    })
  }

  /**
   * 显示操作菜单
   */
  showActionSheet(itemList) {
    return new Promise((resolve, reject) => {
      wx.showActionSheet({
        itemList: itemList,
        success: (res) => {
          resolve(res)
        },
        fail: (error) => {
          reject(error)
        }
      })
    })
  }

  /**
   * 页面跳转
   */
  navigateTo(url) {
    wx.navigateTo({ url })
  }

  /**
   * 页面重定向
   */
  redirectTo(url) {
    wx.redirectTo({ url })
  }

  /**
   * 切换Tab
   */
  switchTab(url) {
    wx.switchTab({ url })
  }

  /**
   * 返回上一页
   */
  navigateBack(delta = 1) {
    wx.navigateBack({ delta })
  }

  /**
   * 生成唯一ID
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  /**
   * 防抖函数
   */
  debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  /**
   * 节流函数
   */
  throttle(func, limit) {
    let inThrottle
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }

  /**
   * 深拷贝对象
   */
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj
    if (obj instanceof Date) return new Date(obj.getTime())
    if (obj instanceof Array) return obj.map(item => this.deepClone(item))
    if (typeof obj === 'object') {
      const clonedObj = {}
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = this.deepClone(obj[key])
        }
      }
      return clonedObj
    }
  }

  /**
   * 获取系统信息
   */
  getSystemInfo() {
    return new Promise((resolve, reject) => {
      wx.getSystemInfo({
        success: (res) => {
          resolve(res)
        },
        fail: (error) => {
          reject(error)
        }
      })
    })
  }

  /**
   * 检查网络状态
   */
  getNetworkType() {
    return new Promise((resolve, reject) => {
      wx.getNetworkType({
        success: (res) => {
          resolve(res)
        },
        fail: (error) => {
          reject(error)
        }
      })
    })
  }

  /**
   * 设置剪贴板
   */
  setClipboardData(data) {
    return new Promise((resolve, reject) => {
      wx.setClipboardData({
        data: data,
        success: (res) => {
          resolve(res)
        },
        fail: (error) => {
          reject(error)
        }
      })
    })
  }

  /**
   * 获取剪贴板数据
   */
  getClipboardData() {
    return new Promise((resolve, reject) => {
      wx.getClipboardData({
        success: (res) => {
          resolve(res)
        },
        fail: (error) => {
          reject(error)
        }
      })
    })
  }

  /**
   * 震动反馈
   */
  vibrateShort() {
    wx.vibrateShort()
  }

  /**
   * 长震动反馈
   */
  vibrateLong() {
    wx.vibrateLong()
  }

  /**
   * 创建动画
   */
  createAnimation(options = {}) {
    const defaultOptions = {
      duration: 300,
      timingFunction: 'ease',
      delay: 0,
      transformOrigin: '50% 50% 0'
    }
    
    return wx.createAnimation({
      ...defaultOptions,
      ...options
    })
  }

  /**
   * 检查是否为有效URL
   */
  isValidUrl(url) {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  /**
   * 检查是否为有效邮箱
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * 检查是否为有效手机号
   */
  isValidPhone(phone) {
    const phoneRegex = /^1[3-9]\d{9}$/
    return phoneRegex.test(phone)
  }

  /**
   * 生成随机字符串
   */
  randomString(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  /**
   * 数组去重
   */
  uniqueArray(arr) {
    return [...new Set(arr)]
  }

  /**
   * 对象转URL参数
   */
  objectToUrlParams(obj) {
    return Object.keys(obj)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
      .join('&')
  }

  /**
   * URL参数转对象
   */
  urlParamsToObject(params) {
    const obj = {}
    params.split('&').forEach(param => {
      const [key, value] = param.split('=')
      if (key && value) {
        obj[decodeURIComponent(key)] = decodeURIComponent(value)
      }
    })
    return obj
  }
}

// 创建单例实例
const commonUtils = new CommonUtils()

module.exports = commonUtils