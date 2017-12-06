/**
 * Created by Feng on 2016/4/12.
 */

var userLongId; // uid
var mobile;
var oTable1;
var treeviewGroups;
var treeviewRoles;
var treeviewPermissions;


(function(){
    loadRolePermission();
    loadGroupPermission();
})();

/**
 * load datas
 */
function loadDepartAndRole() {

    $.ajax({
        url: "/authority/depart.htm",
        type: "get",
        dataType: "json",
        async: true,
        success: function (datas) {
            var departList = eval(datas.data);
            var strdep = "";
            for (var i = 0; i < departList.length; i++) {
                strdep += "<option value=\"" + departList[i].departId + "\">" + departList[i].departName + "</option>";
            }
            $('#selectDepart').append(strdep);
            $('#editDepart').append(strdep);
        },
        error: function (data) {
            console.log(data);
        }
    });


    $.ajax({
        url: "/authority/role.htm",
        type: "get",
        dataType: "json",
        async: true,
        success: function (datas) {
            var roleList = eval(datas.data);
            var strrol = "";
            for (var i = 0; i < roleList.length; i++) {
                strrol += "<option value=\"" + roleList[i].id + "\">" + roleList[i].roleText + "</option>";
            }
            $('#selectRole').append(strrol);
            $('#editRole').append(strrol);
        },
        error: function (data) {
            console.log(data);
        }
    });

}

/**
 * 搜索
 */
function searchUser() {
    // 条件查询用户
    //console.log('refresh data ')
    oTable1.ajax.reload();
}

function selectUsers(sSource, aoData, fnCallback) {
    var queryContent = $("#queryContent").val();
    var querySort = $("#querySort").val();
    var queryStatus = $("#queryStatus").val();

    sSource = getRootPath() + "/settings/users.htm?content=" + queryContent + "&sort=" + querySort + "&status=" + queryStatus;
    aoData = JSON.stringify(aoData);

    $.ajax({
        url: sSource, //sAjaxSource
        data: aoData,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        async: false,
        success: function (aaData) {
            //console.log("call data:" + aaData);
            fnCallback(aaData);
        },
        error: function (msg) {
            console.log(msg);
        }
    });
}

/**
 * 显示修改信息窗口
 * @param id
 */
function showModalUserForm(uid) {
    userLongId = uid;
    // 查询数据
    var jsondata = {
        'op': 'selectLocalUserInfo',
        'editUid': uid
    };

    execAjax("/settings/comm.htm", jsondata, false, function (datas) {
        if (datas.code == 0) {
            $('#editEmail').val(datas.data.email);
            $('#editNickName').val(datas.data.nickName);
            $('#editMobile').val(datas.data.mobile);
            $('#editDepart').val(datas.data.departId);
            $('#editStatus').val(datas.data.status);

            $('#formInfo').modal('show');
        }
    });
}


var currentUidGroups =[];
var currentUidRoles =[];
var currentUidPermissions =[];

