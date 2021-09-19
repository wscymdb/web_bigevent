// 每次调用$ajax(包括$.get/post)发送请求的时候
// 会先调用ajaxPrefilter这个函数
// 这个函数中可以拿到Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
  options.url = 'http://api-breakingnews-web.itheima.net'+options.url
})