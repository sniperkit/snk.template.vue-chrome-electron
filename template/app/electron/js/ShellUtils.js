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

import {shell} from 'electron'

const childprocess = require('child_process')

/**
 * open the external url
 * @param url
 */
export const openUrl = function (url) {
    const success = shell.openExternal(url)
    return success
}

/**
 * open the file
 * @param filePath
 * @returns {boolean} open success or not
 */
export const openFile = function (filePath) {
    const success = shell.openItem(filePath)
    return success
}
/**
 * open the file in folder and selected it
 * @param filePath
 * @returns {boolean}
 */
export const openFileInFolder = function (filePath) {
    const success = shell.showItemInFolder(filePath)
    return success
}

/**
 * move the file into trash
 * @param filePath
 * @returns {boolean}
 */
export const moveFileInTrash = function (filePath) {
    const success = shell.moveItemToTrash(filePath)
    return success
}

export const createShortcut = function (path, shortCutDetail) {
    const success = shell.writeShortcutLink(path, shortCutDetail)
    return success

}

/*------------------------------------------------------------------*/
/*refer document: https://medium.freecodecamp.org/node-js-child-processes-everything-you-need-to-know-e69498fe970a */
/**
 * execute command, exeCommand('start "" "iexplore" "http://google.com/"');
 * @param command
 */
export const exeCommand = function (command) {
    childprocess.exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error:${error}`)
            return
        }
        console.log(`execute command success: ${command}`)
    })
}
