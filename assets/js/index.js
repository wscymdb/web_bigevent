$(function () {
  // 获取用户信息
  getUserInfo();
  // 用户点击退出
  $('#btnLogout').on('click', () => {
    layer.confirm('确定退出登录?', { icon: 3, title: '温馨提醒' }, function (index) {
      //清空token，跳转到登录
      localStorage.removeItem('token');
      location.replace('/login.html');
      // 关闭弹出层  自带的
      layer.close(index);
    });
  })
})

// 获取用户基本信息
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    // 请求头配置对象
    // headers: {
    //   Authorization: localStorage.getItem('token') || ''
    // },
    success(res) {
      // console.log(res);
      if (res.status !== 0) {
        return layer.msg(res.message, { icon: 5 });
      }
      // 调用函数。渲染用户头像
      renderAvatar(res.data)
    }
    
  })
}
// 渲染用户头像
function renderAvatar(user) {
  let uname = user.nickname || user.username;
  // 替换用户的名称 有昵称优先替换没有则替换登录名
  $('#welcome').html('你好&nbsp;' + uname)
  // 判断用户头像
  if (user.user_pic) {
    // 如果有头像图片
    $('.text-avatar').hide();
    $('.layui-nav-img').attr('src', user_pic);
    return
  }
  // 没有头像,截取用户名的首字符作为头像
  $('.layui-nav-img').hide();
  // 截取第一个字符
  uname = uname.substr(0, 1).toUpperCase()
  // 替换
  $('.text-avatar').html(uname)
}
// 用户退出事件