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


import {app, ipcMain} from 'electron'

export const ipcMessages = function () {
    // 主线程的通信事件请求
    ipcMain.on('focus-app', () => {
        mainWindow.show()
    })

    ipcMain.on('quit-app', (event) => {
        app.quit()
    })

    // Reload full app not just webview, useful in debugging
    ipcMain.on('reload-full-app', (event) => {
        mainWindow.reload()
// event.sender.send(channel,'')
    })

    ipcMain.on('clear-app-settings', (eve) => {
        app.relaunch()
        app.exit()
    })

    ipcMain.on('toggle-app', () => {
        if (mainWindow.isVisible()) {
            mainWindow.hide()
        } else {
            mainWindow.show()
        }
    })

    ipcMain.on('toggle-badge-option', () => {
        // BadgeSettings.updateBadge(badgeCount, mainWindow)
    })

    ipcMain.on('update-badge', (event, messageCount) => {
        //webPage.send('tray', messageCount)
    })

    ipcMain.on('update-taskbar-icon', (event, data, text) => {
        // BadgeSettings.updateTaskbarIcon(data, text, mainWindow)
    })

    ipcMain.on('forward-message', (event, listener, ...params) => {
        webPage.send(listener, ...params)
    })

    ipcMain.on('update-menu', (event, props) => {
        appMenu.setMenu(props)
    })

    ipcMain.on('register-server-tab-shortcut', (event, index) => {
        // Array index == Shown index - 1
        webPage.send('switch-server-tab', index - 1)
    })

    ipcMain.on('toggleAutoLauncher', (event, AutoLaunchValue) => {
        // setAutoLaunch(AutoLaunchValue)
    })
}
