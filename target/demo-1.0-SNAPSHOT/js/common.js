/**
 * Created by Feng on 2016/4/11.
 */

var updateStatus = false;

function setUpdateStatus(status) {
    updateStatus = status;
    parent.updateStatus = status;
}

function getUpdateStatus() {
    return updateStatus;
}
/**
 * 文件上传后对该文件信息进行保存 并返回保存后的ID信息
 * @param id
 * @param adaptId
 * @param tag
 * @param name
 * @param url
 */
function saveFilePath(id, adaptId, tag, name, url, status) {
    return execAjaxData("/fileCtrl/saveFileInfo.htm", {
        'adaptId': adaptId,
        'tag': tag,
        'name': name,
        'url': url,
        'status': status
    }, function (datas) {
        //if(isUpdate){
        //    //将以前的数据置为无效
        //    updateStatus(id);
        //}

        if (id != null) {
            $(id).val(datas.data.id);
        }
    });
}

function getFileList() {
    var adaptId = $("#adaptId").val();
    $.ajax({
        cache: false,
        url: "/fileCtrl/filelist.htm",
        type: "POST",
        dataType: "html",
        data: {'adaptId': adaptId},
        async: true,
        error: function (data) {
            console.log(data);
        },
        success: function (data) {
            $("#fileList").html(data);
        }
    });
}

function getTaskRemarks() {
    var adaptId = $("#adaptId").val();
    $.ajax({
        cache: false,
        url: "/task/remarkList.htm",
        type: "POST",
        dataType: "html",
        data: {'adaptId': adaptId},
        async: true,
        error: function (data) {
            console.log(data);
        },
        success: function (data) {
            $("#remarkList").html(data);
        }
    });
}


function updateFileStatus(id, status) {
    execAjaxData("/common/updateFileStatus.htm", {'fileId': id, 'status': status}, function (datas) {
    });
}

/**
 * 获取根路径
 * @returns {string}
 */
function getRootPath() {
    var strFullPath = window.document.location.href;
    var strPath = window.document.location.pathname;
    var pos = strFullPath.indexOf(strPath);
    var prePath = strFullPath.substring(0, pos);
    var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
    return (prePath);
}

/**
 * 执行 ajax 调用
 * @param url
 * @param jsondata
 * @param isAsynv
 * @param callback
 */
function execAjaxData(url, jsondata, callback, completeCallback) {
    var deferred = $.Deferred();
    $.ajax({
        cache: false,
        url: url,
        type: "POST",
        dataType: "json",
        data: jsondata,
        async: true,
        error: function (data) {
            console.log(data);
            deferred.reject();
        },
        success: function (data) {
            //console.log(data);
            callback(data);
            deferred.resolve();
        },
        complete: function () {
            !!completeCallback && completeCallback();
        }
    });
    return deferred.promise();

}

/**
 * 执行 ajax 调用
 * @param url
 * @param jsondata
 * @param isAsynv
 * @param callback
 */
function execAjax(url, jsondata, isAsync, callback) {
    console.log(getRootPath() + url);
    console.log(JSON.stringify(jsondata));

    $.ajax({
        cache: false,
        url: getRootPath() + url,
        type: "POST",
        dataType: "json",
        data: JSON.stringify(jsondata),
        async: isAsync,
        error: function (data) {
            console.log(data);
        },
        success: function (data) {
            //console.log(data);
            callback(data);
        },
        complete: function () {
        }
    });
}

/**
 * 获取服务器中当前时间
 */
function setCurrentTime(id) {
    execAjaxData("/util/getCurrentTime.htm", {}, function (datas) {
        var currentTime = datas.data.timeStampDate;
        $(id).val(currentTime);
    });
}

/**
 * 获取当前时间
 * @returns {string}
 */
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var strHours = date.getHours();
    var strMinutes = date.getMinutes();
    var strSeconds = date.getSeconds();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }

    if (strHours >= 0 && strHours <= 9) {
        strHours = "0" + strHours;
    }

    if (strMinutes >= 0 && strMinutes <= 9) {
        strMinutes = "0" + strMinutes;
    }

    if (strSeconds >= 0 && strSeconds <= 9) {
        strSeconds = "0" + strSeconds;
    }


    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + strHours + seperator2 + strMinutes
        + seperator2 + strSeconds;
    return currentdate;
}


