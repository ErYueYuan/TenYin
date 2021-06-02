import common from '../../utils/common.js';
let toast_text = require('../../compoents/toast_text/toast.js');
let COS = require('../../utils/cos-wx-sdk-v5.js');
const util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // sexList: [
    //   {
    //     id: 'F',
    //     name: '女'
    //   },
    //   {
    //     id: 'M',
    //     name: '男'
    //   },
    //   {
    //     id: 'X',
    //     name: '未知'
    //   }
    // ],
    sexList: [
      {
        id: 'F',
        name: '女'
      },
      {
        id: 'M',
        name: '男'
      }
    ],
    head_default: 'https://upload-10051630.cos.ap-shanghai.myqcloud.com/static/userVc/dlrpic/personal_head.png',
    currentDate: '',
    userVc: '',
    isDis: false,
    imgs: [],
    isUpload: false,
    headimgs: [],
    sourceTypeList: ['album', 'camera'],
    userVcCompanyList: '',
    companyName: '',
    companyContent: '',
    companyValue: [0],//设置默认显示的index
    company_value: '0',
    newlist: [],
    showSelector:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log('page  edit  options',JSON.parse(options.userVc))
    let usersex = JSON.parse(options.userVc).sex
    let head_img = JSON.parse(options.userVc).head
    this.setData({
      userVc: JSON.parse(options.userVc),
      sex_index: usersex == 'M' ? 0 : (usersex == 'F' ? 1 : 2),
      head: !!head_img ? head_img : this.data.head_default,
      userInfo: wx.getStorageSync('userInfo')
    })
    

    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    var Y =date.getFullYear(); 
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); 
    this.setData({
      currentDate: Y + '-'  + M+ '-' + D,
      companyValue: [0]
    })
    // console.log('当前日期：',this.data.currentDate)

    this.companyList4Front();
    this.detailVc();
    
  },

  companyList4Front () {
    let that = this;
    common.myRequest({
      url: 'lmapi/melzg/card/companyList4Front',
      data: {
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId
      },
      success: res => {
        if (res.data.status == 'SUCCESS') {
          that.setData({
            userVcCompanyList: res.data.userVcCompanyList
          })
        } else {
          toast_text._showToast(that, res.data.message, '', true);
        }
      }
    })
  },

  detailVc () {
    let that = this;
    common.myRequest({
      url: 'lmapi/melzg/card/detailVc',
      data: {
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId,
        vcId: wx.getStorageSync('userVc').id,
        openId: wx.getStorageSync('openId')
      },
      success: res => {
        if (res.data.status == 'SUCCESS') {
          that.setData({
            userVc: res.data.userVc,
            slogan: res.data.userVc.slogan,
            birthday: res.data.userVc.birthday,
            userName: res.data.userVc.name,
            userMobile: res.data.userVc.mobile
          })
          if (!!res.data.userVc.wechatUrl) {
            that.setData({
              imgs: [res.data.userVc.wechatUrl],
              isUpload: true
            })
          } else {
            that.setData({
              isUpload: false
            })
          }

          if (!!res.data.userVcCompany) {
            that.setData({
              companyName: res.data.userVcCompany.companyName,
              companyContent: res.data.userVcCompany.content,
              companyid: res.data.userVcCompany.id,
              // company_index: (that.data.userVcCompanyList).findIndex(item => {
              //   return item.id = res.data.userVcCompany.id
              // })
            })
          }
        } else {
          toast_text._showToast(that, res.data.message, '', true);
        }
      }
    })
  },

  

  changeHeadImg() {
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['orignial', 'compressed'],
      sourceType: ['album','camera'],
      success: function (res) {
        util.imgCheck(res.tempFilePaths[0]).then(rt=>{// res.tempFiles[0].path
          if (JSON.parse(rt.data).status == 'SUCCESS') {
            let Bucket = app.globalData.Bucket;
            let Region = app.globalData.Region;
            let tempFilePaths = res.tempFilePaths;
            let filePath = res.tempFiles[0].path;
            let filename = filePath.substr(filePath.lastIndexOf('/') + 1);
            let cos = new COS({
              getAuthorization: function (options, callback) {
                // 异步获取签名
                common.myRequestGet({
                  url: 'lmapi/config/tpTencent/cos/sign',
                  data: {},
                  success: res => {
                    let data = res.data;
                    callback({
                      TmpSecretId: data.tmpSecretId,
                      TmpSecretKey: data.tmpSecretKey,
                      XCosSecurityToken: data.token,
                      ExpiredTime: data.expiredTime,
                    });
                  }
                })
              }
            })
            cos.postObject({
              Bucket: Bucket,
              Region: Region,
              Key: filename,
              FilePath: filePath,
              onProgress: function (info) {
                console.log(JSON.stringify(info));
              }
            }, function (err, data) {
              console.log(err || data);
              that.setData({
                headimgs: tempFilePaths,
                head: 'https://' + data.Location
              })
            });
          } else {
            toast_text._showToast(that, '图片含有敏感信息，请重新上传', '', true);
          }
        })
      }
    })
  },

  chooseCompany () {
    this.setData({
      // showSelector: true
      showSelector: false,//一期暂时不能修改公司
    })
  },
  closeCompanyMask () {
    this.setData({
      showSelector: false
    })
  },
  // bindComapnyChange (e) {
  //   this.setData({
  //     company_value: e.detail.value[0]
  //   })
  //   this.setData({
  //     newlist: (this.data.userVcCompanyList).find((value,index)=>{
  //       return index == this.data.company_value
  //     })
  //   })

  //   this.setData({
  //     companyid: this.data.newlist.id,
  //     companyName: this.data.newlist.companyName,
  //     companyContent: this.data.newlist.content
  //   })
  // },
  // cancelChoose(){
  //   this.setData({
  //     companyid: '',
  //     companyContent: '',
  //     companyName: ''
  //   })
  // },




  bindSexChange(e){
    this.setData({
      sex_index: e.detail.value,
      sexid: e.target.dataset.sexid
    })
  },

  
  chooseImg () {
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['orignial', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        util.imgCheck(res.tempFilePaths[0]).then(rq=>{
          if (JSON.parse(rq.data).status == 'SUCCESS') {
            let Bucket = app.globalData.Bucket;
            let Region = app.globalData.Region;
            let tempFilePaths = res.tempFilePaths;
            let filePath = res.tempFiles[0].path;
            let filename = filePath.substr(filePath.lastIndexOf('/') + 1);
            let cos = new COS({
              getAuthorization: function (options, callback) {
                // 异步获取签名
                common.myRequestGet({
                  url: 'lmapi/config/tpTencent/cos/sign',
                  data: {},
                  success: res => {
                    let data = res.data;
                    callback({
                      TmpSecretId: data.tmpSecretId,
                      TmpSecretKey: data.tmpSecretKey,
                      XCosSecurityToken: data.token,
                      ExpiredTime: data.expiredTime,
                    });
                  }
                })
              }
            })
            cos.postObject({
              Bucket: Bucket,
              Region: Region,
              Key: filename,
              FilePath: filePath,
              onProgress: function (info) {
                console.log(JSON.stringify(info));
              }
            }, function (err, data) {
              console.log(err || data);
              that.setData({
                imgs: tempFilePaths,
                isUpload: true,
                newcode: 'https://' + data.Location
              })
            });
          } else {
            toast_text._showToast(that, '图片含有敏感信息，请重新上传', '', true);
          }
        })
      }
    })
  },

  previewImg (e) {
    let current = e.target.dataset.src;
    wx.previewImage({
      urls: this.data.imgs,
      current: current,
      success: function (res) {
        console.log('预览成功')
      }
    })
  },

  bindDateChange: function (e) {
    this.setData({
      birthday: e.detail.value
    })
  },

  nameBlur(e){
    if (!!e.detail.value) {
      util.msgCheck(e.detail.value).then(res=>{
        if (res.data.status == 'SUCCESS') {
          if (util.name(e.detail.value)) {
            this.setData({
              userName: e.detail.value
            })
            return true;
          } else {
            toast_text._showToast(this,'请填写规范的名片姓名','',true)
            this.setData({
              userName: ""
            })
            return false
          }
        } else {
          this.setData({
            userName: ""
          })
          toast_text._showToast(this, '输入内容含有敏感词汇，请修改', '', true);
        }
      })
    }
  },

  telBlur(e){
    if (!!e.detail.value) {
      util.msgCheck(e.detail.value).then(res=>{
        if (res.data.status == 'SUCCESS') {
          if (util.mobile(e.detail.value)) {
            this.setData({
              userMobile: e.detail.value
            })
            return true;
          } else {
            toast_text._showToast(this,'请填写规范的名片联系电话','',true)
            this.setData({
              userMobile: ""
            })
            return false
          }
        } else {
          this.setData({
            userMobile: ""
          })
          toast_text._showToast(this, '输入内容含有敏感词汇，请修改', '', true);
        }
      })
    }
  },

  sloganBlur(e){
    if(e.detail.value.length > 0){
      util.msgCheck(e.detail.value).then(res=>{
        if (res.data.status == 'SUCCESS') {
          this.setData({
            slogan: e.detail.value
          })
        } else {
          this.setData({
            slogan: ''
          })
          toast_text._showToast(this, '输入内容含有敏感词汇，请修改', '', true);
        }
      })
    }
  },

  companyDetail() {
    wx.navigateTo({
      url: '../companyDetail/companyDetail',
    })
  },

  // 保存按钮
  saveInfo(){
    let that = this;
    if (!that.data.userName) {
      toast_text._showToast(that,'请填写名片姓名','',true)
      return false
    } else if (!util.name(that.data.userName)) {
      toast_text._showToast(that,'请填写规范的名片姓名','',true)
      return false
    }

    if (!that.data.userMobile) {
      toast_text._showToast(that,'请填写名片联系电话','',true)
      return false
    } else if (!util.mobile(that.data.userMobile)) {
      toast_text._showToast(that,'请填写规范的名片联系电话','',true)
      return false
    }

    common.myRequest({
      url: 'lmapi/melzg/card/editVc',
      data: {
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId,
        id: wx.getStorageSync('userVc').id,
        name: that.data.userName,
        mobile: that.data.userMobile,
        slogan: that.data.userVc.slogan,
        sex: that.data.sexid,
        birthday: that.data.birthday,
        wechatUrl: that.data.imgs[0],
        companyId: that.data.companyid,
        companyContent: that.data.companyContent,
        head: that.data.head,
        wechatUrl: that.data.newcode, //微信二维码
        slogan: that.data.slogan
      },
      success: res => {
        if (res.data.status == 'SUCCESS') {
          wx.navigateBack({
            delta: 1,
          })
        } else {
          toast_text._showToast(that,res.data.message,'',true)
        }
      }
    })
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