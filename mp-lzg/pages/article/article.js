import common from '../../utils/common.js';
let toast_text = require('../../compoents/toast_text/toast.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lmArticleList: [],
    articleTotal: '',
    offset: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.listOrderArticle(); // 查询资讯列表
  },

  listOrderArticle() {
    let that = this;
    wx.showLoading({
      title: '正在加载中…',
      mask: true
    })
    common.myRequest({
      url: 'lmapi/melzg/card/listOrderArticle',
      data: {
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId,
        vcId: wx.getStorageSync('userVc').id,
        limit: 10,
        offset: that.data.offset
      },
      success: res => {
        wx.hideLoading();
        if (res.data.status == 'SUCCESS') {
          if (that.data.offset == 0) {
            that.setData({
              lmArticleList: res.data.lmArticleList
            })
            let newArrys = [];
            for(var i = 0;i<that.data.lmArticleList.length;i++){
              if(that.data.lmArticleList[i].isSelection == 'Y'){
                newArrys.push(that.data.lmArticleList[i].id)
              }
            }
            if(newArrys.length>0){
              that.setData({
                idList: newArrys
              })
            }
          } else if (that.data.offset > 0) {
            that.setData({
              lmArticleList: that.data.lmArticleList.concat(res.data.lmArticleList)
            })
          }
          that.setData({
            articleTotal: res.data.total
          })
        } else {
          toast_text._showToast(that,res.data.message,'',true);
        }
      }
    })
  },

  checkboxChange (e) {
    this.setData({
      idList: e.detail.value
    })
    for(var i = 0;i<this.data.idList.length;i++){
      for(var j = 0;j<this.data.lmArticleList.length;j++){
        if(this.data.idList[i]==this.data.lmArticleList[j].id){
          this.data.lmArticleList[j].isSelection = 'Y'
        }
      }
    }
  },

  addArticle () {
    let that = this;
    wx.showLoading({
      title: '正在加载中…',
      mask: true
    })
    common.myRequest({
      url: 'lmapi/melzg/card/addArticle',
      data: {
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId,
        vcId: wx.getStorageSync('userVc').id,
        idList: that.data.idList
      },
      success: res => {
        wx.hideLoading();
        if (res.data.status == 'SUCCESS') {
          // wx.redirectTo({
          //   url: '../index/index',
          // })
          wx.navigateBack({
            delta: 1,
          })
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
    let that = this;
    if ((that.data.lmArticleList).length < that.data.articleTotal) {
      let offset = that.data.offset + 10;
      that.setData({
        offset: offset
      })
      that.listOrderArticle();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})