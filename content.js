/* eslint-disable */

console.log('start to inject content js')
var skip_class = ['select-tool-bar',
                  'done-select',
                  'show-select-xpath',
                  'select-parent']
var rule_name = ''
var CssSelector = window.CssSelector
var selected_elements = []
var selector = new CssSelector({
    parent: document,
    enableResultStripping: true,
    enableSmartTableSelector: true,
    allowMultipleSelectors: false,
    ignoredClasses: skip_class
})
var top = 0

chrome.runtime.onMessage.addListener(
    function(request, sender) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.command === 'trigger') {
            console.log('receive command to trigger...')
            rule_name = request.name
            start_to_find_xpath()
        }
        if (request.command === 'close') {
            console.log('close picker')
            stop_finding_xpath()
        }
        return true
    }
)

function send_message_to_background(message) {
    chrome.runtime.sendMessage(message)
}

function highlight(element, light_type){
    if (element === null) {
        return
    }
    if (light_type === 'selected') {
        // 选中被高亮的元素可能有很多个
        // 同时也要取消hover的元素
        remove_highlight('hover')
        //remove_highlight('selected')
        element.classList.add('seleted-element-highlight')
    } else if (light_type === 'hover') {
        remove_highlight('hover')
        element.classList.add('hovered-element-highlight')
    }
}

function highlight_elements(elements) {
    for (var element of elements) {
        highlight(element)
    }
}

function highlight_selected(css_selector) {
    remove_highlight('selected')
    var elements = document.querySelectorAll(css_selector)
    elements.forEach(function(element) {
        element.classList.add('seleted-element-highlight')
    })
}

function disable_a_link() {
    var a_tags = document.getElementsByTagName('a')
    for (var i=0; i<a_tags.length; i++){
        var element = a_tags[i]
        //element.style.pointerEvents = "none"
        element.onclick = function() {return false}
    }
}

function enable_a_link() {
    var a_tags = document.getElementsByTagName('a')
    for (var i=0; i<a_tags.length; i++){
        var element = a_tags[i]
        //element.style.removeProperty("pointer-events")
        element.onclick = null
    }
}

function remove_highlight(light_type){
    if (light_type === 'hover') {
        var element = document.querySelector('.hovered-element-highlight')
        if (element) {
            element.classList.remove('hovered-element-highlight')
        }
    } else if (light_type === 'selected') {
        document.querySelectorAll('.seleted-element-highlight').forEach(el => {
        el.classList.remove('seleted-element-highlight')
        })
    }
}

function get_current_element(event){
    var x = event.clientX, y = event.clientY,
        element = document.elementFromPoint(x, y);
    return element
}

function track_mouse(event){
    var elementMouseIsOver = get_current_element(event)
    if (!elementMouseIsOver) {
        return
    }
    var class_name = elementMouseIsOver.className
    if (class_name && skip_class.includes(class_name)) {
        return
    }
    highlight(elementMouseIsOver, 'hover')
}

function choose_element(event) {
    var element = get_current_element(event)
    if (!element) {
        return
    }

    var class_name = element.className
    if(class_name && skip_class.includes(class_name)) {
        return
    }
    remove_highlight('hover')
    if (selected_elements.length === 0) {
        selected_elements.push(element)
        result = selector.getCssSelector([element])
    } else {
        // selected_elements里面已经有一个节点了，那么
        // 要考虑现在是不是在点击列表页的连续两项，如果是，
        // 那么就要智能扩展到整个列表
        // element = merge_elements(element)
        result = selector.getCssSelector([selected_elements[0], element])
        if (!element) {
            return
        }
    }
    highlight_selected(result)
    var xpath = window.cssxpath(result)
    console.log('the merged selector is :', xpath)
    var input = document.querySelector('.show-select-xpath')
    input.value = result
    send_message_to_background({from: 'picker', 'message': xpath, 'name': rule_name})
}

function start_to_find_xpath(){
    top = 0
    selected_elements = []
    add_corner_button()
    disable_a_link()
    window.onmousemove = track_mouse
    window.onmousedown = choose_element
}

function stop_finding_xpath() {
    remove_highlight('selected')
    remove_highlight('hover')
    window.onmousedown = null
    window.onmousemove = null
    enable_a_link()
}

function get_parent_element(element) {
    return element.parentNode
}

function remove_toolbar() {
    stop_finding_xpath()
    var body = document.getElementsByTagName('body')[0]
    var done = document.querySelector('.select-tool-bar')
    body.removeChild(done)
}

function select_parent() {
    top--
}

function add_corner_button() {
    //在网页左下角添加一个按钮，用来细化picker的红框
    var done = document.createElement('button')
    var text = document.createTextNode('Done')
    done.appendChild(text)
    done.onclick = remove_toolbar
    done.setAttribute('class', 'done-select')

    var input = document.createElement('input')
    input.setAttribute('class', 'show-select-xpath')
    input.setAttribute('type', 'text')

    var parent = document.createElement('button')
    parent.appendChild(document.createTextNode('P'))
    parent.setAttribute('class', 'select-parent')
    parent.onclick = select_parent

    var div = document.createElement('div')
    div.appendChild(input)
    div.appendChild(parent)
    div.appendChild(done)
    div.setAttribute('class', 'select-tool-bar')
    var body = document.getElementsByTagName('body')[0]
    body.appendChild(div)
}
