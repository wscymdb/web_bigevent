$(function () {
  // 导入
  let form = layui.form;
  // 渲染信息
  initUserInfo()
  // 表单验证
  form.verify({
    nickname(val) {
      if (val.length > 6) return '昵称的长度要是1~6之间哦！'
    }
  })
  // 收集信息，发送请求(监听表单提交事件)
  $('.layui-form').on('submit', (e) => {
    // 阻止默认行为
    e.preventDefault();
    // 获取信息
    let data = {
      id: $('[name=uid]').val(),
      nickname: $('[name=nickname]').val(),
      email: $('[name=uemail]').val()
    }
    // 发送请求
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data,
      success(res) {
        if (res.status !== 0) {
          return layer.msg(res.msg)
        }
        // 更新头像区域
        // 调用父也页面的getUserInfo
        // window表示当前的iframe
        // window.parent 表示index.html
        window.parent.getUserInfo();
        layer.msg('修改成功', { icon: 1 })
      }
    })
  })
  // 点击重置按钮，就数据恢复成以前的样子
  $('[type=reset]').on('click', (e) => {
    e.preventDefault();
    initUserInfo();
  })
})
// 获取用户信息
// 获取用户基本信息
function initUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    success(res) {
      // console.log(res);
      if (res.status !== 0) {
        return layer.msg(res.message, { icon: 5 });
      }
      // 调用函数。渲染用户信息
      renderForm(res.data)
    }

  })
}
// 渲染用户信息到表单
function renderForm(user) {
  // 用户的id
  uid = user.id;
  // 渲染
  $('[name=uid]').val(user.id);
  $('[name=uname]').val(user.username);
  $('[name=nickname]').val(user.nickname);
  $('[name=uemail]').val(user.email);
}