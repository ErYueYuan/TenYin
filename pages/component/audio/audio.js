// pages/component/audio/audio.js
const vm = wx.createInnerAudioContext({});
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    audioSrcs:{
      default:'http://121.196.46.103:8080/music/1.mp3',
      type:String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    status:true,
    audioSrc:"http://121.196.46.103:8080/music/1.mp3"
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    play(){
      console.log(this.data.audioSrc);
      vm.src= this.data.audioSrc
      vm.play();
      console.log(vm);
      vm.onPause(() => {
        // 暂停监听
        
        console.log('暂停播放!');
        
        });
    },
    

  }
})
