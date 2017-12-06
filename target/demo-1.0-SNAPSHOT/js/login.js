/**
 * Created by Feng on 2016/4/11.
 */


function onEnterKeyDown(evt) {
    var evt = evt ? evt : (window.event ? window.event : null);//兼容IE和FF
    if (evt.keyCode == 13) {
        doLogin();
    }
}


/**
 * 登录
 */
function doLogin() {
    $("#btnLogin").button('loading');
    var email = $("#email").val();
    var password = $("#password").val();
    var jsondata = {
        'email': email,
        'password': password
    };
    execAjaxData("/doLogin.htm", jsondata, function (data) {
        $("#btnLogin").button('reset');

    });

}