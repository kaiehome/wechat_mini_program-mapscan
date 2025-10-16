// coordinate-adjuster.js - 坐标调整工具
// 用于调整打卡点圆圈在地图图片上的位置

console.log('🎯 打卡点坐标调整工具')
console.log('=' .repeat(50))

// 当前打卡点坐标配置（基于打卡集章地图布局）
const CURRENT_COORDINATES = {
  signin: { x: 80, y: 120 },     // 寻根·霜降廉养 - 手工区（左上）
  esports: { x: 280, y: 100 },   // 笃行·电竞廉规 - 电竞区（右上）
  coffee: { x: 320, y: 200 },    // 省身·啡香廉思 - 咖啡区（中右）
  makeup: { x: 120, y: 250 },    // 正容·美妆廉仪 - 美妆区（中左）
  sleep: { x: 80, y: 350 },      // 静悟·清风入梦 - 睡眠区（左下）
  breeze: { x: 300, y: 320 }     // 沁心·清风廉饮 - 空调区（右下）
}

// 打卡点信息
const CHECKPOINT_INFO = {
  signin: { name: '寻根·霜降廉养', area: '手工区' },
  esports: { name: '笃行·电竞廉规', area: '电竞区' },
  coffee: { name: '省身·啡香廉思', area: '咖啡区' },
  makeup: { name: '正容·美妆廉仪', area: '美妆区' },
  sleep: { name: '静悟·清风入梦', area: '睡眠区' },
  breeze: { name: '沁心·清风廉饮', area: '空调区' }
}

// 显示当前坐标
function showCurrentCoordinates() {
  console.log('📍 当前打卡点坐标:')
  console.log('-' .repeat(40))
  
  Object.keys(CURRENT_COORDINATES).forEach(id => {
    const coord = CURRENT_COORDINATES[id]
    const info = CHECKPOINT_INFO[id]
    console.log(`${info.name} (${info.area}): x=${coord.x}, y=${coord.y}`)
  })
  
  console.log('-' .repeat(40))
  console.log('💡 使用 adjustCoordinate(id, x, y) 来调整坐标')
}

// 调整单个打卡点坐标
function adjustCoordinate(checkpointId, x, y) {
  if (!CURRENT_COORDINATES[checkpointId]) {
    console.error(`❌ 无效的打卡点ID: ${checkpointId}`)
    return false
  }
  
  const info = CHECKPOINT_INFO[checkpointId]
  const oldCoord = CURRENT_COORDINATES[checkpointId]
  
  CURRENT_COORDINATES[checkpointId] = { x, y }
  
  console.log(`✅ 已调整 ${info.name} 的坐标:`)
  console.log(`   从 x=${oldCoord.x}, y=${oldCoord.y}`)
  console.log(`   到 x=${x}, y=${y}`)
  
  return true
}

// 批量调整坐标
function batchAdjustCoordinates(updates) {
  console.log('🔄 开始批量调整坐标...')
  
  let successCount = 0
  Object.keys(updates).forEach(id => {
    const coord = updates[id]
    if (adjustCoordinate(id, coord.x, coord.y)) {
      successCount++
    }
  })
  
  console.log(`\n🎉 批量调整完成: ${successCount}/${Object.keys(updates).length} 个成功`)
}

// 生成配置代码
function generateConfigCode() {
  console.log('\n📋 生成配置代码:')
  console.log('=' .repeat(50))
  
  Object.keys(CURRENT_COORDINATES).forEach(id => {
    const coord = CURRENT_COORDINATES[id]
    const info = CHECKPOINT_INFO[id]
    console.log(`// ${info.name} (${info.area})`)
    console.log(`x: ${coord.x}, y: ${coord.y}`)
    console.log('')
  })
}

