var oTable1;
var role;
var departId;

function selectUsers(sSource, aoData, fnCallback) {

    sSource = getRootPath() + "/all/tasks.action";

    // 从cookie中获取uid
    //var uid = $.cookie('userid');
    // 没有uid，跳转至登陆页面
    //if (uid == null) {
    //    document.location.href = "/login.action";
    //    return;
    //}
    //aoData.push({name: "uid", value: uid});

    // 获取查询关键词
    aoData.push({name: "keyword", value: $("#keyword").val()});

    // 获取查询时间范围
    aoData.push({name: "timeRange", value: $("#time_range").val()});

    aoData.push({name: "adminUid", value: $.cookie('adminUid')});

    var myData = JSON.stringify(aoData);

    $.ajax({
        url: sSource, //sAjaxSource
        data: myData,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        async: false,
        success: function (response) {
            role = response.role;
            departId = response.departId;
            console.log("call data:" + response);
            fnCallback(response);
        },
        error: function (msg) {
            console.log(msg);
        }
    });
}

function receiveTaskShow(id, status, adaptId, assignDepartId) {

    $("#id").val(id);
    $("#status").val(status);
    $("#adaptId").val(adaptId);
    $('#formInfo').modal('show');
}

/**
 * 领取任务
 */
function receiveTask() {
    var adminUid = $.cookie('adminUid');
    var id = $("#id").val();
    var status = $("#status").val();
    var adaptId = $("#adaptId").val();

    $.ajax({
        url: "/all/receiveTask.action",
        type: "post",
        dataType: "json",
        data: {
            adminUid: adminUid,
            id: id,
            status: status,
            adaptId: adaptId
        },
        async: false,
        success: function (response) {
            $('#formInfo').modal('hide');
//                var msg = response.msg;
            var code = response.code;
            if (code == 0) {
                alert("成功");
                // 领取成功跳转到我的任务页面
                loadPage("content/myTaskList");
            } else {
                alert("错误: " + code);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            var status = XMLHttpRequest.status;
            if (status != 200) {
                alert("错误", textStatus + " " + status + "</br>" + errorThrown);
            } else {
                alert("错误", "未知错误");
            }
        }
    });
}
function assignTaskShow(id, assignDepartId, len, role, status) {

    var adminUid = $.cookie('adminUid');
    var jsondata = {
        'id': id,
        'adminUid': adminUid,
        'assignDepartId': assignDepartId,
        'role': role
    };

    if (len == 0) {
        execAjax("/all/getName.action", jsondata, false, function (datas) {
            console.log(datas.code);
            //添加所需要执行的操作代码
            $('#assign').empty();
            for (var i = 0; i < datas.data.name.length; i++) {
                $('#assign').append('<option value="' + datas.data.name[i].uid + '" selected="true">' + datas.data.name[i].nickName + '</option>');
            }
            $("#id1").val(id);
            $("#status1").val(status);
            $('#formAssign').modal('show');
        });
    } else {

        $('#formAssign').modal('show');
    }
}

function assignTask(adaptId) {
    //var adminUid = $.cookie('adminUid');
    //var id = $("#id1").val();
    //var status = $("#status1").val();
    var assignId = $("#assign").val();
    //var assignName = $("#assign").find("option:selected").text();

    $.ajax({
        url: "/task/assignTask.htm",
        type: "post",
        dataType: "json",
        data: {adaptId: adaptId, assignId: assignId},
        async: false,
        success: function (response) {
            $('#formAssign').modal('hide');
//                var msg = response.msg;
            var code = response.code;
            if (code == 0) {
                alert("成功");
                // 指派成功刷新当前页面
                oTable1.ajax.reload();
            } else {
                alert("错误: " + code);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            var status = XMLHttpRequest.status;
            if (status != 200) {
                alert("错误", textStatus + " " + status + "</br>" + errorThrown);
            } else {
                alert("错误", "未知错误");
            }
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
    click: function () {
        oTable1.ajax.reload();
    }
});