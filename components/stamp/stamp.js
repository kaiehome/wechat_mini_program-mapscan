// components/stamp/stamp.js
Component({
  properties: {
    // 印章ID
    stampId: {
      type: String,
      value: ''
    },
    // 印章名称
    name: {
      type: String,
      value: ''
    },
    // 印章图片路径
    image: {
      type: String,
      value: ''
    },
    // 是否已完成
    completed: {
      type: Boolean,
      value: false
    },
    // 完成时间
    completionTime: {
      type: String,
      value: ''
    },
    // 印章描述
    description: {
      type: String,
      value: ''
    },
    // 印章类型
    type: {
      type: String,
      value: 'checkpoint' // signin | checkpoint
    },
    // 是否可点击
    clickable: {
      type: Boolean,
      value: true
    },
    // 是否显示动画
    animated: {
      type: Boolean,
      value: true
    },
    // 印章大小
    size: {
      type: String,
      value: 'medium' // small | medium | large
    }
  },

  data: {
    showAnimation: false,
    animationData: null
  },

  lifetimes: {
    attached() {
      this.initStamp()
    }
  },

  observers: {
    'completed': function(newVal) {
      if (newVal && this.data.animated) {
        this.playCompletionAnimation()
      }
    }
  },

  methods: {
    // 初始化印章
    initStamp() {
      // 可以在这里添加初始化逻辑
    },

    // 播放完成动画
    playCompletionAnimation() {
      const animation = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease-out'
      })

      // 印章放大缩小动画
      animation.scale(1.2).step({ duration: 200 })
      animation.scale(1.0).step({ duration: 800 })

      this.setData({
        animationData: animation.export(),
        showAnimation: true
      })

      // 动画结束后隐藏
      setTimeout(() => {
        this.setData({
          showAnimation: false
        })
      }, 1000)
    },

    // 印章点击事件
    onStampTap() {
      if (!this.properties.clickable) return

      // 触发震动反馈
      wx.vibrateShort({
        type: 'light'
      })

      // 触发父组件事件
      this.triggerEvent('stamptap', {
        stampId: this.properties.stampId,
        name: this.properties.name,
        completed: this.properties.completed,
        type: this.properties.type
      })
    },

    // 获取印章状态样式
    getStampStatusClass() {
      const { completed, type } = this.properties
      let statusClass = ''

      if (completed) {
        statusClass += ' completed'
      } else {
        statusClass += ' pending'
      }

      if (type === 'signin') {
        statusClass += ' signin'
      }

      return statusClass
    },

    // 获取印章颜色
    getStampColor() {
      const { stampId, completed } = this.properties
      
      if (completed) {
        return '#4CAF50'
      }

      const colorMap = {
        'signin': '#4CAF50',
        'esports': '#FF9800',
        'coffee': '#9C27B0',
        'makeup': '#E91E63',
        'sleep': '#2196F3',
        'breeze': '#00BCD4'
      }

      return colorMap[stampId] || '#666666'
    }
  }
})
