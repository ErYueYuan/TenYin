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
        console.log(newVal,oldVal);
        return newVal;
      }
    }
  },
  attached() {
    console.log(app.globalData.musicState);
    let routes = getCurrentPages();
console.log(routes);
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
    musicState:''
  },
  observers:{
    'dataItem':function(val){
      console.log(val);
      this.setData({
        status:false,
        title:val.Content,
        name:val.name,
        audioSrc:val.url,
        musicState:app.globalData.musicState
      })
      // this.play(val)
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    play(val) { 
      console.log(this.data);
      if(!val)return;
      vm.src = val.url
      vm.play();
      console.log(app.globalData.musicState);
      // this.setData({
      //   status:false,
      //   title:val.Content,
      //   name:val.name,
      //   audioSrc:val.url
      // })
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