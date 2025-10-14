// utils/common.js
// 公共工具函数

/**
 * 格式化时间
 * @param {Date|number} date 时间对象或时间戳
 * @param {string} format 格式字符串
 * @returns {string} 格式化后的时间字符串
 */
function formatTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return ''
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  const second = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second)
}

/**
 * 防抖函数
 * @param {Function} func 要防抖的函数
 * @param {number} delay 延迟时间
 * @returns {Function} 防抖后的函数
 */
function debounce(func, delay = 300) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}

/**
 * 节流函数
 * @param {Function} func 要节流的函数
 * @param {number} delay 延迟时间
 * @returns {Function} 节流后的函数
 */
function throttle(func, delay = 300) {
  let lastExecTime = 0
  return function (...args) {
    const currentTime = Date.now()
    if (currentTime - lastExecTime >= delay) {
      func.apply(this, args)
      lastExecTime = currentTime
    }
  }
}

/**
 * 深拷贝对象
 * @param {*} obj 要拷贝的对象
 * @returns {*} 拷贝后的对象
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime())
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item))
  }

  if (typeof obj === 'object') {
    const clonedObj = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }

  return obj
}

/**
 * 生成随机字符串
 * @param {number} length 字符串长度
 * @returns {string} 随机字符串
 */
export function generateRandomString(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 获取设备信息
 * @returns {Object} 设备信息
 */
export function getDeviceInfo() {
  try {
    const systemInfo = wx.getSystemInfoSync()
    return {
      platform: systemInfo.platform,
      system: systemInfo.system,
      version: systemInfo.version,
      model: systemInfo.model,
      brand: systemInfo.brand,
      screenWidth: systemInfo.screenWidth,
      screenHeight: systemInfo.screenHeight,
      pixelRatio: systemInfo.pixelRatio,
      safeArea: systemInfo.safeArea
    }
  } catch (error) {
    console.error('获取设备信息失败', error)
    return {}
  }
}

/**
 * 检查网络状态
 * @returns {Promise} 网络状态
 */
export function checkNetworkStatus() {
  return new Promise((resolve, reject) => {
    wx.getNetworkType({
      success: (res) => {
        resolve({
          isConnected: res.networkType !== 'none',
          networkType: res.networkType
        })
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}

/**
 * 显示加载提示
 * @param {string} title 提示文本
 * @param {boolean} mask 是否显示遮罩
 */
export function showLoading(title = '加载中...', mask = true) {
  wx.showLoading({
    title,
    mask
  })
}

/**
 * 隐藏加载提示
 */
export function hideLoading() {
  wx.hideLoading()
}

/**
 * 显示成功提示
 * @param {string} title 提示文本
 * @param {number} duration 显示时长
 */
export function showSuccess(title = '操作成功', duration = 2000) {
  wx.showToast({
    title,
    icon: 'success',
    duration
  })
}

/**
 * 显示错误提示
 * @param {string} title 提示文本
 * @param {number} duration 显示时长
 */
export function showError(title = '操作失败', duration = 2000) {
  wx.showToast({
    title,
    icon: 'none',
    duration
  })
}

/**
 * 显示确认对话框
 * @param {string} content 对话框内容
 * @param {string} title 对话框标题
 * @returns {Promise} 用户选择结果
 */
export function showConfirm(content, title = '提示') {
  return new Promise((resolve) => {
    wx.showModal({
      title,
      content,
      success: (res) => {
        resolve(res.confirm)
      },
      fail: () => {
        resolve(false)
      }
    })
  })
}

/**
 * 页面跳转
 * @param {string} url 跳转地址
 * @param {string} type 跳转类型 (navigateTo|redirectTo|switchTab|reLaunch)
 */
export function navigateTo(url, type = 'navigateTo') {
  const navigateMethods = {
    navigateTo: wx.navigateTo,
    redirectTo: wx.redirectTo,
    switchTab: wx.switchTab,
    reLaunch: wx.reLaunch
  }

  const method = navigateMethods[type]
  if (method) {
    method({ url })
  } else {
    console.error('无效的跳转类型:', type)
  }
}

/**
 * 获取当前页面路径
 * @returns {string} 当前页面路径
 */
export function getCurrentPagePath() {
  const pages = getCurrentPages()
  if (pages.length > 0) {
    return pages[pages.length - 1].route
  }
  return ''
}

/**
 * 获取页面参数
 * @returns {Object} 页面参数
 */
export function getPageParams() {
  const pages = getCurrentPages()
  if (pages.length > 0) {
    return pages[pages.length - 1].options || {}
  }
  return {}
}

/**
 * 设置页面标题
 * @param {string} title 页面标题
 */
export function setPageTitle(title) {
  wx.setNavigationBarTitle({
    title
  })
}

/**
 * 设置页面背景色
 * @param {string} backgroundColor 背景色
 * @param {string} frontColor 前景色
 */
export function setPageBackground(backgroundColor = '#ffffff', frontColor = '#000000') {
  wx.setNavigationBarColor({
    backgroundColor,
    frontColor
  })
}

/**
 * 震动反馈
 * @param {string} type 震动类型 (light|medium|heavy)
 */
export function vibrate(type = 'medium') {
  const vibrateTypes = {
    light: 'light',
    medium: 'medium',
    heavy: 'heavy'
  }

  if (vibrateTypes[type]) {
    wx.vibrateShort({
      type: vibrateTypes[type]
    })
  }
}

/**
 * 复制到剪贴板
 * @param {string} data 要复制的数据
 * @returns {Promise} 复制结果
 */
export function copyToClipboard(data) {
  return new Promise((resolve, reject) => {
    wx.setClipboardData({
      data,
      success: () => {
        showSuccess('复制成功')
        resolve(true)
      },
      fail: (error) => {
        showError('复制失败')
        reject(error)
      }
    })
  })
}

/**
 * 保存图片到相册
 * @param {string} filePath 图片路径
 * @returns {Promise} 保存结果
 */
export function saveImageToPhotosAlbum(filePath) {
  return new Promise((resolve, reject) => {
    wx.saveImageToPhotosAlbum({
      filePath,
      success: () => {
        showSuccess('保存成功')
        resolve(true)
      },
      fail: (error) => {
        if (error.errMsg.includes('auth deny')) {
          showError('需要相册权限才能保存图片')
        } else {
          showError('保存失败')
        }
        reject(error)
      }
    })
  })
}

/**
 * 获取用户位置
 * @returns {Promise} 位置信息
 */
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        resolve({
          latitude: res.latitude,
          longitude: res.longitude,
          speed: res.speed,
          accuracy: res.accuracy
        })
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}

/**
 * 检查权限
 * @param {string} scope 权限范围
 * @returns {Promise} 权限状态
 */
export function checkAuthSetting(scope) {
  return new Promise((resolve) => {
    wx.getSetting({
      success: (res) => {
        resolve(res.authSetting[scope])
      },
      fail: () => {
        resolve(false)
      }
    })
  })
}

/**
 * 请求权限
 * @param {string} scope 权限范围
 * @returns {Promise} 权限请求结果
 */
export function requestAuth(scope) {
  return new Promise((resolve, reject) => {
    wx.authorize({
      scope,
      success: () => {
        resolve(true)
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}

/**
 * 日志记录
 * @param {string} level 日志级别
 * @param {string} message 日志消息
 * @param {*} data 附加数据
 */
export function log(level, message, data = null) {
  const timestamp = formatTime(new Date())
  const logData = {
    timestamp,
    level,
    message,
    data,
    page: getCurrentPagePath(),
    userAgent: getDeviceInfo()
  }

  console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`, logData)
}

/**
 * 错误处理
 * @param {Error} error 错误对象
 * @param {string} context 错误上下文
 */
export function handleError(error, context = '') {
  log('error', `错误发生在: ${context}`, {
    message: error.message,
    stack: error.stack,
    name: error.name
  })

  showError(`操作失败: ${error.message}`)
}

/**
 * 性能监控
 * @param {string} name 监控名称
 * @param {Function} fn 要监控的函数
 * @returns {Function} 监控后的函数
 */
function performanceMonitor(name, fn) {
  return function (...args) {
    const startTime = Date.now()
    const result = fn.apply(this, args)
    const endTime = Date.now()
    
    log('performance', `${name} 执行时间: ${endTime - startTime}ms`)
    
    return result
  }
}

// 导出所有函数
module.exports = {
  formatTime,
  debounce,
  throttle,
  deepClone,
  generateRandomString,
  getDeviceInfo,
  checkNetworkStatus,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  showConfirm,
  navigateTo,
  getCurrentPagePath,
  getPageParams,
  setPageTitle,
  setPageBackground,
  vibrate,
  copyToClipboard,
  saveImageToPhotosAlbum,
  getCurrentLocation,
  checkAuthSetting,
  requestAuth,
  log,
  handleError,
  performanceMonitor
}
