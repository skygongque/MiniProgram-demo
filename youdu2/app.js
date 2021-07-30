// app.js
App({
  onLaunch() {
    // 初始化与开发环境
    wx.cloud.init({
      env:"william-1gad8ar4afa59e08"
    });
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null
  }
})
