function set_download_url(url) {
    console.log("set_url:" + url);

    // create download link
    var anchor = $("#download-anchor");

    if(0 == anchor.length) {
        var anchor = $("<a>");
        anchor.attr("id", "download-anchor");
        anchor.text("下载");
        anchor.css("background-color", "transparent");
        anchor.css("color", "#999");
        anchor.css("font-size", "10px");
        anchor.hover(function(){
            $(this).css("color", "#333333");

        },
            function() {
                $(this).css("color", "#999");
            });

        var buttons = $(".buttons > div");

        var label = $("<label>");
        label.attr("title", "download");
        label.prepend(anchor);

        var span = buttons.children("span").clone();
        buttons.prepend(span);
        buttons.prepend(label);
    }

    if (url) {
        console.log("url: " + url);
        var a = $("#download-anchor");
        var title = document.title.split('-')[0].trim() ;
        var re = /.+\/.+(\.mp[34]).*/;
        var result = re.exec(url);
        var ext = ".mp3"
        if (result.length > 1) {
            ext = result[1];
        }
        var file = title + ext;
        //a.attr("download", file); //新版本的chrome已经不允许非同域名修改download属性
        a.attr("href", "#");
        a.show();
        a.off("click"); //移除上次的binding
        a.on("click", function() {
            chrome.runtime.sendMessage({"url": url, "file":file});
        });

        re = /.+\/.+_(.+k)(_1v)?.+/;
        var result = re.exec(url);
        if (result) {
            var j = result[1];
            a.html("下载《" + title + "》(" + j + "bps)");
        }
        else {
            a.html("下载《" + title + "》");
        }

        
    }
    else {
        $("#download-anchor").hide();
    }
}

chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        // console.log("onMessage: " + document.title.split('-')[0].trim() + ":" + request.url);
        set_download_url(request.url);
        if (request.download) {
            $("#download-anchor")[0].click();
        }
    }
);
