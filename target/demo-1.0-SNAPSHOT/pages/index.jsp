<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <link rel="shortcut icon" href="/Testin-128.png">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Testin | DMPF</title>
    <!-- Tell the browser to be responsive to screen width -->
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <!-- Bootstrap 3.3.5 -->
    <link rel="stylesheet" href="../bootstrap/css/bootstrap.min.css">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="../css/font-awesome.min.css">
    <!-- Ionicons -->
    <link rel="stylesheet" href="../css/ionicons.min.css">
    <!-- Theme style -->
    <link rel="stylesheet" href="../dist/css/AdminLTE.min.css">
    <!-- AdminLTE Skins. Choose a skin from the css/skins
         folder instead of downloading all of them to reduce the load. -->
    <link rel="stylesheet" href="../dist/css/skins/_all-skins.min.css">
    <!-- iCheck -->
    <link rel="stylesheet" href="../plugins/iCheck/flat/blue.css">
    <!-- jvectormap -->
    <link rel="stylesheet" href="../plugins/jvectormap/jquery-jvectormap-1.2.2.css">
    <!-- Date Picker -->
    <link rel="stylesheet" href="../plugins/datepicker/datepicker3.css">
    <!-- Daterange picker -->
    <link rel="stylesheet" href="../plugins/daterangepicker/daterangepicker-bs3.css">
    <!-- bootstrap wysihtml5 - text editor -->
    <link rel="stylesheet" href="../plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.min.css">

    <link href="../closetabs/style.min862f.css?v=4.1.0" rel="stylesheet">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="../js/system/html5shiv.min.js"></script>
    <script src="../js/system/respond.min.js"></script>
    <![endif]-->


    <style>
        .navbar-nav > .user-menu > .dropdown-menu {
            border-top-right-radius: 0;
            border-top-left-radius: 0;
            padding: 1px 0 0 0;
            border-top-width: 0;
            width: 102px;
        }

        .navbar-nav > .user-menu > .dropdown-menu > .user-footer {
            background-color: #f9f9f9;
            padding: 10px 48px 10px 10px;
        }
    </style>
