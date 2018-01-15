/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Becauseqa.Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */
/** NEED the "tabs" permission **/
/**
 *  new tab https://developer.chrome.com/extensions/tabs
 * @param url
 */
let tabindex = 0
let createdTabId // created tab object
const newTab = function (url) {
    if (!createdTabId) {
        const uniqueUrl = chrome.extension.getURL(url + '?id=' + tabindex++)
        chrome.tabs.create({
            url: uniqueUrl
        }, function (tab) {
            createdTabId = tab
        })
    } else {
        // highlight the tab with index property
        chrome.tabs.highlight({tabs: [createdTabId.index]})
    }
}
/**
 * https://developer.chrome.com/extensions/tabs#event-onRemoved
 */
const closeTabEvent = function () {
    chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
        if (tabId === createdTabId.id) {
            createdTabId = null
        }
    })
}

/**
 *
 * @param tabId , if for active tab can be null
 * @param jsFile
 */
const executeJavaScriptFile = function (tabId, jsFile) {
    chrome.tabs.executeScript(tabId, {file: jsFile})
}
const executeJavaScriptCode = function (tabId, jsCode) {
    chrome.tabs.executeScript(tabId, {code: jsCode})
}

export {newTab, closeTabEvent}