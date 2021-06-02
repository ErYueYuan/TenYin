import common from '../../utils/common.js';
let toast_text = require('../../compoents/toast_text/toast.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyImage: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let isIphoneX = app.globalData.isIphoneX;
    this.setData({
      isIphoneX: isIphoneX
    })
    this.initializeVc(wx.getStorageSync('openId'));
  },

  initializeVc (openid) {
    let that = this;
    common.myRequest({
      url: 'lmapi/melzg/card/initializeVc',
      data: {
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId,
        openId: openid
      },
      success: res => {
        if (res.data.status == "SUCCESS") {
          if (!!res.data.userVcCompany) {
            that.setData({
              companyImage: res.data.userVcCompany.companyImage
            })
          } else {
            toast_text._showToast(that, '暂无公司信息', '', true);
          }
        } else {
          toast_text._showToast(that, res.data.message, '', true);
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