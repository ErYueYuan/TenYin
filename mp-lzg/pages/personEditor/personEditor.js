let toast_text = require('../../compoents/toast_text/toast.js');
const common = require('../../utils/common.js');
const util = require('../../utils/util.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    profile: "", // 个人简介内容
    total: '0',//总字数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.detailVc();//查询详情
  },

  detailVc () {
    let that = this;
    common.myRequest({
      url: 'lmapi/melzg/card/detailVc',
      data: {
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId,
        vcId: wx.getStorageSync('userVc').id,
        openId: wx.getStorageSync('openId')
      },
      success: res => {
        if (res.data.status == 'SUCCESS') {
          that.setData({
            userVc: res.data.userVc,
            profile: res.data.userVc.remark
          })
        } else {
          toast_text._showToast(that, res.data.message, '', true);
        }
      }
    })
  },

  proInput (e) {
    this.setData({
      profile: e.detail.value,
      total: e.detail.value.length
    })
  },

  profileBlur(e) {
    this.setData({
      profile: e.detail.value
    })
  },


  // 保存
  save() {
    let that = this;
    if (that.data.profile == undefined || that.data.profile.length == 0) {
      toast_text._showToast(that, '请输入您的个人简介与荣誉', '', true);
      return false
    }
    // let str = that.data.profile.split('\n').join('&hh')

    util.msgCheck(that.data.profile).then(res=>{
      if (res.data.status == 'SUCCESS') {
        common.myRequest({//保存
          url: 'lmapi/melzg/card/editVc',
          data: {
            saasId: app.globalData.saasId,
            platformId: app.globalData.platformId,
            id: wx.getStorageSync('userVc').id,
            name: that.data.userVc.name,
            moliePhone: that.data.userVc.mobile,
            remark: that.data.profile
          },
          success: res => {
            if (res.data.status == 'SUCCESS') {
              wx.navigateBack({
                delta: 1,
              })
            } else {
              toast_text._showToast(that, res.data.message, '', true);
            }
          }
        })
      } else {
        toast_text._showToast(that, '输入内容含有敏感词汇，请修改', '', true);
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