function showPermissionForm(uid) {
    userLongId = uid;
    // load user datas

    $.ajax({
        url: "/authority/permission/user/"+ uid +".htm",
        type: "get",
        dataType: "json",
        async: false,
        success: function (datas) {
            if (datas.code == 0) {
                // clear ui checked
                treeviewGroups.treeview('uncheckAll', {silent: true});
                treeviewRoles.treeview('uncheckAll', {silent: true});
                treeviewPermissions.treeview('uncheckAll', {silent: true});

                currentUidGroups = eval(datas.data.groups);
                currentUidRoles = eval(datas.data.roles);
                currentUidPermissions = eval(datas.data.operation);

                // set group
                var uncheckedNodes_gourps = treeviewGroups.treeview('getUnchecked');
                for (var i = 0; i < currentUidGroups.length; i++) {
                    var gourpid = currentUidGroups[i].groupId;
                    for (var j = 0; j < uncheckedNodes_gourps.length; j++) {
                        if (uncheckedNodes_gourps[j].id == gourpid && uncheckedNodes_gourps[j].tags != undefined) {
                            treeviewGroups.treeview('checkNode', [uncheckedNodes_gourps[j], {silent: true}]);
                            treeviewGroups.treeview('checkNode', [treeviewGroups.treeview('getParent', uncheckedNodes_gourps[j]), {silent: true}]);
                        }
                    }
                }

                // set role
                var uncheckedNodes_roles = treeviewRoles.treeview('getUnchecked');
                for (var i = 0; i < currentUidRoles.length; i++) {
                    var roleid = currentUidRoles[i].roleId;
                    for (var j = 0; j < uncheckedNodes_roles.length; j++) {
                        if (uncheckedNodes_roles[j].id == roleid) {
                            treeviewRoles.treeview('checkNode', [uncheckedNodes_roles[j], {silent: true}]);
                        }
                    }
                }

                // set permission
                var uncheckedNodes_permission = treeviewPermissions.treeview('getUnchecked');
                for (var i = 0; i < currentUidPermissions.length; i++) {
                    var permission = currentUidPermissions[i];
                    console.log("init----"+permission);
                    for (var j = 0; j < uncheckedNodes_permission.length; j++) {
                        if (uncheckedNodes_permission[j].id == permission && uncheckedNodes_permission[j].tags != undefined) {
                            treeviewPermissions.treeview('checkNode', [uncheckedNodes_permission[j], {silent: true}]);
                            treeviewPermissions.treeview('checkNode', [treeviewPermissions.treeview('getParent', uncheckedNodes_permission[j]), {silent: true}]);
                        }
                    }
                }

                var roleIds =[];
                for(var i=0;i<currentUidRoles.length;i++){ roleIds.push(currentUidRoles[i].roleId) }
                disableOutPermission();
                // disableUncheckedOnPermission();
            }
        }
    });
    $('#formPermission').modal('show');
}

/**
 * 显示添加用户窗口
 */
function showAddNewUser() {
    userLongId = -1;
    $('#formAddNew').modal('show');
}

/**
 * 查询用户信息
 */
function checkEmail() {
    $("#user_error_msg").html("");
    if ($('#txtEmail').val() == "") {
        $("#user_error_msg").html("邮箱不可为空");
        return false;
    }
    var jsondata = {
        'op': 'checkEmail',
        'email': $('#txtEmail').val()
    };

    execAjax("/settings/comm.htm", jsondata, false, function (datas) {
        if (datas.code == 0) {
            if (datas.data.nickName == "") {
                alert("账号存在，但是姓名为空");
            } else {
                $('#txtNickName').val(datas.data.nickName);
            }
            userLongId = datas.data.uid;
            mobile = datas.data.mobile;
        } else if (datas.code == -1) {
            $("#user_error_msg").html("用户不存在");
        }
    });
}

function errormsg() {
    if ($('#txtEmail').val() == "" || $('#txtNickName').val() == "") {
        //alert("邮箱和姓名不可为空!");
        $("#user_error_msg").html("邮箱不可为空");
        $("#nickname_error_msg").html("姓名不可为空");
        return false;
    } else {
        $("#user_error_msg").html("");
        $("#nickname_error_msg").html("");

    }
}

/**
 * 添加用户
 */
function addRoleUser() {

    if (userLongId <= 0) {
        alert("请先输入邮箱后点击 “检测用户”。");
        return;
    }

    //如果邮箱为空，清空检验结果提示框
    if ($('#txtEmail').val() == "") {
        $("#user_error_msg").html("");
    }
    if ($('#txtEmail').val() == "") {
        //alert("邮箱和姓名不可为空!");
        $("#nickname_error_msg").html("");
        $("#user_error_msg").html("邮箱不可为空");
        return false;
    } else if ($('#txtNickName').val() == "") {
        $("#user_error_msg").html("");
        $("#nickname_error_msg").html("姓名不可为空");
        return false;
    } else {
        $("#user_error_msg").html("");
        $("#nickname_error_msg").html("");
        if (!Validator.isEmail($('#txtEmail').val())) {
            $("#user_error_msg").html("请输入正确邮箱");
            return false;
        }
    }
    var jsondata = {
        'op': 'addUser',
        'uid': userLongId,
        'email': $('#txtEmail').val(),
        'nickName': $('#txtNickName').val(),
        'mobile': mobile,
        'departId': $('#selectDepart').val(),
        'departName': $('#selectDepart').find("option:selected").text(),
        'roleId': $('#selectRole').val(),
        'status': $('#selectStatus').val()
    };

    execAjax("/settings/comm.htm", jsondata, false, function (datas) {
        if (datas.code == 0) {
            $('#formAddNew').modal('hide');
            alert(datas.message);
        }
        else {
            userLongId = -1;
            alert(datas.message);
        }
    });
}

