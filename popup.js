let start = document.getElementById('start')
let rule_name = document.getElementById('rule_name')
start.addEventListener('click', function() {
    console.log('start to capture')
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        var activeTab = tabs[0]
        chrome.tabs.sendMessage(activeTab.id, {command: 'trigger', 'name': rule_name.value})
    })
}, false)