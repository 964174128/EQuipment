//获取get参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

var id = GetQueryString("id");

$(function () {
     
    $('.selectpicker').selectpicker.defaults = {
        noneSelectedText: '没有选中任何项',
        noneResultsText: '没有找到匹配项',
        countSelectedText: '选中{1}中的{0}项',
        maxOptionsText: ['超出限制 (最多选择{n}项)', '组选择超出限制(最多选择{n}组)'],
        multipleSeparator: ', ',
        selectAllText: '全选',
        deselectAllText: '取消全选'
    };

    $('#mainForm').bootstrapValidator({
        message: '不合法输入！',
        excluded: ':disabled',//关键配置，表示只对于禁用域不进行验证，其他的表单元素都要验证

        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',//显示验证成功或者失败时的一个小图标
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            id: {
                validators: {
                    notEmpty: {
                        message: '配线架编号必填不能为空'
                    },
                    digits: {
                        message: '配线架编号只能由数字组成。'
                    },
                }
            },
            portId: {
                validators: {
                    notEmpty: {
                        message: '端口编号必填不能为空'
                    },
                    digits: {
                        message: '端口编号只能由数字组成。'
                    },
                }
            },
            name: {
                message: '设备名称不能为空',//默认提示信息
                validators: {
                    notEmpty: {
                        message: '设备名称必填不能为空'
                    },
                }
            }, 
            portName: {
                message: '端口名称不能为空',//默认提示信息
                validators: {
                    notEmpty: {
                        message: '端口名称必填不能为空'
                    },
                }
            },
            engineRoom: {
                message: '所属机房不能为空',//默认提示信息
                validators: {
                    notEmpty: {
                        message: '所属机房必填不能为空'
                    },
                }
            },
            cabinet: {
                message: '所属机柜不能为空',//默认提示信息
                validators: {
                    notEmpty: {
                        message: '所属机柜必填不能为空'
                    },
                }
            },
        }
    }).on('error.form.bv', function (e) {

        var $form = $(e.target),
            validator = $form.data('bootstrapValidator'),
            $invalidField = validator.getInvalidFields().eq(0),
            $collapse = $invalidField.parents('.collapse');

        $collapse.collapse('show');
    });

    GetEngineRooms();
});

//获取机房列表
function GetEngineRooms() {
    $("#engineRoom").html("");
    $.ajax({
        type: 'POST',
        data: "",
        dataType: "json",
        url: ajaxUrl + "EngineRooms/datagrid",
        success: function (data) {
            var htmlStr = "";
            $.each(data.data, function (i, n) {
                var option = '<option title="' + n.id + '">' + n.name + '</option>';
                htmlStr += option;
            });
            $("#engineRoom").html(htmlStr);
            $("#engineRoom").selectpicker("refresh");
            if (id != undefined) {
                GetPatchPanelInfo();
                return;
            }
            GetCabinets();
        }
    });
}

//获取机柜列表
function GetCabinets(cabinetId) {
    $("#cabinet").html("");
    $.ajax({
        type: 'POST',
        data: { "id": parseInt($("button[data-id='engineRoom']").attr("title")), },
        dataType: "json",
        url: ajaxUrl + "Cabinets/datagrid",
        success: function (data) {
            var htmlStr = "";
            $.each(data.data, function (i, n) {
                var option = '<option title="' + n.id + '">' + n.name + '</option>';
                htmlStr += option;
            });
            $("#cabinet").html(htmlStr);

            if (cabinetId != undefined && cabinetId != null) {
                $("#cabinet option[title='" + data.cabinetId + "']").attr("selected", "selected");
            }
            $("#cabinet").selectpicker("refresh");
        }
    });
}

//保存
function InsertPatchPanel() {
    var urlTemp = "";
    if (id == undefined || id == null) {
        urlTemp = ajaxUrl + "PatchPanels/add";
    } else {
        urlTemp = ajaxUrl + "PatchPanels/edit"
    }
    $("#errMsg").html("");
    $.ajax({
        type: 'POST',
        data: {
            "id": parseInt($("#id").val()), "name": $("#name").val(), "portId": parseInt($("#portId").val()), "portName": $("#portName").val(),
            "portType": $("#portType").val(), "portConnect": $("#portConnect").val(), "engineRoomId": parseInt($("button[data-id='engineRoom']").attr("title")),
            "cabinetId": parseInt($("button[data-id='cabinet']").attr("title")),
        },
        dataType: "json",
        url: urlTemp,
        success: function (data) {
            if (data.success == true || data.success == "true") {
                $(':input', '#mainForm')
       .not(':button,:submit,:reset,:hidden')
       .val('')
       .removeAttr('checked');
                alert("保存成功！");
                return;
            }
            alert(data.msg);
        },
        error: function (data) {
            alert(data.success);
        }
    });
}

//获取配线架信息
function GetPatchPanelInfo() {
    $.ajax({
        type: 'POST',
        data: {
            "id": id
        },
        dataType: "json",
        url: ajaxUrl + "PatchPanels/getonebyid",
        success: function (data) {
            data = data.data;
            $("#id").val(id);
            $("#id").attr("readonly", "readonly");
            $("#name").val(data.name); 
            $("#portId").val(data.portId);
            $("#portName").val(data.portName);
            $("#portType").val(data.portType);
            $("#portConnect").val(data.portConnect);
            $("#engineRoom option[title='" + data.engineRoomId + "']").attr("selected", "selected");
            $("#engineRoom").selectpicker("refresh");
            GetCabinets(data.cabinetId);
        },
        error: function (data) {
            alert("获取设备信息失败，请检查网络连接！");
        }
    });
}

//选择机房时，切换机柜
$('#engineRoom').on('changed.bs.select', function (e) {
    GetCabinets();
});

$("#saveBtn").click(function (e) {
    InsertPatchPanel();
});

$("#deleteBtn").click(function (e) {
    $(':input', '#mainForm')
       .not(':button,:submit,:reset,:hidden')
       .val('')
       .removeAttr('checked');
});