var ajaxUrl = "http://192.168.1.103:8080/crmnew/";

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

function ShowError(message) {
    $("#errorMsgDiv").text(message);
}

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
