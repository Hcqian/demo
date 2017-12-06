/**
 * Created by Feng on 2016/4/12.
 */


var $checkableTree;
var $expandibleTree;
var selectUserid;

/**
 * 查询部门及用户
 */
function selectDepartUsers() {
    var jsondata = {
        'op': 'selectDepartUsers'
    };

    execAjax("/settings/comm.htm", jsondata, true, function (datas) {
        if (datas.code == 0) {
            var list = eval(datas.data);
            var content = '[';

            for (var i = 0; i < list.length; i++) {
                var depart = list[i];
                if (i == list.length - 1) {
                    content += '{' +
                        '"id": "' + depart.id + '"' +
                        ',"text": "' + depart.text + '"';
                    var strnodes = '';
                    var parentid = depart.id;
                    var childlist = depart.nodes;
                    if (childlist != null) {
                        var nodes = eval(childlist);
                        for (var j = 0; j < nodes.length; j++) {
                            if (parentid == nodes[j].parentId) {
                                if (j == nodes.length - 1) {
                                    strnodes += '{' +
                                        '"id": "' + nodes[j].id + '"' +
                                        ',"text": "' + nodes[j].text + '"' +
                                        ',"tags":  "[' + nodes[j].parentId + ']"' +
                                        '}';
                                } else {
                                    strnodes += '{' +
                                        '"id": "' + nodes[j].id + '"' +
                                        ',"text": "' + nodes[j].text + '"' +
                                        ',"tags":  "[' + nodes[j].parentId + ']"' +
                                        '},';
                                }
                            }
                        }
                    }
                    if (strnodes != '') {
                        strnodes = '[' + strnodes + ']';
                        content += ',"nodes": ' + strnodes;
                    }
                    content += '}';
                } else {
                    content += '{' +
                        '"id": "' + depart.id + '"' +
                        ',"text": "' + depart.text + '"';
                    var strnodes = '';
                    var parentid = depart.id;
                    var childlist = depart.nodes;
                    if (childlist != null) {
                        var nodes = eval(childlist);
                        for (var j = 0; j < nodes.length; j++) {
                            if (parentid == nodes[j].parentId) {
                                if (j == nodes.length - 1) {
                                    strnodes += '{' +
                                        '"id": "' + nodes[j].id + '"' +
                                        ',"text": "' + nodes[j].text + '"' +
                                        ',"tags":  "[' + nodes[j].parentId + ']"' +
                                        '}';
                                } else {
                                    strnodes += '{' +
                                        '"id": "' + nodes[j].id + '"' +
                                        ',"text": "' + nodes[j].text + '"' +
                                        ',"tags":  "[' + nodes[j].parentId + ']"' +
                                        '},';
                                }
                            }
                        }
                    }
                    if (strnodes != '') {
                        strnodes = '[' + strnodes + ']';
                        content += ',"nodes": ' + strnodes;
                    }
                    content += '},';
                }
            }
            content += "]";
            //console.log(content);
            $expandibleTree = $('#treeviewUsers').treeview({
                data: content,
                multiSelect: false,
                levels: 1,
                onNodeSelected: function (event, node) {
                    //选中事件
                    if (node.tags != undefined) {
                        //取消选择
                        $checkableTree.treeview('uncheckAll', {silent: true});
                        parentid = $checkableTree.treeview('getParent', node).id;
                        // 设置选择
                        selectUserRoles(node.id);
                    }
                },
                onNodeUnselected: function (event, node) {
                    //取消选中事件
                    //if (node.tags != undefined) {
                    //    console.log('onNodeUnselected ' + node.id + ':' + node.text);
                    //}
                }
            });
            //$('#treeviewUsers').treeview('collapseAll', {silent: true});
        }
        else {
            return null;
        }
    });
}

/**
 * 查询用户的角色
 * @param userid
 */
function selectUserRoles(userid) {

    selectUserid = userid;
    var jsondata = {
        'op': 'selectUserRoles',
        'userid': userid
    };

    execAjax("/settings/comm.htm", jsondata, false, function (datas) {
        if (datas.code == 0) {
            var list = eval(datas.data);
            for (var i = 0; i < list.length; i++) {
                var roleid = list[i].roleid;
                var departid = list[i].departid;
                //console.log("userid:" + userid + ",departid:" + departid + ",roleid:" + roleid);

                var uncheckedNodes = $checkableTree.treeview('getUnchecked');

                for (var j = 0; j < uncheckedNodes.length; j++) {
                    //console.log("tags:" + uncheckedNodes[j].tags + ",id:" + uncheckedNodes[j].id);
                    if (uncheckedNodes[j].tags == undefined && uncheckedNodes[j].id == roleid) {
                        // 特殊处理
                        if (uncheckedNodes[j].text == "超级管理员" || uncheckedNodes[j].text == "管理员") {
                            $checkableTree.treeview('checkNode', [uncheckedNodes[j], {silent: true}]);
                        }
                    } else {
                        if (uncheckedNodes[j].id == roleid && uncheckedNodes[j].tags == "[" + departid + "]") {
                            $checkableTree.treeview('checkNode', [uncheckedNodes[j], {silent: true}]);
                            //var parentnode = $checkableTree.treeview('getParent', uncheckedNodes[j]);
                            $checkableTree.treeview('checkNode', [$checkableTree.treeview('getParent', uncheckedNodes[j]), {silent: true}]);
                        }
                    }
                }
            }
        }
        else {
        }
    });
}

