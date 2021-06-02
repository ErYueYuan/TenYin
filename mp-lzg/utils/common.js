// 运行版本：开发版UAT  develop，体验版生产  trial，正式版生产  release
// 接口地址  开发 https://ts.sxtong.cn/   体验 https://wxuat.sxtong.cn/   生产 https://wx.sxtong.cn/
const myRequest = function (options) {
  let version = __wxConfig.envVersion;
  if (version == 'develop') {
    let domain = 'https://ts.sxtong.cn/'
    options.url = domain + options.url;
  } else if (version == 'trial') {
    let domain = 'https://wxuat.sxtong.cn/'
    options.url = domain + options.url;
  } else if (version == 'release') {
    let domain = 'https://wx.sxtong.cn/'
    options.url = domain + options.url;
  }
  options.header = {
    'appId': getApp().globalData.appId,
    'content-type': 'application/json',
    'sharetoken': wx.getStorageSync('token')
  }
  options.method = 'POST';
  var successCB = options.success;
  options.success = function (res) {
    successCB(res)
  }
  wx.request(options)
}

const myRequestGet = function (options) {
  let version = __wxConfig.envVersion;
  if (version == 'develop') {
    let domain = 'https://ts.sxtong.cn/'
    options.url = domain + options.url;
  } else if (version == 'trial') {
    let domain = 'https://wx.sxtong.cn/'
    options.url = domain + options.url;
  } else if (version == 'release') {
    let domain = 'https://wx.sxtong.cn/'
    options.url = domain + options.url;
  }
  options.header = {
    'appId': getApp().globalData.appId,
    'content-type': 'application/json',
    'sharetoken': wx.getStorageSync('token')
  }
  options.method = 'GET';
  var successCB = options.success;
  options.success = function (res) {
    successCB(res)
  }
  wx.request(options)
}

module.exports = {
  myRequest: myRequest,
  myRequestGet: myRequestGet
}