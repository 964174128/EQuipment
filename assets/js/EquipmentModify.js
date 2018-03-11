//获取get参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
 
$(function () {
    var id = GetQueryString("id");
    var engineRooms = [];
    var cabinets = [];
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
                        message: '设备编号必填不能为空'
                    },
                    digits: {
                        message: '设备编号只能由数字组成。'
                    },
                }
            },
            portId: { 
                validators: {
                    notEmpty: {
                        message: '用户名必填不能为空'
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
   
});

function InsertEquipment() {
    $.ajax({
        type: 'POST',
        data: {
            "id": parseInt($("#id").val()), "name": $("#name").val(), "model": $("#model").val(), "portId": parseInt($("#portId").val()), "portName": $("#portName").val(),
            "portType": $("#portType").val(), "portConnect": $("#portConnect").val(), "engineRoomId": $("button[data-id='engineRoom']").attr("title"),
            "cabinetId": $("button[data-id='cabinetId']").attr("title")
        },
        dataType: "json",
        url: ajaxUrl + "Equipments/datagrid",
        success: function (data) {
            $.each(data.data, function (i, n) {
                var aiNew = oTable02.fnAddData([n.id, n.name, n.model, n.portId, n.portType, n.portConnect, n.engineRoom, n.cabinet,
                    '<a class="edit" href="">修改 </a><a class="delete" href=""> 删除</a>']);
                var nRow = oTable02.fnGetNodes(aiNew[0]);
                $(nRow).find('td:last-child').addClass('actions text-center');
            });
        },
        error: function (data) {
            ShowError(data.error);
        }
    });
}

$("#saveBtn").click(function(){ 
});