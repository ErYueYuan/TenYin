const util = require('../../utils/util.js');
import common from '../../utils/common.js';

//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      productCode: options.productcode,
      briskCode: options.briskcode,
      productType: options.producttype,
      staticPage:wx.getStorageSync('staticpage')
    })
    let that = this
    if (options.source == 'product') {
      if(this.data.productType == '16'){
        let channelUserId = wx.getStorageSync('userVc').agentCode,
        curridProvince = wx.getStorageSync('userInfo').province || '',
        timer = new Date().getTime(),
        newProcessFlag = this.data.briskCode != 'undefined'?'W':'Y',
        identificationStatus = wx.getStorageSync('userInfo').status

        let url = app.globalData.lzgUrl + '#/channel/channelCode=' + app.globalData.platformCode + '&channelUserId=' + channelUserId + '&productId=' + this.data.productCode + '&briskCode=' + this.data.briskCode + '&opType=1&areaCode=' + curridProvince + '&shareTime=' + timer + '&status=' + identificationStatus + '&channelSource=' + 'lzg' + '&platformId=' + app.globalData.platformId + '&platformCode=' + app.globalData.platformCode + '&newProcessFlag=' + newProcessFlag

        that.setData({
          url: url
        })
        console.log('寿险产品详情跳转地址:',that.data.url)
      }else{
        // let userId = wx.getStorageSync('userVc').oldLzgUserId
        let userId = wx.getStorageSync('oldLzgUserId') 
        common.myRequestGet({
          url: 'rbk/lm/oauth/createToken/'+userId,
          success: res => {
            console.log('res=========',res)
            let url = this.data.staticPage +  "&token=" + res.data.token + "&userId=" + userId
            that.setData({
              url: url
            })
            console.log('产品详情跳转地址:',that.data.url)
          }
        })
      }
    } else if (options.source == 'article') {
      this.setData({
        url: 'http://lzgplus.cisg.cn/lzg/#/articleDetail/5a50d27ebf6047b0b6a1a2a69b6f8048'
      })
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