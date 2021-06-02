const common = require("../../utils/common");
let toast_text = require('../../compoents/toast_text/toast.js');

const app = getApp()

// pages/hobbyEditor/hobbyEditor.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: true,
    selectList: [],
    flag: false,
    x: 0,
    y: 0,

    userVcHobbyList: '',
    newArray: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.hobbyListUser4Front();//已选
    this.hobbyList4Front();//爱好列表
  },

  hobbyListUser4Front() {
    let that = this;
    common.myRequest({
      url: 'lmapi/melzg/card/hobbyListUser4Front',
      data: {
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId,
        userVcId: wx.getStorageSync('userVc').id,
        params: {
          limit: 1000,
          offset: 0
        }
      },
      success: res => {
        if (res.data.status == 'SUCCESS') {
          if (!!res.data.userVcHobbyList) {
            that.setData({
              selectList: res.data.userVcHobbyList
            })
          }
        }
      }
    })
  },

  hobbyList4Front () {
    let that = this;
    common.myRequest({
      url: 'lmapi/melzg/card/hobbyList4Front',
      data: {
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId,
        params: {
          limit: 1000,
          offset: 0
        },
        userVcId: wx.getStorageSync('userVc').id
      },
      success: res => {
        if (res.data.status == 'SUCCESS') {
          if (!!res.data.userVcHobbyList) {
            that.setData({
              userVcHobbyList: res.data.userVcHobbyList
            })
          }
        } else {
          toast_text._showToast(that, res.data.message, '', true);
        }
      }
    })
  },

  addLabel: function (e) {
    const that = this;
    let index = e.target.dataset.index;
    let item = that.data.userVcHobbyList[index];
    let value = e.target.dataset.className;
    if (item.isSelected == 1) {
      item.isSelected = true;
    } else if (item.isSelected == 0) {
      item.isSelected = false;
    }
    item.isSelected = !item.isSelected;
    if (!!item.isSelected) {
      that.data.selectList.push(e.target.dataset)
      that.setData({
        selectList: that.data.selectList
      })
    } else {
      let select = that.data.selectList;
      for (let i=0;i<that.data.selectList.length;i++) {
        if (that.data.selectList[i].className == value) {//that.data.selectList[i].value == value
          select.splice(i,1)
          that.setData({
            selectList: select
          })
        }
      }
    }

    that.setData({
      userVcHobbyList: that.data.userVcHobbyList
    })

  },

  delLabel: function (e) {
    const that = this;
    let index = e.currentTarget.dataset.index;
    let value = e.currentTarget.dataset.value;
    let select = that.data.selectList;
    select.splice(index,1)
    that.setData({
      selectList: select
    })

    for (let i=0;i<that.data.userVcHobbyList.length;i++) {
      if (that.data.userVcHobbyList[i].id == value) {
        that.data.userVcHobbyList[i].isSelected = false;
        that.setData({
          userVcHobbyList: that.data.userVcHobbyList
        })
      }
    }

    
  },

  save () {
    let idList = [];
    this.data.selectList.forEach((item) =>{
      idList.push(item.id);
    })
    
    let that = this;
    wx.showLoading({
      title: '正在加载中…',
      mask: true
    })
    common.myRequest({
      url: 'lmapi/melzg/card/hobby',
      data: {
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId,
        userVcId: wx.getStorageSync('userVc').id,
        idList: idList
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
          toast_text._showToast(that, res.data.message, '', true);
        }
      }
    })
  },







  // //长按
  // _longtap: function (e) {
  //   console.log('长按', e)
  //   const detail = e.detail;
  //   this.setData({
  //     x: e.currentTarget.offsetLeft,
  //     y: e.currentTarget.offsetTop
  //   })
  //   this.setData({
  //     // hidden: false,
  //     flag: true
  //   })
  // },
  // //触摸开始
  // touchs: function (e) {
  //   console.log('触摸开始', e)
  //   this.setData({
  //     beginIndex: e.currentTarget.dataset.index
  //   })
  // },
  // //触摸结束
  // touchend: function (e) {
  //   if (!this.data.flag) {
  //     return;
  //   }
  //   const x = e.changedTouches[0].pageX
  //   const y = e.changedTouches[0].pageY
  //   const list = this.data.elements;
  //   let data = this.data.data;
  //   for (var j = 0; j < list.length; j++) {
  //     const item = list[j];
  //     if (x > item.left && x < item.right && y > item.top && y < item.bottom) {
  //       const endIndex = item.dataset.index;
  //       const beginIndex = this.data.beginIndex;
  //       //向后移动
  //       if (beginIndex < endIndex) {
  //         let tem = data[beginIndex];
  //         for (let i = beginIndex; i < endIndex; i++) {
  //           data[i] = data[i + 1]
  //         }
  //         data[endIndex] = tem;
  //       }
  //       //向前移动
  //       if (beginIndex > endIndex) {
  //         let tem = data[beginIndex];
  //         for (let i = beginIndex; i > endIndex; i--) {
  //           data[i] = data[i - 1]
  //         }
  //         data[endIndex] = tem;
  //       }

  //       this.setData({
  //         data: data
  //       })
  //     }
  //   }
  //   this.setData({
  //     // hidden: true,
  //     flag: false
  //   })
  // },
  // //滑动
  // touchm: function (e) {
  //   console.log('滑动', e)
  //   if (this.data.flag) {
  //     const x = e.touches[0].pageX
  //     const y = e.touches[0].pageY
  //     this.setData({
  //       x: x - 75,
  //       y: y - 45
  //     })
  //   }
  // },

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