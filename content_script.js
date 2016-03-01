function set_download_url(url) {
    // console.log("set_url:" + url);
    var dl_section = $("#dl-section");
    if(0 == dl_section.length) {
        dl_section = $("<div id=\"dl-section\">");
        dl_section.css("float", "right");
        dl_section.css("color", "#999");
        dl_section.css("float", "left");
        dl_section.css("padding", "10px 0");
        dl_section.css("display", "inline");

        var label=$("<span id=\"download-song\">");
        var a = $("<a id=\"download-anchor\">");
        a.css("background-color", "transparent");
        a.css("color", "#999");
        a.hover(function(){
                    $(this).css("color", "#333333");

                },
                function() {
                    $(this).css("color", "#999");
                });
        a.html("下载这首歌");
        label.html(a);
        
        dl_section.prepend(label);
        var section = $("#fm-section2");
        if(section.length > 0) {
            section.prepend(dl_section);
        }
        else {
            section = $(".playing-info");
            if(section.length > 0) {
                section.append(dl_section);
            }
        }
        console.log("section:", section);
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
