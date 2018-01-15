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
const webpack = require('webpack')
const merge = require('webpack-merge')
const cleanDistFolderPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const offlinePlugin = require('offline-plugin')
const {baseWebPackConfig, assetsOutputPath, sourcePath} = require('./webpack.config.base')

// Messages prefixed with [HMR] originate from the webpack/hot/dev-server module.
// Messages prefixed with [WDS] originate from the webpack-dev-server client.
const mainEntryJS = path.join(sourcePath, 'index.js')
let entryBody = {}
//“inline”选项会为入口页面添加“热加载”功能，“hot”选项则开启“热替换（Hot Module Reloading）”，即尝试重新加载组件改变的部分（而不是重新加载整个页面）。
// 如果两个参数都传入，当资源改变时，webpack-dev-server将会先尝试HRM（即热替换），如果失败则重新加载整个入口页面
//注意： 如果指定了inline 和hot参数那么就不用指定entry里面的两个参数
// const devServerInlineModeUrl = `webpack-dev-server/client?http://${devServerHost}:${devServerPort}/`
// const devServerHMRModuleUrl = 'webpack/hot/dev-server'
// entryBody.app = [].concat(devServerInlineModeUrl, devServerHMRModuleUrl, mainEntryJS)
entryBody.app = mainEntryJS

const webWebpackConfig = merge(baseWebPackConfig, {
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
                chunks: ['vendor', 'manifest', 'app'],
                chunksSortMode: 'dependency',
                hash: true,
                showErrors: true
            }),
            // split vendor js into its own file
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                minChunks: function (module) {
                    // any required modules inside node_modules are extracted to vendor
                    return (
                        module.resource &&
                        /\.js$/.test(module.resource) &&
                        module.resource.indexOf(
                            path.join(__dirname, './node_modules')
                        ) === 0
                    )
                }
            }),
            // extract webpack runtime and module manifest to its own file in order to
            // prevent vendor hash from being updated whenever app bundle is updated
            new webpack.optimize.CommonsChunkPlugin({
                name: 'manifest',
                chunks: ['vendor']
            }),
            // copy custom static assets
            new CopyWebpackPlugin([
                {
                    from: path.resolve(__dirname, assetsOutputPath),
                    to: assetsOutputPath,
                    ignore: ['.*']
                }
            ])

        ]
    }
)
module.exports = webWebpackConfig


