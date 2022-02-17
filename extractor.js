"use strict";
const puppeteer = require('puppeteer-core')
const fs = require('fs')
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

class GneList{
    constructor(url) {
        this.url = url
        this.page = null
    }

    async init() {
        const browser = await puppeteer.launch({
            headless: false,
            executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        })
        this.page = await browser.newPage()
        await this.page.goto(this.url, {timeout: 60000})
    }

    run() {
        var a = document.querySelector('#posts > article:nth-child(1) > div > header > h1 > a')
        var b = document.querySelector('#posts > article:nth-child(2) > div > header > h1 > a')
        var selector = new CssSelector({
            parent: document,
            enableResultStripping: true,
            enableSmartTableSelector: true,
            allowMultipleSelectors: false,
            ignoredClasses: [
                'select-helper-panel',
                'done-select'
            ]
        })

        var result = selector.getCssSelector([a, b])
        return result
    }


    async make_a_test() {
        var CssSelector = fs.readFileSync('./CssSelector.js', 'utf-8')
        // await this.page.addScriptTag({path: './CssSelector.js'})
        await this.page.evaluate(CssSelector)
        var result = await this.page.evaluate(this.run)
        console.log(result)

    }
}

(async () => {
    const extractor = new GneList('https://www.kingname.info/')
    await extractor.init()
    await extractor.make_a_test()
})()