/**
 * 编辑用户
 */
function editUserInfo() {
    if ($('#editNickName').val() == "") {
        //alert("姓名或手机号不可为空！");
        $("#editNickName_error_msg").html("名称不可为空");
        return false;
    }

    $("#editNickName_error_msg").html("");
    $("#editMobile_error_msg").html("");
    //if (!Validator.isMobileNum($('#editMobile').val())) {
    //    $("#editMobile_error_msg").html("请输入正确手机号");
    //    return false;
    //}


    var jsondata = {
        'op': 'saveLocalUserInfo',
        'userId': userLongId,
        'nickName': $('#editNickName').val(),
        'mobile': $('#editMobile').val(),
        'departId': $('#editDepart').val(),
        'departName': $('#editDepart').find("option:selected").text(),
        'status': $('#editStatus').val()
    };

    execAjax("/settings/comm.htm", jsondata, false, function (datas) {
        if (datas.code == 0) {
            $('#formInfo').modal('hide');
            alert(datas.message);
        } else if (datas.code == -1) {
            alert(datas.message);
        }
    });
}


/**
 * 加载用户组信息， 用户组数
 */
function loadGroups() {

    $.ajax({
        url: "/authority/group.htm",
        type: "get",
        dataType: "json",
        async: true,
        success: function (datas) {
            // private Integer groupId;
            // private String groupName;
            // private Integer departId; // 所属部门
            // private String departName;
            console.log(datas.data);
            var vals={};
            for(var i=0; i<datas.data.length; i++){
                var current = datas.data[i];
                var val =vals[current.departId];
                if(typeof(val)=='undefined'){
                    val = {
                        "id": current.departId,
                        "text": current.departName,
                        "nodes":[]
                    };
                    vals[current.departId] =val;
                }
                val.nodes.push({
                    "id": current.groupId,
                    "text": current.groupName,
                    "tags": "["+ current.departId +"]"
                });
            }
            var result =[];
            for(var key in vals){    result.push(vals[key]);     };

            var content = JSON.stringify(result);
            console.log(content);


                treeviewGroups = $('#tvGroups').treeview({
                data: content,
                //multiSelect: false,
                showCheckbox: true,
                levels: 1,
                onNodeUnchecked: function(event, node){
                    disableOutPermission();
                },
                onNodeChecked: function (event, node) {
                    disableOutPermission();
                }
            });
            $('#tvGroups').treeview('collapseAll', {silent: true});

        },
        error: function (data) {
            console.log(data);
        }
    });

}



/**
 * 加载角色信息 角色数
 */
function loadRoles() {

    $.ajax({
        url: "/authority/role.htm",
        type: "get",
        dataType: "json",
        async: true,
        success: function (datas) {

            if (datas.code == 0) {
                var list = eval(datas.data);
                var content = [];
                for (var i = 0; i < list.length; i++) {
                    var role = list[i];
                    content.push({
                        id: role.roleId,
                        text:role.roleText
                    });
                }
                content  = JSON.stringify(content);
                console.log(content);


                treeviewRoles = $('#tvRoles').treeview({
                    data: content,
                    //multiSelect: false,
                    showCheckbox: true,
                    levels: 1,
                    onNodeUnchecked: function(event, node){
                        disableOutPermission();
                    },
                    onNodeChecked: function (event, node) {
                        disableOutPermission();
                    }
                });
                $('#tvRoles').treeview('collapseAll', {silent: true});
            }
        },
        error: function (data) {
            console.log(data);
        }
    });



}

/**
 * 权限树
 */
