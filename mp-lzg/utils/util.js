const common = require('../utils/common.js')


const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//用户名
const username = code => {
  if (code.length == 11) {
    let regex = /^1\d{10}$/;
    if (regex.test(code)) {
      return true
    }
  } else if (code.length > 0 && code.length <= 9) {
    let regex = /^\d{9}$/;
    if (regex.test(code)) {
      return true
    }
  } else if (code.length > 9 && code.length < 11) {
    let regex = /^1\d{10}$/;
    if (regex.test(code)) {
      return true
    }
  }
}

//密码
const password = pass => {
  let regex = /^[a-zA-Z0-9!@`~#$%^&*()_+-=\|;':",.<>?]{6,18}$/;
  if (regex.test(pass)) {
    return true
  }
}

//昵称
const name = name => {
  let regex = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/;
  if (regex.test(name)) {
    return true
  }
}

//手机
const mobile = mobile => {
  let regex = /^1\d{10}$/;
  if (regex.test(mobile)) {
    return true
  }
}

// 字符串转16进制
function strToHexCharCode (str) {
  if(str === '')
    return ''
  let hexCharCode = []
  hexCharCode.push('0x')
  for(var i = 0; i < str.length; i++) {
    hexCharCode.push((str.charCodeAt(i)).toString(16))
  }
  return hexCharCode.join('')
}


// 文本内容安全校验接口
const msgCheck = function (con) {
  return new Promise((resolve) => {
    common.myRequest({
      url: 'lmapi/melzg/card/msgSecCheck',
      data: {content: con},
      success: res => {
        resolve(res)
      }
    })
  })
}

// 图片内容安全校验接口
const imgCheck = function (con) {
  return new Promise((resolve)=>{
    wx.uploadFile({
      url: 'https://wx.sxtong.cn/lmapi/melzg/card/imgSecCheck',
      method: 'POST',
      filePath: con,
      name: 'media',
      header: {
        'content-type': 'multipart/form-data',
        'sharetoken': wx.getStorageSync('token')
      },
      success: function(res) {
        resolve(res)
      },
    })
  })
}

/**
 * 处理富文本里的图片宽度自适应
 * 1.去掉img标签里的style、width、height属性
 * 2.img标签添加style属性：max-width:100%;height:auto
 * 3.修改所有style里的width属性为max-width:100%
 * 4.去掉<br/>标签
 */
const richImg = function (html) {
  let newContent = html.replace(/<img[^>]*>/gi, function(match,capture){
    match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
    match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
    match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
    return match;
  });
  newContent = newContent.replace(/style="[^"]+"/gi, function(match,capture){
    match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
    return match;
  });
  newContent = newContent.replace(/<br[^>]*\/>/gi, '');
  newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;margin-top:0;margin-bottom:0;"');
  return newContent;
}





module.exports = {
  formatTime: formatTime,
  username: username,
  password: password,
  name: name,
  mobile: mobile,
  strToHexCharCode: strToHexCharCode,
  msgCheck: msgCheck,
  imgCheck: imgCheck,
  richImg: richImg
}
