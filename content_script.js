function set_download_url(url) {
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
        $("#fm-section2").prepend(dl_section);
    }    
    if (url) {
        var a = $("#download-anchor");
        var title = document.title.split('-')[0].trim() ;
        var file = title + ".mp3";
        //a.attr("download", file); //新版本的chrome已经不允许非同域名修改download属性
        a.attr("href", "#");
        a.show();
        a.off("click"); //移除上次的binding
        a.on("click", function() {
            chrome.runtime.sendMessage({"url": url, "file":file});
        });

        var i = url.lastIndexOf('/');
        var s = url.substring(i + 1);
        var r = /.+?(_(.+))?\..{3,4}/;
        var result = r.exec(s);
        var j = result[2];
        if (j) {
            a.html("下载《" + title + "》(" + j + "kbps)");
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
        console.log("onMessage: " + document.title.split('-')[0].trim() + ":" + request.url);
        set_download_url(request.url);
        if (request.download) {
            $("#download-anchor")[0].click();
        }
    }
);
