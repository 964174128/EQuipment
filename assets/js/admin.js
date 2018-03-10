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

    function restoreRow(oTable02, nRow) {
        var aData = oTable02.fnGetData(nRow);
        var jqTds = $('>td', nRow);

        for (var i = 0, iLen = jqTds.length ; i < iLen ; i++) {
            oTable02.fnUpdate(aData[i], nRow, i, false);
        }
        oTable02.fnDraw();
    };

    function editRow(oTable02, nRow) {
        var aData = oTable02.fnGetData(nRow);
        var jqTds = $('>td', nRow);
        jqTds[0].innerHTML = '<input type="text" value="' + aData[0] + '">';
        jqTds[1].innerHTML = '<input type="text" value="' + aData[1] + '">';
        jqTds[2].innerHTML = '<input type="text" value="' + aData[2] + '">'; 
        jqTds[3].innerHTML = '<a class="edit save" href="#">保存 </a><a class="delete" href="#"> 删除</a>';
    };

    function saveRow(oTable02, nRow) {
        var jqInputs = $('input', nRow);
        oTable02.fnUpdate(jqInputs[0].value, nRow, 0, false);
        oTable02.fnUpdate(jqInputs[1].value, nRow, 1, false);
        oTable02.fnUpdate(jqInputs[2].value, nRow, 2, false); 
        oTable02.fnUpdate('<a class="edit" href="#">修改 </a><a class="delete" href="#"> 删除</a>', nRow, 3, false);
        oTable02.fnDraw();
    };


    // Append add row button to table
    var addRowLink = '<a href="#" id="addRow" class="btn btn btn-primary"  style="margin-right:20px;">新增</a>';
    $('#dataTables-example_filter').prepend(addRowLink);

    var nEditing = null;

    // Add row initialize
    $('#addRow').click(function (e) {
        e.preventDefault();

        // Only allow a new row when not currently editing
        if (nEditing !== null) {
            return;
        }

        var aiNew = oTable02.fnAddData(['', '', '', '<a class="edit" href="">修改 </a><a class="delete" href=""> 删除</a>']);
        var nRow = oTable02.fnGetNodes(aiNew[0]);
        editRow(oTable02, nRow);
        nEditing = nRow;

        $(nRow).find('td:last-child').addClass('actions text-center');
    });
     
    $(document).on("click", "#dataTables-example a.delete", function (e) {
        e.preventDefault();

        var nRow = $(this).parents('tr')[0];
        oTable02.fnDeleteRow(nRow);
    });
     
    $(document).on("click", "#dataTables-example a.edit", function (e) {
        e.preventDefault(); 
        var nRow = $(this).parents('tr')[0];

        if (nEditing !== null && nEditing != nRow) { 
            restoreRow(oTable02, nEditing);
            editRow(oTable02, nRow);
            nEditing = nRow;
        }
        else if (nEditing == nRow && this.innerHTML == "保存 ") { 
            saveRow(oTable02, nEditing);
            nEditing = null;
        }
        else { 
            editRow(oTable02, nRow);
            nEditing = nRow;
        }
    });
})



