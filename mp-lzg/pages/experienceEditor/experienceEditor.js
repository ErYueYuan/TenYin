import common from '../../utils/common.js';
// let toast_notice = require('../../compoents/toast_notice/toast.js');
let toast_text = require('../../compoents/toast_text/toast.js');
const util = require('../../utils/util.js');

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentDate: '',
    companyName: '',
    workName: '',
    content: '',
    date: '',
    showType: '0',
    editway: 'edit',
    id: '',
    userVcWorkExperience: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    this.setData({
      currentDate: Y + '-' + M + '-' + D,
      editway: options.editway,
      id: options.id
    })
    if (this.data.editway == 'edit') {
      this.workExperience();//查询详情
    }
    
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
        toast_text._showToast(this,'开始时间应小于结束时间','',true);
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
        toast_text._showToast(this,'结束时间应大于开始时间','',true);
      }
    } else {
      this.setData({
        endDate: e.detail.value
      })
    }
  },

  nameBlur(e){
    if (e.detail.value.length > 0) {
      util.msgCheck(e.detail.value).then(res=>{
        if (res.data.status == 'SUCCESS') {
          this.setData({
            companyName: e.detail.value
          })
        } else {
          this.setData({
            companyName: ''
          })
          toast_text._showToast(this, '输入内容含有敏感词汇，请重新输入', '', true);
        }
      })
    }
  },

  workBlur(e){
    if (e.detail.value.length > 0) {
      util.msgCheck(e.detail.value).then(res=>{
        if (res.data.status == 'SUCCESS') {
          this.setData({
            workName: e.detail.value
          })
        } else {
          this.setData({
            workName: ''
          })
          toast_text._showToast(this, '输入内容含有敏感词汇，请重新输入', '', true);
        }
      })
    }
  },

  contentBlur(e){
    // this.setData({
    //   content: e.detail.value
    // })
    // if (e.detail.value > 200) {
    //   toast_text._showToast(this,'请您输入字数在200字内','',true)
    // }

    if (e.detail.value.length > 0) {
      util.msgCheck(e.detail.value).then(res=>{
        if (res.data.status == 'SUCCESS') {
          this.setData({
            content: e.detail.value
          })
          if (e.detail.value > 200) {
            toast_text._showToast(this,'请您输入字数在200字内','',true)
          }
        } else {
          this.setData({
            content: ''
          })
          toast_text._showToast(this, '输入内容含有敏感词汇，请重新输入', '', true);
        }
      })
    }
  },

  workExperience () {
    let that = this;
    common.myRequestGet({
      url: 'lmapi/melzg/card/workExperience/' + this.data.id,
      success: res => {
        if (res.data.status == 'SUCCESS') {
          that.setData({
            userVcWorkExperience: res.data.userVcWorkExperience,
            companyName: res.data.userVcWorkExperience.companyName,
            workName: res.data.userVcWorkExperience.position,
            startDate: res.data.userVcWorkExperience.startDate,
            endDate: res.data.userVcWorkExperience.endDate,
            content: res.data.userVcWorkExperience.note,
            showType: res.data.userVcWorkExperience.showType
          })
        } else {
          toast_text._showToast(that,res.data.message,'',true)
        }
      }
    })
  },

  showTypeBtn () {
    let that = this;
    if (that.data.showType == '0') {
      that.setData({
        showType: '1'
      })
    } else if (that.data.showType == '1') {
      that.setData({
        showType: '0'
      })
    }
  },

  delBtn () {
    this.operationWorkExperience('delete')
  },

  saveBtn(){
    if (this.data.editway == 'edit') {
      this.operationWorkExperience('modify');
    } else if (this.data.editway == 'add') {
      this.operationWorkExperience('save');
    }
  },

  operationWorkExperience (way) {
    let that = this;
    if (!that.data.companyName) {
      toast_text._showToast(that,'请输入您的公司名称','',true)
      return false
    }
    if (!that.data.workName) {
      toast_text._showToast(that,'请输入您的职位名称','',true)
      return false
    }
    if (!that.data.startDate) {
      toast_text._showToast(that,'请选择开始时间','',true)
      return false
    }
    if (!that.data.endDate) {
      toast_text._showToast(that,'请选择结束时间','',true)
      return false
    }

    wx.showLoading({
      title: '正在加载中…',
      mask: true
    })
    common.myRequest({
      url: 'lmapi/melzg/card/workExperience',
      data: {
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId,
        userVcId: wx.getStorageSync('userVc').id,
        way: way,
        companyName: that.data.companyName,
        position: that.data.workName,
        startDate: that.data.startDate,
        endDate: that.data.endDate,
        note: that.data.content,
        id: way == 'save' ? '' : that.data.id,
        showType: that.data.showType,//是否显示：0-显示；1-不显示
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