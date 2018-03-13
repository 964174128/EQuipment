 
$(function () { 
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
                        message: '个人必填不能为空'
                    },
                    digits: {
                        message: '个人编号只能由数字组成。'
                    },
                }
            },
            name: {
                validators: {
                    notEmpty: {
                        message: '姓名必填不能为空'
                    },
                }
            }, 
            password2: {
                field: 'password1',
                message: '密码不同请检查!'
            },
        }
    }).on('error.form.bv', function (e) {

        var $form = $(e.target),
            validator = $form.data('bootstrapValidator'),
            $invalidField = validator.getInvalidFields().eq(0),
            $collapse = $invalidField.parents('.collapse');

        $collapse.collapse('show');
    });

    GetUserInfo();
});

//获取个人信息
function GetUserInfo() {
    $(':input', '#mainForm')
       .not(':button,:submit,:reset,:hidden')
       .val('')
       .removeAttr('checked'); 
    $.ajax({
        type: 'POST',
        data: "",
        dataType: "json",
        url: ajaxUrl + "user/getUser",
        success: function (data) {
            $("#id").val(data.id); 
            $("#name").val(data.name);
        }
    });
}

  
//保存
function SaveUserInfo() { 
    $.ajax({
        type: 'POST',
        data: {
            "id": parseInt($("#id").val()), "name": $("#name").val(), "password": $("#password").val(),
        },
        dataType: "json",
        url: ajaxUrl + "user/editUser",
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
 

$("#saveBtn").click(function (e) {
    SaveUserInfo();
});

$("#deleteBtn").click(function (e) {
    $(':input', '#mainForm')
       .not(':button,:submit,:reset,:hidden')
       .val('')
       .removeAttr('checked');
});