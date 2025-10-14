// data/checkpoints.js
// 打卡点配置数据

const checkpoints = [
  {
    id: 'signin',
    name: '寻根·霜降廉养',
    type: 'signin',
    description: '用户手机扫描第一个二维码完成线上打卡，加盖"寻根·霜降廉养"电子印章，正式开启廉洁探索之旅。',
    position: {
      lat: 39.908823,
      lng: 116.397470
    },
    stampImage: '/images/stamps/signin.png',
    color: '#4CAF50',
    icon: '/images/icons/signin.png',
    order: 1,
    isRequired: true,
    unlockCondition: null
  },
  {
    id: 'esports',
    name: '笃行·电竞廉规',
    type: 'checkpoint',
    description: '用户在电竞区扫描二维码打卡，加盖"笃行·电竞廉规"电子印章，强化对廉洁规则的践行意识。',
    position: {
      lat: 39.908923,
      lng: 116.397570
    },
    stampImage: '/images/stamps/esports.png',
    color: '#FF9800',
    icon: '/images/icons/esports.png',
    order: 2,
    isRequired: true,
    unlockCondition: 'signin'
  },
  {
    id: 'coffee',
    name: '省身·啡香廉思',
    type: 'checkpoint',
    description: '用户在咖啡区扫描二维码打卡，加盖"省身·啡香廉思"电子印章。',
    position: {
      lat: 39.909023,
      lng: 116.397670
    },
    stampImage: '/images/stamps/coffee.png',
    color: '#9C27B0',
    icon: '/images/icons/coffee.png',
    order: 3,
    isRequired: true,
    unlockCondition: 'signin'
  },
  {
    id: 'makeup',
    name: '正容·美妆廉仪',
    type: 'checkpoint',
    description: '用户在美妆区扫描二维码打卡，加盖"正容·美妆廉仪"电子印章，展现廉洁风采。',
    position: {
      lat: 39.909123,
      lng: 116.397770
    },
    stampImage: '/images/stamps/makeup.png',
    color: '#E91E63',
    icon: '/images/icons/makeup.png',
    order: 4,
    isRequired: true,
    unlockCondition: 'signin'
  },
  {
    id: 'sleep',
    name: '静悟·清风入梦',
    type: 'checkpoint',
    description: '用户在睡眠区扫描二维码打卡，加盖"静悟·清风入梦"电子印章，在宁静中领悟廉洁真谛。',
    position: {
      lat: 39.909223,
      lng: 116.397870
    },
    stampImage: '/images/stamps/sleep.png',
    color: '#2196F3',
    icon: '/images/icons/sleep.png',
    order: 5,
    isRequired: true,
    unlockCondition: 'signin'
  },
  {
    id: 'breeze',
    name: '沁心·清风廉饮',
    type: 'checkpoint',
    description: '用户在清风区扫描二维码打卡，加盖"沁心·清风廉饮"电子印章，完成所有打卡行程。',
    position: {
      lat: 39.909323,
      lng: 116.397970
    },
    stampImage: '/images/stamps/breeze.png',
    color: '#00BCD4',
    icon: '/images/icons/breeze.png',
    order: 6,
    isRequired: true,
    unlockCondition: 'signin'
  }
]

