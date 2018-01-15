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


import {app, BrowserWindow, Menu, Tray} from 'electron'
import {openUrl} from './ShellUtils'

const pkg = require('../../../package.json')
let appTray
let appIconPath

export const createTray = function (iconPath) {
    appTray = new Tray(iconPath)
    appIconPath = iconPath
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Quit',
            click: function () {
                app.isQuitting = true
                app.quit()
            }
        },
        {type: 'separator'},
        {
            label: 'Settings',
            click: function (menuItem, focusedWindow, event) {

            }
        },
        {
            label: 'Help',
            click: function (menuItem, focusedWindow, event) {
                openUrl(pkg.homepage)
            }
        }
    ])

    appTray.setToolTip(app.getName())
    appTray.setContextMenu(contextMenu)

    appTray.on('click', (events, bounds) => {

    })
    appTray.on('double-click', (events, bounds) => {
            const mainWindow = BrowserWindow.getAllWindows()[0]
            mainWindow.show()
        }
    )

    return appTray

}

export const displayBalloon = function (title, content) {
    if (appTray) appTray.displayBalloon({icon: appIconPath, title: title, content: content})
}

