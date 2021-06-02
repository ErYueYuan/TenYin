import common from '../../utils/common.js';
let toast_text = require('../../compoents/toast_text/toast.js');
const util = require('../../utils/util.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  writeInput: function (e) {
    this.setData({
      content: e.detail.value
    })
  },

  writeBlur: function (e) {
    this.setData({
      content: e.detail.value
    })
  },

  commit: function () {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
    let userVc = wx.getStorageSync('userVc');

    if (that.data.content.length > 0) {
      util.msgCheck(that.data.content).then(res=>{
        if (res.data.status == 'SUCCESS') {
          wx.showLoading({
            title: '正在加载中…',
            mask: true
          })
          common.myRequest({
            url: 'lmapi/melzg/card/feedback',
            data: {
              agentCode: userInfo.agentcode,
              contact: userVc.mobile,
              deptCode2: userInfo.deptCode2,
              deptCode5: userInfo.deptCode5,
              deptName2: userInfo.deptName2,
              saasId: app.globalData.saasId,
              platformId: app.globalData.platformId,
              content: that.data.content,//必传
              source: 0,//必传 默认0
              suggestionType: 1,//必传 <意见反馈>传1  <存疑反馈>传2
              userId: userInfo.userId,//必传 投诉人id(等同userVcId)
              userName: userInfo.name,//投诉人名称
            },
            success: res => {
              wx.hideLoading();
              if (res.data.status == 'SUCCESS') {
                toast_text._showToast(that,'感谢您的反馈！','',true);
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 1,
                  })
                }, 1500);
              } else {
                toast_text._showToast(that,res.data.message,'',true);
              }
            }
          })
        } else {
          toast_text._showToast(that, '输入内容含有敏感词汇，请修改', '', true);
        }
      })
    } else {
      toast_text._showToast(that, '请输入您的意见和建议', '', true);
    }
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