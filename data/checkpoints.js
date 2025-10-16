// data/checkpoints.js

/**
 * 打卡点配置数据
 */
const CHECKPOINTS_DATA = [
  {
    id: 'signin',
    name: '寻根·霜降廉养',
    area: '手工区',
    type: 'signin',
    position: { 
      lat: 30.2741, 
      lng: 120.1551,
      x: 120,   // 手工区 - 调整为适配新地图布局
      y: 180   
    },
    stampImage: '/images/stamps/signin.png',
    description: '用户在手工区扫描二维码打卡，加盖"寻根·霜降廉养"电子印章，正式开启廉洁探索之旅。',
    icon: '/images/icons/handicraft.png',
    color: '#4CAF50',
    order: 1,
    required: true,
    qrCode: 'checkpoint:signin' // 示例二维码内容
  },
  {
    id: 'esports',
    name: '笃行·电竞廉规',
    area: '电竞区',
    type: 'checkpoint',
    position: { 
      lat: 30.2742, 
      lng: 120.1552,
      x: 480,  // 电竞区 - 调整为适配新地图布局
      y: 120
    },
    stampImage: '/images/stamps/esports.png',
    description: '用户在电竞区扫描二维码打卡，加盖"笃行·电竞廉规"电子印章，强化对廉洁规则的践行意识。',
    icon: '/images/icons/esports.png',
    color: '#2196F3',
    order: 2,
    required: true,
    qrCode: 'checkpoint:esports'
  },
  {
    id: 'coffee',
    name: '省身·啡香廉思',
    area: '咖啡区',
    type: 'checkpoint',
    position: { 
      lat: 30.2743, 
      lng: 120.1553,
      x: 520,  // 咖啡区 - 调整为适配新地图布局
      y: 280
    },
    stampImage: '/images/stamps/coffee.png',
    description: '用户在咖啡区扫描二维码打卡，加盖"省身·啡香廉思"电子印章。',
    icon: '/images/icons/coffee.png',
    color: '#FF9800',
    order: 3,
    required: true,
    qrCode: 'checkpoint:coffee'
  },
  {
    id: 'makeup',
    name: '正容·美妆廉仪',
    area: '美妆区',
    type: 'checkpoint',
    position: { 
      lat: 30.2744, 
      lng: 120.1554,
      x: 180,  // 美妆区 - 调整为适配新地图布局
      y: 380
    },
    stampImage: '/images/stamps/makeup.png',
    description: '用户在美妆区扫描二维码打卡，加盖"正容·美妆廉仪"电子印章，展现廉洁风采。',
    icon: '/images/icons/makeup.png',
    color: '#E91E63',
    order: 4,
    required: true,
    qrCode: 'checkpoint:makeup'
  },
  {
    id: 'sleep',
    name: '静悟·清风入梦',
    area: '睡眠区',
    type: 'checkpoint',
    position: { 
      lat: 30.2745, 
      lng: 120.1555,
      x: 320,  // 服装区 - 调整为适配新地图布局
      y: 450
    },
    stampImage: '/images/stamps/sleep.png',
    description: '用户在睡眠区扫描二维码打卡，加盖"静悟·清风入梦"电子印章，在宁静中领悟廉洁真谛。',
    icon: '/images/icons/sleep.png',
    color: '#9C27B0',
    order: 5,
    required: true,
    qrCode: 'checkpoint:sleep'
  },
  {
    id: 'breeze',
    name: '沁心·清风廉饮',
    area: '空调区',
    type: 'checkpoint',
    position: { 
      lat: 30.2746, 
      lng: 120.1556,
      x: 80,   // 睡眠区 - 调整为适配新地图布局
      y: 320
    },
    stampImage: '/images/stamps/breeze.png',
    description: '用户在清风区扫描二维码打卡，加盖"沁心·清风廉饮"电子印章，完成所有打卡行程。',
    icon: '/images/icons/breeze.png',
    color: '#00BCD4',
    order: 6,
    required: true,
    qrCode: 'checkpoint:breeze'
  }
]

/**
 * 打卡点工具类
 */
class CheckpointsUtils {
  constructor() {
    this.checkpoints = CHECKPOINTS_DATA
  }

  /**
   * 获取所有打卡点
   */
  getAllCheckpoints() {
    return this.checkpoints
  }

  /**
   * 根据ID获取打卡点
   */
  getCheckpointById(id) {
    return this.checkpoints.find(checkpoint => checkpoint.id === id)
  }

  /**
   * 获取签到点
   */
  getSigninCheckpoint() {
    return this.checkpoints.find(checkpoint => checkpoint.type === 'signin')
  }

  /**
   * 获取普通打卡点
   */
  getCheckpointList() {
    return this.checkpoints.filter(checkpoint => checkpoint.type === 'checkpoint')
  }

  /**
   * 根据类型获取打卡点
   */
  getCheckpointsByType(type) {
    return this.checkpoints.filter(checkpoint => checkpoint.type === type)
  }