// 打卡点工具函数
const checkpointUtils = {
  /**
   * 根据ID获取打卡点信息
   * @param {string} checkpointId 打卡点ID
   * @returns {Object|null} 打卡点信息
   */
  getCheckpointById(checkpointId) {
    return checkpoints.find(checkpoint => checkpoint.id === checkpointId) || null
  },

  /**
   * 获取所有打卡点
   * @returns {Array} 打卡点列表
   */
  getAllCheckpoints() {
    return checkpoints
  },

  /**
   * 获取签到点
   * @returns {Object|null} 签到点信息
   */
  getSigninCheckpoint() {
    return checkpoints.find(checkpoint => checkpoint.type === 'signin') || null
  },

  /**
   * 获取普通打卡点
   * @returns {Array} 普通打卡点列表
   */
  getRegularCheckpoints() {
    return checkpoints.filter(checkpoint => checkpoint.type === 'checkpoint')
  },

  /**
   * 根据类型获取打卡点
   * @param {string} type 打卡点类型
   * @returns {Array} 打卡点列表
   */
  getCheckpointsByType(type) {
    return checkpoints.filter(checkpoint => checkpoint.type === type)
  },

  /**
   * 获取地图中心点
   * @returns {Object} 地图中心坐标
   */
  getMapCenter() {
    if (checkpoints.length === 0) {
      return { lat: 39.908823, lng: 116.397470 }
    }

    const totalLat = checkpoints.reduce((sum, checkpoint) => sum + checkpoint.position.lat, 0)
    const totalLng = checkpoints.reduce((sum, checkpoint) => sum + checkpoint.position.lng, 0)
    
    return {
      lat: totalLat / checkpoints.length,
      lng: totalLng / checkpoints.length
    }
  },

  /**
   * 获取地图边界
   * @returns {Object} 地图边界
   */
  getMapBounds() {
    if (checkpoints.length === 0) {
      return {
        north: 39.908823,
        south: 39.908823,
        east: 116.397470,
        west: 116.397470
      }
    }

    const lats = checkpoints.map(cp => cp.position.lat)
    const lngs = checkpoints.map(cp => cp.position.lng)

    return {
      north: Math.max(...lats),
      south: Math.min(...lats),
      east: Math.max(...lngs),
      west: Math.min(...lngs)
    }
  },

  /**
   * 验证打卡点ID是否有效
   * @param {string} checkpointId 打卡点ID
   * @returns {boolean} 是否有效
   */
  isValidCheckpointId(checkpointId) {
    return checkpoints.some(checkpoint => checkpoint.id === checkpointId)
  },

  /**
   * 获取打卡点颜色
   * @param {string} checkpointId 打卡点ID
   * @returns {string} 颜色值
   */
  getCheckpointColor(checkpointId) {
    const checkpoint = this.getCheckpointById(checkpointId)
    return checkpoint ? checkpoint.color : '#666666'
  },

  /**
   * 获取打卡点图标
   * @param {string} checkpointId 打卡点ID
   * @returns {string} 图标路径
   */
  getCheckpointIcon(checkpointId) {
    const checkpoint = this.getCheckpointById(checkpointId)
    return checkpoint ? checkpoint.icon : '/images/icons/default.png'
  },

  /**
   * 获取打卡点印章图片
   * @param {string} checkpointId 打卡点ID
   * @returns {string} 印章图片路径
   */
  getCheckpointStampImage(checkpointId) {
    const checkpoint = this.getCheckpointById(checkpointId)
    return checkpoint ? checkpoint.stampImage : '/images/stamps/default.png'
  },

  /**
   * 检查解锁条件
   * @param {string} checkpointId 打卡点ID
   * @param {Array} completedStamps 已完成的印章列表
   * @returns {boolean} 是否已解锁
   */
  isUnlocked(checkpointId, completedStamps) {
    const checkpoint = this.getCheckpointById(checkpointId)
    if (!checkpoint) return false

    // 签到点始终解锁
    if (checkpoint.type === 'signin') return true

    // 检查解锁条件
    if (checkpoint.unlockCondition) {
      return completedStamps.includes(checkpoint.unlockCondition)
    }

    return true
  },

  /**
   * 获取下一个可解锁的打卡点
   * @param {Array} completedStamps 已完成的印章列表
   * @returns {Object|null} 下一个打卡点
   */
  getNextUnlockedCheckpoint(completedStamps) {
    for (const checkpoint of checkpoints) {
      if (!completedStamps.includes(checkpoint.id) && this.isUnlocked(checkpoint.id, completedStamps)) {
        return checkpoint
      }
    }
    return null
  },

  /**
   * 获取推荐打卡顺序
   * @param {Array} completedStamps 已完成的印章列表
   * @returns {Array} 推荐的打卡顺序
   */
  getRecommendedOrder(completedStamps) {
    const unlocked = checkpoints.filter(checkpoint => 
      !completedStamps.includes(checkpoint.id) && 
      this.isUnlocked(checkpoint.id, completedStamps)
    )
    
    return unlocked.sort((a, b) => a.order - b.order)
  }
}

// 地图配置
const mapConfig = {
  // 地图中心点
  center: checkpointUtils.getMapCenter(),
  
  // 地图缩放级别
  scale: 16,
  
  // 是否显示用户位置
  showLocation: true,
  
  // 是否显示指南针
  showCompass: true,
  
  // 是否显示比例尺
  showScale: true,
  
  // 地图样式
  style: 1,
  
  // 地图控件
  controls: [],
  
  // 标记点配置
  markers: checkpoints.map(checkpoint => ({
    id: checkpoint.id,
    latitude: checkpoint.position.lat,
    longitude: checkpoint.position.lng,
    iconPath: checkpoint.icon,
    width: 30,
    height: 30,
    callout: {
      content: checkpoint.name,
      color: '#333333',
      fontSize: 14,
      borderRadius: 8,
      bgColor: '#ffffff',
      padding: 8,
      display: 'ALWAYS'
    }
  }))
}

// 活动配置
const activityConfig = {
  // 活动名称
  name: '廉洁探索之旅',
  
  // 活动描述
  description: '通过扫码打卡集赞，在6个不同区域体验廉洁文化',
  
  // 总打卡点数
  totalCheckpoints: checkpoints.length,
  
  // 完成奖励
  completionReward: {
    title: '恭喜完成所有打卡！',
    message: '行程已完成，电子印章已集齐，请到签到处领取奖品！',
    prize: '精美纪念品一份'
  },
  
  // 活动规则
  rules: [
    '必须首先完成签到才能开始其他打卡',
    '除签到外，其他5个点位可任意顺序完成',
    '每个点位只能打卡一次',
    '完成所有6个点位后可领取奖品'
  ],
  
  // 活动时间
  timeRange: {
    start: '2024-01-01 00:00:00',
    end: '2024-12-31 23:59:59'
  }
}

// 导出所有配置
module.exports = {
  checkpoints,
  checkpointUtils,
  mapConfig,
  activityConfig
}
