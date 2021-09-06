// pages/player/player.js
const  COS = require('../asstes/js/cos-wx-sdk-v5');
Page({

  /**
   * 页面的初始数据
   */
  data: {
     show:false,
     data:{
     },
     FileName:"",
     Filepath:""

  },
  musicData:function(e){
    this.setData({
      data:e.detail
    })
  },
  uploadBtn(){
    let that = this;
    wx.chooseImage({
      count:1,
      success(res){
        console.log(res);
        const filepath = res.tempFilePaths;
        that.setData({
          Filepath:filepath[0]
        })
        that.setData({
          FileName:filepath[0].substr(filepath[0].lastIndexOf('/')+1)
        })
      }
    })
  },
  //上传存储桶
  uploadCors(){
    let that = this;
    let name = that.data.FileName;
    let file = that.data.Filepath;
    console.log(name,file);
    const cos  = new COS({
      getAuthorization: function(options, callback) {
        console.log("cos签名", options, callback);
        wx.request({
          url:'http://49.232.154.119:3001/getCors',
          method:'GET',
          success(res){
            console.log(res.data)
            let data  = res.data
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
    cos.putObject(
      {
        Bucket: 'ym-1301900579',
        /* 必须 */
        Region: "ap-beijing",
        /* 存储桶所在地域，必须字段 */
        Key: "upload/ekc/" +name,
        /* 必须 */
        StorageClass: "STANDARD",
        Body: file, // 上传文件对象
        onProgress: function(progressData) {
          console.log(JSON.stringify(progressData));
        },
      },function(err,data){
        console.log(err,data);
      }
    )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
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