</head>
<body class="hold-transition skin-blue-light sidebar-mini" onload="loadPermissinDatas()">
<div class="wrapper">

    <header class="main-header">
        <!-- Logo -->
        <a href="#" class="logo">
            <!-- mini logo for sidebar mini 50x50 pixels -->
            <span class="logo-mini">
                <%--<img style="height: 50px;" src="/Testin-128.png" >--%>
                <b>D</b>A
            </span>
            <!-- logo for regular state and mobile devices -->
            <span class="logo-lg">
                <%--<img style="height: 50px;" src="/Testin-128.png" >--%>
                <b>DMPF</b>Admin
            </span>
        </a>
        <!-- Header Navbar: style can be found in header.less -->
        <nav class="navbar navbar-static-top" role="navigation">
            <!-- Sidebar toggle button-->
            <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
                <span class="sr-only">Toggle navigation</span>
            </a>

            <div class="navbar-custom-menu">
                <ul class="nav navbar-nav">
                    <%--<li class="dropdown notifications-menu">--%>
                    <%--<!-- Menu toggle button -->--%>
                    <%--<a href="#" class="dropdown-toggle" data-toggle="dropdown">--%>
                    <%--<i class="fa fa-bell-o"></i>--%>
                    <%--<span id="newMessageCount" class="label label-warning"></span>--%>
                    <%--</a>--%>
                    <%--<ul class="dropdown-menu">--%>
                    <%--<li id="newMessageCountContent" class="header"></li>--%>
                    <%--<li>--%>
                    <%--<!-- Inner Menu: contains the notifications -->--%>
                    <%--<ul id="messageList" class="menu">--%>
                    <%--&lt;%&ndash;<li><!-- start notification -->&ndash;%&gt;--%>
                    <%--&lt;%&ndash;<a name="processMsg" href="javascript:;">&ndash;%&gt;--%>
                    <%--&lt;%&ndash;<i class="fa fa-users text-aqua"></i> 循环生成消息&ndash;%&gt;--%>
                    <%--&lt;%&ndash;</a>&ndash;%&gt;--%>
                    <%--&lt;%&ndash;</li>&ndash;%&gt;--%>
                    <%--</ul>--%>
                    <%--</li>--%>
                    <%--<li class="footer">--%>
                    <%--<a name="processMsg" href="javascript:void(0)" onclick="loadPage('/message/list.htm')"--%>
                    <%--data-msg-id=""--%>
                    <%--data-msg-type="">查看所有消息</a>--%>
                    <%--</li>--%>
                    <%--</ul>--%>
                    <%--</li>--%>

                    <!-- User Account: style can be found in dropdown.less -->
                    <li class="dropdown user user-menu">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                            <img src="../dist/img/user2-160x160.jpg" class="user-image" alt="User Image">
                            <span class="hidden-xs" id="userEmail">Alexander Pierce</span>
                        </a>
                        <ul class="dropdown-menu">
                            <li class="user-footer">
                                <div class="pull-right">
                                    <button type="button" class="btn btn-flat btn-default" onclick="userLogout()">退出
                                    </button>
                                </div>
                            </li>
                        </ul>
                    </li>
                    <!-- Control Sidebar Toggle Button -->
                    <!--<li>-->
                    <!--<a href="#" data-toggle="control-sidebar"><i class="fa fa-gears"></i></a>-->
                    <!--</li>-->
                </ul>
            </div>
        </nav>
    </header>
    <!-- Left side column. contains the logo and sidebar -->
    <aside class="main-sidebar">
        <!-- sidebar: style can be found in sidebar.less -->
        <section class="sidebar">
            <!-- Sidebar user panel -->
            <div class="user-panel">
                <div class="pull-left image">
                    <%--<img src="../dist/img/user2-160x160.jpg" class="img-circle" alt="User Image">--%>
                </div>
                <div class="pull-left info">
                    <%--<p id="leftUserEmail"></p>--%>
                    <%--<span><i class="fa fa-circle text-success"></i> Online</span>--%>
                </div>
            </div>

            <!-- sidebar menu: : style can be found in sidebar.less -->
            <ul class="sidebar-menu" id="sidebarMenu">
                <!--<li class="treeview">-->
                <!--<a href="#content/dashboard" onclick="loadPage('content/dashboard')">-->
                <!--<i class="fa fa-dashboard"></i> <span>Dashboard</span> <i-->
                <!--class="fa fa-angle-left pull-right"></i>-->
                <!--</a>-->
                <!--</li>-->
            </ul>
        </section>
        <!-- /.sidebar -->
    </aside>

    <!-- Content Wrapper. Contains page content -->
    <div id="page-wrapper" class="content-wrapper">
        <%--<section class="content" id="page-content">--%>
        <%--</section>--%>
        <div class="row content-tabs" style="padding-right:-10px;">
            <button class="roll-nav roll-left J_tabLeft"><i class="fa fa-backward"></i>
            </button>
            <nav class="page-tabs J_menuTabs">
                <div class="page-tabs-content">
                    <a href="javascript:;" class="active J_menuTab" data-id="/task/currentTask.htm?type=1">我的任务</a>
                </div>
            </nav>
            <%--<a href="login.html" class="roll-nav roll-right J_tabExit"><i class="fa fa fa-sign-out"></i> 退出</a>--%>
            <button class="roll-nav roll-right J_tabRight"><i class="fa fa-forward"></i>
            </button>
            <%--<div class="btn-group roll-nav roll-right">--%>
            <%--<button class="dropdown J_tabClose" data-toggle="dropdown">关闭操作<span class="caret"></span>--%>

            <%--</button>--%>
            <%--<ul role="menu" class="dropdown-menu dropdown-menu-right">--%>
            <%--<li class="J_tabShowActive"><a>定位当前选项卡</a>--%>
            <%--</li>--%>
            <%--<li class="divider"></li>--%>
            <%--<li class="J_tabCloseAll"><a>关闭全部选项卡</a>--%>
            <%--</li>--%>
            <%--<li class="J_tabCloseOther"><a>关闭其他选项卡</a>--%>
            <%--</li>--%>
            <%--</ul>--%>
            <%--</div>--%>

        </div>
        <div class="row J_mainContent" id="content-main">
            <iframe class="J_iframe" name="iframe0" width="100%" height="1100px" src="/task/currentTask.htm?type=1"
                    frameborder="0" data-id="/task/currentTask.htm?type=1" seamless>
            </iframe>
        </div>

    </div>
    <!-- /.content-wrapper -->
    <%--<footer class="main-footer">--%>
    <%--<div class="pull-right hidden-xs">--%>
    <%--<b>Version</b> 1.0.0--%>
    <%--</div>--%>
    <%--<strong>Copyright &copy; 2014-2015 <a href="http://www.testin.cn">北京云测信息技术有限公司</a>.</strong> All rights--%>
    <%--reserved.--%>
    <%--</footer>--%>

