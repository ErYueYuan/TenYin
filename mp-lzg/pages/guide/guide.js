import common from '../../utils/common.js';
let toast_text = require('../../compoents/toast_text/toast.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('guide.js   options---',options)
    console.log('guide.js   userVc',wx.getStorageSync('openId'))
    if(options.openid){
      wx.setStorageSync('shareId', (options.openid))
    }
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
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          console.log('01  授权',res)
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }


    
    wx.login({
      success: res => {
        let wxRes = res;
        let that = this
        if (wxRes && wxRes.code) {
          wx.getSetting({
            success: res => {
              if (res.authSetting['scope.userInfo']) {
                wx.getUserInfo({
                  complete: (res) => {
                    app.globalData.userInfo = res.userInfo;
                    that.setData({
                      userInfo: app.globalData.userInfo,
                      hasUserInfo: true
                    })
                    wx.setStorageSync('globalData', app.globalData.userInfo);
                    console.log('已授权');
                    that.getInfo(wxRes)
                  },
                })
              }else{
                console.log('未授权')
              }
            }
          })
        }
      }
    })
    
  },

  getInfo:function(res){
    common.myRequest({
      url: 'lmapi/melzg/card/code2openid',
      data: {
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId,
        appId: app.globalData.appId,
        secret: app.globalData.secret,
        wxCode: res.code
      },
      success: res => {
        console.log('guide.js    code2openid---',res)
        if (res.data.status == "SUCCESS") {
          this.setData({
            openId: res.data.openid
          })
          wx.setStorageSync('openId', res.data.openid);
          this.register(res.data.openid);
        } else {
          wx.hideLoading();
          toast_text._showToast(this, res.data.message, '', true);
        }
      }
    })
  },

  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    // console.log(app.globalData.userInfo)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })

      wx.login({
        success: (res) => {
          console.log('02  授权',res)
          wx.showLoading({
            title: '正在加载中…',
            mask: true
          })
          this.getInfo(res)
        },
      })
    }
  },

  //注册
  register (openid) {
    wx.showLoading({
      title: '正在加载中…',
      mask: true
    })
    common.myRequest({
      url: 'lmapi/melzg/user/register4Miniprogram',
      data: {
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId,
        openid: openid
      },
      success: res => {
        wx.hideLoading();
        console.log('guide.js   register4Miniprogram---',res)
        if (res.data.status == 'SUCCESS') {
          if (res.data.isBind == 'Y') {//已绑定
            // wx.redirectTo({
            //   url: '../index/index',
            // })
            wx.navigateTo({
              url: '../index/index',
            })
          } else if (res.data.isBind == 'N') {//未绑定
            if(wx.getStorageSync('shareId')){
              // wx.redirectTo({
              //   url: '../index/index',
              // })
              wx.navigateTo({
                url: '../index/index',
              })
            }else{
              wx.navigateTo({
                url: '../bind/bind',
              })
            }
          }
        } else {
          toast_text._showToast(this, res.data.message, '', true);
        }
      }
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})