/**
 * 保存用户的角色
 * @param userid
 */
function saveUserRoles() {
    console.log("saveUserRoles click ")
    var checkedNodes = $checkableTree.treeview('getChecked');
    var roleids = new Array();
    for (var i = 0; i < checkedNodes.length; i++) {
        var item = {
            'departid': checkedNodes[i].tags,
            'roleid': checkedNodes[i].id
        };
        roleids.push(item);
    }
    var jsondata = {
        'op': 'saveUserRoles',
        'userid': selectUserid,
        //'departId': departId,
        'roleids': roleids
    };

    execAjax("/settings/comm.htm", jsondata, false, function (datas) {
        if (datas.code == 0) {
            alert("更新成功.");
        }
        else {
            alert("更新失败.");
        }
    });
}

/**
 * 查询角色
 */
function selectRoles() {
    var jsondata = {
        'op': 'selectRoles'
    };

    execAjax("/settings/comm.htm", jsondata, true, function (datas) {
        if (datas.code == 0) {

            var list = eval(datas.data);
            var content = '[';

            for (var i = 0; i < list.length; i++) {
                var depart = list[i];
                if (i == list.length - 1) {
                    content += '{' +
                        '"id": "' + depart.id + '"' +
                        ',"text": "' + depart.text + '"';
                    var strnodes = '';
                    var parentid = depart.id;
                    var childlist = depart.nodes;
                    if (childlist != null) {
                        var nodes = eval(childlist);
                        for (var j = 0; j < nodes.length; j++) {
                            if (parentid == nodes[j].tags) {
                                if (j == nodes.length - 1) {
                                    strnodes += '{' +
                                        '"id": "' + nodes[j].id + '"' +
                                        ',"text": "' + nodes[j].text + '"' +
                                        ',"tags":  "[' + nodes[j].tags + ']"' +
                                        '}';
                                } else {
                                    strnodes += '{' +
                                        '"id": "' + nodes[j].id + '"' +
                                        ',"text": "' + nodes[j].text + '"' +
                                        ',"tags":  "[' + nodes[j].tags + ']"' +
                                        '},';
                                }
                            }
                        }
                    }
                    if (strnodes != '') {
                        strnodes = '[' + strnodes + ']';
                        content += ',"nodes": ' + strnodes;
                    }
                    content += '}';
                } else {
                    content += '{' +
                        '"id": "' + depart.id + '"' +
                        ',"text": "' + depart.text + '"';
                    var strnodes = '';
                    var parentid = depart.id;
                    var childlist = depart.nodes;
                    if (childlist != null) {
                        var nodes = eval(childlist);
                        for (var j = 0; j < nodes.length; j++) {
                            if (parentid == nodes[j].tags) {
                                if (j == nodes.length - 1) {
                                    strnodes += '{' +
                                        '"id": "' + nodes[j].id + '"' +
                                        ',"text": "' + nodes[j].text + '"' +
                                        ',"tags":  "[' + nodes[j].tags + ']"' +
                                        '}';
                                } else {
                                    strnodes += '{' +
                                        '"id": "' + nodes[j].id + '"' +
                                        ',"text": "' + nodes[j].text + '"' +
                                        ',"tags":  "[' + nodes[j].tags + ']"' +
                                        '},';
                                }
                            }
                        }
                    }
                    if (strnodes != '') {
                        strnodes = '[' + strnodes + ']';
                        content += ',"nodes": ' + strnodes;
                    }
                    content += '},';
                }
            }
            content += "]";
            console.log(content);

            $checkableTree = $('#treeviewPermissions').treeview({
                data: content, showIcon: false,
                showCheckbox: true,
                levels: 1,
                onNodeChecked: function (event, node) {
                    console.log('onNodeChecked ' + node.id + ':' + node.text);
                },
                onNodeUnchecked: function (event, node) {
                }
            });
        }

    });
}