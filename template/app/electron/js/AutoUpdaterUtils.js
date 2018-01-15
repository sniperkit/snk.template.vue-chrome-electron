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
import {app, BrowserWindow, dialog} from 'electron'
import {autoUpdater} from 'electron-updater'
import log from './LoggerUtils'
import {displayBalloon} from './TrayUtils'

autoUpdater.autoDownload = false
let updateMenuItem
// checking the update
autoUpdater.on('checking-for-update', () => {
    sendMessage('Checking for update...')
})
autoUpdater.on('update-available', (updateInfo) => {
    sendMessage('Update available.')
    //"none", "info", "error", "question" or "warning".
    const title = `Software Update`
    const availableUpdateMessage = `A new version of ${app.getName()} ${updateInfo.version} is available!`
    const dlgOptions = {
        type: 'question',
        buttons: ['Install Update', 'Remind Me Later'],
        defaultId: 0,
        title: title,
        message: `${availableUpdateMessage} Would you like to download it now?\nRelease Notes:`,
        detail: `${updateInfo.releaseNotes}`,
        checkboxLabel: `Automatically download and install updates in the future`,
        checkboxChecked: false,
        noLink: true

    }
    displayBalloon(title, availableUpdateMessage)
    dialog.showMessageBox(dlgOptions, (response) => {
        if (response === 0) {
            log.info('Begin to download the package...')
            autoUpdater.downloadUpdate()
        } else {
            updateMenuItem.enabled = true
            updateMenuItem = null
        }
    })
})

autoUpdater.on('update-not-available', (info) => {
    sendMessage('There are no updates currently available.')
    updateMenuItem.enabled = true
    updateMenuItem = null
})
autoUpdater.on('error', (err) => {
    // mainWindow.webContents.send("message", 'Error in auto-updater. ' + err);
    dialog.showErrorBox('Error: ', error == null ? 'unknown' : (error.stack || error).toString())
})
autoUpdater.on('download-progress', (progressObj) => {
    let log_message = 'Download speed: ' + progressObj.bytesPerSecond
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
    log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
    log.info(log_message)
})
autoUpdater.on('update-downloaded', (info) => {
    // Ask user to update the app
    log.info('Update-downloaded event triggered,show the dialog for your permission to quit...')
    const dlgOptions = {
        type: 'question',
        title: `Software Update`,
        buttons: ['Install and Relaunch', 'Install Later'],
        message: `A new update ${info.version} has been downloaded`,
        detail: 'It will be installed the next time you restart the application',
        noLink: true
    }
    dialog.showMessageBox(dlgOptions, (response) => {
        if (response === 0) {
            log.info('The button you had clicked is install and relaunch')
            app.isQuitting = true
            autoUpdater.quitAndInstall()
            // force app to quit. This is just a workaround, ideally autoUpdater.quitAndInstall() should relaunch the app.
            app.quit()
        }
    })
})

/**
 * send the window message
 * @param message
 */
function sendMessage(message) {
    BrowserWindow.getFocusedWindow().webContents.send('message', message)
}

/**
 * check for version update
 * @param menuItem
 * @param focusedWindow
 * @param event
 */
export const checkUpdates = function (menuItem) {
    updateMenuItem = menuItem
    updateMenuItem.enabled = false
    if (process.env.NODE_ENV === 'production') {
        autoUpdater.checkForUpdates()
    } else {
        dialog.showErrorBox(
            'Check Update available',
            'You cannot use AutoUpdate Feature in development mode!'
        )
    }
}



