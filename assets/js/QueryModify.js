//获取get参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

var id = GetQueryString("id");
$(function () { 
    GetQueryInfo();
});

//获取设备信息
function GetQueryInfo() { 
    $(':input', '#mainForm')
       .not(':button,:submit,:reset,:hidden')
       .val('')
       .removeAttr('checked'); 
    $.ajax({
        type: 'POST',
        data: { "id":parseInt(id)},
        dataType: "json",
        url: ajaxUrl + "Equipments/getonebyid",
        success: function (data) { 
            data = data.data;
            $("#id").val(data.id);
            $("#name").val(data.name);
            $("#model").val(data.model);
            $("#portId").val(data.portId);
            $("#portName").val(data.portName);
            $("#portType").val(data.portType);
            $("#portConnect").val(data.portConnect);
            $("#building").val(data.buildingName);
            $("#engineRoom").val(data.engineRoomName);
            $("#cabinet").val(data.cabinetName);
        }
    });
}
 