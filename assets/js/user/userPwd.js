$(function () {
  // 导入form
  let form = layui.form;
  // 表单验证
  form.verify({
    pwd: [
      /^[\S]{6,12}$/
      , '密码必须6到12位，且不能出现空格'
    ],
    samePwd: function (value) {
      if (value === $('[name=oldPwd]').val()) {
        return '新密码不能与旧密码一致'
      }
    },
    repwd(value) {
      if (value !== $('[name=newPwd]').val()) {
        return '两次密码不一致!'
      }
    }
  })
  // 获取信息,发送请求
  $('.layui-form').on('submit',function(e){
    console.log(1);
    e.preventDefault();
    // 获取信息
   
    $.ajax({
      method:'POST',
      url:'/my/updatepwd',
      data:$(this).serialize(),
      success(res) {
        console.log(res);
        if(res.status !==0) return layer.msg('更新密码失败')
        layer.msg('更新密码成功')
        $('.layui-form')[0].reset()
      }
    })
  })
})