function loadPermissions() {

    $.ajax({
        url: "/authority/operations.htm",
        type: "get",
        dataType: "json",
        async: true,
        success: function (datas) {
            // private Integer groupId;
            // private String groupName;
            // private Integer departId; // 所属部门
            // private String departName;
            console.log(datas.data);
            var vals={};
            for(var i=0; i<datas.data.length; i++){
                var current = datas.data[i];
                var val =vals[current.opGroup];
                if(typeof(val)=='undefined'){
                    val = {
                        "id": current.opGroup,
                        "text": current.opGroup,
                        "nodes":[]
                    };
                    vals[current.opGroup] =val;
                }
                val.nodes.push({
                    "id": current.opName,
                    "text": current.opText,
                    "tags": "["+ current.opGroup +"]"
                });
            }
            var result =[];
            for(var key in vals){    result.push(vals[key]);     };

            var content = JSON.stringify(result);
            console.log(content);


            treeviewPermissions = $('#tvPermissions').treeview({
                data: content,
                //multiSelect: false,
                showCheckbox: true,
                levels: 1,
                onNodeUnchecked: function (event, node) {
                    //取消勾选
                    console.log(" onNodeUnchecked " + node.text + " tag:" + node.tag + "  nodes:"+node.nodes);



                    if (node.nodes != undefined && node.nodes.length != undefined) {
                        var uncheckedNodes_permission = treeviewPermissions.treeview('getChecked');
                        for (var j = 0; j < uncheckedNodes_permission.length; j++) {
                            var parentnode = treeviewPermissions.treeview('getParent', uncheckedNodes_permission[j]);
                            if (parentnode.id == node.id) {
                                for (var i = 0; i < node.nodes.length; i++) {
                                    console.log(node.nodes[i].text);
                                    var tmpnode = node.nodes[i];
                                    if (uncheckedNodes_permission[j].id == tmpnode.id) {
                                        treeviewPermissions.treeview('uncheckNode', [uncheckedNodes_permission[j], {silent: true}]);
                                    }
                                }
                            }
                        }
                    }

                },
                onNodeChecked: function (event, node) {
                    console.log(" onNodeChecked " + node.text + " tag:" + node.tag);
                    if (node.nodes != undefined && node.nodes.length != undefined) {
                        var uncheckedNodes_permission = treeviewPermissions.treeview('getUnchecked');
                        for (var j = 0; j < uncheckedNodes_permission.length; j++) {
                            var parentnode = treeviewPermissions.treeview('getParent', uncheckedNodes_permission[j]);
                            if (parentnode.id == node.id) {
                                for (var i = 0; i < node.nodes.length; i++) {
                                    console.log(node.nodes[i].text);
                                    var tmpnode = node.nodes[i];
                                    if (uncheckedNodes_permission[j].id == tmpnode.id && uncheckedNodes_permission[j].state.disabled==false) {
                                        treeviewPermissions.treeview('checkNode', [uncheckedNodes_permission[j], {silent: true}]);
                                    }
                                }
                            }
                        }
                    }
                }
            });
            $('#tvPermissions').treeview('expandAll', {silent: true});

        },
        error: function (data) {
            console.log(data);
        }
    });
}

var roleOperations={};
var groupOperations={};

/**
 * 查询组权限
 */
function loadGroupPermission() {
    // if(!roleOperations) {
    $.ajax({
        url: "/authority/permission/group.htm",
        type: "get",
        dataType: "json",
        async: true,
        success: function (datas) {
            console.log("loadGroupPermission _");
            if (datas.code == 0) {
                groupOperations = {};
                for (var i = 0; i < datas.data.length; i++) {
                    var current = datas.data[i];
                    if (typeof(groupOperations[current.groupId]) == 'undefined') {
                        groupOperations[current.groupId] = [];
                    }
                    groupOperations[current.groupId].push(current.operation);
                }
            }
            console.log(groupOperations);
            console.log("loadGroupPermission _end");
        }
    });
    // }
}

/**
 * 查询角色权限
 * @param roleid
 */
function loadRolePermission() {
    // if(!roleOperations) {
        $.ajax({
            url: "/authority/permission/role.htm",
            type: "get",
            dataType: "json",
            async: true,
            success: function (datas) {
                console.log("loadRolePermission _");
                if (datas.code == 0) {
                    roleOperations = {};
                    for (var i = 0; i < datas.data.length; i++) {
                        var current = datas.data[i];
                        if (typeof(roleOperations[current.roleId]) == 'undefined') {
                            roleOperations[datas.data[i].roleId] = [];
                        }
                        roleOperations[datas.data[i].roleId].push(datas.data[i].operation);
                    }
                }
                console.log(roleOperations);
                console.log("loadRolePermission _end");
            }
        });
    // }
}


function disableUncheckedOnPermission(){
    var nodes = treeviewPermissions.treeview('getDisabled');
    for(var i=0;i<nodes.length;i++){
        treeviewPermissions.treeview('uncheckNode',[nodes[i]]);
    }
}

/**
 * 禁用角色允许之外的权限
 */
