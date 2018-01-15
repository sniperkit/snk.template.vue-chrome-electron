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
process.env.BABEL_ENV = 'main'
const merge = require('webpack-merge')
const path = require('path')
const {baseWebPackConfig} = require('./webpack.config.base')
const {dependencies} = require('./package.json')

const mainTarget = 'electron-main'
const mainEntryJS = path.join(__dirname, 'app/electron', 'main.js')
let mainEntryBody = {}
mainEntryBody.main = mainEntryJS

const mainWebpackConfig = merge(baseWebPackConfig, {
    entry: mainEntryBody,
    output: {
        filename: 'main.bundle.js',
        libraryTarget: 'commonjs2'
    },
    target: mainTarget,
    externals: Object.keys(dependencies || {}),
    node: {
        // add for electron
        __dirname: process.env.NODE_ENV !== 'production',
        __filename: process.env.NODE_ENV !== 'production'
    },
})


module.exports = mainWebpackConfig
