var _tabid = null;
var _url = null;

function checkForDoubanfm(tabid, changeinfo, tab) {
    var re=/http:\/\/douban\.fm\/(\?.+|$|#)/;
    console.log("checkForDoubanfm: " + tab.url);
    if (re.test(tab.url)) {
        _tabid = tabid;
        chrome.pageAction.show(tabid);
/*        chrome.webRequest.onBeforeRequest.addListener(function(details) {
                                                          send_download_url(null, false);
                                                      }, 
                                                      {urls:["http://douban.fm/*", "http://*.douban.com/*"]});
*/
        // chrome.webRequest.onResponseStarted.addListener(hook_download_url, {urls:["http://douban.fm/*", "http://*.douban.com/*", "http://*.doubanio.com/*"]});
        chrome.webRequest.onResponseStarted.addListener(hook_download_url, {urls:["http://*.doubanio.com/*"]});
        chrome.tabs.onRemoved.addListener(function(tabid, removeInfo) {
                                              if (_tabid == tabid) {
                                                  console.log("onRemoved");
                                                  _tabid = null;
                                                  chrome.pageAction.hide(tabid);
                                                  chrome.webRequest.onResponseStarted.removeListener(hook_download_url);
                                              }
                                          });
    }
    else {

    }
}

chrome.tabs.onUpdated.addListener(checkForDoubanfm);
chrome.pageAction.onClicked.addListener(function(tab) {
                                            if (_url) {
                                                send_download_url(_url, true);
                                            }
                                        });

var hook_re=/http:\/\/.+\.douban(io)?\.com\/.+\/.+.mp[34](\?.*)?$/;
/*
 * 拦截网络请求地址，把mp3的地址保存下来，然后把地址通过消息发送到content_script.js
 */
function hook_download_url(details) {
    var url = details.url;
    console.log("test hook:", url);
    if(hook_re.test(url)) {
        if (_url != url) {
            _url = url;
            console.log("hook_download_url:" + details.url);
            send_download_url(details.url, false);
        }
    }
}

function send_download_url(url, download) {
    var tabid = _tabid;
    if (tabid) {
        if (url) {
            console.log("send_download_url: " + url);
            var _url = url;
            chrome.tabs.sendMessage(tabid, 
                                        {url:_url, 
                                         download:download} );
        }
        else {
/*            chrome.tabs.sendMessage(tabid, 
                                   {url:null,
                                   download:false});
*/
        }
    }
}

function download_file(url, file) {
    chrome.downloads.download(
        {
            "url": url,
            "filename": file
        });
}

chrome.runtime.onMessage.addListener(function(message) {
    var url = message["url"];
    var file = message["file"];
    if (null != url && null != file) {
        download_file(url, file);
    }
});
