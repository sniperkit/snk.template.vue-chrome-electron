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

process.env.BABEL_ENV = 'renderer'
const childprocess = require('child_process')
const merge = require('webpack-merge')
const cleanDistFolderPlugin = require('clean-webpack-plugin')
const baseWebPackConfig = require('./webpack.config.web')

const target = 'electron-renderer'
const rendererWebpackConfig = merge(baseWebPackConfig, {
    output: {
        libraryTarget: 'commonjs2'
    },
    target: target,
    node: {
        // add for electron
        __dirname: process.env.NODE_ENV !== 'production',
        __filename: process.env.NODE_ENV !== 'production'
    },
    devServer: {
        open: false,
        before(app) {
            //run the electron main process here,https://github.com/chentsulin/electron-react-boilerplate/blob/master/webpack.config.renderer.dev.js
            console.log('[BecauseQA] Staring Electron Main Process...')
            childprocess.spawn('npm', ['run', 'start-app-main'],
                {shell: true, env: process.env, stdio: 'inherit'})
                .on('close', code => process.exit(code))
                .on('error', spawnError => console.error(spawnError))
        }
    },
    plugins: [
        new cleanDistFolderPlugin(['bin'])
    ]
})


module.exports = rendererWebpackConfig
