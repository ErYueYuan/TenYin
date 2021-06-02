import common from '../../utils/common.js';
let toast_notice = require('../../compoents/toast_notice/toast.js');
let toast_text = require('../../compoents/toast_text/toast.js');
const util = require('../../utils/util.js');


//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showModal: false,
    music_showModal: false,
    disable_showModal: false,
    qrcode_showModal: false,
    poster_showModal: false,
    openSettingBtnHidden: true,
    isStartEdit: false,//是否编辑我的名片
    isEdit: true, // 是否编辑
    isEditPerson: true,//编辑和非编辑的样式判断
    isEditWork: true,
    isEditStudy: true,
    isEditEduc: true,
    isEditQual: true,
    isEditHobby: true,
    isEditGoods: true,
    isEditArticle: true,
    userVc: "",//存储名片信息
    lmUserVcVisitList: '',//访问者头像及个数
    visitCount: '',//访问人数
    isVisit: true,//访问人数为0时隐藏
    praiseCount: '',//点赞人数
    lmArticleList: [],//存储我的动态
    backgroundImage: '',//背景图
    productList: '',//存储为你优选
    userVcWorkExperienceList: '',//存储从业经历
    userVcEducationList: '',//存储学历认证
    userVcQualificationList: '',//存储资格认证
    isMe: true,//当前查看名片者是否为代理人本人
    remarkDetail: '',//个人简介内容
    isOpen: false,//从业经历展开收起
    remarkSwitch: 0,//模块展示隐藏状态:0是开，1是关
    // fieldDetail: '', //擅长领域内容
    likeimg: 'https://upload-10051630.cos.ap-shanghai.myqcloud.com/static/userVc/dlrpic/fav1.png',
    head_default: 'https://upload-10051630.cos.ap-shanghai.myqcloud.com/static/userVc/dlrpic/avatar.png',
    startDate: '',
    endDate: '',
    workSwitch: 0,
    educSwitch: 0,
    qualSwitch: 0,
    hobbySwitch: 0,
    productSwitch: 0,
    articleSwitch: 0,
    isremarkOpen: 0,
    isworkOpen: 0,
    iseducOpen: 0,
    isqualOpen: 0,
    ishobbyOpen: 0,
    isproductOpen: 0,
    isarticleOpen: 0,
    articleTotal: '',
    offset: 0,
    isShow: true,//部分模块对查看者为非本人时默认隐藏
    isHideViewerWork: true,
    isHideViewerEduc: true,
    isHideViewerQual: true,
    isHideViewerHobby: true,
    isHideViewerProduct: true,
    isHideViewerArticle: true,
    // isShowHonor: true,
    // isHavePerson: true,
    // isHaveHobby: true,
    // isHaveProduct: true,
    // isHaveArticle: true,
    // imgUrl: '../images/bg2.png',
    // newdate: [],
  },

  // //事件处理函数
  // bindViewTap: function () {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  onLoad: function (options) {
    if(app.globalData && !app.globalData.userInfo){
      if(wx.getStorageSync('globalData')){
        app.globalData.userInfo = wx.getStorageSync('globalData')
      }
    }

    let nowdate1 = (util.formatTime(new Date())).split(' ')[0];
    let nowdate2 = nowdate1.split('/')
    // let nowdate = nowdate2[0] + '-' + nowdate2[1] + '-' + nowdate2[2];
    let nowdate = nowdate2[0] + '-' + nowdate2[1];


    let globalOpenid = "";
    // if (options.scene) {
    //   console.log('解码后：',decodeURIComponent(options.scene))
    //   globalOpenid = decodeURIComponent(options.scene)
    // } else {
    //   globalOpenid = options.openid
    // }
    if(wx.getStorageSync('shareId')){
      globalOpenid = wx.getStorageSync('shareId')
    }
    console.log('globalOpenid---',globalOpenid)
    if (!!globalOpenid) {
      console.log('从分享链接进来的')
      // console.log('分享者和被分享者是否同一人：',options.openid == wx.getStorageSync('openId'))
      this.setData({
        masterOpenid: globalOpenid,
        isStartEdit: false
      })
      if (globalOpenid == wx.getStorageSync('openId')) {
        this.setData({
          isMe: true,
          initopenid: globalOpenid
        })
      } else {
        this.setData({
          isMe: false,
          initopenid: globalOpenid
        })
      }

      wx.login({
        success: (res) => {
          common.myRequest({
            url: 'lmapi/melzg/card/code2openid',
            data: {
              saasId: app.globalData.saasId,
              platformId: app.globalData.platformId,
              appId: app.globalData.appId,
              secret: app.globalData.secret,
              wxCode: res.code
            },
            success: res => {
              if (res.data.status == "SUCCESS") {
                this.setData({
                  openId: res.data.openid
                })
                wx.setStorageSync('unshareOpenId', res.data.openid);
                // 注册微信
                common.myRequest({
                  url: 'lmapi/melzg/user/register4Miniprogram',
                  data: {
                    saasId: app.globalData.saasId,
                    platformId: app.globalData.platformId,
                    openid: res.data.openid
                  },
                  success: res => {
                    if (res.data.status == 'SUCCESS') {
                      this.initializeVc(this.data.initopenid);
                    } else {
                      toast_text._showToast(this, res.data.message, '', true);
                    }
                  }
                })
              } else {
                toast_text._showToast(this, res.data.message, '', true);
              }
            }
          })
        },
      })

    } else {
      console.log('不是从分享进来的')
      this.initializeVc(wx.getStorageSync('openId')); // 初始化名片信息
    }

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            // hasUserInfo: true
            hasUserInfo: false
          })
        }
      })
    }

    let isIphoneX = app.globalData.isIphoneX;
    this.setData({
      isIphoneX: isIphoneX,
      nowdate: nowdate
    })
  },

  // 被分享人授权按钮
  getUserInfo(e) {
    app.globalData.userInfo = e.detail.userInfo;
    console.log('被分享人点了授权按钮-e',e)
    console.log('被分享人点了授权按钮-userInfo',app.globalData.userInfo)
    let that = this;
    console.log('masterOpenid---',that.data.masterOpenid)
    console.log("wx.getStorageSync('openId')---",wx.getStorageSync('openId'))
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })

      wx.login({
        success: (res) => {
          wx.showLoading({
            title: '正在加载中…',
            mask: true
          })
          common.myRequest({
            url: 'lmapi/melzg/card/code2openid',
            data: {
              saasId: app.globalData.saasId,
              platformId: app.globalData.platformId,
              appId: app.globalData.appId,
              secret: app.globalData.secret,
              wxCode: res.code
            },
            success: res => {
              wx.hideLoading();
              if (res.data.status == "SUCCESS") {
                that.setData({
                  openId: res.data.openid,
                })
                wx.setStorageSync('unshareOpenId', res.data.openid);
                that.initializeVc(that.data.masterOpenid);
              } else {
                toast_text._showToast(that, res.data.message, '', true);
              }
            }
          })
        },
      })
    } else {
      that.setData({
        hasUserInfo: false
      })
    }
  },

  // 初始化名片信息
  initializeVc(openid) {
    console.log('初始化接口initializeVc的入参 openid---',openid)
    let that = this;
    wx.showLoading({
      title: '正在加载中…',
      mask: true
    })
    common.myRequest({
      url: 'lmapi/melzg/card/initializeVc',
      data: {
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId,
        openId: openid
      },
      success: res => {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
        wx.hideLoading();
        console.log('初始化接口initializeVc的出参',res)
        if (res.data.status == "SUCCESS") {
          if (!!res.data.userVc) {
            that.setData({
              userVc: res.data.userVc,
              head: !!res.data.userVc.head ? res.data.userVc.head : this.data.head_default,
              praiseCount: res.data.userVc.praise,
              disable_showModal: res.data.userVc.status == 0 ? false : true,//status  0启用  1禁用
              token: res.data.token,
              userVcCompany: res.data.userVcCompany,
              userVcSwitch: res.data.userVcSwitch,
              remarkSwitch: res.data.userVcSwitch.remark,
              workSwitch: res.data.userVcSwitch.workExperience,
              educSwitch: res.data.userVcSwitch.education,
              qualSwitch: res.data.userVcSwitch.qualification,
              hobbySwitch: res.data.userVcSwitch.hobby,
              productSwitch: res.data.userVcSwitch.product,
              articleSwitch: res.data.userVcSwitch.article,
              remarkDetail: res.data.userVc.remark,
              slogan: res.data.userVc.slogan
            })
            wx.setStorageSync('oldLzgUserId', res.data.oldLzgUserId);
            wx.setStorageSync('token', res.data.token);
            wx.setStorageSync('userVc', res.data.userVc);

            // let platformId;
            // if (res.data.uuserFzgLoginRequestVO.userInfo.agentType == 0) {//0懒掌柜 1fun掌柜 2渠道
            //   platformId = 'f2ce8561055a40d5a5e7dcdffde1e8bc'
            // } else if (res.data.uuserFzgLoginRequestVO.userInfo.agentType == 1) {
            //   platformId = '2724341dfdc5463cbf167f1195da6e3e'
            // } else if (res.data.uuserFzgLoginRequestVO.userInfo.agentType == 2) {
            //   platformId = 'bbc1e5a0d58011ea8eb2005056953860'
            // }
            // wx.setStorageSync('platformId', platformId)
            
            wx.setStorageSync('platformId', 'f2ce8561055a40d5a5e7dcdffde1e8bc');

            if (!!that.data.isMe) {
              this.addVisit4Front(openid,res.data.userVc.id);
            } else {
              this.addVisit4Front(wx.getStorageSync('unshareOpenId'));
            }
            
            this.visitList4Front(res.data.userVc.id);
            this.isPraise();//点赞人今天是否点赞过此名片接口
            this.listArticle(); // 查询已选择资讯
            this.listProduct(); // 查询已选择产品
            this.workExperienceList(res.data.userVc.id); // 查询从业经历列表
            this.educationList(res.data.userVc.id); // 查询学历认证列表
            this.qualificationList(res.data.userVc.id); // 查询资质证书列表
            this.hobbyListUser4Front(res.data.userVc.id);//个人爱好列表
            
          }

          if (!!res.data.userVcBackgroundImage) {
            that.setData({
              backgroundImage: res.data.userVcBackgroundImage.backgroundImage
            })
          }

          if (!!res.data.uuserFzgLoginRequestVO) {
            wx.setStorageSync('userInfo', res.data.uuserFzgLoginRequestVO.userInfo);
          }
        }
      }
    })
  },

  addVisit4Front (openid,id) {
    common.myRequest({
      url: 'lmapi/melzg/card/addVisit4Front',
      data: {
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId,
        enterId: openid,//访问者id
        enterHead: app.globalData.userInfo.avatarUrl,
        beEnterId: wx.getStorageSync('userVc').id
      },
      success: res => {
        if (res.data.status == 'SUCCESS') {
          
        }
      }
    })
  },

  visitList4Front (id) {
    common.myRequest({
      url: 'lmapi/melzg/card/visitList4Front',
      data: {
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId,
        beEnterId: id,
        limit: '4'
      },
      success: res => {
        if (res.data.status == 'SUCCESS') {
          this.setData({
            lmUserVcVisitList: res.data.lmUserVcVisitList,
            isVisit: res.data.total == 0 ? false : true,
            visitCount: res.data.total
          })
        }
      }
    })
  },

  isPraise () {
    common.myRequest({
      url: 'lmapi/melzg/card/isPraise',
      data: {
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId,
        praiseId: wx.getStorageSync('openId'),
        bePraiseId: this.data.userVc.id
      },
      success: res => {
        if (res.data.status == 'SUCCESS') {
          this.setData({
            likeimg: res.data.isPraise == 'Y' ? 'https://upload-10051630.cos.ap-shanghai.myqcloud.com/static/userVc/dlrpic/fav2.png' : 'https://upload-10051630.cos.ap-shanghai.myqcloud.com/static/userVc/dlrpic/fav1.png'
          })
        }
      }
    })
  },

  musicList4Front() {
    common.myRequest({
      url: 'lmapi/melzg/card/musicList4Front',
      data: {
        type: '',
        state: ''
      },
      success: res => {

      }
    })
  },

  companyList4Front() {
    common.myRequest({
      url: 'lmapi/melzg/card/companyList4Front',
      data: {
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId,
      },
      success: res => {

      }
    })
  },

  qualificationList(id) {
    let that = this;
    common.myRequest({
      url: 'lmapi/melzg/card/qualificationList',
      data: {
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId,
        userVcId: id,
        params: {
          limit: 10,
          offset: 0
        }
      },
      success(res) {
        if (res.data.status == 'SUCCESS') {
          if (!!res.data.userVcQualificationList) {
            that.setData({
              userVcQualificationList: res.data.userVcQualificationList
            })
            if(that.data.userVcQualificationList.length == 0 && that.data.isMe == false){
              that.setData({
                isHideViewerQual: false
              })
            }
          }
        }
      }
    })
  },

  remark() {
    common.myRequest({
      url: 'lmapi/melzg/card/remark',
      data: { saasId: app.globalData.saasId },
      success: res => {

      }
    })
  },

  workExperienceList(id) {
    let that = this;
    common.myRequest({
      url: 'lmapi/melzg/card/workExperienceList',
      data: {
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId,
        userVcId: id
      },
      success: res => {
        if (res.data.status == 'SUCCESS') {
          if (!!res.data.userVcWorkExperienceList) {
            that.setData({
              userVcWorkExperienceList: res.data.userVcWorkExperienceList,
              partList: res.data.userVcWorkExperienceList.slice(0,2),
              allList: res.data.userVcWorkExperienceList.slice(2,res.data.userVcWorkExperienceList.length)
            })
            
            if(that.data.userVcWorkExperienceList.length == 0 && that.data.isMe == false){
              that.setData({
                isHideViewerWork: false
              })
            }

            let list = that.data.userVcWorkExperienceList;
            list.forEach(function(item,index){
              let ss = (item.startDate).split('-')
              let ee = (item.endDate).split('-')
              that.setData({
                startDate: ss[0]+'-'+ss[1],
                endDate: ee[0]+'-'+ee[1],
              })
            })

          }
        }
      }
    })
  },

  educationList(id) {
    let that = this;
    common.myRequest({
      url: 'lmapi/melzg/card/educationList',
      data: {
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId,
        userVcId: id
      },
      success: res => {
        if (res.data.status == 'SUCCESS') {
          if (!!res.data.userVcEducationList) {
            that.setData({
              userVcEducationList: res.data.userVcEducationList
            })
            if(that.data.userVcEducationList.length == 0 && that.data.isMe == false){
              that.setData({
                isHideViewerEduc: false
              })
            }
          }
        }
      }
    })
  },

  hobbyListUser4Front(id) {
    let that = this;
    common.myRequest({
      url: 'lmapi/melzg/card/hobbyListUser4Front',
      data: {
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId,
        userVcId: id,
        params: {
          limit: 1000,
          offset: 0
        }
      },
      success: res => {
        if (res.data.status == 'SUCCESS') {
          if (!!res.data.userVcHobbyList) {
            that.setData({
              userVcHobbyList: res.data.userVcHobbyList
            })
            if(that.data.userVcHobbyList.length == 0 && that.data.isMe == false){
              that.setData({
                isHideViewerHobby: false
              })
            }
          }
        }
      }
    })
  },

  listArticle() {
    let that = this;
    common.myRequest({
      url: 'lmapi/melzg/card/listArticle',
      data: {
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId,
        vcId: wx.getStorageSync('userVc').id,
        limit: 10,
        offset: that.data.offset
      },
      success: res => {
        if (res.data.status == 'SUCCESS') {
          if (that.data.offset == 0) {
            that.setData({
              lmArticleList: res.data.lmArticleList,
            })
          } else if (that.data.offset > 0) {
            that.setData({
              lmArticleList: that.data.lmArticleList.concat(res.data.lmArticleList)
            })
          }

          if(that.data.lmArticleList.length == 0 && that.data.isMe == false){
            that.setData({
              isHideViewerArticle: false
            })
          }

          that.setData({
            articleTotal: res.data.total
          })
        }
      }
    })
  },

  listProduct() {
    let that = this;
    common.myRequest({
      url: 'lmapi/melzg/card/listProduct',
      data: {
        agentcode: wx.getStorageSync('userVc').agentCode,
        platformId: app.globalData.platformId,
        saasId: app.globalData.saasId,
        platform: '2'
      },
      success: res => {
        if (res.data.status == 'SUCCESS') {
          if (!!res.data.productList) {
            that.setData({
              productList: res.data.productList
            })
            if(that.data.productList.length == 0 && that.data.isMe == false){
              that.setData({
                isHideViewerProduct: false
              })
            }
          }
        }
      }
    })
  },

  browseCount() {
    common.myRequest({
      url: 'lmapi/melzg/card/browseCount',
      data: {
        agentcode: '',
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId,
        browseType: ''
      },
      success: res => { }
    })
  },

  notice: function () {
    this.setData({
      showModal: true
    })
  },
  speak(){
    wx.navigateTo({
      url: '../questionFeedback/questionFeedback',
    })
  },
  ok: function () {
    this.setData({
      showModal: false
    })
  },
  ask(){
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  },

  editCard () {
    
    this.setData({
      isStartEdit: true,
      remarkSwitch: 0,
      workSwitch: 0,
      educSwitch: 0,
      qualSwitch: 0,
      hobbySwitch: 0,
      productSwitch: 0,
      articleSwitch: 0,

      // isEditPerson: this.data.userVcSwitch.remark == 0 ? true : false,
      // isEditWork: this.data.userVcSwitch.workExperience == 0 ? true : false,
      // isEditEduc: this.data.userVcSwitch.education == 0 ? true : false,
      // isEditQual: this.data.userVcSwitch.qualification == 0 ? true : false,
      // isEditHobby: this.data.userVcSwitch.hobby == 0 ? true : false,
      // isEditGoods: this.data.userVcSwitch.product == 0 ? true : false,
      // isEditArticle: this.data.userVcSwitch.article == 0 ? true : false,
    })
  },

  goodsDetail(e){
    wx.setStorageSync('staticpage', e.currentTarget.dataset.staticpage)
    wx.navigateTo({
      url: '../transPage/transPage?source=' + 'product' + '&productcode=' + e.currentTarget.dataset.productcode + '&briskcode=' + e.currentTarget.dataset.briskcode  + '&producttype=' + e.currentTarget.dataset.producttype + '&staticpage=' + e.currentTarget.dataset.staticpage,
    })
  },
  articleDetail(e){
    wx.navigateTo({
      url: '../articleDetail/articleDetail?articleid=' + e.currentTarget.dataset.articleid,
    })
  },
  closed(){
    this.setData({
      showModal: false
    })
  },
  phone() {
    wx.makePhoneCall({
      phoneNumber: wx.getStorageSync('userVc').mobile,
      success: res => {}
    })
  },

  companyDetail() {
    wx.navigateTo({
      url: '../companyDetail/companyDetail'
    })
  },

  edit () {
    if (this.data.hasUserInfo) {
      if (!!this.data.isStartEdit) {
        wx.navigateTo({
          url: '../edit/edit?userVc=' + JSON.stringify(this.data.userVc),
        })
      } else {
        toast_text._showToast(this, '请点击编辑我的名片按钮~', '', true);
      }
    } else {
      toast_text._showToast(this, '请授权并登录~', '', true);
    }
  },

  checkWechat () {
    if (!!wx.getStorageSync('userVc').wechatUrl) {
      this.setData({
        qrcodeImg: wx.getStorageSync('userVc').wechatUrl,
        qrcode_showModal: true
      })
    } else {
      this.setData({
        qrcode_showModal: false
      })
      toast_text._showToast(this,'顾问暂未上传二维码哦~', '', true);
    }
  },

  hidecode () {
    this.setData({
      qrcode_showModal: false
    })
  },

  previewImage (e) {
    let cur = e.target.dataset.src;//获取本地一张图片链接
		wx.previewImage({
			current: cur, //字符串，默认显示urls的第一张
      urls: [cur], // 数组，需要预览的图片链接列表
      success: function (res) {}
		})
  },

  // 从业经历查看全部
  checkMore () {
    this.setData({
      isOpen: !this.data.isOpen,
    })
  },

  edit_person: function () {
    wx.navigateTo({
      url: '../personEditor/personEditor',
    })
  },
  edit_work: function () {
    wx.navigateTo({
      url: '../experienceEditor/experienceEditor?editway=' + 'add' + '&id=' + wx.getStorageSync('userVc').id,
    })
  },
  edit_education: function () {
    wx.navigateTo({
      url: '../educationEditor/educationEditor?educway=' + 'add' + '&id=' + wx.getStorageSync('userVc').id,
    })
  },
  edit_certificate: function () {
    wx.navigateTo({
      url: '../certification/certification?qualway=' + 'add' + '&qcid=' + wx.getStorageSync('userVc').id,
    })
  },
  qualedit (e) {
    wx.navigateTo({
      url: '../certification/certification?qualway=' + 'edit' + '&qcid=' + e.target.dataset.certid + '&tableid=' + e.target.dataset.tableid,
    })
  },
  edit_hobby: function () {
    wx.navigateTo({
      url: '../hobbyEditor/hobbyEditor',
    })
  },
  edit_products() {
    wx.navigateTo({
      url: '../products/products',
    })
  },
  edit_article() {
    wx.navigateTo({
      url: '../article/article',
    })
  },
  changeImg: function () {
    wx.navigateTo({
      url: '../backgroundImg/backgroundImg',
    })
  },
  changeMusic: function () {
    wx.navigateTo({
      url: '../backgroundMusic/music',
    })
  },


  save_card () {
    let that = this;
    common.myRequest({
      url: 'lmapi/melzg/card/userVcSwitch',
      data: {
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId,
        userVcId: wx.getStorageSync('userVc').id,
        remark: that.data.isremarkOpen,
        workExperience: that.data.isworkOpen,
        education: that.data.iseducOpen,
        qualification: that.data.isqualOpen,
        hobby: that.data.ishobbyOpen,
        product: that.data.isproductOpen,
        article: that.data.isarticleOpen,
      },
      success: res => {
        if (res.data.status == 'SUCCESS') {
          that.setData({
            isStartEdit: false
          })
          that.initializeVc(wx.getStorageSync('openId'))
        } else {
          toast_text._showToast(that, res.data.message, '', true);
        }
      }
    })
  },

  make_poster() {
    wx.request({
      url: 'http://coreuat.cninsure.net/cbsmh/mh/mhThirdService/getAppletQRCode4B',
      data: {
        saasId: app.globalData.saasId,
        platformCode: '2',
        params: {
          scene: wx.getStorageSync('userVc').agentCode
        }
      },
      method: 'POST',
      success: res => {
        if (res.data.status == 'SUCCESS') {
          this.createPosterImg4Front(res.data.params.qrCode);
        }
      }
    })
  },

  createPosterImg4Front (qrCode) {
    let that = this;
    wx.showLoading({
      title: '正在加载中…',
      mask: true
    })
    common.myRequest({
      url: 'lmapi/melzg/card/createPosterImg4Front',
      data: {
        id: wx.getStorageSync('userVc').id,
        openId: wx.getStorageSync('openId'),
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId,
        posterUrl: qrCode
      },
      success: res => {
        wx.hideLoading();
        if (res.data.status == 'SUCCESS') {
          that.setData({
            poster_showModal: true,
            posterUrl: res.data.posterUrl
          })
        } else {
          toast_text._showToast(that, res.data.message, '', true);
        }
      }
    })
  },

  hidePoster() {
    this.setData({
      poster_showModal: false
    })
  },
  // // 保存海报，并且跳转至名片主页
  // save_posterImg() {
  //   let that = this;
  //   wx.getSetting({
  //     success(res) {
  //       if (!res.authSetting['scope.address.scope.writePhotosAlbum']) {
  //         wx.authorize({
  //           scope: 'scope.writePhotosAlbum',
  //           success() {
  //             // 同意获取相册的授权了
  //             that.saveImgToLocal();
  //           },
  //           fail() {
  //             that.setData({
  //               openSettingBtnHidden: false
  //             })
  //           }
  //         })
  //       } else {
  //         // 已经授权过了
  //         that.saveImgToLocal();
  //       }
  //     }
  //   })
  // },
  // // 保存图片到本地
  // saveImgToLocal(e) {
  //   let that = this;
  //   let imgSrc = that.data.imgUrl;
  //   wx.downloadFile({
  //     url: imgSrc,
  //     success(res) {
  //       wx.saveImageToPhotosAlbum({
  //         filePath: res.tempFilePath,
  //         success(data) {
  //           toast_text._showToast(that, '保存成功', '', true);
  //         }
  //       })
  //     }
  //   })
  // },
  // // 授权
  // handleSetting(e) {
  //   var url = '网络图片路径'; 
  //   wx.downloadFile({
  //   url: url,
  //     success: function (res) {
  //     var benUrl = res.tempFilePath;
  //     //图片保存到本地相册
  //     wx.saveImageToPhotosAlbum({
  //     filePath: benUrl,
  //     //授权成功，保存图片
  //     success: function (data) {
  //     wx.showToast({
  //       title: '保存成功',
  //       icon: 'success',
  //       duration: 2000
  //     })
  //     },
  //     //授权失败
  //     fail: function (err) {
  //     if (err.errMsg) {//重新授权弹框确认
  //       wx.showModal({
  //       title: '提示',
  //       content: '您好,请先授权，在保存此图片。',
  //       showCancel: false,
  //       success(res) {
  //       if (res.confirm) {//重新授权弹框用户点击了确定
  //         wx.openSetting({//进入小程序授权设置页面
  //         success(settingdata) {
  //         console.log(settingdata)
  //         if (settingdata.authSetting['scope.writePhotosAlbum']) {//用户打开了保存图片授权开关
  //         wx.saveImageToPhotosAlbum({
  //           filePath: benUrl,
  //           success: function (data) {
  //           wx.showToast({
  //           title: '保存成功',
  //           icon: 'success',
  //           duration: 2000
  //           })
  //           },
  //         })
  //         } else {//用户未打开保存图片到相册的授权开关
  //         wx.showModal({
  //           title: '温馨提示',
  //           content: '授权失败，请稍后重新获取',
  //           showCancel: false,
  //         })
  //         }
  //         }
  //         })
  //       } 
  //       }
  //       })
  //     }
  //     }
  //     })
  //     }
  //   })



  // },
  // 点赞
  likeBtn() {
    if (this.data.hasUserInfo) {
      let priseid;
      if (!!this.data.isMe) {
        priseid = wx.getStorageSync('openId')
      } else {
        priseid = wx.getStorageSync('unshareOpenId');
      }
      common.myRequest({
        url: 'lmapi/melzg/card/praise',
        data: {
          saasId: app.globalData.saasId,
          platformId: app.globalData.platformId,
          praiseId: priseid,
          bePraiseId: this.data.userVc.id
        },
        success: res => {
          if (res.data.status == "SUCCESS") {

            //点赞动效
            wx.vibrateShort();//手机振动
            this.animation = wx.createAnimation({
              duration: 150, // 动画持续时间，单位 ms
              timingFunction: 'linear', // 动画的效果
              delay: 10, // 动画延迟时间，单位 ms
              transformOrigin: '50% 50%' // 动画的中心点
            })
            setTimeout(function () {
              this.animation.scale(1.5).step();
              this.animation.scale(1.0).step();
              this.setData({
                animation: this.animation.export()
              });
            }.bind(this), 50);
            //


            this.setData({
              likeimg: 'https://upload-10051630.cos.ap-shanghai.myqcloud.com/static/userVc/dlrpic/fav2.png',
              praiseCount: res.data.praiseCount
            })
          } else {
            toast_text._showToast(this, '每天最多为TA点赞5次哦~', '', true);
            this.setData({
              likeimg: 'https://upload-10051630.cos.ap-shanghai.myqcloud.com/static/userVc/dlrpic/fav2.png'
            })
          }
        }
      })
    }

    
  },

  disable_cancel () {
    this.setData({
      disable_showModal: false
    })
  },

  // 分享
  shareCard() {

  },
  // 模块显示
  showModule(e) {
    let type = e.currentTarget.dataset.type;
    if (type == '1') {
      this.setData({
        isEditPerson: false,
        isremarkOpen: 1
      })
    } else if (type == '2') {
      this.setData({
        // isShowHonor: false
      })
    } else if (type == '3') {
      this.setData({
        isEditWork: false,
        isworkOpen: 1
      })
    } else if (type == '4') {
      this.setData({
        isEditStudy: false
      })
    } else if (type == '5') {
      this.setData({
        isEditEduc: false,
        iseducOpen: 1
      })
    } else if (type == '6') {
      this.setData({
        isEditQual: false,
        isqualOpen: 1
      })
    } else if (type == '7') {
      this.setData({
        isEditHobby: false,
        ishobbyOpen: 1
      })
    } else if (type == '8') {
      this.setData({
        isEditGoods: false,
        isproductOpen: 1
      })
    } else if (type == '9') {
      this.setData({
        isEditArticle: false,
        isarticleOpen: 1
      })
    }
  },
  // 模块隐藏
  hideModule(e) {
    let type = e.currentTarget.dataset.type;
    if (type == '1') {
      this.setData({
        isEditPerson: true,
        isremarkOpen: 0
      })
    } else if (type == '2') {
      this.setData({
        // isShowHonor: true
      })
    } else if (type == '3') {
      this.setData({
        isEditWork: true,
        isworkOpen: 0
      })
    } else if (type == '4') {
      this.setData({
        isEditStudy: true
      })
    } else if (type == '5') {
      this.setData({
        isEditEduc: true,
        iseducOpen: 0
      })
    } else if (type == '6') {
      this.setData({
        isEditQual: true,
        isqualOpen: 0
      })
    } else if (type == '7') {
      this.setData({
        isEditHobby: true,
        ishobbyOpen: 0
      })
    } else if (type == '8') {
      this.setData({
        isEditGoods: true,
        isproductOpen: 0
      })
    } else if (type == '9') {
      this.setData({
        isEditArticle: true,
        isarticleOpen: 0
      })
    }
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    if ((that.data.lmArticleList).length < that.data.articleTotal) {
      let offset = that.data.offset + 10;
      that.setData({
        offset: offset
      })
      that.listArticle();
    }
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    // console.log(res)//res.from,页面上有分享按钮走的button，右上角菜单走menu

    let shareId;
    if (this.data.masterOpenid) {
      shareId = this.data.masterOpenid
    } else {
      shareId = wx.getStorageSync('openId');
    }
    console.log('分享者openId---',shareId)
    console.log('被分享人openId---',this.data.masterOpenid)
    return {
      title: this.data.userVc.name + '的名片',
      path: '/pages/guide/guide?openid=' + shareId,
      success: function (res) {
        // this.setData({
        //   isStartEdit: false
        // })
      }
    }
  },

  editExperience (e) {
    wx.navigateTo({
      url: '../experienceEditor/experienceEditor?editway=' + 'edit' + '&id=' + e.currentTarget.dataset.editid,
    })
  },

  editEducation (e) {
    wx.navigateTo({
      url: '../educationEditor/educationEditor?educway=' + 'edit' + '&id=' + e.currentTarget.dataset.educid,
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onshow调初始化')
    console.log('onshow  openid---',wx.getStorageSync('openId'))
    console.log('onshow  initopenid---',this.data.initopenid)
    if (!!this.data.initopenid) {
      this.initializeVc(this.data.initopenid)
    } else {
      this.initializeVc(wx.getStorageSync('openId'));
    }
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    wx.setBackgroundTextStyle({
      textStyle: 'dark' // 下拉背景字体、loading 图的样式为dark
    })
    // // setTimeout(function(){
    //   this.initializeVc(wx.getStorageSync('openId'));
    // // },1000)

    // this.initializeVc(this.data.initopenid);
    console.log('刷新入参---',wx.getStorageSync('openId'))
    console.log('分享人openid---',wx.getStorageSync('shareId'))
    console.log('initopenid---',this.data.initopenid)
    // this.initializeVc(wx.getStorageSync('openId'));
    this.initializeVc(this.data.initopenid)

  },


  /**
   * 分享到朋友圈，目前只支持Android 
   */
  // onShareTimeline(res){
  //   console.log(res)

  //   let shareId;
  //   if (this.data.masterOpenid) {
  //     shareId = this.data.masterOpenid
  //   } else {
  //     shareId = wx.getStorageSync('openId');
  //   }
  //   return {
  //     title: this.data.userVc.name + '的名片',
  //     path: '/pages/index/index?openid=' + shareId,
  //     success: function (res) {
        
  //     }
  //   }
  // }

  

})
