$(function () {

  let form = layui.form
  initCate()
  initInfo()
  // 定义获取文章详情的方法
  function initInfo() {
    let editId = sessionStorage.getItem('editId')
    console.log(editId);
    // 发起Ajax请求
    $.ajax({
      method: 'GET',
      url: '/my/article/' + editId,
      success(res) {
        console.log(res);
        if (res.status !== 0) return layer.msg(res.message);
        $('[name=title]').val(res.data.title);
        $('[name=content]').val(res.data.content);
        // $('[name=cate_id]').val(res.data.cate_id);
        // 重新渲染一下整个页面
        // form.render();
      }
    })
  }

  // 定义加载文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success(res) {
        console.log(res);
        if (res.status !== 0) return layer.msg(res.message);
        // 使用模板引擎渲染分类的下拉菜单
        let htmlStr = template('tpl-cate', res);
        $('[name=cate_id]').html(htmlStr)
        // 重新渲染一下整个页面
        form.render();
      }
    })
  }

  // 富文本相关
  // 初始化富文本编辑器
  initEditor()

  // 裁剪图片区域
  // 1. 初始化图片裁剪器
  let $image = $('#image')

  // 2. 裁剪选项
  let options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }
 
  // 3. 初始化裁剪区域
  $image.cropper(options)

  // 点击选择封面按钮提交文件
  $('#btnChooseImg').on('click', function () {
    // 触发文件选择框
    $('#coverFile').click();
  })

  // 监听coverFile的change事件 获取用户的选择文件列表
  $('#coverFile').on('change', function (e) {
    console.log(e.target.files);
    let files = e.target.files;
    let file = e.target.files[0]
    if (files.length === 0) return layer.msg('请选择图片')
    // 更加选择的文件创建URL地址
    let newImgURL = URL.createObjectURL(file)

    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', newImgURL)  // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域
  })

  // 定义文章的发布状态
  let art_state = '已发布';

  // 为存为草稿绑定事件
  $('#btnSave2').on('click', function () {
    art_state = '草稿';
  })

  // 为表单绑定submit提交事件
  $('#form-pub').on('submit', function (e) {
    e.preventDefault();
    // 1. 基于表单快速创建一个formData对象
    let fd = new FormData($(this)[0])
    // 2. 像formData追加
    fd.append('state', art_state)
    // 追加文章Id
    fd.append('Id',sessionStorage.getItem('editId'))

    // 3. 将裁剪后的图片输出为一个文件
    $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // blob 就是输出后的文件
        // 4.将文件存储到fd中
        fd.append('cover_img', blob);

        // 5.发起ajax请求
        publishArticle(fd);
      })
  })

  // 定义一个发布文章的方法
  function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/edit',
      data: fd,
      // 数据格式是formData
      // 必须添加以下两个配置项
      contentType: false,
      processData: false,
      success(res) {
        if (res.status !== 0) return layer.msg(res.message);
        layer.msg(res.message);
        // 跳转到文章列表页面
        location.href = '/article/art_list.html';
      }
    })
  }
})

