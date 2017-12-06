/**
 * Created by phoenix-kai on 2016/10/14.
 */

Array.prototype.contains=function(obj) {
    var index=this.length;
    while (index--){
        if(this[index]==obj){
            return true;
        }
    }
    return false;
}

$(document).ready(function(){

    $.ajaxSetup({
        statusCode: {
            401: function(data) {
                console.error(data);
                var val = data.responseJSON;
                if(!!val){
                    alert("code: "+ val.code + "; "+ val.message);
                }else{
                    alert("权限不足");
                }
            }
        }
    });

    if(typeof(currentPageAuthroty)=="undefined"){
        currentPageAuthroty = new PageAuthroty();
    }
    currentPageAuthroty.refresh();


});





function PageAuthroty(){

    // this.groupAll={
    //     Account : "需求对接组",
    //     CasePM : "CasePM",
    //     AutoTest : "自动化组",
    //     ManualTest : "征途",
    //     VerifyPM : "审核PM",
    //     ReportPM : "ReportPM",
    //     QualityPM : "质检PM",
    //     DataManag : "数据管理员",
    //     Systemger : "系统管理员"
    // }


    var $this = this;
    this.loadGroupInfos=function(){
        $.ajax({
            url: "/authority/group.htm",
            type: "get",
            dataType: "json",
            async: false,
            success: function (data) {
                // debugger;
                if(data.code==0) {
                    $this.groupInfos = data.data;
                    console.log("加载组信息");
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
    };
    this.loadProcessTranstionMapping=function (){
        $.ajax({
            url: "/authority/processTranstionMapping.htm",
            type: "get",
            dataType: "json",
            async: true,
            success: function (data) {
                $this.processTranstionMapping = data.data;
                console.log("加载组百分比关系");
            },
            error: function (data) {
                console.log(data);
            }
        });
    };

    this.loadCurrentUserPermission=function(){
        $.ajax({
            url: "/authority/permission/user/current.htm",
            type: "get",
            dataType: "json",
            async: false,
            success: function (data) {
                if(data.code==0) {
                    $this.currentUserPermission = data.data;
                    console.log("加载页面权限");
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
    }

    this.groupInfos=[];  //[{"groupId":2,"groupKey":"Account","groupName":"需求对接组","departId":2,"departName":"Android"},
    this.processTranstionMapping=[]; // [{"processCode":0,"assignText":"新建任务","group":null},{"processCode":5,"assignText":"领取任务5%","group":{"name":"需求对接组","key":"Account"}},
    this.currentUserPermission ={operation:[],roles:[],groups:[],uid:-1};

    this.findGroupInfoById = function(groupId){
        // debugger;
        for(var i=0;i<this.groupInfos.length; i++){
            if(this.groupInfos[i].groupId == groupId){
                return this.groupInfos[i];
            }
        }
        return ;
    };
    this.findGroupInfo = function(key, departName){
        var keyGroups = [];
        if(typeof(key)=='undefined' && typeof(departName)=='undefined'  ){
            return keyGroups;
        }
        for(var i=0;i<this.groupInfos.length; i++){
            var keyEqual = typeof(key)=='undefined' || this.groupInfos[i].groupKey == key;
            var departNameEqual = typeof(departName)=='undefined' || this.groupInfos[i].departName == departName;
            if(keyEqual && departNameEqual){
                keyGroups.push(this.groupInfos[i]);
            }
        }
        return keyGroups;
    };

    this.findGroupIds = function(key, departName){
        var groupInfos = this.findGroupInfo(key,departName);
        var groupIds = [];
        for(var i=0;i<groupInfos.length; i++){
            groupIds.push(groupInfos[i].groupId);
        }
        return groupIds;
    };



    this.loadGroupInfos();
    this.loadProcessTranstionMapping();
    this.loadCurrentUserPermission();

}

/**********config ************/

PageAuthroty.prototype.lastOptType={
    "auth-able":{
        true:function(){

            $(this).attr("disabled", false);
            $(this).css({pointerEvents: ""});
            $(this).css("cursor","");
        },
        false:function(){
            $(this).attr("disabled", true);
            $(this).css({pointerEvents: "none"});
            $(this).css({cursor:"not-allowed"});
        }
    },
    "auth-display":{
        true:function(){
            $(this).show();
        },
        false:function(){
            $(this).hide();
        }
    },
    "auth-realdisplay":{
        true:function(){
            $(this).show();
        },
        false:function(){
            $(this).hide();
            $(this).remove();
        }
    }
}


//检查任务可否编辑
//参数{groupKey:[],operation:[], taskStatus，execDepart,execUid ,processCode, condition}
// execDepart 任务所在组id
PageAuthroty.prototype.checkTaskEditable=function(val){
    try {
        if (typeof(val) != 'object') {
            return false;
        }
        // debugger;
        var currentUserPermission = currentPageAuthroty.getCurrentUserPermission();
        var accountGroups = currentPageAuthroty.getCurrentGroupByKey('Account'); // 接口组
        // var manualTestGroups = currentPageAuthroty.getCurrentGroupByKey('ManualTest'); // 征途组

        //自定义条件是否满足
        var conditionResult = typeof(val.condition) == 'undefined' || !!eval(val.condition);
        var permissionCheckResult = false;
        //用户权限是否满足
        //任务状态是进行中，且当前用户有编辑进行中任务权限
        if (        (val.taskStatus == 1 || val.taskStatus == 0 )
            && !!val.operation && val.operation.contains("task$editRunning") && this.currentOperationAnyContains("task$editRunning")) {

            //当前执行人可编辑，  征途组任务时，征途组所有人可编辑
            //95% 时 属于此接口组的人都有权限
            var inGroup= currentPageAuthroty.getCurrentGroupByGroupId(val.execDepart);
            // debugger
            if( typeof(inGroup) != 'undefined' && inGroup.groupKey == 'ManualTest' ){
                permissionCheckResult=true;
            }else if(typeof(inGroup) != 'undefined' && inGroup.groupKey == 'Account' && val.processCode ==95 ){
                permissionCheckResult=true;
            }else{
                permissionCheckResult = currentUserPermission.uid == val.execUid;
            }
            //
            // permissionCheckResult = (  currentUserPermission.uid == val.execUid ) &&(
            //                             ( typeof(inGroup) != 'undefined' ) ||
            //                             ( ( typeof(accountGroup) != 'undefined' ) &&   !!$.trim(val.execDepart))
            //                         );
            // permissionCheckResult = (  currentUserPermission.uid == val.execUid )
            //     || ( typeof(accountGroup) != 'undefined' )
            //     || ( val.execDepart == 4 && typeof(manualTestGroup) != 'undefined');
        }
        //任务状态是已完成，且当前用户有编辑已完成任务权限
        if (val.taskStatus == 2 && !!val.operation
            && val.operation.contains("task$editComplate") && this.currentOperationAnyContains("task$editComplate")) {
            permissionCheckResult = true;
        }

        //判断当前用户的用户组是否有匹配
        if(!!val.groupKey){
            var inGroup=false;
            for(var i=0;i<val.groupKey.length; i++){
                //用户组要匹配
                var inGroupObj = this.getCurrentGroupByKey(val.groupKey[i]);
                if(typeof(inGroupObj) !='undefined'){
                    inGroup=true;
                    break;
                }
            }
            permissionCheckResult = permissionCheckResult && inGroup ;
        }

        return conditionResult && permissionCheckResult;

    }catch(e){
        console.error(e);
        return false;
    }
}

// key  及 不满足权限时的操作
PageAuthroty.prototype.keyStrategy={
    "data-auth-taskeditable":{
        atype: "auth-able",
        run:function(val){
            //任务可否编辑
            //参数{operation:[], taskStatus，execDepart,execUid, condition}
            if(typeof(val)=='undefined') { return}
            var val = eval('(' + val + ')');
            return currentPageAuthroty.checkTaskEditable(val);
        }
    },
    "data-auth-abled":{
        atype: "auth-able",
        run:function (val) {
            //参数groupid:[],roleId:[],operation:[], groupid, uid, condition:function
            if(typeof(val)=='undefined') { return }
            var val = eval('(' + val + ')');
            var result=false;
            try {
                if (typeof(val) == 'object') {
                    result = currentPageAuthroty.strategyPermissionCheck(val);
                    if(typeof(val.condition) != 'undefined'){
                        if (typeof(val.condition) == 'function') {
                            result = result && val.condition.call(val);
                        }else{
                            result = !!val.condition;
                        }
                    }
                }
            }finally {
                return result;
            }
        }
    },
    "data-auth-show": {
        atype: "auth-display",
        run:function (val) {
            //参数groupid:[],roleId:[],operation:[], uid, condition:function
            if(typeof(val)=='undefined') { return }
            var val = eval('(' + val + ')');
            var result=false;
            try {
                if (typeof(val) == 'object') {
                    result = currentPageAuthroty.strategyPermissionCheck(val);
                    if(typeof(val.condition) != 'undefined'){
                        if (typeof(val.condition) == 'function') {
                            result = result && val.condition.call(val);
                        }else{
                            result = !!val.condition;
                        }
                    }
                }
            }finally {
                return result;
            }
        }
    },
    "data-auth-realshow": {
        atype: "auth-realdisplay",
        run:function (val) {
            //参数groupid:[],roleId:[],operation:[], uid, condition:function
            if(typeof(val)=='undefined') { return }
            var val = eval('(' + val + ')');
            var result=false;
            try {
                if (typeof(val) == 'object') {
                    result = currentPageAuthroty.strategyPermissionCheck(val);
                    if(typeof(val.condition) != 'undefined'){
                        if (typeof(val.condition) == 'function') {
                            result = result && val.condition.call(val);
                        }else{
                            result = !!val.condition;
                        }
                    }
                }
            }finally {
                return result;
            }
        }
    }



}
//在当前登录用户所属组中查找指定组
PageAuthroty.prototype.getCurrentGroupByGroupId=function(groupId){
    var currentUser = this.getCurrentUserPermission();
    for(var i=0 ;i<currentUser.groups.length; i++){
        if(currentUser.groups[i].groupId == groupId){
            return currentUser.groups[i];
        }
    }
    return;
}
//在当前登录用户所属组中查找指定组
PageAuthroty.prototype.getCurrentGroupByKey=function(groupKey){
    var currentUser = this.getCurrentUserPermission();
    var groups=[];
    for(var i=0 ;i<currentUser.groups.length; i++){
        if(currentUser.groups[i].groupKey == groupKey){
            groups.push(currentUser.groups[i]);
        }
    }
    return;
}
//在当前登录用户所属角色中查找指定角色
PageAuthroty.prototype.getCurrentRoleByRoleName=function(roleName){
    var currentUser = this.getCurrentUserPermission();
    for(var i=0 ;i<currentUser.roles.length; i++){
        if(currentUser.roles[i].roleName == roleName){
            return currentUser.roles[i];
        }
    }
    return;
}
//在当前登录用户所属权限和指定权限是否存在任意匹配
PageAuthroty.prototype.currentOperationAnyContains=function(operations){
    if(typeof(operations)=='undefined'){
        return false;
    }
    var arrays = operations instanceof Array? operations:[operations];
    var currentUser = this.getCurrentUserPermission();
    for(var i=0;i<arrays.length;i++){
        if(currentUser.operation.contains(arrays[i])){
            return true;
        };
    }
    return false;
}

PageAuthroty.prototype.strategyPermissionCheck=function(strategyParam){
    var currentUser = this.getCurrentUserPermission();
    var operations = currentUser.operation;
    var groupIds = (function(){
        var groupIds =[];
        $.each(currentUser.groups, function(){
            groupIds.push(this.groupId);
        });
        return groupIds;
    })();
    var roleIds = (function(){
        var roleIds =[];
        $.each(currentUser.roles, function(){
            roleIds.push(this.roleId);
        });
        return roleIds;
    })();

    var groupIntersect=this.arrayIntersect(strategyParam.groupid,groupIds);
    var roleIntersect=this.arrayIntersect(strategyParam.roleId,roleIds);
    var operationIntersect = this.arrayIntersect(strategyParam.operation,operations);

    var result =    ( (typeof(strategyParam.groupid)=='undefined') || strategyParam.groupid.length==0 || groupIntersect.length>0 )
                    &&
                    ( (typeof(strategyParam.roleId)=='undefined') || strategyParam.roleId.length==0 || roleIntersect.length>0 )
                    &&
                    ( (typeof(strategyParam.operation)=='undefined') || strategyParam.operation.length==0 || operationIntersect.length>0 )
                    &&
                    ( typeof(strategyParam.uid)=='undefined' || currentUser.uid == strategyParam.uid);

    return result;
}

PageAuthroty.prototype.getCurrentUserPermission=function(){
    if(!this.currentUserPermission){
        this.currentUserPermission= this.loadCurrentUserPermission();
    }
    return this.currentUserPermission;
}

// PageAuthroty.prototype.strategyDefaultParam={
//     groupid:[],roleId:[],operation:[], adaptId:""
//     after:function(){}
// }



//刷新
PageAuthroty.prototype.refresh=function(){

    var $this= this;
    //加载元素
    var eles = this.loadEleByMark();
    //判断当前用户权限是否满足元素定义任意权限
    eles.each(function(){
        var results={};
        //同一类型操作，做或判断
        for(var key in $this.keyStrategy){
            var val = $(this).attr(key);
            if(typeof(val) != 'undefined') {
                var result = $this.keyStrategy[key].run.call(this, val);
                if (typeof(result) != 'undefined') {
                    if (typeof(results[$this.keyStrategy[key].atype]) == 'undefined') {
                        results[$this.keyStrategy[key].atype] = result;
                    } else {
                        results[$this.keyStrategy[key].atype] = results[$this.keyStrategy[key].atype] && result;
                    }
                }
            }
        }
        for(var resultKey in results){
            $this.lastOptType[resultKey][results[resultKey]].call(this);
        }
    });

}

//加载所有标记的元素
PageAuthroty.prototype.loadEleByMark=function(){
    var pattern=[];
    for(var key in this.keyStrategy){
        pattern.push(key);
    }
    var patternJoin = "["+pattern.join("],[")+"]";
    return $(patternJoin);

}

PageAuthroty.prototype.arrayIntersect = function(array1,array2){
    var array3=[];
    if(typeof(array1)=='undefined' || typeof(array2)=='undefined'){
        return array3;
    }
    for(var i=0;i<array1.length;i++){
        for(var o=0;o<array2.length; o++){
            if($.trim(array1[i]) == $.trim(array2[o])){
                array3.push(array1[i]);
            }
        };
    }
    return array3;
}

