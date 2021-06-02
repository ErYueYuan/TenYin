import common from '../../utils/common.js';
let toast_text = require('../../compoents/toast_text/toast.js');
const util = require('../../utils/util.js');

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    educationList: [
      {
        code: 0,
        name: '大专'
      },
      {
        code: 1,
        name: '本科'
      },
      {
        code: 2,
        name: '硕士'
      },
      {
        code: 3,
        name: '博士'
      },
      {
        code: 4,
        name: '其他'
      }
    ],
    date: '',
    educway: '',
    educid: '',
    currentDate: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    var Y =date.getFullYear(); 
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); 
    this.setData({
      currentDate: Y + '-'  + M+ '-' + D,
      educway: options.educway,
      educid: options.id
    })

    if (this.data.educway == 'edit') {
      this.getEducation();//学历详情查询
    }
  },

  schoolBlur(e){
    this.setData({
      schoolName: e.detail.value
    })
  },

  startDateChange: function (e) {
    let startdate1 = new Date(e.detail.value)
    let startime1 = startdate1.getTime();
    if (!!this.data.endDate) {
      let startdate2 = new Date(this.data.endDate)
      let startime2 = startdate2.getTime();
      if (startime1 < startime2) {
        this.setData({
          startDate: e.detail.value
        })
      } else {
        this.setData({
          startDate: ""
        })
        toast_text._showToast(this,'入学时间应小于毕业时间','',true);
      }
    } else {
      this.setData({
        startDate: e.detail.value
      })
    }
  },

  endDateChange: function (e) {
    let endate1 = new Date(e.detail.value)
    let endtime1 = endate1.getTime();
    if (!!this.data.startDate) {
      let endate2 = new Date(this.data.startDate)
      let endtime2 = endate2.getTime();
      if (endtime1 > endtime2) {
        this.setData({
          endDate: e.detail.value
        })
      } else {
        this.setData({
          endDate: ''
        })
        toast_text._showToast(this,'毕业时间应大于入学时间','',true);
      }
    } else {
      this.setData({
        endDate: e.detail.value
      })
    }
  },

  bindEducationChange: function (e) {
    this.setData({
      position_index: e.detail.value
    })
  },

  getEducation () {
    let that = this;
    wx.showLoading({
      title: '正在加载中…',
      mask: true
    })
    common.myRequest({
      url: 'lmapi/melzg/card/getEducation',
      data: {
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId,
        id: that.data.educid
      },
      success: res => {
        wx.hideLoading();
        if (res.data.status == 'SUCCESS') {
          that.setData({
            schoolName: res.data.userVcEducation.schoolName,
            startDate: res.data.userVcEducation.startDate,
            endDate: res.data.userVcEducation.endDate,
            position_index: res.data.userVcEducation.position,
          })
        } else {
          toast_text._showToast(that,res.data.message,'',true);
        }
      }
    })
  },

  delBtn () {
    this.operationEducation('delete');
  },

  saveBtn(){
    if (this.data.educway == 'edit') {
      this.operationEducation('modify');
    } else if (this.data.educway == 'add') {
      this.operationEducation('save');
    }
  },

  operationEducation (way) {
    let that = this;
    if (!that.data.schoolName) {
      toast_text._showToast(that,'请填写您的学校','',true)
      return false
    }
    if (!that.data.startDate) {
      toast_text._showToast(that,'请选择入学时间','',true)
      return false
    }
    if (!that.data.endDate) {
      toast_text._showToast(that,'请选择毕业时间','',true)
      return false
    }
    if (!that.data.position_index) {
      toast_text._showToast(that,'请选择学历','',true)
      return false
    }

    util.msgCheck(that.data.schoolName).then(res=>{
      if (res.data.status == 'SUCCESS') {
        wx.showLoading({
          title: '正在加载中…',
          mask: true
        })
        common.myRequest({
          url: 'lmapi/melzg/card/education',
          data: {
            saasId: app.globalData.saasId,
            platformId: app.globalData.platformId,
            way: way,
            userVcId: wx.getStorageSync('userVc').id,
            id: way == 'save' ? '' : that.data.educid,
            schoolName: that.data.schoolName,
            startDate: that.data.startDate,
            endDate: that.data.endDate,
            position: that.data.position_index,//0-大专、1-本科、2-硕士、3-博士、4-其他
          },
          success: res => {
            wx.hideLoading();
            if (res.data.status == 'SUCCESS') {
              wx.navigateBack({
                delta: 1,
              })
            } else {
              toast_text._showToast(that,res.data.message,'',true);
            }
          }
        })
      } else {
        toast_text._showToast(that, '输入的学校名称含有敏感词汇，请修改', '', true);
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
    // let pages = getCurrentPages();
    // console.log('PageB  获取栈内页面  pages---',pages)
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