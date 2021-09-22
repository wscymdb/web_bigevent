$(function () {
  
  // 点击去登录链接时隐藏注册反之则隐藏登录
  $('#linkReg').on('click', function () {
    $('.loginBox').hide();
    $('.regBox').show();
  });

  $('#linkLogin').on('click', function () {
    $('.loginBox').show();
    $('.regBox').hide();
  });

  // 表单校验规则相关
  // 从layui中获取form
  let form = layui.form
  // 添加表单验证规则
  form.verify({
    pwd: [
      /^[\S]{6,12}$/
      , '密码必须6到12位，且不能出现空格'
    ],
    // 确认密码校验规则
    repwd: function (val) {
      // val 表示当前输入的值
      // 通过对比密码的值和确认密码的值判断
      let pwd = $(".regBox [name=upwd]").val()
      if (pwd !== val) {
        return '两次密码不一致'
      }
    }
  })
  // 注册发送请求相关
  $('.regBox .layui-form').on('submit', (e) => {
    // 阻止默认提交行为
    e.preventDefault();
    // 搜集输入的信息
    let data = {
      username: $('.regBox [name=uname]').val(),
      password: $('.regBox [name=upwd]').val(),
    }
    // 发送请求
    $.ajax({
      method: 'POST',
      url: '/api/reguser',
      data,
      success(res) {
        console.log(res);
        if (res.status !== 0) {
          return layer.msg(res.message, { icon: 5 });
        }
        layer.msg(res.message + '请登录', { icon: 6 })
        // 注册成功，跳转到登录页面
        // 模拟人点击
        $('#linkLogin').click()
      }
    })
  })
  // 登录相关
  $('.loginBox .layui-form').on('submit', (e) => {
    // 阻止默认行为
    e.preventDefault()
    // 获取相关的数据
    let data = { username: $('.loginBox [name=uname]').val(), password: $('.loginBox [name=upwd]').val() }
    // 发送请求
    $.ajax({
      method: 'POST',
      url: '/api/login',
      data,
      success(res) {
        console.log(res);
        if (res.status !== 0) {
          return layer.msg(res.message, { icon: 5 });
        }
        layer.msg(res.message, { icon: 6 })
        // 将token值暂时存入浏览器中
        localStorage.setItem('token',res.token)
        // 跳转到后台首页
        location.replace('../../index.html') 
        //
      }
    })
  })
})
