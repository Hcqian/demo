/**
 * Created by Feng on 2016/4/27.
 * 任务详情
 */

var adaptId;
var taskCreateTime;

/**
 * 初始化页面、权限
 */
function initTaskDetailPage() {
    // 查询单个任务信息
    adaptId = getParam("adaptId");

    // 加载摘要信息
    loadTaskSummary();

    // 根据权限显示相应页面
    initHtmlDiv();
}

/**
 * load html，根据权限显示相应页面
 */
function initHtmlDiv() {

    // 后台获取 tab 权限
    var adminUid = $.cookie('adminUid'); // 读取 cookie
    var jsondata = {
        'op': 'taskDetailInitTabs',
        'adminUid': adminUid
    };

    execAjax("/task/info.action", jsondata, false, function (datas) {
        if (datas.code == 0) {
            console.log(datas.data);

            //set values
            $("#taskDetailTabs").append(datas.data.tabs);
            $("#taskDetailTabsContent").append(datas.data.tabsContent);
        }
    });
}

/**
 * 查询任务摘要信息
 */
function loadTaskSummary() {
    // 修改密码
    var jsondata = {
        'op': 'taskSummary',
        'adaptId': adaptId
    };

    execAjax("/task/info.action", jsondata, false, function (datas) {
        if (datas.code == 0) {
            console.log(datas.data);
            //set values
            $("#appIcon").attr('src', datas.data.appIcon);
            $("#appName").text(datas.data.appName);
            if (datas.data.appType == '1') {
                $("#appType").text("Android");
            } else {
                $("#appType").text("iOS");
            }
            $("#appVersion").text(datas.data.appVersion);
            $("#taskId").text(datas.data.taskId);
            $("#adaptId").text(datas.data.adaptId);

            taskCreateTime = datas.data.taskCreateTime;
        }
    });
}
