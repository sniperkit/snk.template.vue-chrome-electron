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

/*
Description:
  之所以创建这个项目是因为官方的vue 的webpack的脚手架实在是太笨重的，我想要一个更加适合自己，快速上手的框架
CreateDate: 2017.11.01
Update history:
   2017.12.14 Walter Hu
              1. `eslint-loader` add emitWarning
              2. dev-server > clientLogLevel
   2017.11.10 Walter Hu
              1. publicPath change
              2. add into one file
              3.
   2017.11.05 Walter Hu
              1. webpack add the progress pramater
              2. add `v-cloak` property for refresh issue in vue page(http://blog.csdn.net/bobobocai/article/details/70676951)
              3. [changelog help](http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)
   2017.11.04 Walter Hu, winston的使用需要webpack排除
   2017.11.01 Walter Hu, init version
 */
const path = require('path')
const webpack = require('webpack')
const pkg = require('./package.json')

// Plugins from webpack
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const WriteFileWebPackPlugin = require('write-file-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const notifier = require('node-notifier')
//production only
const offlinePlugin = require('offline-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzip = false

// 自定义的相关设置常量
const isDevEnvironment = process.env.NODE_ENV === 'development'
const devServerHost = process.env.HOST || 'localhost'
const devServerPort = process.env.PORT || '3000'
const sourcePath = path.join(__dirname, 'src')
const outputPath = path.join(__dirname, 'dist')
const testsPath = path.join(__dirname, 'test')
const assetsOutputPath = 'static'
// 线上assets目录文件的相对位置，在开发环境或者本地的文件的时候是/在prodution可以是CDN地址
const publicPath = isDevEnvironment ? '/' : './'
const sourceMap = isDevEnvironment ? 'eval-source-map' : 'source-map'
//webpack dev server
const devServer = {
    host: devServerHost,
    port: devServerPort,
    inline: true,
    hot: true,
    open: true,
    contentBase: outputPath,
    publicPath: publicPath,
    useLocalIp: false,
    stats: {colors: true, errors: true, errorDetails: true, version: true, performance: true},
    overlay: {
        warnings: true,
        errors: true
    },
    watchContentBase: true,
    clientLogLevel: 'warning',
    compress: true,
    noInfo: false,
    quiet: false, // necessary for FriendlyErrorsPlugin
    watchOptions: {
        poll: false // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
    },
    historyApiFallback: true,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    },
    proxy: {
        // to acess the github api
        '/github/**': {
            target: 'https://api.github.com/',
            changeOrigin: true,
            secure: false,
            pathRewrite: {
                '^/github': ''
            },
            bypass: function (req, res, proxyOptions) {
                if (req.url === '/github/nope') {
                    return '/'
                }
            }
        }
    },
    before(app) {
    },
    after(app) {
    }

}


const webpackConfig = {
    output: {
        path: outputPath,
        filename: path.posix.join(assetsOutputPath, 'js/[name].bundle.js'),
        publicPath: publicPath,
        chunkFilename: path.posix.join(assetsOutputPath, 'js/[name].bundle.js')
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': sourcePath
        }
    },
    devtool: sourceMap,
    node: {
        // prevent webpack from injecting useless setImmediate polyfill because Vue
        // source contains it (although only uses it if it's native).
        setImmediate: false,
        // prevent webpack from injecting mocks to Node native modules
        // that does not make sense for the client
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    },
    module: {
        rules: [
            // If true, your code will be linted during bundling and
            // linting errors and warings will be shown in the console.
            {
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: [sourcePath, testsPath],
                options: {
                    formatter: require('eslint-friendly-formatter'),
                    emitWarning: true
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        css: isDevEnvironment ? ['vue-style-loader', {
                            loader: 'css-loader',
                            options: {
                                minimize: false,
                                sourceMap: false
                            }
                        }] : ExtractTextPlugin.extract({
                            use: [{
                                loader: 'css-loader',
                                options: {
                                    minimize: true,
                                    sourceMap: true
                                }
                            }],
                            fallback: 'vue-style-loader'
                        }),
                        postcss: isDevEnvironment ? ['vue-style-loader', {
                            loader: 'css-loader',
                            options: {
                                minimize: false,
                                sourceMap: false
                            }
                        }] : ExtractTextPlugin.extract({
                            use: [{
                                loader: 'css-loader',
                                options: {
                                    minimize: true,
                                    sourceMap: true
                                }
                            }],
                            fallback: 'vue-style-loader'
                        }),
                        less: isDevEnvironment ? ['vue-style-loader', {
                            loader: 'less-loader',
                            options: {
                                sourceMap: false
                            }
                        }] : ExtractTextPlugin.extract({
                            use: [{
                                loader: 'css-loader',
                                options: {
                                    minimize: true,
                                    sourceMap: true
                                }
                            }, {
                                loader: 'less-loader',
                                options: {
                                    minimize: true,
                                    sourceMap: true
                                }
                            }],
                            fallback: 'vue-style-loader'
                        }),
                        sass: isDevEnvironment ? ['vue-style-loader', {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: false,
                                indentedSyntax: true
                            }
                        }] : ExtractTextPlugin.extract({
                            use: [{
                                loader: 'css-loader',
                                options: {
                                    minimize: true,
                                    sourceMap: true
                                }
                            }, {
                                loader: 'sass-loader',
                                options: {
                                    minimize: true,
                                    sourceMap: true,
                                    indentedSyntax: true
                                }
                            }],
                            fallback: 'vue-style-loader'
                        }),
                        scss: isDevEnvironment ? ['vue-style-loader', {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: false
                            }
                        }] : ExtractTextPlugin.extract({
                            use: [{
                                loader: 'css-loader',
                                options: {
                                    minimize: true,
                                    sourceMap: true
                                }
                            }, {
                                loader: 'sass-loader',
                                options: {
                                    minimize: true,
                                    sourceMap: true

                                }
                            }],
                            fallback: 'vue-style-loader'
                        }),
                        stylus: isDevEnvironment ? ['vue-style-loader', {
                            loader: 'stylus-loader',
                            options: {
                                sourceMap: false
                            }
                        }] : ExtractTextPlugin.extract({
                            use: [{
                                loader: 'css-loader',
                                options: {
                                    minimize: true,
                                    sourceMap: true
                                }
                            }, {
                                loader: 'stylus-loader',
                                options: {
                                    minimize: true,
                                    sourceMap: true

                                }
                            }],
                            fallback: 'vue-style-loader'
                        }),
                        styl: isDevEnvironment ? ['vue-style-loader', {
                            loader: 'stylus-loader',
                            options: {
                                sourceMap: false
                            }
                        }] : ExtractTextPlugin.extract({
                            use: [{
                                loader: 'css-loader',
                                options: {
                                    minimize: true,
                                    sourceMap: true
                                }
                            }, {
                                loader: 'stylus-loader',
                                options: {
                                    minimize: true,
                                    sourceMap: true

                                }
                            }],
                            fallback: 'vue-style-loader'
                        })
                    },
                    cssSourceMap: (isDevEnvironment ? false : true),
                    // If you have problems debugging vue-files in devtools,
                    // set this to false - it *may* help
                    // https://vue-loader.vuejs.org/en/options.html#cachebusting
                    cacheBusting: false,
                    transformToRequire: {
                        video: ['src', 'poster'],
                        source: 'src',
                        img: 'src',
                        image: 'xlink:href'
                    }
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [sourcePath, testsPath]
            },
            // Generate loaders for standalone style files (outside of .vue)
            {
                test: new RegExp('\\.css$'),
                use: isDevEnvironment ? ['vue-style-loader', {
                    loader: 'css-loader',
                    options: {
                        minimize: false,
                        sourceMap: false
                    }
                }] : ExtractTextPlugin.extract({
                    use: [{
                        loader: 'css-loader',
                        options: {
                            minimize: true,
                            sourceMap: true
                        }
                    }],
                    fallback: 'vue-style-loader'
                })
            },
            {
                test: new RegExp('\\.postcss$'),
                use: isDevEnvironment ? ['vue-style-loader', {
                    loader: 'css-loader',
                    options: {
                        minimize: false,
                        sourceMap: false
                    }
                }] : ExtractTextPlugin.extract({
                    use: [{
                        loader: 'css-loader',
                        options: {
                            minimize: true,
                            sourceMap: true
                        }
                    }],
                    fallback: 'vue-style-loader'
                })
            },
            {
                test: new RegExp('\\.less$'),
                use: isDevEnvironment ? ['vue-style-loader', {
                    loader: 'less-loader',
                    options: {
                        sourceMap: false
                    }
                }] : ExtractTextPlugin.extract({
                    use: [{
                        loader: 'less-loader',
                        options: {
                            minimize: true,
                            sourceMap: true
                        }
                    }],
                    fallback: 'vue-style-loader'
                })
            },
            {
                test: new RegExp('\\.sass$'),
                use: isDevEnvironment ? ['vue-style-loader', {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: false,
                        indentedSyntax: true
                    }
                }] : ExtractTextPlugin.extract({
                    use: [{
                        loader: 'sass-loader',
                        options: {
                            minimize: true,
                            sourceMap: true,
                            indentedSyntax: true
                        }
                    }],
                    fallback: 'vue-style-loader'
                })
            },
            {
                test: new RegExp('\\.scss$'),
                use: isDevEnvironment ? ['vue-style-loader', {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: false
                    }
                }] : ExtractTextPlugin.extract({
                    use: [{
                        loader: 'sass-loader',
                        options: {
                            minimize: true,
                            sourceMap: true
                        }
                    }],
                    fallback: 'vue-style-loader'
                })
            },
            {
                test: new RegExp('\\.stylus$'),
                use: isDevEnvironment ? ['vue-style-loader', {
                    loader: 'stylus-loader',
                    options: {
                        sourceMap: false
                    }
                }] : ExtractTextPlugin.extract({
                    use: [{
                        loader: 'stylus-loader',
                        options: {
                            minimize: true,
                            sourceMap: true
                        }
                    }],
                    fallback: 'vue-style-loader'
                })
            },
            {
                test: new RegExp('\\.styl$'),
                use: isDevEnvironment ? ['vue-style-loader', {
                    loader: 'styl-loader',
                    options: {
                        sourceMap: false
                    }
                }] : ExtractTextPlugin.extract({
                    use: [{
                        loader: 'stylus-loader',
                        options: {
                            minimize: true,
                            sourceMap: true
                        }
                    }],
                    fallback: 'vue-style-loader'
                })
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: path.posix.join(assetsOutputPath, 'img/[name].bundle.[ext]')
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: path.posix.join(assetsOutputPath, 'media/[name].bundle.[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: path.posix.join(assetsOutputPath, 'fonts/[name].bundle.[ext]')
                }
            }
        ]
    },
    plugins: [
        // common plugins used in production and development environment
        new webpack.DefinePlugin({'process.env': {NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production')}}),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
        new webpack.NoEmitOnErrorsPlugin(),
        // keep module.id stable when vender modules does not change
        new webpack.HashedModuleIdsPlugin(),
        // extract css into its own file
        new ExtractTextPlugin({
            filename: path.posix.join(assetsOutputPath, 'css/[name].bundle.css'),
            // Setting the following option to `false` will not extract CSS from codesplit chunks.
            // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
            // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`,
            // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
            allChunks: true
        })
    ],
    performance: {
        hints: false
    }
}

// only for development build plugin
if (isDevEnvironment) {
    webpackConfig.devServer = devServer
    webpackConfig.plugins = (webpackConfig.plugins || []).concat([
        new WriteFileWebPackPlugin(),
        new FriendlyErrorsPlugin({
            compilationSuccessInfo: {
                messages: [`Your web application is running here: http://${devServerHost}:${devServerPort}`],
            },
            onErrors: (severity, errors) => {
                if (severity !== 'error') {
                    return
                }
                const error = errors[0]
                const filename = error.file.split('!').pop()
                notifier.notify({
                    title: pkg.name,
                    message: severity + ': ' + error.name,
                    subtitle: filename || '',
                    icon: path.resolve(__dirname, assetsOutputPath, 'favicon.ico')
                })
            }
        })
    ])
} else { // for production build
    webpackConfig.plugins = (webpackConfig.plugins || []).concat([
        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        new OptimizeCSSPlugin({
            cssProcessorOptions:
                {safe: true, map: {inline: false}}
        }),
        // enable scope hoisting
        new webpack.optimize.ModuleConcatenationPlugin(),
        // support for service worker, with offline
        new offlinePlugin({
            appShell: '/', // 404 fallback ServiceWorker.navigateFallbackURL
            caches: 'all',
            responseStrategy: 'cache-first',
            updateStrategy: 'changed',
            externals: [],
            excludes: ['**/.*', '**/*.map', '**/*.gz'],
            relativePaths: true,
            autoUpdate: 1000 * 60 * 60 * 5, // (five hours)
            ServiceWorker: {
                output: 'sw.js',
                scope: null,
                events: false,
                minify: false
            }

        })

    ])
    // if need to zip the sourcecode in production
    if (productionGzip) {
        webpackConfig.plugins = (webpackConfig.plugins || []).concat([
            //only for production build
            new CompressionWebpackPlugin({
                asset: '[path].gz[query]',
                algorithm: 'gzip',
                test: new RegExp(
                    '\\.(' +
                    ['js', 'css'].join('|') +
                    ')$'
                ),
                threshold: 10240,
                minRatio: 0.8
            })
            //add more plugins
        ])
    }
}

module.exports.baseWebPackConfig = webpackConfig
module.exports.sourcePath = sourcePath
module.exports.outputPath = outputPath
module.exports.assetsOutputPath = assetsOutputPath
// module.exports.devServerPort = devServerPort
