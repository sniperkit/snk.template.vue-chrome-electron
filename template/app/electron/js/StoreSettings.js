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
import {app} from 'electron'

const storage = require('electron-json-storage')
const path = require('path')


export const storeSettings = function () {
    // store settings
    setDataPath()
    console.log('new path is: ' + getDataPath())
    setData('testdata', {testnode1: true, testnode2: 'test2'}, function (error) {
        if (error) throw error
        console.log('done setting data')
    })

    getData('testdata', function (error, data) {
        if (error) throw error
        console.log(`found data in file is ${data}`)
    })
}
/**
 * default path is: %appdata%/electron/storage
 * @returns {*}
 */
export const getDefaultDataPath = function () {
    return storage.getDefaultDataPath()
}

/**
 * like:
 const newpath = resolve(__dirname, 'settings')
 console.log('new path is: ' + newpath)
 * @param dataPath
 */
export const setDataPath = function () {
    const dataPath = path.resolve(app.getAppPath(), 'data')
    storage.setDataPath(dataPath)
}

export const getDataPath = function () {
    return storage.getDataPath()

}
/**
 * like:
 setData('testdata', {testnode1: true, testnode2: 'test2'}, function (error) {
        if (error) throw error
        console.log('done setting data')
    })
 * @param jsonFileName
 * @param jsonContent
 * @param callback
 */
export const setData = function (jsonFileName, jsonContent, callback) {
    storage.set(jsonFileName, jsonContent, callback)

}

export const getData = function (jsonFileName, callback) {
    hasData(jsonFileName, function (error, hasKey) {
        if (error) throw error
        if (hasKey) {
            storage.get(jsonFileName, callback)
        }
    })


}
export const hasData = function (jsonFileName, callback) {
    storage.has(jsonFileName, callback)
}
export const deleteData = function (jsonFileName, callback) {
    storage.remove(jsonFileName, callback)
}
