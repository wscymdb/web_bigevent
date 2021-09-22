// 每次调用$ajax(包括$.get/post)发送请求的时候
// 会先调用ajaxPrefilter这个函数
// 这个函数中可以拿到Ajax提供的配置对象
<<<<<<< HEAD
$.ajaxPrefilter(function(options) {
  options.url = 'http://api-breakingnews-web.itheima.net'+options.url
=======
$.ajaxPrefilter(function (options) {
  options.url = 'http://api-breakingnews-web.itheima.net' + options.url

  // 为以‘/my’开头的api添加headers请求头
  if (/\/my/.test(options.url)) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }

  // 全局统一挂载complete函数
  // jq的Ajax无论请求成功与否都会调用complete函数
  options.complete = function complete(res) {
    console.log(res);
    if (res.responseJSON.status !== 0 && res.responseJSON.message === '身份认证失败！') {
      // 强制跳转登录
      // 清空token为了防止用户手动输入假的token
      localStorage.removeItem('token')
      location.replace('/login.html')
    }
  }
>>>>>>> index
})