(function ($) {
    $.extend({
        myTime: {
            /**
             * 当前时间戳
             * @return <int>        unix时间戳(秒)
             */
            CurTime: function () {
                return Date.parse(new Date());
            },

            /**
             * 日期 转换为 Unix时间戳
             * @param <string> 2014-01-01 20:20:20  日期格式
             * @return <int>        unix时间戳(秒)
             */
            DateToUnix: function (string) {
                var f = string.split(' ', 2);
                var d = (f[0] ? f[0] : '').split('-', 3);
                var t = (f[1] ? f[1] : '').split(':', 3);
                return (new Date(
                    parseInt(d[0], 10) || null,
                    (parseInt(d[1], 10) || 1) - 1,
                    parseInt(d[2], 10) || null,
                    parseInt(t[0], 10) || null,
                    parseInt(t[1], 10) || null,
                    parseInt(t[2], 10) || null
                )).getTime();
            },

            /**
             * 时间戳转换日期
             * @param <int> unixTime    待时间戳(秒)
             * @param <bool> isFull    返回完整时间(Y-m-d 或者 Y-m-d H:i:s)
             * @param <int>  timeZone   时区
             */
            UnixToDate: function (unixTime, isFull, timeZone) {
                if (typeof (timeZone) == 'number') {
                    unixTime = parseInt(unixTime) + parseInt(timeZone) * 60 * 60;
                }
                var time = new Date(unixTime);
                var ymdhis = "";
                ymdhis += time.getUTCFullYear() + "-";
                ymdhis += (time.getUTCMonth() + 1) + "-";
                ymdhis += time.getUTCDate();
                if (isFull === true) {
                    ymdhis += " " + time.getUTCHours() + ":";
                    ymdhis += time.getUTCMinutes() + ":";
                    ymdhis += time.getUTCSeconds();
                }
                return ymdhis;
            }
        }
    });
})(jQuery);

/**
 * 获取get方式参数
 * @param name  参数名称
 * @returns {*}
 * @constructor
 */
function getParam(name) {
    var str = window.location.href;
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = str.substr(str.indexOf("?") + 1).match(reg);
    if (r != null)return r[2];
    return null;
}

//基本校验
var Validator = {

    //byte length
    byteLength: function (msg) {
        var i, sum;
        sum = 0;
        for (i = 0; i < msg.length; i++) {
            if ((msg.charCodeAt(i) >= 0) && (msg.charCodeAt(i) <= 255)) {
                sum = sum + 1;
            } else {
                sum = sum + 2;
            }
        }
        return sum;
    },

    isEmail: function (str) {
        var reg = /^[A-Za-z\d]+([-_.A-Za-z\d]+)*@([A-Za-z\d]+[-_.])+[A-Za-z\d_-]{2,5}$/;
        //var reg = /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/;
        var flag = reg.test(str);
        return flag;
    },

    //check mobile
    isMobileNum: function (str) {
        var reg = /^1\d{10}$/;
        var flag = reg.test(str);
        return flag;
    },

    //校验身份证号码，15位或者18位，最后一位可以输入X
    isIdCard: function (str) {
        var reg = /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;
        var flag = reg.test(str);
        return flag;
    },

    //a-z A-Z
    isAlpha: function (str) {
        var reg = /^[A-z]+$/;
        var flag = reg.test(str);
        return flag;
    },

    //检查是否字母或数字
    isAlphaNumeric: function (str) {
        var reg = /^[0123456789A-z]+$/;
        var flag = reg.test(str);
        return flag;
    },

    //检查是否字母或数字或中划线下划线
    isAlphaDash: function (str) {
        var reg = /^[-_0123456789A-z]+$/;
        var flag = reg.test(str);
        return flag;
    },

    //检查是否数值
    isNumeric: function (str) {
        var reg = /^-?[0-9]+\.?[0-9]*$/;
        var flag = reg.test(str);
        return flag;
    },

    //检查是否数字
    isDigital: function (str) {
        var reg = /^[0-9]+$/;
        var flag = reg.test(str);
        return flag;
    },

    // 检查是否小于
    isLess: function (str, num) {
        return str.length < num;
    },

    // 检查是否大于
    isMore: function (str, num) {
        if (!str) {
            str = "";
        }
        return str.length > num;
    },

    //检测（只能输入中文）
    isChineseStr: function (str) {
        var flag = true;
        var testStr = /^[\u4e00-\u9fa5]*$/;
        return testStr.test(str);
    },

    //检测（允许中文，英文，字母，数字，"_"，"."）
    isCNDefaultStr: function (str) {
        var flag = true;
        var testStr = /^[\u4e00-\u9fa5a-zA-Z0-9\.\_]*$/;
        return testStr.test(str);
    },

    //检测（允许英文，字母，数字，"_"，"."）
    isDefaultStr: function (str) {
        var flag = true;
        var testStr = /^[\a-zA-Z0-9\.\_]*$/;
        return testStr.test(str);
    },

    //是否是空串
    isEmpty: function (str) {
        return str.replace(/^\s+|\s+$/g, '') == "";
    },

    //图片格式
    isImg: function (str) {
        var reg = /.+(\.gif|\.jpg|\.jpeg|\.png)$/i;
        var flag = reg.test(str);
        return flag;
    },

    //判断是否为url路径
    isUrl: function (str) {
        return (/^(http:|ftp:)\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"])*$/).test(str);
    },

    //检查下载.apk文件url地址
    isUploadUrl: function (str) {
        var reg = /^((https|http|ftp|rtsp|mms):\/\/){1}([A-Za-z0-9\/\/_!~*'().;?:@&=+$,%#-])+(\.([aA][pP][kK]|[iI][pP][aA]))$/;
        var flag = reg.test(str);
        return flag;
    },

    //检查下载.apk文件url地址
    isAppFile: function (str) {
        var reg = /\.([aA][pP][kK]|[iI][pP][aA])$/i;
        var flag = reg.test(str);
        return flag;
    }
};