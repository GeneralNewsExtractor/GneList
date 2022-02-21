chrome.storage.sync.get('backend_address', ({backend_address}) => {
    if (backend_address) {
        document.getElementById('backend').value = backend_address
    }
})


let submit = document.getElementById('submit')
submit.addEventListener('click', function() {
    console.log('click...')
    var backend_address = document.getElementById('backend').value
    if (backend_address) {
        chrome.storage.sync.set({backend_address})
        console.log('set backend to ' + backend_address)
    }
})