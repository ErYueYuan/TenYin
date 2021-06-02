import common from '../../utils/common.js';
let COS = require('../../utils/cos-wx-sdk-v5.js');
let toast_text = require('../../compoents/toast_text/toast.js');
const util = require('../../utils/util.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgs: [],
    isUpload: false,
    qualway: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let isIphoneX = app.globalData.isIphoneX;
    this.setData({
      isIphoneX: isIphoneX,
      qualway: options.qualway,
      qualid: options.qcid,
      qualificationName: options.qcname,
      tableid: options.tableid
    })
    if (this.data.qualway == 'edit') {
      this.getQualification();//资质证书详情查询
    }
  },

  choose: function () {
    wx.navigateTo({
      url: '../certificateType/certificateType?qualway=' + this.data.qualway
    })
  },

  codeBlur (e) {
    this.setData({
      qualificationCode: e.detail.value
    })
  },

  chooseImg () {
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['orignial', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        util.imgCheck(res.tempFilePaths[0]).then(rt=>{
          if(JSON.parse(rt.data).status == 'SUCCESS'){
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
                qualificationImage: 'https://' + data.Location
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

  delBtn () {
    this.operationQualification('delete');
  },

  saveBtn () {
    if (this.data.qualway == 'edit') {
      this.operationQualification('modify');
    } else if (this.data.qualway == 'add') {
      this.operationQualification('save');
    }
  },

  getQualification () {
    let that = this;
    common.myRequest({
      url: 'lmapi/melzg/card/getQualification',
      data: {
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId,
        id: that.data.tableid
      },
      success: res => {
        if (res.data.status == 'SUCCESS') {
          that.setData({
            qualificationName: res.data.userVcQualification.className,
            qualid: res.data.userVcQualification.qualoficationId,
            qualificationCode: res.data.userVcQualification.qualoficationCode,
            imgs: [res.data.userVcQualification.qualoficationImage],
            isUpload: true
          })
        } else {
          toast_text._showToast(that,res.data.message,'',true);
        }
      }
    })
  },

  operationQualification (way) {
    let that = this;
    if (!that.data.qualificationName) {
      toast_text._showToast(that,'请选择证书类别','',true)
      return false
    }
    if (!that.data.qualificationCode) {
      toast_text._showToast(that,'请填写您的证书编码','',true)
      return false
    }
    if (way == 'save') {
      if (!that.data.qualificationImage) {//that.data.imgs[0]
        toast_text._showToast(that,'请上传您的证书图片','',true)
        return false
      }
    } else {
      if (!that.data.imgs[0]) {
        toast_text._showToast(that,'请上传您的证书图片','',true)
        return false
      }
    }
    
    common.myRequest({
      url: 'lmapi/melzg/card/qualification',
      data: {
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId,
        userVcId: wx.getStorageSync('userVc').id,
        id: that.data.tableid,
        way: way,
        qualificationCode: that.data.qualificationCode,
        qualificationImage: that.data.qualificationImage,
        qualificationId: that.data.qualid,//证书id
      },
      success: res => {
        if (res.data.status == 'SUCCESS') {
          // wx.redirectTo({
          //   url: '../index/index',
          // })
          let pages = getCurrentPages();
          console.log('资格认证页面栈数量  pages---',pages)
          console.log('资格认证页面栈数量的长度  pages.length---',pages.length)
          if (pages.length <= 2) {
            console.log('length=2')
            wx.navigateBack({
              delta: 1,
            })
          } else if (pages.length > 2) {
            console.log('length>2')
            // wx.navigateBack({
            //   delta: 2,
            // })
            wx.navigateTo({
              url: '../index/index',
            })
          }
          
        } else {
          toast_text._showToast(that,res.data.message,'',true);
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