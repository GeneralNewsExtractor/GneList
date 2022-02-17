function trigger_picker(message) {
    chrome.tabs.sendMessage(message.tabId, {command: 'trigger'})
}

function close_picker(message) {
    chrome.tabs.sendMessage(message.tabId, {command: 'close'})
}

function post_data_to_backend(msg) {
    var options = {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify({data: msg})
    }
    fetch('http://127.0.0.1:8800/rule', options)
         .then(response => response.json())
         .then(response => {
             console.log(response)
         }).catch((err) => {
             console.log('xxxx', err)
         })
}

chrome.runtime.onMessage.addListener(
    function(request, sender) {
        console.log(request, sender)
        // 这个函数目前只处理从content script传过来的
        //XPath信息，其它消息全部取消
        if (!sender.tab) {
            return
        }
        if (request.from !== 'picker') {
            return
        }

        var url = sender.url
        var xpath = request.message
        console.log('选择的xpath为：', request)
        var body = {
            url: url,
            xpath: xpath,
        }
    }
)