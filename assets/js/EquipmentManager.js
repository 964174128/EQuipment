$(function () {

    GetData();

    //获取数据
    function GetData() {
        oTable02.fnClearTable();
        $.ajax({
            type: 'POST',
            data: '',
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
    };

    function DeleteData(oTable02, nRow) {
        var aData = oTable02.fnGetData(nRow);
        $.ajax({
            type: 'POST',
            data: { "id": parseInt(aData[0]) },
            dataType: "json",
            url: ajaxUrl + "user/deleteUser",
            success: function (data) {
                if (data.success) {
                    oTable02.fnDeleteRow(nRow); 
                    return;
                }
                ShowError(data.msg);
            },
            error: function (data) {
                ShowError("删除失败!请检查网络连接！");
            }
        });
    }  

    // 添加新增按钮
    var addRowLink = '<a href="#" id="addRow" class="btn btn btn-primary"  style="margin-right:20px;">新增</a>';
    $('#dataTables-example_filter').prepend(addRowLink);
 
    // 新增
    $('#addRow').click(function (e) {
        window.location.href = "../pages/EquipmentModify.html"; 
    });

    //删除
    $(document).on("click", "#dataTables-example a.delete", function (e) { 
        var nRow = $(this).parents('tr')[0];
        DeleteData(oTable02, nRow);
    });

    //修改
    $(document).on("click", "#dataTables-example a.edit", function (e) {
        e.preventDefault();
        var nRow = $(this).parents('tr')[0];
        var aData = oTable02.fnGetData(nRow);
        window.location.href = "../pages/EquipmentModify.html?id="+aData[0]; 
    });
 
});





