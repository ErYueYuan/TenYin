// pages/component/music/music.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },
 
  /**
   * 组件的初始数据
   */
  data: {
    index:0,
    status:true,
    list:[]
  },
  attached(){
    this.getData();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    player(e){
      console.log(e)
      let item = e.currentTarget.dataset.item
      this.triggerEvent('getMusic',item)
   },
   getData(){
     let that = this;
    wx.request({
      url: 'http://49.232.154.119:3001/getMusic',
      method:'GET',
      success(res){
        console.log(res.data);
        that.setData({
          list:res.data.data.musicList
        })
      }
    })
   }
  }
})
