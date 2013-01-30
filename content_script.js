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
        $("#download-anchor").show();
        $("#download-anchor").attr("href", url);
        var file = document.title.split('-')[0].trim() + ".mp3";
        $("#download-anchor").attr("download", file);
    }
    else {
        $("#download-anchor").hide();
    }
}

chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
//        console.log(document.title.split('-')[0].trim() + ":" + request.url);
        set_download_url(request.url);
        if (request.download) {
            $("#download-anchor")[0].click();
        }
    }
);
