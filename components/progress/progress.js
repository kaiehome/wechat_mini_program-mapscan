// components/progress/progress.js
Component({
  properties: {
    percentage: {
      type: Number,
      value: 0
    },
    completed: {
      type: Number,
      value: 0
    },
    total: {
      type: Number,
      value: 6
    },
    showText: {
      type: Boolean,
      value: true
    },
    color: {
      type: String,
      value: '#4CAF50'
    }
  },

  data: {
    animatedPercentage: 0
  },

  lifetimes: {
    attached() {
      this.animateProgress()
    }
  },

  observers: {
    'percentage': function(newPercentage) {
      this.animateProgress()
    }
  },

  methods: {
    // 进度条动画
    animateProgress() {
      const animation = wx.createAnimation({
        duration: 800,
        timingFunction: 'ease-out'
      })

      animation.width(`${this.properties.percentage}%`).step()

      this.setData({
        animatedPercentage: this.properties.percentage,
        progressAnimation: animation.export()
      })
    },

    // 点击进度条
    onProgressTap() {
      this.triggerEvent('tap', {
        percentage: this.properties.percentage,
        completed: this.properties.completed,
        total: this.properties.total
      })
    }
  }
})