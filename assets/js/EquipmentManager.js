var ajaxUrl = "http://192.168.1.103:8080/crmnew/";

$(function () {
    $('#side-menu').metisMenu();

    $(window).bind("load resize", function () {
        var topOffset = 50;
        var width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        var height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });

    var url = window.location;
    // var element = $('ul.nav a').filter(function() {
    //     return this.href == url;
    // }).addClass('active').parent().parent().addClass('in').parent();
    var element = $('ul.nav a').filter(function () {
        return this.href == url;
    }).addClass('active').parent();

    while (true) {
        if (element.is('li')) {
            element = element.parent().addClass('in').parent();
        } else {
            break;
        }
    }
});

$(function () {
    var oTable02 = $('#dataTables-example').dataTable({
        responsive: true,
        language: {
            "lengthMenu": "每页显示 _MENU_ 行",
            "zeroRecords": "对不起，没有找到匹配的内容！",
            "info": "第 _PAGE_ 页，共  _PAGES_ 页",
            "infoEmpty": "没有可用记录！",
            "infoFiltered": "(共 _MAX_ 条记录中过滤)",
            "emptyTable": "表格无记录！",
            "loadingRecords": "载入中...",
            "processing": "执行中...",
            "search": "搜索:",
            "paginate": {
                "first": "首页",
                "last": "尾页",
                "next": "下一页",
                "previous": "上一页"
            },
            "aria": {
                "sortAscending": ": 升序",
                "sortDescending": ": 降序"
            },
        },
    });
    $("#dataTables-example_length").append("<div id='errorMsgDiv' style='color:red'>&nbsp; </div>");
    GetData();

    //获取数据
    function GetData() {
        oTable02.fnClearTable();
        $.ajax({
            type: 'GET',
            data: '',
            dataType: "json",
            url: ajaxUrl + "user/datagrid",
            success: function (data) {
                $.each(data.data, function (i, n) {
                    var aiNew = oTable02.fnAddData([n.id, n.username, n.gender, '<a class="edit" href="">修改 </a><a class="delete" href=""> 删除</a>']);
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
            thisUrl = ajaxUrl + "user/addUser";
        } else {
            thisUrl = ajaxUrl + "user/editUser";
        }
        var jqInputs = $('input', nRow);
        var aData = oTable02.fnGetData(nRow);
        $.ajax({
            type: 'POST',
            data: { "id": parseInt(jqInputs[0].value), "username": jqInputs[1].value, "gender": jqInputs[2].value },
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
            url: ajaxUrl + "user/deleteUser",
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
        jqTds[2].innerHTML = '<input class="form-control" type="text" value="' + aData[2] + '">';
        if (isAdd) {
            jqTds[3].innerHTML = '<a class="add save" href="#">保存 </a><a class="delete" href="#"> 删除</a>';
        } else {
            jqTds[3].innerHTML = '<a class="edit save" href="#">保存 </a><a class="delete" href="#"> 删除</a>';
        }
    };

    //保存
    function saveRow(oTable02, nRow) {
        var jqInputs = $('input', nRow);
        oTable02.fnUpdate(jqInputs[0].value, nRow, 0, false);
        oTable02.fnUpdate(jqInputs[1].value, nRow, 1, false);
        oTable02.fnUpdate(jqInputs[2].value, nRow, 2, false);
        oTable02.fnUpdate('<a class="edit" href="#">修改 </a><a class="delete" href="#"> 删除</a>', nRow, 3, false);
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





