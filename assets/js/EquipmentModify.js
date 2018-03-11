$(function () {
    $('#mainForm').bootstrapValidator({
        message: '不合法输入！',
        //excluded:[":hidden",":disabled",":not(visible)"] ,//bootstrapValidator的默认配置
        excluded: ':disabled',//关键配置，表示只对于禁用域不进行验证，其他的表单元素都要验证

        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',//显示验证成功或者失败时的一个小图标
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            username: {
                message: '用户名不能为空',//默认提示信息
                validators: {
                    notEmpty: {
                        message: '用户名必填不能为空'
                    },
                    stringLength: {
                        min: 6,
                        max: 30,
                        message: '用户名长度不能小于6位或超过30位'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '用户名只能由字母、数字、点和下划线组成。'
                    },

                }
            }

        }
    }).on('error.form.bv', function (e) {
        console.log('error');

        // Active the panel element containing the first invalid element
        var $form = $(e.target),
            validator = $form.data('bootstrapValidator'),
            $invalidField = validator.getInvalidFields().eq(0),
            $collapse = $invalidField.parents('.collapse');

        $collapse.collapse('show');
    });
});