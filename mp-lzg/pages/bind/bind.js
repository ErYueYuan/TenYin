import common from '../../utils/common.js';
let toast_text = require('../../compoents/toast_text/toast.js');
const util = require('../../utils/util.js');

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: "",
    password: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  userBlur (e) {
    this.setData({
      username: e.detail.value
    })
  },

  passBlur (e) {
    this.setData({
      password: e.detail.value
    })
  },

  passInput (e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 登录按钮(绑定)
  bindLogin() {    
    if (!this.data.username) {
      toast_text._showToast(this, '用户名不能为空', '', true);
      return false;
    } else if (!!this.data.username && !util.username(this.data.username)) {
      toast_text._showToast(this, '请输入正确格式的工号或手机号', '', true);
      return false;
    }

    if (!this.data.password) {
      toast_text._showToast(this, '密码不能为空', '', true);
      return false;
    } else if (!!this.data.password && util.password(this.data.password)==undefined) {
      toast_text._showToast(this, '请输入正确格式的密码', '', true);
      return false;
    }

    this.bind(this.data.username,this.data.password);
    
  },

  //绑定
  bind (code,password) {
    wx.showLoading({
      title: '正在加载中…',
      mask: true
    })
    common.myRequest({
      url: 'lmapi/melzg/user/bind4Miniprogram',
      data: {
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId,
        openid: wx.getStorageSync('openId'),
        code: code,
        password: password
      },
      success: res => {
        wx.hideLoading();
        if (res.data.status == 'SUCCESS') {
          wx.redirectTo({
            url: '../index/index',
          })
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