</div>
<!-- ./wrapper -->

<!-- loading -->
<div class="modal fade" id="loading" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop='static'>
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="myModalLabel">提示</h4>
            </div>
            <div class="modal-body">
                正在加载,请稍候...
            </div>
        </div>
    </div>
</div>

<!-- loading -->
<div class="modal fade" id="uploading" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop='static'
     style="opacity: 1;">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">提示</h4>
            </div>
            <div class="modal-body">
                正在上传，请稍候...
            </div>
        </div>
    </div>
</div>


<!-- jQuery 2.1.4 -->
<script src="../plugins/jQuery/jQuery-2.1.4.min.js"></script>
<!-- jQuery UI 1.11.4 -->
<script src="../js/system/jquery-ui.min.js"></script>
<!-- jQuery Cookie -->
<script src="../plugins/jQueryCookie/jquery.cookie.js"></script>
<!-- Resolve conflict in jQuery UI tooltip with Bootstrap tooltip -->

<script>
    $.widget.bridge('uibutton', $.ui.button);
</script>
<!-- Bootstrap 3.3.5 -->
<script src="../bootstrap/js/bootstrap.min.js"></script>
<!-- jvectormap -->
<script src="../plugins/jvectormap/jquery-jvectormap-1.2.2.min.js"></script>
<script src="../plugins/jvectormap/jquery-jvectormap-world-mill-en.js"></script>
<!-- daterangepicker -->
<script src="../plugins/daterangepicker/moment.js"></script>
<script src="../plugins/daterangepicker/daterangepicker.js"></script>
<!-- datepicker -->
<script src="../plugins/datepicker/bootstrap-datepicker.js"></script>

<script src="../plugins/timepicker/bootstrap-timepicker.min.js"></script>

<!-- Bootstrap WYSIHTML5 -->
<script src="../plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.all.min.js"></script>
<!-- Slimscroll -->
<script src="../plugins/slimScroll/jquery.slimscroll.min.js"></script>
<!-- FastClick -->
<script src="../plugins/fastclick/fastclick.min.js"></script>

<script src="../closetabs/contabs.min.js"></script>

<!-- AdminLTE App -->
<script src="../dist/js/app.min.js"></script>
<script src="../js/system/ajaxupload/jquery.json.min.js"></script>


<script src="<c:url value="/common/webuploader/0.1.5/webuploader.js"/>"></script>
<script src="<c:url value="/common/upload.js"/>"></script>

<link rel="stylesheet" href="<c:url value="/common/webuploader/0.1.5/webuploader.css"/>" type="text/css"/>

<script type="text/javascript" src="/common/deletefile.js"></script>
<script src="/js/common.js"></script>
<script src="/js/index.js"></script>
<script src="/common/bootbox.min.js"></script>

<script>
    $(function () {
    });

    function getMessageById(id) {
        var url = "/message/getMessageById.htm";
        loadPageData(url, {'messageId': id});
    }


    // show dialogs
    function showErrorDialog(title, mesage, callback) {
        console.log('--------------');
        if (title == "") {
            title = "提示";
        }

        bootbox.confirm({
            title: title,
            message: mesage,
            buttons: {
                cancel: {
                    label: '<i class="fa fa-times"></i> 取消'
                },
                confirm: {
                    label: '<i class="fa fa-check"></i> 确定'
                }
            },
            callback: function (result) {
                callback(result);
            }
        });
    }

</script>

</body>
</html>