  /**
   * 获取地图标记点
   */
  getMapMarkers(completedStamps = []) {
    // 为兼容<map>组件要求（若有页面仍在使用），确保 marker.id 为 Number
    return this.checkpoints.map((checkpoint, index) => ({
      id: index + 1, // 数字类型
      latitude: checkpoint.position.lat,
      longitude: checkpoint.position.lng,
      iconPath: completedStamps.includes(checkpoint.id)
        ? '/images/icons/completed.png'
        : '/images/icons/pending.png',
      width: 40,
      height: 40,
      callout: {
        content: checkpoint.name,
        color: completedStamps.includes(checkpoint.id) ? '#4CAF50' : '#FF9800',
        fontSize: 24,
        borderRadius: 8,
        bgColor: 'white',
        padding: 8,
        display: 'BYCLICK'
      }
    }))
  }

  /**
   * 获取打卡点统计信息
   */
  getCheckpointsStatistics(completedStamps = []) {
    const total = this.checkpoints.length
    const completed = completedStamps.length
    const remaining = total - completed
    const completionRate = total > 0 ? (completed / total * 100).toFixed(1) : 0

    return {
      total,
      completed,
      remaining,
      completionRate: parseFloat(completionRate)
    }
  }

  /**
   * 获取下一个可打卡的点位
   */
  getNextAvailableCheckpoint(completedStamps = [], isSignedIn = false) {
    // 如果未签到，返回签到点
    if (!isSignedIn) {
      return this.getSigninCheckpoint()
    }

    // 如果已签到，返回第一个未完成的点位
    return this.checkpoints.find(checkpoint => 
      !completedStamps.includes(checkpoint.id) && checkpoint.type === 'checkpoint'
    )
  }

  /**
   * 获取打卡进度详情
   */
  getProgressDetails(completedStamps = []) {
    const progress = this.checkpoints.map(checkpoint => ({
      ...checkpoint,
      isCompleted: completedStamps.includes(checkpoint.id),
      completionTime: this.getCompletionTime(checkpoint.id)
    }))

    return {
      all: progress,
      completed: progress.filter(p => p.isCompleted),
      pending: progress.filter(p => !p.isCompleted),
      statistics: this.getCheckpointsStatistics(completedStamps)
    }
  }

  /**
   * 获取完成时间（模拟数据）
   */
  getCompletionTime(checkpointId) {
    // 这里可以从存储中获取真实的完成时间
    // 暂时返回模拟数据
    const now = new Date()
    const offset = Math.floor(Math.random() * 3600000) // 随机1小时内
    return new Date(now.getTime() - offset).toLocaleString()
  }

  /**
   * 验证打卡点ID
   */
  isValidCheckpointId(id) {
    return this.checkpoints.some(checkpoint => checkpoint.id === id)
  }

  /**
   * 获取打卡点颜色
   */
  getCheckpointColor(id) {
    const checkpoint = this.getCheckpointById(id)
    return checkpoint ? checkpoint.color : '#666666'
  }

  /**
   * 获取打卡点图标
   */
  getCheckpointIcon(id) {
    const checkpoint = this.getCheckpointById(id)
    return checkpoint ? checkpoint.icon : '/images/icons/default.png'
  }

  /**
   * 生成二维码内容
   */
  generateQRCodeContent(id) {
    const checkpoint = this.getCheckpointById(id)
    return checkpoint ? checkpoint.qrCode : null
  }

  /**
   * 解析二维码内容
   */
  parseQRCodeContent(qrContent) {
    // 支持多种格式
    if (qrContent.includes(':')) {
      const parts = qrContent.split(':')
      if (parts[0] === 'checkpoint') {
        return parts[1]
      }
    }
    
    // 直接是ID
    if (this.isValidCheckpointId(qrContent)) {
      return qrContent
    }
    
    return null
  }

  /**
   * 获取打卡点排序
   */
  getSortedCheckpoints(sortBy = 'order') {
    return [...this.checkpoints].sort((a, b) => {
      if (sortBy === 'order') {
        return a.order - b.order
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name)
      } else if (sortBy === 'area') {
        return a.area.localeCompare(b.area)
      }
      return 0
    })
  }

  /**
   * 搜索打卡点
   */
  searchCheckpoints(keyword) {
    if (!keyword) return this.checkpoints
    
    const lowerKeyword = keyword.toLowerCase()
    return this.checkpoints.filter(checkpoint => 
      checkpoint.name.toLowerCase().includes(lowerKeyword) ||
      checkpoint.area.toLowerCase().includes(lowerKeyword) ||
      checkpoint.description.toLowerCase().includes(lowerKeyword)
    )
  }
}

// 创建单例实例
const checkpointsUtils = new CheckpointsUtils()

module.exports = {
  CHECKPOINTS_DATA,
  checkpointsUtils
}