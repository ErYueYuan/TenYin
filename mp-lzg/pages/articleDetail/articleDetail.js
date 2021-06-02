import toast from '../../compoents/toast_text/toast.js';
import common from '../../utils/common.js';
let toast_text = require('../../compoents/toast_text/toast.js');
const util = require('../../utils/util.js');

const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleDetail: '',
    publishDate: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getArticleDetail(options.articleid);
  },

  getArticleDetail (articleid) {
    let that = this;
    common.myRequest({
      url: 'lmapi/melzg/articleManager/getArticleDetail',
      data: {
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId,
        id: articleid
      },
      success: res => {
        if (res.data.status == 'SUCCESS') {
          that.setData({
            articleDetail: res.data.articleDetail,
            articleDetailText: util.richImg(res.data.articleDetail.text)
          })
          if (!!res.data.articleDetail.publishDate) {
            that.setData({
              publishDate: res.data.articleDetail.publishDate.split(' ')[0]
            })
          }
        } else {
          toast_text._showToast(that,res.data.message,'',true);
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