$(function () {
  getArticleList()
  // 弹出层的索引 后面关闭用
  let indexAdd = null;
  let indexEdit = null;
  // 添加文章
  $('#addBtn').on('click', () => {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog_add').html()
    });
  })
  // 因为页面是通过js添加的不可以直接绑定事件
  // 通过事件代理
  $('body').on('submit', '#add_art', (e) => {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: {
        name: $('[name=aname]').val(),
        alias: $('[name=alias]').val()
      },
      success(res) {
        if (res.status !== 0) return layer.msg(res.message)
        layer.msg(res.message)
        // 刷新列表
        getArticleList();
        layer.close(indexAdd)
      }
    })
  })
  // 删除列表
  $('#tbody').on('click', '#remove_art', (e) => {
    layer.confirm('确定删除吗?', { icon: 3, title: '提示' }, function (index) {
      //do something
      console.log(e.target.dataset.id);
      let id = e.target.dataset.id;
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success(res) {
          if (res.status !== 0) return layer.msg(res.message);
          getArticleList()
        }
      })

      layer.close(index);
    });

  })
  // 编辑列表
  $('#tbody').on('click', '#eduit_art', function (e) {
    // console.log(e.target);

    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialod_edit').html()
    });
    // 获取数据
    var id = $(this).attr('data-id')
    console.log(id);
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success(res) {
        // console.log(res);
        if (res.status !== 0) return layer.msg(res.message);
        $('[name=ename]').val(res.data.name)
        $('[name=ealias]').val(res.data.alias)
        $('[name=hideID]').val(res.data.id)
      }
    })
  })
  // 修改数据
  $('body').on('submit', '#edit_art', (e) => {
    e.preventDefault();
    let id = $('[name=hideID]').val();
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: {
        id,
        name: $('[name=ename]').val(),
        alias: $('[name=ealias]').val()
      },
      success(res) {
        if (res.status !== 0) return layer.msg(res.message)
        getArticleList()
        layer.close(indexEdit)
      }
    })
  })
  // 获取文章列表
  function getArticleList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success(res) {
        // 翻转一下数组
        data = res.data.reverse()
        // console.log(data);
        if (res.status !== 0) return layer.msg('获取文章列表失败');
        // 利用模板引擎渲染
        $('#tbody').html(template('tpl_art', res))
      }
    })
  }
})
