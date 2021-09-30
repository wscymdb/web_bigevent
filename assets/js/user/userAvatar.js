$(function () {
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比 选中框的大小
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)

  // 为上传按钮绑定单击事件
  $('#btnChooseImg').on('click', () => {
    // 调用file框得单击事件
    $('#file').click()
    // console.dir($('#file')[0]);
  })

  // 为文件选择框绑定change事件
  $('#file').on('change', (e) => {
    // 获取用户选择的文件
    let file = e.target.files[0]
    // 判断用户是否上传了照片
    let filelist = e.target.files
    if (filelist.length === 0) return layer.msg("请上传图片")
    // 将用户的文件转换成URL
    let newImg = URL.createObjectURL(file)
    console.log(newImg);
    // 销毁老照片 替换新照片
    $image.cropper('destroy')
      .attr('src', newImg)
      .cropper(options)
  })
  // 上传裁剪后的头像
  $('#btnUpload').on('click', (e) => {
    // dataURL 获取的是用户裁剪后的照片
    let dataURL = $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    // 发送请求
    $.ajax({
      method: 'POST',
      url: '/my/update/avatar',
      data: { avatar: dataURL },
      success(res) {
        if (res.status !== 0)
          return layer.msg(res.message)
        layer.msg(res.message)
        // 调用父元素的方法重新渲染
        window.parent.getUserInfo()
      }
    })
  })
})
