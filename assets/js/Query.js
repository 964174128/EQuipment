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
                    var aiNew = oTable02.fnAddData([n.id, n.name, n.model, n.portId, n.portName, n.portType, n.portConnect, n.engineRoom, n.cabinet,
                        '<a class="detail" href="">查看详情 </a>']);
                    var nRow = oTable02.fnGetNodes(aiNew[0]);
                    $(nRow).find('td:last-child').addClass('actions text-center');
                });
            },
            error: function (data) {
                ShowError(data.error);
            }
        });
    };
     
    //修改
    $(document).on("click", "#dataTables-example a.detail", function (e) {
        e.preventDefault();
        var nRow = $(this).parents('tr')[0];
        var aData = oTable02.fnGetData(nRow);
        window.location.href = "../pages/QueryModify.html?id=" + aData[0];
    });

});





