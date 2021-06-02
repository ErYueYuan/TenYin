// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    BarHeight: 0,
    stateBarHeight: 0
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '/pages/player/player?user=1&id=0'
    })
  },
  back() {
    wx.navigateBack({
      delta: 1
    })
  },
  backHome() {
    wx.navigageBack({
      delta: pages.length
    })
  },
  onLoad() {
    this.setData({
      BarHeight: app.globalData.BarHeight+'px',
      stateBarHeight: app.globalData.BarHeight+44+'px'
    })
    console.log(app.globalData.BarHeight + 44, this.data.BarHeight, this.data.stateBarHeight);
    wx.setNavigationBarTitle({
      title: '发现' //页面标题为路由参数
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,

        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,

          })
        }
      })
    }
  },
  getUserInfo(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})