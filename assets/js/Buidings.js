$(function () {

    GetData();

    //获取数据
    function GetData() {
        oTable02.fnClearTable(); 
        $.ajax({
            type: 'POST',
            data: '',
            dataType: "json",
            url: ajaxUrl + "Buildings/datagrid",
            success: function (data) {
                $.each(data.data, function (i, n) {
                    var aiNew = oTable02.fnAddData([n.id, n.name, '<a class="edit" href="">修改 </a><a class="delete" href=""> 删除</a>']);
                    var nRow = oTable02.fnGetNodes(aiNew[0]);
                    $(nRow).find('td:last-child').addClass('actions text-center');
                });
            },
            error: function (data) { 
                ShowError(data.error);
            }
        });
    };

    function ModifyData(oTable02, nRow, isAdd) {
        var thisUrl;
        if (isAdd) {
            thisUrl = ajaxUrl + "Buildings/add";
        } else {
            thisUrl = ajaxUrl + "Buildings/edit";
        }
        var jqInputs = $('input', nRow);
        var aData = oTable02.fnGetData(nRow);
        $.ajax({
            type: 'POST',
            data: { "id": parseInt(jqInputs[0].value), "name": jqInputs[1].value },
            dataType: "json",
            url: thisUrl,
            success: function (data) {
                if (data.success) {
                    saveRow(oTable02, nRow);
                    return;
                }
                ShowError(data.msg);
            },
            error: function (data) {
                ShowError("保存失败！请检查输入！");
            }
        });
    }

    function DeleteData(oTable02, nRow) {
        var aData = oTable02.fnGetData(nRow);
        $.ajax({
            type: 'POST',
            data: { "id": parseInt(aData[0]) },
            dataType: "json",
            url: ajaxUrl + "Buildings/delete",
            success: function (data) {
                if (data.success) {
                    oTable02.fnDeleteRow(nRow);
                    nEditing = null;
                    return;
                }
                ShowError(data.msg);
            },
            error: function (data) {
                ShowError("删除失败!请检查网络连接！");
            }
        });
    }

    function ShowError(message) {
        $("#errorMsgDiv").text(message);
    }

    //恢复表格
    function restoreRow(oTable02, nRow) {
        var aData = oTable02.fnGetData(nRow);
        var jqTds = $('>td', nRow);

        for (var i = 0, iLen = jqTds.length ; i < iLen ; i++) {
            oTable02.fnUpdate(aData[i], nRow, i, false);
        }
        oTable02.fnDraw();
    };

    //修改
    function editRow(oTable02, nRow, isAdd) {
        var aData = oTable02.fnGetData(nRow);
        var jqTds = $('>td', nRow);
        jqTds[0].innerHTML = '<input class="form-control" type="text" value="' + aData[0] + '">';
        jqTds[1].innerHTML = '<input class="form-control" type="text" value="' + aData[1] + '">'; 
        if (isAdd) {
            jqTds[2].innerHTML = '<a class="add save" href="#">保存 </a><a class="delete" href="#"> 删除</a>';
        } else {
            jqTds[2].innerHTML = '<a class="edit save" href="#">保存 </a><a class="delete" href="#"> 删除</a>';
        }
    };

    //保存
    function saveRow(oTable02, nRow) {
        var jqInputs = $('input', nRow);
        oTable02.fnUpdate(jqInputs[0].value, nRow, 0, false);
        oTable02.fnUpdate(jqInputs[1].value, nRow, 1, false); 
        oTable02.fnUpdate('<a class="edit" href="#">修改 </a><a class="delete" href="#"> 删除</a>', nRow, 2, false);
        oTable02.fnDraw();
        nEditing = null;
    };


    // 添加新增按钮
    var addRowLink = '<a href="#" id="addRow" class="btn btn btn-primary"  style="margin-right:20px;">新增</a>';
    $('#dataTables-example_filter').prepend(addRowLink);

    var nEditing = null;

    // 新增行
    $('#addRow').click(function (e) {
        e.preventDefault();

        //如果正在编辑则不新增
        if (nEditing !== null) {
            return;
        }

        var aiNew = oTable02.fnAddData(['', '', '', '<a class="edit" href="">修改 </a><a class="delete" href=""> 删除</a>']);
        var nRow = oTable02.fnGetNodes(aiNew[0]);
        editRow(oTable02, nRow, true);
        nEditing = nRow;

        $(nRow).find('td:last-child').addClass('actions text-center');
    });

    $(document).on("click", "#dataTables-example a.delete", function (e) {
        e.preventDefault();
        var nRow = $(this).parents('tr')[0];
        DeleteData(oTable02, nRow);
    });

    $(document).on("click", "#dataTables-example a.edit", function (e) {
        e.preventDefault();
        var nRow = $(this).parents('tr')[0];

        if (nEditing !== null && nEditing != nRow) {
            restoreRow(oTable02, nEditing);
            editRow(oTable02, nRow, false);
            nEditing = nRow;
        }
        else if (nEditing == nRow && this.innerHTML == "保存 ") {
            ModifyData(oTable02, nEditing, false);
        }
        else {
            editRow(oTable02, nRow, false);
            nEditing = nRow;
        }
    });

    $(document).on("click", "#dataTables-example a.add", function (e) {
        e.preventDefault();
        var nRow = $(this).parents('tr')[0];

        if (nEditing !== null && nEditing != nRow) {
            restoreRow(oTable02, nEditing);
            editRow(oTable02, nRow, true);
            nEditing = nRow;
        }
        else if (nEditing == nRow && this.innerHTML == "保存 ") {
            ModifyData(oTable02, nEditing, true);
        }
        else {
            editRow(oTable02, nRow, true);
            nEditing = nRow;
        }
    });
});