// 生成完整的data/checkpoints.js配置
function generateFullConfig() {
  console.log('\n📄 完整的data/checkpoints.js配置:')
  console.log('=' .repeat(60))
  
  const configs = [
    {
      id: 'signin',
      name: '寻根·霜降廉养',
      area: '手工区',
      order: 1,
      coord: CURRENT_COORDINATES.signin
    },
    {
      id: 'esports', 
      name: '笃行·电竞廉规',
      area: '电竞区',
      order: 2,
      coord: CURRENT_COORDINATES.esports
    },
    {
      id: 'coffee',
      name: '省身·啡香廉思', 
      area: '咖啡区',
      order: 3,
      coord: CURRENT_COORDINATES.coffee
    },
    {
      id: 'makeup',
      name: '正容·美妆廉仪',
      area: '美妆区', 
      order: 4,
      coord: CURRENT_COORDINATES.makeup
    },
    {
      id: 'sleep',
      name: '静悟·清风入梦',
      area: '睡眠区',
      order: 5,
      coord: CURRENT_COORDINATES.sleep
    },
    {
      id: 'breeze',
      name: '沁心·清风廉饮',
      area: '空调区',
      order: 6,
      coord: CURRENT_COORDINATES.breeze
    }
  ]
  
  configs.forEach(config => {
    console.log(`position: { lat: 30.274${config.order}, lng: 120.155${config.order}, x: ${config.coord.x}, y: ${config.coord.y} },`)
  })
}

// 预设坐标方案
const PRESET_COORDINATES = {
  // 方案1: 圆形布局
  circle: {
    signin: { x: 200, y: 150 },
    esports: { x: 300, y: 120 },
    coffee: { x: 350, y: 200 },
    makeup: { x: 300, y: 280 },
    sleep: { x: 200, y: 300 },
    breeze: { x: 150, y: 200 }
  },
  
  // 方案2: 线性布局
  linear: {
    signin: { x: 100, y: 150 },
    esports: { x: 150, y: 150 },
    coffee: { x: 200, y: 150 },
    makeup: { x: 250, y: 150 },
    sleep: { x: 300, y: 150 },
    breeze: { x: 350, y: 150 }
  },
  
  // 方案3: 网格布局
  grid: {
    signin: { x: 100, y: 100 },
    esports: { x: 200, y: 100 },
    coffee: { x: 300, y: 100 },
    makeup: { x: 100, y: 200 },
    sleep: { x: 200, y: 200 },
    breeze: { x: 300, y: 200 }
  }
}

// 应用预设方案
function applyPreset(presetName) {
  if (!PRESET_COORDINATES[presetName]) {
    console.error(`❌ 无效的预设方案: ${presetName}`)
    console.log('可用方案:', Object.keys(PRESET_COORDINATES).join(', '))
    return false
  }
  
  console.log(`🎯 应用预设方案: ${presetName}`)
  batchAdjustCoordinates(PRESET_COORDINATES[presetName])
  return true
}

// 导出到全局
if (typeof window !== 'undefined') {
  window.showCurrentCoordinates = showCurrentCoordinates
  window.adjustCoordinate = adjustCoordinate
  window.batchAdjustCoordinates = batchAdjustCoordinates
  window.generateConfigCode = generateConfigCode
  window.generateFullConfig = generateFullConfig
  window.applyPreset = applyPreset
  window.PRESET_COORDINATES = PRESET_COORDINATES
}

console.log('\n🚀 可用的命令:')
console.log('1. showCurrentCoordinates()          - 显示当前坐标')
console.log('2. adjustCoordinate(id, x, y)        - 调整单个坐标')
console.log('3. batchAdjustCoordinates(updates)   - 批量调整坐标')
console.log('4. generateConfigCode()              - 生成配置代码')
console.log('5. generateFullConfig()              - 生成完整配置')
console.log('6. applyPreset("circle")             - 应用预设方案')
console.log('\n💡 示例: adjustCoordinate("signin", 150, 200)')

// 自动显示当前坐标
showCurrentCoordinates()
