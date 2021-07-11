// pages/component/audio/audio.js
const vm = wx.createInnerAudioContext({});
const  app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dataItem: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        return newVal;
      }
    }
  },

  attached() {

  },
  /**
   * 组件的初始数据
   */
  data: {
    musicData:'',
    status: true,
    audioSrc: "",
    title:'',
    name:'',
    musicState:app.globalData.musicState
    

  },
  observers:{
    'dataItem':function(val){
      console.log(val);
      this.play(val)
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    play(val) { 
      console.log(this.data);
      vm.src = val.url
      vm.play();
      app.globalData.musicState = true;
      console.log(app.globalData.musicState);
      this.setData({
        status:false,
        title:val.Content,
        name:val.name
      })
      console.log(this.data);
      
      vm.onPause(() => {
        this.setData({
          status:true
        })
        // 暂停监听
        console.log('暂停播放!');

      });
    },
    pause() {
      vm.pause();
      this.setData({
        status: true
      })
    }


  }
})