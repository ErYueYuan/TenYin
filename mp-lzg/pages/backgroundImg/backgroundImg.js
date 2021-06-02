let COS = require('../../utils/cos-wx-sdk-v5.js');
import common from '../../utils/common.js';
let toast_notice = require('../../compoents/toast_notice/toast.js');
let toast_text = require('../../compoents/toast_text/toast.js');
const util = require('../../utils/util.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userVcBackgroundImageList: [],
    image_showModal: false,
    backgroundImgs: [],
    userVcImageId: '',
    userVcImageSrc: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userVc: wx.getStorageSync('userVc')
    })
    this.imageList();
  },

  imageList: function () {
    let that = this;
    common.myRequest({
      url: 'lmapi/melzg/card/imageList4Front',
      data: {
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId,
        userVcId: that.data.userVc.id,
        params: {
          limit: 10,
          offset: 0
        }
      },
      success: res => {
        if (res.data.status == 'SUCCESS') {
          if (!!res.data.userVcBackgroundImageList) {
            that.setData({
              userVcBackgroundImageList: res.data.userVcBackgroundImageList
            })
          }
        }
      }
    })

  },

  photos() {
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['orignial', 'compressed'],
      sourceType: ['album'],
      success: function (res) {
        util.imgCheck(res.tempFilePaths[0]).then(rt=>{
          if(JSON.parse(rt.data).status == 'SUCCESS'){
            //上传COS
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
                backgroundImgs: tempFilePaths,
                image_showModal: true,
                userVcImageId: '',
                userVcImageSrc: 'https://' + data.Location
              })
            });
            
          } else {
            toast_text._showToast(that, '图片含有敏感信息，请重新上传', '', true);
          }
        })
      }
    })
  },

  camera() {
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['orignial', 'compressed'],
      sourceType: ['camera'],
      success: function (res) {
        util.imgCheck(res.tempFilePaths[0]).then(rq=>{
          if(JSON.parse(rq.data).status == 'SUCCESS'){
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
                  backgroundImgs: tempFilePaths,
                  image_showModal: true,
                  userVcImageId: '',
                  userVcImageSrc: 'https://' + data.Location
                })
            });

          } else {
            toast_text._showToast(that, '图片含有敏感信息，请重新上传', '', true);
          }
        })
        
      }
    })
  },

  previewImage: function (e) {    
    this.setData({
      backgroundImgs: [e.currentTarget.dataset.src],
      image_showModal: true,
      userVcImageId: e.currentTarget.dataset.id,
      userVcImageSrc: '',//e.currentTarget.dataset.src
    })
  },

  // 设为背景
  saveImage () {
    let that = this;
    common.myRequest({
      url: 'lmapi/melzg/card/doSetVcImage',
      data: {
        saasId: app.globalData.saasId,
        platformId: app.globalData.platformId,
        openId: wx.getStorageSync('openId'),
        id: wx.getStorageSync('userVc').id,
        userVcImageId: !!that.data.userVcImageId ? that.data.userVcImageId : '',//背景图id
        backgroundImage: !!that.data.userVcImageSrc ? that.data.userVcImageSrc : '',//自定义背景图地址
      },
      success: res => {
        if (res.data.status == 'SUCCESS') {
          that.setData({
            image_showModal: false
          })
          // wx.redirectTo({
          //   url: '../index/index',
          // })
          wx.navigateBack({
            delta: 1,
          })
        } else {
          toast_text._showToast(that,res.data.message,'',true)
        }
      }
    })
  },

  hideImg() {
    this.setData({
      image_showModal: false
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