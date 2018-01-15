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
process.env.BABEL_ENV = 'web'
const path = require('path')
const merge = require('webpack-merge')
const cleanDistFolderPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const {baseWebPackConfig, sourcePath, outputPath, assetsOutputPath} = require('./webpack.config.base')

const mainEntryJS = path.join(sourcePath, 'index.js')

const chromeConfigPath = path.join(__dirname, '/app/chrome')
const optionsEntryJS = path.join(chromeConfigPath, 'options.js')
const backgroundEntryJS = path.join(chromeConfigPath, 'background.js')
const contentscriptsEntryJS = path.join(chromeConfigPath, 'contentscripts.js')
let entryBody = {}
entryBody.app = mainEntryJS
entryBody.options = optionsEntryJS
entryBody.background = backgroundEntryJS
entryBody.contentscripts = contentscriptsEntryJS


const chromeWebpackConfig = merge(baseWebPackConfig, {
    entry: entryBody,
    plugins: [
        new cleanDistFolderPlugin(['dist']),
        new HtmlWebpackPlugin({
            template: path.join(sourcePath, 'index.html'),
            filename: 'index.html',
            inject: true,
            minify: {
                removeComments: false,
                collapseWhitespace: false,
                removeAttributeQuotes: false
            },
            chunks: ['app'],
            chunksSortMode: 'auto',
            hash: true,
            showErrors: true
        }),
        new HtmlWebpackPlugin({
            template: path.join(chromeConfigPath, 'options.html'),
            filename: 'options.html',
            inject: true,
            minify: {
                removeComments: false,
                collapseWhitespace: false,
                removeAttributeQuotes: false
            },
            chunks: ['options'],
            chunksSortMode: 'auto',
            hash: true,
            showErrors: true
        }),
        new HtmlWebpackPlugin({
            template: path.join(chromeConfigPath, 'background.html'),
            filename: 'background.html',
            inject: true,
            minify: {
                removeComments: false,
                collapseWhitespace: false,
                removeAttributeQuotes: false
            },
            chunks: ['background'],
            chunksSortMode: 'auto',
            hash: true,
            showErrors: true
        }),
        // copy custom static assets
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, assetsOutputPath),
                to: assetsOutputPath,
                ignore: ['*.json']
            },
            {
                from: path.resolve(chromeConfigPath, 'manifest.json'),
                to: outputPath
            },
            {
                from: path.resolve(chromeConfigPath, 'libs'),
                to: path.resolve(assetsOutputPath, 'libs')
            }
        ])

    ]
})

module.exports = chromeWebpackConfig
