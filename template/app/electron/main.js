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

import {app, BrowserWindow} from 'electron'
import log from './js/LoggerUtils'
import {crashDialog} from './js/DialogUtils'
import {ipcMessages} from './js/IpcMain'
import {checkUpdater, CustomMenu} from './js/MenuUtils'
import {createTray, displayBalloon} from './js/TrayUtils'
import {registerShortCuts, unregisterShortcuts} from './js/globalShortcutUtils'

const path = require('path')

let mainWindow
let appTray

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
const isDevEnvironment = process.env.NODE_ENV !== 'production'
const devStatic = path.join(__dirname, '../../static').replace(/\\/g, '\\\\')
const prodStatic = path.join(__dirname, '/static').replace(/\\/g, '\\\\')

global.__static = isDevEnvironment ? devStatic : prodStatic
log.info(`Static path is: ${global.__static}, dev Static path is: ${devStatic}, production static path is: ${prodStatic}`)
const APP_ICON = path.resolve(__static, 'img', (process.platform === 'win32' ? 'favicon.png' : 'favicon.ico'))
//console.log('app path is: ' + path.resolve(__static, 'icons', (process.platform === 'win32' ? 'app.ico' : 'app.png')))

const winURL = process.env.NODE_ENV === 'development'
    ? `http://127.0.0.1:3000`
    : `file://${__dirname}/index.html`


const installExtensions = function () {
    require('electron-debug')({showDevTools: true})
    // Install `vue-devtools`
    require('electron').app.on('ready', () => {
        let installExtension = require('electron-devtools-installer')
        installExtension.default(installExtension.VUEJS_DEVTOOLS)
            .then(() => {
            })
            .catch(err => {
                console.log('Unable to install `vue-devtools`: \n', err)
            })
    })
}

const makeSingleInstance = function () {
    const isAlreadyRunning = app.makeSingleInstance(() => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) {
                log.info('Window is already running!')
                mainWindow.restore()
            }
            mainWindow.show()
        }
    })
    if (isAlreadyRunning) {
        app.quit()
    }
}

const createBrowserWindow = function () {
    /**
     * Initial window options
     */
    let mainWindow = new BrowserWindow({
        icon: APP_ICON,
        height: 563,
        width: 1000,
        // backgroundColor: '#ccff1f',
        show: false,
        useContentSize: true,
        fullscreen: false,
        fullscreenWindowTitle: true,
        center: true,
        webPreferences: {
            devTools: true,
            webSecurity: false, //cors issue, cross domain request
            allowRunningInsecureContent: true,
            allowDisplayingInsecureContent: true,
            plugins: true, //BrowserWindow.addExtension
            defaultFontSize: 18,//default is 16
            defaultEncoding: 'UTF-8'

        }

    })


    appTray = createTray(APP_ICON)
    const trayTitle = app.getName() + ' ' + app.getVersion()
    const trayMessage = 'You can reopen the application from here'
    log.info(`Default SystemTray's title is: ${trayTitle}, content is: ${trayMessage}`)
    // page load incrementally, which is not a good experience for a native app.
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })
    mainWindow.on('close', (event) => {
        //因为上面是设置了一个全局引用,因此这里需要对该对象解除引用
        // event.preventDefault()
        // mainWindow = null
        if (!app.isQuitting) {
            event.preventDefault()
            displayBalloon(trayTitle, trayMessage)
            process.platform === 'darwin' ? app.hide() : mainWindow.hide()
        }
    })

    mainWindow.on('minimize', function (event) {
        event.preventDefault()
        displayBalloon(trayTitle, trayMessage)
        process.platform === 'darwin' ? app.hide() : mainWindow.hide()
    })
    mainWindow.on('show', function () {
        appTray.setHighlightMode('selection')
    })

    mainWindow.on('unresponsive', () => {
        crashDialog(mainWindow)
    })
    mainWindow.on('enter-full-screen', () => {
        mainWindow.webContents.send('enter-fullscreen')
    })

    mainWindow.on('leave-full-screen', () => {
        mainWindow.webContents.send('leave-fullscreen')
    })

    mainWindow.webContents.on('dom-ready', () => {
        mainWindow.show()
    })
    mainWindow.webContents.once('did-frame-finish-load', () => {
        // Initate auto-updates on MacOS and Windows
        log.info('check updating when start the page...')
        checkUpdater()
    })
    mainWindow.webContents.on('crashed', function () {
        crashDialog(mainWindow)
    })
    //  To destroy tray icon when navigate to a new URL
    mainWindow.webContents.on('will-navigate', e => {
        if (e) {
            mainWindow.webContents.send('destroytray')
        }
    })


    // 加载对应的web内容
    mainWindow.loadURL(winURL)
    return mainWindow
}

const appEvents = function () {
    app.on('ready', () => {
        mainWindow = createBrowserWindow()
        //register the global shortcuts
        registerShortCuts()
        // setup the menu
        CustomMenu({
            tabs: []
        })
        log.debug('session setup.......')
        const session = mainWindow.webContents.session
        console.log(`Default Electron User-Agent: ` + session.getUserAgent())
        //const IEUserAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko'
        ipcMessages()
        // install extensions
        if (isDevEnvironment) installExtensions()

    })
    app.on('activate', () => {
        if (mainWindow === null) {
            mainWindow = createBrowserWindow()
        }
    })
    app.on('window-all-closed', () => {
        // destory the tray icon
        if (appTray) appTray.destroy()
        //在OSX中经常是用户虽然关闭了主窗口,但是仍然希望使用Menu Bar,因此这里不进行强行关闭
        if (process.platform !== 'darwin') {
            app.quit()
        }

    })
// 应用被重新激活之后的回调
    app.on('activate', () => {
        // 在Dock中的Menu Bar被点击之后重新激活应用
        if (mainWindow === null) {
            mainWindow = createBrowserWindow()
        }
    })
//应用将要退出时响应
    app.on('will-quit', function () {
        unregisterShortcuts()
    })
    app.on('before-quit', function () {

    })
}

// main function put here
makeSingleInstance()
appEvents()
process.on('uncaughtException', err => {
    console.error(err)
    console.error(err.stack)
})
