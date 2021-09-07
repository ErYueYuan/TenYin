// pages/uploadaudio/uploadaudio.js
const COS = require('../asstes/js/cos-wx-sdk-v5');
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    FileName: "",
    Filepath: "",
    fileOrgin: "",
    name:"",
    musicName:"",
    url:"",
    audioUrl:""
  },
  //上传图片
  uploadImg() {
    let that = this;
    wx.chooseImage({
      count: 1,
      type: "all",
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res);
        const filepath = res.tempFilePaths;
        console.log(filepath);
        that.setData({
          Filepath: filepath[0]
        })
        that.setData({
          fileOrgin:0
        })
        that.setData({
          FileName: filepath[0].substr(filepath[0].lastIndexOf('/') + 1)
        })
        wx.nextTick(()=>{
          that.uploadCors();
        })
      }
    })
  },
  //上传音频
  uploadAudio() {
    let that = this;
    wx.chooseMessageFile({
      count: 1,
      type: "all",
      success(res) {
        console.log(res);
        let filepath = res.tempFiles[0];
        that.setData({
          Filepath: filepath.path
        })
        that.setData({
          FileName: filepath.name
        })
        that.setData({
          fileOrgin: 1
        })
        console.log(that.data.Filepath, that.data.FileName);
        wx.nextTick(()=>{
          that.uploadCors();
        })
      }
    })
  },
  uploadCors() {
    let that = this;
    let name = that.data.FileName;
    let file = that.data.Filepath;
    if (!name || !file) {
      Toast('乱来，上传图片或音频啊~~~~~~~');
      return;
    }
    console.log(name, file);
    const cos = new COS({
      getAuthorization: function (options, callback) {
        console.log("cos签名", options, callback);
        wx.request({
          url: 'http://49.232.154.119:3001/getCors',
          method: 'GET',
          success(res) {
            console.log(res.data)
            let data = res.data
            callback({
              TmpSecretId: data.credentials
                .tmpSecretId,
              TmpSecretKey: data.credentials
                .tmpSecretKey,
              XCosSecurityToken: data.credentials
                .sessionToken,
              // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
              StartTime: data
                .startTime, // 单位是秒
              ExpiredTime: data
                .expiredTime,
              ScopeLimit: true, // 细粒度控制权限需要设为 true，会限制密钥只在相同请求时重复使用
            });
          }
        })
      }
    })
    let originName = that.data.fileOrgin == 0? "upload/img": "upload/audio";
    cos.postObject({
      Bucket: 'ym-1301900579',
      /* 必须 */
      Region: "ap-beijing",
      /* 存储桶所在地域，必须字段 */
      Key: originName + name,
      FilePath: file, // 上传文件对象
      onProgress: function (progressData) {
        console.log(JSON.stringify(progressData));
      },
    }, function (err, data) {
      that.data.url = "http://" + data.Location;
      console.log(err, data);

    })
  },
  //提交
  submitFile(){
    wx.request({
      url: 'http://localhost:3001/uploadAudioMsg',
      method: 'POST',
      data: {
        name: that.data.name,
        musicName: that.data.musicName,
        url: that.data.url,
        audioUrl:that.data.aUrl
      },
      success(res) {
        console.log(res);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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