function disableOutPermission() {
    var roleCheckPermission = {};
    var groupCheckPermission = {};
    var checkedNodes = $('#tvRoles').treeview('getChecked',{});
    // var roleIds=[];
    // debugger;
    for(var i=0;i<checkedNodes.length;i++){
        // roleIds.push(checkedNodes[i].id);
        var rolePermissions = roleOperations[checkedNodes[i].id];
        for(var o=0;o<rolePermissions.length;o++){
            roleCheckPermission[rolePermissions[o]]="";
        }
    }

    var checkedNodes = $('#tvGroups').treeview('getChecked',{});
    // var groupIds=[];
    for(var i=0;i<checkedNodes.length;i++){
        if(typeof(checkedNodes[i].parentId)!='undefined'){
            // groupIds.push(checkedNodes[i].id);
            for(var o=0;o<groupOperations[checkedNodes[i].id].length;o++) {
                groupCheckPermission[groupOperations[checkedNodes[i].id][o]] = "";
            }
        }
    }

    // if (!!roleIds) {
    //     for (var i = 0; i < roleIds.length; i++) {
    //         permission = permission.concat(roleOperations[roleIds[i]]);
    //     }
    // }
    // if (!!groupIds) {
    //     for (var i = 0; i < groupIds.length; i++) {
    //         permission = permission.concat(groupOperations[groupIds[i]]);
    //     }
    // }
    console.log(roleOperations);
    // console.log("---"+permission);
    treeviewPermissions.treeview('enableAll');
    var nodes = treeviewPermissions.treeview('getEnabled');


    begin:
    for(var i=0;i<nodes.length;i++){
        var isEqual=false;
        second:
        for(var rolePermission in roleCheckPermission){
            for(var groupPermission in groupCheckPermission) {
                console.log("nodeId:"+nodes[i].id + " groupPermission:"+groupPermission + "  rolePermission:"+rolePermission);
                if (nodes[i].id == groupPermission && nodes[i].id == rolePermission) {
                    // console.log(nodes[i]);
                    // treeviewPermissions.treeview('enableNode', [nodes[i], {silent: true}]);
                    // var parentNode = treeviewPermissions.treeview('getNode',nodes[i].parentId);
                    // treeviewPermissions.treeview('enableNode', [parentNode, {silent: true}]);

                    isEqual = true;
                    break second;
                }
            }
        }
        if(isEqual){
            continue;
        }
        if(typeof(nodes[i].parentId)=='undefined'){
            continue;
        }
        treeviewPermissions.treeview('disableNode', [nodes[i], {silent: true}]);
        // var parentNode = treeviewPermissions.treeview('getParent', nodes[i]);
        // console.log("--------------------------000");
        // console.log(parentNode);
        // var parentNeedDisabled=true;
        // for(var i=0;i<parentNode.nodes.length;i++){
        //     console.log(123);
        //     if(parentNode.nodes[i].state.disabled==false) {
        //         parentNeedDisabled = false;
        //         break;
        //     }
        // }
        // treeviewPermissions.treeview('disableNode', [parentNode, {silent: true}]);
    }

    console.log(nodes);
}

/**
 * 保存数据
 */
function saveUserPermission() {
    var checkedNodes_group = treeviewGroups.treeview('getChecked');
    var checkedNodes_role = treeviewRoles.treeview('getChecked');
    var checkedNodes_permission = treeviewPermissions.treeview('getChecked');

    var param={
        uid:userLongId,
        groupIds: [],
        roles: [],
        operation: []
    }

    for (var i = 0; i < checkedNodes_group.length; i++) {
        if(typeof(checkedNodes_group[i].parentId)!='undefined'){
            param.groupIds.push(checkedNodes_group[i].id);
        }
    }

    for (var i = 0; i < checkedNodes_role.length; i++) {
        param.roles.push(checkedNodes_role[i].id);
    }

    for (var i = 0; i < checkedNodes_permission.length; i++) {
        if(typeof(checkedNodes_permission[i].parentId)!='undefined'){
            param.operation.push(checkedNodes_permission[i].id);
        }
    }

    $.ajax({
        type: "POST",
        // dataType: "json",
        contentType:"application/json",
        url: "/authority/permission/user.htm",
        data: JSON.stringify(param),
        traditional:true,
        async: true,
        success: function (datas) {
            alert("更新成功");
            $('#formPermission').modal('hide');
        },
        error: function (data) {
            console.log(data);
            alert("网络异常");
        }
    });



}