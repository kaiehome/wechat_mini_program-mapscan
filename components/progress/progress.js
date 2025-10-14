// components/progress/progress.js
Component({
  properties: {
    // 进度百分比 (0-100)
    percentage: {
      type: Number,
      value: 0,
      observer: function(newVal) {
        this.setData({
          progressPercentage: Math.min(100, Math.max(0, newVal))
        })
      }
    },
    // 已完成数量
    completed: {
      type: Number,
      value: 0
    },
    // 总数量
    total: {
      type: Number,
      value: 6
    },
    // 是否显示文字
    showText: {
      type: Boolean,
      value: true
    },
    // 进度条颜色
    color: {
      type: String,
      value: '#4CAF50'
    },
    // 背景色
    backgroundColor: {
      type: String,
      value: '#f0f0f0'
    },
    // 进度条高度
    height: {
      type: Number,
      value: 12
    },
    // 是否显示动画
    animated: {
      type: Boolean,
      value: true
    },
    // 动画持续时间
    duration: {
      type: Number,
      value: 500
    }
  },

  data: {
    progressPercentage: 0,
    animationData: null
  },

  lifetimes: {
    attached() {
      this.initProgress()
    }
  },

  observers: {
    'percentage': function(newVal) {
      this.updateProgress(newVal)
    }
  },

  methods: {
    // 初始化进度条
    initProgress() {
      const { percentage, animated, duration } = this.properties
      this.updateProgress(percentage, animated, duration)
    },

    // 更新进度
    updateProgress(percentage, animated = true, duration = 500) {
      const targetPercentage = Math.min(100, Math.max(0, percentage))
      
      if (animated && this.data.animated) {
        this.animateProgress(targetPercentage, duration)
      } else {
        this.setData({
          progressPercentage: targetPercentage
        })
      }
    },

    // 进度条动画
    animateProgress(targetPercentage, duration) {
      const animation = wx.createAnimation({
        duration: duration,
        timingFunction: 'ease-out'
      })

      animation.width(`${targetPercentage}%`).step()
      
      this.setData({
        animationData: animation.export(),
        progressPercentage: targetPercentage
      })
    },

    // 重置进度
    reset() {
      this.setData({
        progressPercentage: 0,
        animationData: null
      })
    },

    // 设置进度
    setProgress(percentage) {
      this.updateProgress(percentage)
    },

    // 增加进度
    increment(step = 1) {
      const current = this.data.progressPercentage
      const total = this.properties.total
      const newPercentage = Math.min(100, current + (step / total * 100))
      this.updateProgress(newPercentage)
    },

    // 减少进度
    decrement(step = 1) {
      const current = this.data.progressPercentage
      const total = this.properties.total
      const newPercentage = Math.max(0, current - (step / total * 100))
      this.updateProgress(newPercentage)
    }
  }
})
