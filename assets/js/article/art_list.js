$(function () {
  let form = layui.form;
  let laypage = layui.laypage;
  // 定义美化时间的过滤器(模板引擎的方法)
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);

    let y = dt.getFullYear();
    let m = padZero(dt.getMonth() + 1);
    let d = padZero(dt.getDate());

    let hh = padZero(dt.getHours());
    let mm = padZero(dt.getMinutes());
    let ss = padZero(dt.getSeconds());

    return `${y}年-${m}月-${d}日 ${hh}:${mm}:${ss}`;
  }


  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }


  // 定义一个默认的查询字符串
  // 发请求用
  let q = {
    pagenum: 1, // 页码值
    pagesize: 2, // 每页显示多少条数据
    cate_id: '', // 文章分类的 Id
    state: '' //文章的状态
  }
  initTable()
  initCate()

  // 监听筛选表单提交事件
  $('#form-search').on('submit', (e) => {
    e.preventDefault();
    // 将获取的数据填充到q中
    q.cate_id = $('[name=cate_id]').val();
    q.state = $('[name=state]').val();
    // 根据最新的筛选条件重新调用获取列表函数
    initTable()
  })

  // 获取文章列表数据的方法
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success(res) {
        if (res.status !== 0) return layer.msg(res.message);
        console.log(res);
        // 使用模板引擎渲染数据
        let htmlStr = template('tpl-table', res);
        $('#tbody').html(htmlStr)
        // 调用渲染分页的函数
        renderPage(res.total)
      }
    })
  }
  // 获取文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success(res) {
        if (res.status !== 0) return layer.msg(res.message)
        let htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').append(htmlStr)
        // 源于layui无法监听到Ajax之后的数据 所以要重新渲染一下
        form.render()
      }
    })
  }
  // 定义分页的函数
  function renderPage(total) {
    //调用laypage.render()来渲染分页结构
    laypage.render({
      elem: 'pageBox', //分页容器Id
      count: total, //数据总数，
      limit: q.pagesize, //每页显示几条数据
      curr: q.pagenum,
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      //分页发生切换调用此函数
      // 触发方式 
      // 1.点击页码触发
      // 2.调用laypage.render()
      jump(obj, first) {
        // 使用第一中方法调用first的值undefined
        // 使用第二中方法调用first的值true
        // obj.curr 得到当前页
        // obj.limit  //得到每页显示的条数
        // 因为当此函数调用(调用laypage.render())会造成死循环
        // 判断当点击触发才调用
        if (first) return;
        // console.log(first);
        // 将最新的页码和每页显示几条赋值给q
        q.pagenum = obj.curr;
        q.pagesize = obj.limit;
        // 根据最新的q获取最新的列表,渲染表格
        initTable();
      }
    });
  }

  // 因为删除按钮是通过js动态添加的
  // 利用事件委托为删除按钮绑定单击事件
  // jq的on不等于js的addeventlistener 重复声明后者会替换前者
  $('#tbody').delegate('#removeList', "click", (e) => {
    // 获取当前页面的删除按钮的个数
    let len = $('.btn-delete').length
    // 询问删除
    layer.confirm('确认删除该信息?', { icon: 3, title: '提示' }, function (index) {
      //do something
      let id = e.target.dataset.id
      // 发起Ajax
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success(res) {
          console.log(res);
          if (res.status !== 0) return layer.msg(res.message);
          
          layer.msg(res.message);

          // 此时 如果当前数据删除完了 但是页码没变（有bug）
          // 当删除玩数据后判断当前这一页中是否还要其他数据
          // 如果没有 让页码-1
          // 如果有 调用initTable 方法

          if (len === 1) {
            // 如果删除按钮的数量等于一证明删除后就没有数据了
            // 注意  页码的数量最低是1
            q.pagenum = q.pagenum === 1 ? 1 : --q.pagenum;
          }
          // 重新渲染
          initTable()

        }
      })
      layer.close(index);
    });

  })

  // 编辑按钮
  $('#tbody').delegate('#editList', 'click', function (e) {

    sessionStorage.setItem('editId', this.dataset.id)
    location.href = '/article/atr_edit_pub.html';
  })
})