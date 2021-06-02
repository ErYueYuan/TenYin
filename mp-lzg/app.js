//app.js
import common from '/utils/common.js';
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // let code = res.code;
        const code = res.code;
        if (res.code) {
          wx.getSetting({
            success: (res) => {
              if (res.authSetting['scope.userInfo']) {
                wx.getUserInfo({
                  success: (res) => {
                    common.myRequest({
                      url: 'lmapi/melzg/card/code2openid',
                      data: {
                        saasId: this.globalData.saasId,
                        appId: this.globalData.appId,
                        secret: this.globalData.secret,
                        wxCode: code,
                        platformId: 'f2ce8561055a40d5a5e7dcdffde1e8bc'
                      },
                      success: res => {
                        console.log('app.js    code2openid---',res)
                        this.globalData.userInfo = res.userInfo;
                        wx.setStorageSync('openId', res.data.openid);
                        wx.setStorageSync('unionId', res.data.unionid);

                        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                        // 所以此处加入 callback 以防止这种情况
                        if (this.userInfoReadyCallback) {
                          this.userInfoReadyCallback(res)
                        }
                      }
                    })
                  },
                })
              }
            },
          })
        }
      }
    })

    // 获取设备信息
    wx.getSystemInfo({
      success: res => {
        let modelmes = res.model;
        if (modelmes.search('iPhone X') != -1 || modelmes.search('iPhone XS') != -1 || modelmes.search('iPhone 11') != -1 || modelmes.search('iPhone 11 Pro Max') != -1) {
          this.globalData.isIphoneX = true;
        }
      }
    })
  },

  globalData: {
    userInfo: null,
    isIphoneX: false,
    saasId: 'ff5a67337b6611e89feafa163eb3e537',
    // appId: 'wxfbc2173862c4e3c2',
    // secret: '8d818f009cb6e7809b1e178e2c6c3228',
    openId: wx.getStorageSync('openId'),
    unionId: wx.getStorageSync('unionId'),
    // Bucket: 'upload-10051630',
    Region: 'ap-shanghai',
    // lzgUrl:'https://wx.sxtong.cn/lzg/',
    platformCode:'2',
    platformId: 'f2ce8561055a40d5a5e7dcdffde1e8bc',
    appId: 'wx24e42530cfe458e0',
    secret: '08451df7ebc8c8d965a414da573b8c8a',
    Bucket: 'uploaduat-10051630',
    lzgUrl:'https://wxuat.sxtong.cn/lzg/',
  }
})