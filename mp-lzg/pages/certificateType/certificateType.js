import common from '../../utils/common.js';
let toast_text = require('../../compoents/toast_text/toast.js');

const app = getApp()



Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: 0,
    titleList: '',
    currentTab: '0',
    isSearch: false,
    hotList: '',
    templateList: '',
    isTemp: false,
    ind: '',
    hotindex: '',
    hotTab: [
      {
        id: '001',
        className: '热门'
      }
    ],
    searchList: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      qualway: options.qualway
    })
    wx.getSystemInfo({ // 获取当前设备的宽高
      success: function (res) {
        that.setData({
          winHeight: res.windowHeight
        });
      }
    });

    this.qualificationHotList();//查询热点资质证书列表
    this.qualificationTempList();//名片资质证书分类查询接口

  },

  qualificationHotList () {
    let that = this;
    wx.showLoading({
      title: '正在加载中…',
      mask: true
    })
    common.myRequest({
      url: 'lmapi/melzg/card/qualificationHotList',
      data: {
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId
      },
      success: res => {
        wx.hideLoading();
        if (res.data.status == "SUCCESS") {
          that.setData({
            hotList: res.data.qualificationHotList
          })
        } else {
          toast_text._showToast(that, res.data.message, '', true);
        }
      }
    })
  },

  qualificationTempList () {
    let that = this;
    common.myRequest({
      url: 'lmapi/melzg/card/qualificationTempList',
      data: {
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId,
        classLevel: '0',//等级：0-一级；1-二级
        params: {
          limit: 10,
          offset: 0
      }
      },
      success: res => {
        if (res.data.status == "SUCCESS") {
          that.setData({
            titleList: that.data.hotTab.concat(res.data.userVcQualificationTemplateList)
          })
        } else {
          toast_text._showToast(that, res.data.message, '', true);
        }
      }
    })
  },

  leftab (e) {
    let that = this;
    that.setData({
      currentTab: e.target.dataset.tabindex,
      ind: '',
      hotindex: ''
    })
    if (e.target.dataset.tabindex == 0) {
      that.setData({
        isTemp: false
      })
      that.qualificationHotList();
    } else {
      wx.showLoading({
        title: '正在加载中…',
        mask: true
      })
      common.myRequest({
        url: 'lmapi/melzg/card/qualificationTempList',
        data: {
          saasId: app.globalData.saasId,
          platformId: app.globalData.platformId,
          classId: e.target.dataset.tabid,//一级分类id
          classLevel: '1',//等级：0-一级；1-二级
          params: {
            limit: 10,
            offset: 0
          }
        },
        success: res => {
          wx.hideLoading();
          if (res.data.status == "SUCCESS") {
            that.setData({
              templateList: res.data.userVcQualificationTemplateList,
              isTemp: true
            })
          } else {
            toast_text._showToast(that, res.data.message, '', true);
          }
        }
      })
    } 
    
  },

  changeType(e) {
    let that = this;
    if (that.data.currentTab === e.target.dataset.index) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.index
      })
    }
  },

  searchContentBlur(e){
    this.setData({
      searchContent: e.detail.value
    })
  },

  search(e){
    let that = this;
    this.setData({
      searchContent: e.detail.value
    })
    if(!!that.data.searchContent){
      common.myRequest({
        url: 'lmapi/melzg/card/qualificationTempList',
        data: {
          saasId: app.globalData.saasId,
          platformId: app.globalData.platformId,
          className: that.data.searchContent,
          classLevel: '1',//等级：0-一级；1-二级
          params: {
            limit: 10,
            offset: 0
          }
        },
        success: res => {
          if (res.data.status == 'SUCCESS') {
            that.setData({
              searchList: res.data.userVcQualificationTemplateList,
              isSearch: true
            })
          } else {
            toast_text._showToast(that,'暂无相关搜索结果，换个关键词继续搜索噢~','',true)
          }
        }
      })
    } else {
      that.setData({
        isSearch: false
      })
    }
  },

  cancelSearch(){
    this.setData({
      isSearch: false
    })
  },

  chooseSearch (e) {
    this.setData({
      searchindex: e.target.dataset.searchindex
    })
    // wx.navigateTo({
    //   url: '../certification/certification?qualway=' + this.data.qualway + '&qcid=' + e.target.dataset.searchid + '&qcname=' + e.target.dataset.searchname
    // })
    wx.redirectTo({
      url: '../certification/certification?qualway=' + this.data.qualway + '&qcid=' + e.target.dataset.searchid + '&qcname=' + e.target.dataset.searchname
    })
  },

  chooseHot (e) {
    this.setData({
      hotindex: e.target.dataset.hotindex
    })
    // wx.navigateTo({
    //   url: '../certification/certification?qualway=' + this.data.qualway + '&qcid=' + e.target.dataset.hotid + '&qcname=' + e.target.dataset.hotname,
    // })
    wx.redirectTo({
      url: '../certification/certification?qualway=' + this.data.qualway + '&qcid=' + e.target.dataset.hotid + '&qcname=' + e.target.dataset.hotname
    })
  },

  chooseTemp (e) {
    this.setData({
      ind: e.target.dataset.tempindex
    })
    // wx.navigateTo({
    //   url: '../certification/certification?qualway=' + this.data.qualway + '&qcid=' + e.target.dataset.tempid + '&qcname=' + e.target.dataset.tempname,
    // })
    wx.redirectTo({
      url: '../certification/certification?qualway=' + this.data.qualway + '&qcid=' + e.target.dataset.tempid + '&qcname=' + e.target.dataset.tempname
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