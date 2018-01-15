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

import {app, BrowserWindow, Menu} from 'electron'
import {openUrl} from './ShellUtils'
import {checkUpdates} from './AutoUpdaterUtils'

const pkg = require('../../../package.json')
const os = require('os')
const path = require('path')

const appName = app.getName()
const appVersion = app.getVersion()

const menuTemplate = [
    {
        label: 'Edit',
        submenu: [
            {role: 'undo'},
            {role: 'redo'},
            {type: 'separator'},
            {role: 'cut'},
            {role: 'copy'},
            {role: 'paste'},
            {role: 'pasteandmatchstyle'},
            {role: 'delete'},
            {role: 'selectall'}
        ]
    },
    {
        label: 'View',
        submenu: [
            {role: 'reload'},
            {role: 'forcereload'},
            {type: 'separator'},
            {role: 'resetzoom'},
            {role: 'zoomin'},
            {role: 'zoomout'},
            {type: 'separator'},
            {
                label: 'Toggle Full Screen',
                accelerator: process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11',
                click: function (item, focusedWindow) {
                    if (focusedWindow) {
                        focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
                    }
                }
            },
            {type: 'separator'},
            {
                label: 'Toggle Developer Tools',
                accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'F12',
                click: function (item, focusedWindow) {
                    if (focusedWindow) {
                        focusedWindow.toggleDevTools()
                    }
                }
            }
        ]
    },
    {
        role: 'window',
        submenu: [
            {
                role: 'minimize',
                label: 'Minimize',
                accelerator: 'CmdOrCtrl+M'
            },
            {role: 'close'}
        ]
    },
    {
        label: 'History',
        submenu: [{
            label: 'Back',
            accelerator: process.platform === 'darwin' ? 'Command+Left' : 'Alt+Left',
            click(item, focusedWindow) {
                if (focusedWindow) {
                    historyGo(true)
                }
            }
        }, {
            label: 'Forward',
            accelerator: process.platform === 'darwin' ? 'Command+Right' : 'Alt+Right',
            click(item, focusedWindow) {
                if (focusedWindow) {
                    historyGo(false)
                }
            }
        }]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click() {
                    openUrl(pkg.homepage)
                }
            },
            {role: 'about'},
            {
                label: 'Check for updates...',
                click(menuItem, focusedWindow, event) {
                    checkUpdates(menuItem)
                }
            },
            {
                type: 'separator'
            }, {
                label: 'Report an Issue...',
                click(item, focusedWindow) {
                    const body = `
			<!-- Please succinctly describe your issue and steps to reproduce it. -->
			${app.getName()}: ${app.getVersion()}
			Electron Versoin: ${process.versions.electron}
			Platform Information: ${process.platform} ${process.arch} ${os.release()}`
                    openUrl(`https://github.com/BecauseQA/becauseqa.info/issues/new?body=${encodeURIComponent(body)}`)
                }
            }
        ]
    }
]

if (process.platform === 'darwin') {
    menuTemplate.unshift({
        label: `${appName} ${appVersion}`,
        submenu: [
            {role: 'about'},
            {type: 'separator'},
            {role: 'services', submenu: []},
            {type: 'separator'},
            {role: 'hide'},
            {role: 'hideothers'},
            {role: 'unhide'},
            {type: 'separator'},
            {role: 'quit'}
        ]
    })

    // Edit menu
    menuTemplate[1].submenu.push(
        {type: 'separator'},
        {
            label: 'Speech',
            submenu: [
                {role: 'startspeaking'},
                {role: 'stopspeaking'}
            ]
        }
    )

    // Window menu
    menuTemplate[3].submenu = [
        {role: 'close'},
        {role: 'minimize'},
        {role: 'zoom'},
        {type: 'separator'},
        {role: 'front'}
    ]
}


/**
 * 发送信息到renderer线程中
 * @param action
 * @param params
 */
const sendAction = function (action, ...params) {
    const win = BrowserWindow.getAllWindows()[0]

    if (process.platform === 'darwin') {
        win.restore()
    }

    win.webContents.send(action, ...params)
}

/**
 * history go back or forward
 */
const historyGo = function (back) {
    const focusedWindow = BrowserWindow.getFocusedWindow()
    const webContents = focusedWindow.webContents
    if (webContents != null) {
        if (back) {
            webContents.goBack()
        }
        else {
            webContents.goForward()
        }
    }
}

const resetAppSettings = function () {
    // We save App's settings/configurations in following files


}

/**
 * custom the menu bar
 * @param propItems
 * @constructor
 */
export const CustomMenu = function (propItems) {
    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)
}

/**
 * check update in main process
 */
export const checkUpdater = function () {
    setTimeout(() => {
        checkUpdates({})
    }, 10 * 1000)
}


