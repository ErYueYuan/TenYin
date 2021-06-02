// toast.js

/**
 * 显示toast 默认3000ms
 */
function _showToast(page, _toastText, _isShowMask) {

  // toast时间  
  let count = parseInt(count) ? parseInt(count) : 3000;

  page.setData({
    //设置toast时间，toast内容  
    _toastText: _toastText,
    // 显示toast  
    _isShowToast: true,
    _isShowMask: true,
  });

  // 定时器关闭  
  setTimeout(function() {
    page.setData({
      _isShowToast: false,
      _isShowMask: false
    });
  }, count);
}

/**
 * 显示toast 默认1500ms 
 */
function showToastDefault(page, toastText) {
  this._showToast(page, toastText, false);
}

/**
 * 全屏不可点击 显示toast 默认2000ms 
 */
function showToastWithMask(page, toastText) {
  this._showToast(page, toastText, false);
}

module.exports = {
  _showToast: _showToast,
  showToastDefault: showToastDefault,
  showToastWithMask: showToastWithMask
}