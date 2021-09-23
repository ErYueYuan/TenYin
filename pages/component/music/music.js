// pages/component/music/music.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    index: 0,
    status: true,
    list: []
  },
  attached() {
    this.getData();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    player(e) {
      console.log(e)
      let item = e.currentTarget.dataset.item
      this.triggerEvent('getMusic', item)
    },
    getData() {
      let that = this;
      wx.request({
        url: 'http://localhost:3001/getData',
        method: 'GET',
        success(res) {
          console.log(res.data.list);
          that.setData({
            list: res.data.list
          })
        }
      })
    },
    downUrl(e) {
      let item = e.currentTarget.dataset.item
      wx.downloadFile({
        url: "http://ym-1301900579.cos.ap-beijing.myqcloud.com/upload/audio/%E5%B0%B1%E6%98%AF%E5%8D%97%E6%96%B9%E5%87%AF%20-%20%E6%9D%80%E6%AD%BB%E9%82%A3%E4%B8%AA%E7%9F%B3%E5%AE%B6%E5%BA%84%E4%BA%BA.mp3",
        success(res) {
          let filePath = res.tempFilePath;
          console.log(filePath);
          wx.openDocument({
            filePath: filePath,
            success: function (res) {
              console.log('打开文档成功')
            },
          })
          console.log(res);
        }
      })
    }
  }
})