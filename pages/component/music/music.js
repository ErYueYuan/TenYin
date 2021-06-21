// pages/component/music/music.js
const m = wx.getBackgroundAudioManager();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data:{
      default:[],
      type:Array
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    index:0,
    status:true,
    list:""
  },
  attached(){
    this.getData();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    player(){
      m.title="测试"
      m.src="http://121.196.46.103:8080/music/1.mp3";
      m.play(()=>{
        console.log(1);
      });
      console.log(m);
   
   },
   getData(){
     let that = this;
    wx.request({
      url: 'http://localhost:3000/getMusic',
      method:'GET',
      success(res){
        console.log(res);
        that.setData({
          list:res
        })
      }
    })
   }
  }
})
