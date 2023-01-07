$(function(){
    // 点击去注册账号
    $('#link_reg').on('click',function(){
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击“去登录”的链接
    $('#link_login').on('click',function(){
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 从layui中获得form对象
    var form=layui.form
    var layer=layui.layer
    // 通过form.verify()函数自定义校验规则
    form.verify({
        pwd:[/^[\S]{6,12}$/,'密码必须是6到12位,且不能出现空格'],
        // 校验两次密码是否一致的规则
        repwd:function(value){
            // 通过形参拿到确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于判断
            // 如果判断失败,则return一个提示消息即可  val()是jquery的写法,而value是原生js的写法
            var pwd=$('.reg-box [name=password]').val()

            if(pwd!==value){
                return '两次密码不一致'
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit',function(e) {
        // 阻止默认的提交行为
        e.preventDefault()

        // 发起阿贾克斯的的POST请求  name 属性用于对提交到服务器后的表单数据进行标识,或者在客户端通过 JavaScript 引用表单数据
        var data={
            username:$('#form_reg [name=username').val(),
            password:$('#form_reg [name=password]').val()
        }

        $.post('/api/reguser',data,function(res){
            if(res.status!==0) {
                return layer.msg(res.message)
            }

            layer.msg('注册成功,请登录! ')
            // 模拟人的点击行为
            $('link_login').click()
        })
    })

    // 监听登录表单的提交事件
    $('#form_login').submit(function(e){
        e.preventDefault()
        $.ajax({
            url:'/api/login',
            method:'POST',
            // 快速获取表单中的数据
            // 将表单内容序列化成一个字符串
            data:$(this).serialize(),
            success:function(res){
                if(res.status!==0){
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功!')
                // token的意思是“令牌”，“通证”，是服务端生成的一串字符串，作为客户端进行请求的一个标识
                // 将登录成功得到的token字符串,保存到localStorage中
                // 在HTML5中，新加入了一个localStorage特性，这个特性主要是用来作为本地存储来使用的，解决了cookie存储空间不足的问题(cookie中每条cookie的存储空间为4k)，localStorage中一般浏览器支持的是5M大小，这个在不同的浏览器中localStorage会有所不同。

                localStorage.setItem('token',res.token)
                location.href='/index.html'

            }
        })
    })
})