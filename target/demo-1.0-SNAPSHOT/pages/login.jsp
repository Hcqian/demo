<%@ page contentType="text/html;charset=UTF-8" language="java" %>


<!DOCTYPE html>
<html>
<head>
</head>
<body >

        <p >登录后开始你的操作</p>
                <input id="email" name="email"  placeholder="请输入邮箱">
                <input id="password" name="password" placeholder="请输入密码">
                    <button id="btnLogin"  onclick="doLogin()" >登录
                    </button>
</body>
<script src="/plugins/jQuery/jQuery-2.1.4.min.js"></script>
<script src="/js/common.js"></script>
<script>
    function doLogin() {
//        $("#btnLogin").button('loading');
        var email = $("#email").val();
        var password = $("#password").val();
        var jsondata = {
            'email': email,
            'password': password
        };
        console.log(jsondata);
        execAjaxData("/doLogin.htm", jsondata, function (data) {
            $("#btnLogin").button('reset');

        });

    }

</script>
</html>
