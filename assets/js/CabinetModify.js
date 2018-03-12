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
                        message: '机柜编号必填不能为空'
                    },
                    digits: {
                        message: '机柜编号只能由数字组成。'
                    },
                }
            },
            name: {
                validators: {
                    notEmpty: {
                        message: '机柜名称必填不能为空'
                    },
                }
            }, 
            building: {
                validators: {
                    notEmpty: {
                        message: '所属建筑必填不能为空'
                    },
                }
            },
            floor: {
                validators: {
                    notEmpty: {
                        message: '所属楼层必填不能为空'
                    },
                }
            },
            engineRoom: {
                validators: {
                    notEmpty: {
                        message: '所属机房必填不能为空'
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

    GetBuildings();
});

//获取建筑列表
function GetBuildings() {
    $("#building").html("");
    $.ajax({
        type: 'POST',
        data: "",
        dataType: "json",
        url: ajaxUrl + "Buildings/datagrid",
        success: function (data) {
            var htmlStr = "";
            $.each(data.data, function (i, n) {
                var option = '<option title="' + n.id + '">' + n.name + '</option>';
                htmlStr += option;
            });
            $("#building").html(htmlStr);
            $("#building").selectpicker("refresh");
            if (id != undefined) {
                GetCabinetInfo();
                return;
            }
            GetFloors();
        }
    });
}

//获取楼层列表
function GetFloors(floorId) {
    $("#floor").html("");
    $.ajax({
        type: 'POST',
        data: { "id": parseInt($("button[data-id='building']").attr("title")), },
        dataType: "json",
        url: ajaxUrl + "Cabinets/datagrid",
        success: function (data) {
            var htmlStr = "";
            $.each(data.data, function (i, n) {
                var option = '<option title="' + n.id + '">' + n.name + '</option>';
                htmlStr += option;
            });
            $("#floor").html(htmlStr);

            if (floorId != undefined && floorId != null) {
                $("#floor option[title='" + data.floorId + "']").attr("selected", "selected");
                $("#floor").selectpicker("refresh");
                GetEngineRooms(engineId);
                return;
            }
            $("#floor").selectpicker("refresh");
        }
    });
}

//获取机房列表
function GetEngineRooms(engineId) {
    $("#engineRoom").html("");
    $.ajax({
        type: 'POST',
        data: { "id": parseInt($("button[data-id='floor']").attr("title")), },
        dataType: "json",
        url: ajaxUrl + "Cabinets/datagrid",
        success: function (data) {
            var htmlStr = "";
            $.each(data.data, function (i, n) {
                var option = '<option title="' + n.id + '">' + n.name + '</option>';
                htmlStr += option;
            });
            $("#engineRoom").html(htmlStr);

            if (engineId != undefined && engineId != null) {
                $("#engineRoom option[title='" + data.engineRoomId + "']").attr("selected", "selected");
            }
            $("#engineRoom").selectpicker("refresh");
        }
    });
}

//保存
function InsertCabinet() {
    var urlTemp = "";
    if (id == undefined || id == null) {
        urlTemp = ajaxUrl + "Equipments/add";
    } else {
        urlTemp = ajaxUrl + "Equipments/edit"
    }
    $("#errMsg").html("");
    $.ajax({
        type: 'POST',
        data: {
            "id": parseInt($("#id").val()), "name": $("#name").val(), "engineRoomId": parseInt($("button[data-id='engineRoom']").attr("title")),
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

//获取机柜信息
function GetCabinetInfo() {
    $.ajax({
        type: 'POST',
        data: {
            "id": id
        },
        dataType: "json",
        url: ajaxUrl + "Equipments/getequipmentsbyid",
        success: function (data) {
            data = data.data;
            $("#id").val(id);
            $("#id").attr("readonly", "readonly");
            $("#name").val(data.name);
            $("#building option[title='" + data.buidingId + "']").attr("selected", "selected");
            $("#building").selectpicker("refresh");
            GetFloors(data.floorId);
        },
        error: function (data) {
            alert("获取机柜信息失败，请检查网络连接！");
        }
    });
}

//选择建筑时，切换楼层
$('#building').on('changed.bs.select', function (e) {
    GetFloors();
});

//选择楼层时，切换机房
$('#floor').on('changed.bs.select', function (e) {
    GetEngineRooms();
});

$("#saveBtn").click(function (e) {
    InsertCabinet();
});

$("#deleteBtn").click(function (e) {
    $(':input', '#mainForm')
       .not(':button,:submit,:reset,:hidden')
       .val('')
       .removeAttr('checked');
});