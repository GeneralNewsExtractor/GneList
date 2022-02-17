let start = document.getElementById('start')
start.addEventListener('click', function() {
    console.log('start to capture')
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        var activeTab = tabs[0]
        chrome.tabs.sendMessage(activeTab.id, {command: 'trigger'})
    })
}, false)