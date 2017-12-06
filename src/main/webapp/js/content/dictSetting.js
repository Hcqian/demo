/**
 * Created by Feng on 2016/4/12.
 */

var dictList;
var recordid;

function loadDicts() {
    execAjax("/dict/list.htm", {}, false, function (datas) {
        if (datas.code == 0) {
            var strhtml = "";
            dictList = eval(datas.data);
            for (var i = 0; i < dictList.length; i++) {
                var id = dictList[i].id;
                var name = dictList[i].name;
                var defaultValue = dictList[i].value;
                var content = dictList[i].content;

                strhtml += "<tr>";
                strhtml += "<td hidden=\"hidden\">" + id + "</td>";
                strhtml += "<td >" + name + "</td>";
                strhtml += "<td>" + defaultValue + "</td>";
                strhtml += "<td style='max-width: 460px;'>" + content + "</td>";
                strhtml += "<td>";
                strhtml += "<button type=\"button\" class=\"btn btn-link btn-xs\" onclick=\"showModalForm(" + id + ")\">编辑";
                strhtml += "</button>";
                strhtml += "</td>";
                strhtml += "</tr>";
            }

            $("#dictTable").append(strhtml);
        }
    });
}

/**
 * 修改字典内容
 */
function modifyContent() {
    //名称或内容项不可为空
    if($('#txtName').val() == ""){
        $("#txtContent_error_msg").html("");
        $("#txtName_error_msg").html("名称不可为空");
        return false;
    }else if($('#txtContent').val() == ""){
        $("#txtName_error_msg").html("");
        $("#txtContent_error_msg").html("内容项不可为空");
        return false;
    }else{
        $("#txtName_error_msg").html("");
        $("#txtContent_error_msg").html("");
    }
    var jsondata = {
        'op': 'update',
        'id': recordid,
        'name': $('#txtName').val(),
        'value': $('#txtValue').val(),
        'content': $('#txtContent').val()
    };
    execAjax("/settings/dict.htm", jsondata, false, function (datas) {
        if (datas.code == 0) {
            alert("修改成功");
            $('#formInfo').modal('hide');
        }
    });
}

function showModalForm(id) {
    recordid = id;
    if (dictList != null) {
        for (var i = 0; i < dictList.length; i++) {
            var rid = dictList[i].id;
            var name = dictList[i].name;
            var defaultValue = dictList[i].value;
            var content = dictList[i].content;
            if (rid == recordid) {
                $('#txtName').val(name);
                $('#txtValue').val(defaultValue);
                $('#txtContent').val(content);
            }
        }
    }
    $('#formInfo').modal('show');
}

function addDicShow(){
    $('#addInfo').modal('show');
}

function addDic(){
    //名称或内容项不可为空
    if($('#addName').val() == ""){
        $("#addContent_error_msg").html("");
        $("#addName_error_msg").html("名称不可为空");
        return false;
    }else if($('#addContent').val() == ""){
        $("#addName_error_msg").html("");
        $("#addContent_error_msg").html("内容项不可为空");
        return false;
    }else{
        $("#addName_error_msg").html("");
        $("#addContent_error_msg").html("");
    }
    var jsondata = {
        'op':'add',
        'name': $('#addName').val(),
        'value': $('#addValue').val(),
        'content': $('#addContent').val()
    };
    execAjax("/settings/dict.htm", jsondata, false, function (datas) {
        if (datas.code == 0) {
            alert("新增成功");
            $('#addInfo').modal('hide');
            $('#addName').val("");
            $('#addValue').val("");
            $('#addContent').val("");
        }
    });
}
