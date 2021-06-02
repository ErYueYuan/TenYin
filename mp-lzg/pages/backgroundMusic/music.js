import common from '../../utils/common.js';
let toast_notice = require('../../compoents/toast_notice/toast.js');
let toast_text = require('../../compoents/toast_text/toast.js');
const recorderManager = wx.getRecorderManager()
var init
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "准备录音",
    musicList: [
      { id: '0', name: 'A Thousand Miles' },
      { id: '1', name: 'My Boyfriend' },
      { id: '2', name: 'See You Again' }
    ],
    showModal: false,
    music_showModal: false,
    doubt_showModal: false,
    disable_showModal: false,
    qrcode_showModal: false,
    poster_showModal: false,
    music_name: '录音1',

    time: 0, //录音时长
    duration: 600000, //录音最大值ms 600000/10分钟
    // tempFilePath: "", //音频路径
    buttons: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 长按录音开始
   */
  recordStart: function (e) {

  },
  /**
   * 长按录音结束
   */
  recordTerm: function (e) {
    rm.stop(), this.setData({
      isTouchEnd: true,
      isTouchStart: false,
      touchEnd: e.timeStamp,
      value: 100
    }), clearInterval(this.timer);
  },


  // 开始播放
  recordBtn: function () {
    recorderManager.onStart(() => {
      console.log('监听录音开始事件')
      this.setData({
        title: "正在录音",
        // status: "1"
      })
    })

    const options = {
      duration: 10000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'aac',
      frameSize: 50
    }
    this.recordingTimer();
    recorderManager.start(options)
  },
  // 计时器
  recordingTimer: function (time) {
    let that = this;
    if (time == undefined) {
      //将计时器赋值给init
      init = setInterval(function () {
        let time = that.data.time + 1;
        that.setData({
          time: time
        })
      }, 1000);
    } else {
      clearInterval(init)
      console.log("暂停计时")
    }
  },

  choose(e) {
    console.log(e)
    let that = this;
    let currentId = e.currentTarget.id;
    let musicList = that.data.musicList;

    musicList.forEach(function (item, index) {
      if (currentId == index) {
        musicList[index].checked = true;
      } else {
        musicList[index].checked = false;
      }
      that.setData({
        musicList
      })
    });
  },

  musicDetail(e) {
    wx.navigateTo({
      url: '../musicDetail/musicDetail?name=' + e.currentTarget.dataset.name,
    })
  },

  writeName() {
    this.setData({
      music_showModal: true
    })
  },
  music_cancel() {
    this.setData({
      music_showModal: false
    })
  },
  music_ok() {
    console.log(this.data.musicName)
    this.setData({
      music_showModal: false,
      music_name: this.data.musicName
    })
  },
  musicNameBlur(e) {
    let musicName;
    this.setData({
      musicName: e.detail.value
    })
  },

  commit() {
    let that = this;
    let list = that.data.musicList;
    list.forEach(function (item, index) {
      let music = list.filter(function (item, index, array) {
        return (item.checked == true);
      });
      that.setData({
        musicId: music[0].id
      })
    });
    console.log('选中的音乐的id:', that.data.musicId)
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
