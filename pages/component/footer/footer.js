// pages/component/footer/footer.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
     data:{
       default:['1'],
       type:Array
     },
     num:{
       default:1,
       type:Number
     }
  },

  /**
   * 组件的初始数据
   */
  data: {
    routeList:[
      { 
        name:'发现',
        icon:'',//默认图标
        backIcon:"",//选中图标
        url:'/pages/index/index',
      },
      {
        name:'我的',
        icon:'',//默认图标
        backIcon:"",//选中图标
        url:'/pages/player/player'
      },
      {
        name:'我的',
        icon:'',//默认图标
        backIcon:"",//选中图标
        url:'/pages/logs/logs'
      }
    ]

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
