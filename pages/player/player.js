// pages/player/player.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     show:false,
     data:{
     },
  },
  musicData:function(e){
    this.setData({
      data:e.detail
    })
  },
  uploadBtn(){
    wx.chooseImage({
      success(res){
        console.log(res);
        const filepath = res.tempFilePaths;
        wx.uploadFile({
          filePath: filepath[0],
          name: 'file',
          url: 'http://localhost:3001/upload',
          header: {  
            "Content-Type": "multipart/form-data"  
          },  
          success(res){
            console.log(res);
          }
        })
      }
    })
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