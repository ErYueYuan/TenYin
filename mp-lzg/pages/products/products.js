import common from '../../utils/common.js';
let toast_text = require('../../compoents/toast_text/toast.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // navTab: ['寿险', '意健险'],
    navTab: [
      {
        id: '16',
        name: '寿险'
      },
      {
        id: '13',
        name: '意健险'
      }
    ],
    currentTab: 0,
    productList: [],
    productListTotal: '',
    offset: 0,
    productIds: '',
    source: '16',//16寿险 13意健险
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.listOrderProduct();//查询产品列表
  },

  listOrderProduct() {
    let that = this;
    wx.showLoading({
      title: '正在加载中…',
      mask: true
    })
    common.myRequest({
      url: 'lmapi/melzg/card/listOrderProduct',
      data: {
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId,
        agentcode: wx.getStorageSync('userVc').agentCode,
        platform: "2",
        source: that.data.source,
        params: {
          limit: 10,
          offset: that.data.offset
        },
        mainRiskFlag: "1"
      },
      success: res => {
        wx.hideLoading();
        if (res.data.status == 'SUCCESS') {
          if (that.data.offset == 0) {
            that.setData({
              productList: res.data.productList
            })
            let newArrys = [];
            for(var i = 0;i<that.data.productList.length;i++){
              if(that.data.productList[i].isSelected == 'Y'){
                newArrys.push(that.data.productList[i].id)
              }
            }
            if(newArrys.length>0){
              that.setData({
                productIds: newArrys
              })
            }
          } else if (that.data.offset > 0) {
            that.setData({
              productList: that.data.productList.concat(res.data.productList),
            })
          }
          that.setData({
            productListTotal: res.data.total
          })
        } else {
          toast_text._showToast(that,res.data.message,'',true);
        }
      }
    })
  },

  checkboxChange (e) {
    this.setData({
      productIds: e.detail.value
    })
    for(var i = 0;i<this.data.productIds.length;i++){
      for(var j = 0;j<this.data.productList.length;j++){
        if(this.data.productIds[i]==this.data.productList[j].id){
          this.data.productList[j].isSelected = 'Y'
      }
    }
  }
  },

  currentTab: function (e) {
    if (this.data.currentTab == e.currentTarget.dataset.idx) {
      return;
    }
    this.setData({
      currentTab: e.currentTarget.dataset.idx,
      source: e.currentTarget.dataset.id,
      offset: 0
    });
    this.listOrderProduct();
  },

  addProduct(){
    let that = this;
    wx.showLoading({
      title: '正在加载中…',
      mask: true
    })
    common.myRequest({
      url: 'lmapi/melzg/card/addProduct',
      data: {
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId,
        agentcode: wx.getStorageSync('userVc').agentCode,
        productIds: that.data.productIds,
        source: that.data.source
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
    // console.log('触底')
    let that = this;
    if ((that.data.productList).length < that.data.productListTotal) {
      let offset = that.data.offset + 10;
      that.setData({
        offset: offset
      })
      that.listOrderProduct();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})