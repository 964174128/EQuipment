//获取get参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
 
$(function () {
    var id = GetQueryString("id");
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