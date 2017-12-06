var oTable1;

function selectUsers(sSource, aoData, fnCallback) {

    sSource = getRootPath() + "/my/tasks.action";

    // 从cookie中获取uid
    var uid = $.cookie('userid');
    // 没有uid，跳转至登陆页面
    if (uid == null) {
        window.location.href = 'login.html';
        return;
    }
    aoData.push({name: "uid", value: uid});

    aoData.push({name: "adminUid", value: $.cookie('adminUid')});

    // 获取查询关键词
    aoData.push({name: "keyword", value: $("#keyword").val()});

    // 获取查询时间范围
    aoData.push({name: "timeRange", value: $("#time_range").val()});

    var myData = JSON.stringify(aoData);

    $.ajax({
        url: sSource, //sAjaxSource
        data: myData,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        async: false,
        success: function (aaData) {
            console.log("call data:" + aaData);
            fnCallback(aaData);
        },
        error: function (msg) {
            console.log(msg);
        }
    });
}

//Date range picker with time picker
$('#time_range').daterangepicker({
    timePicker: true,
    timePickerIncrement: 30,
    format: 'YYYY/MM/DD h:mm A',
    timePicker12Hour: true
});

$("#search_btn").bind({
    click: function() {
        oTable1.ajax.reload();
    }
});