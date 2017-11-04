/*
 * Copyright (c) 2017. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

/*
Description:
  之所以创建这个项目是因为官方的vue 的webpack的脚手架实在是太笨重的，我想要一个更加适合自己，快速上手的框架
CreateDate: 2017.11.01
Update history:
   2017.11.01 Walter Hu, init version
 */
const path = require('path')
const webpack = require('webpack')

// Plugins from webpack
const cleanDistFolderPlugin = require('clean-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WriteFileWebPackPlugin = require("write-file-webpack-plugin")
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
//production only
const CompressionWebpackPlugin = require('compression-webpack-plugin')

// 自定义的相关设置常量
const sourcePath = path.join(__dirname, 'src')
const mainEntryJS = path.join(sourcePath, 'index.js')
const outputPath = path.join(__dirname, 'dist')
const testsPath = path.join(__dirname, 'test')
const assetsSubDirectory = 'statics'
//线上assets目录文件的相对位置，在开发环境或者本地的文件的时候是/在prodution可以是CDN地址
const assetsPublicPath = './'
const sourceMap = process.env.NODE_ENV === 'development' ? '#cheap-module-eval-source-map' : '#source-map'


const devServerHost = 'localhost'
const devServerPort = '3000'
// Messages prefixed with [HMR] originate from the webpack/hot/dev-server module.
// Messages prefixed with [WDS] originate from the webpack-dev-server client.
let entryBody = {}
//“inline”选项会为入口页面添加“热加载”功能，“hot”选项则开启“热替换（Hot Module Reloading）”，即尝试重新加载组件改变的部分（而不是重新加载整个页面）。
// 如果两个参数都传入，当资源改变时，webpack-dev-server将会先尝试HRM（即热替换），如果失败则重新加载整个入口页面
//注意： 如果指定了inline 和hot参数那么就不用指定entry里面的两个参数
// const devServerInlineModeUrl = `webpack-dev-server/client?http://${devServerHost}:${devServerPort}/`
// const devServerHMRModuleUrl = 'webpack/hot/dev-server'
// entryBody.app = [].concat(devServerInlineModeUrl, devServerHMRModuleUrl, mainEntryJS)
entryBody.app = mainEntryJS

module.exports = {

    entry: entryBody,
    output: {
        path: outputPath,
        filename: '[name].bundle.js',
        publicPath: assetsPublicPath,
        chunkFilename: path.posix.join(assetsSubDirectory, 'js/[id].bundle.js')
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': sourcePath
        }
    },
    devtool: sourceMap,
    module: {
        rules: [
            {
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: [sourcePath, testsPath],
                options: {
                    formatter: require('eslint-friendly-formatter')
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        css: ExtractTextPlugin.extract({
                            use: [{
                                loader: 'css-loader',
                                options: {
                                    minimize: true,
                                    sourceMap: true
                                }
                            }],
                            fallback: 'vue-style-loader'
                        }),
                        postcss: ExtractTextPlugin.extract({
                            use: [{
                                loader: 'css-loader',
                                options: {
                                    minimize: true,
                                    sourceMap: true
                                }
                            }],
                            fallback: 'vue-style-loader'
                        }),
                        less: ExtractTextPlugin.extract({
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
                        sass: ExtractTextPlugin.extract({
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
                        scss: ExtractTextPlugin.extract({
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
                        stylus: ExtractTextPlugin.extract({
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
                        styl: ExtractTextPlugin.extract({
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
                    transformToRequire: {
                        video: 'src',
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
                use: ExtractTextPlugin.extract({
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
                use: ExtractTextPlugin.extract({
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
                use: ExtractTextPlugin.extract({
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
                use: ExtractTextPlugin.extract({
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
                test:new RegExp('\\.scss$'),
                use: ExtractTextPlugin.extract({
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
                use: ExtractTextPlugin.extract({
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
                use: ExtractTextPlugin.extract({
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
                    name: path.posix.join(assetsSubDirectory, 'img/[name].bundle.[ext]')
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: path.posix.join(assetsSubDirectory, 'media/[name].bundle.[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: path.posix.join(assetsSubDirectory, 'fonts/[name].bundle.[ext]')
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"'}),
        new cleanDistFolderPlugin(['dist']),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(), new FriendlyErrorsPlugin(),
        // UglifyJs do not support ES6+, you can also use babel-minify for better treeshaking: https://github.com/babel/minify
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: true,
            parallel: true
        }),
        // extract css into its own file
        new ExtractTextPlugin({
            filename: path.posix.join(assetsSubDirectory, 'css/[name].bundle.css')
        }),
        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        new OptimizeCSSPlugin({
            cssProcessorOptions:
                {safe: true, map: {inline: false}}
        }),
        // keep module.id stable when vender modules does not change
        new webpack.HashedModuleIdsPlugin(),
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
                from: path.resolve(__dirname, assetsSubDirectory),
                to: assetsSubDirectory,
                ignore: ['.*']
            }
        ]),
        new WriteFileWebPackPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(sourcePath,'index.html'),
            filename: 'index.html',
            inject: true,
            minify: {
                removeComments: false,
                collapseWhitespace: false,
                removeAttributeQuotes: false
            },
            chunks: ['vendor', 'manifest', 'app'],
            chunksSortMode: 'dependency',
            hash:true,
            showErrors:true
        }),
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
    ],
    devServer: {
        clientLogLevel: 'info',
        index: 'index.htm',
        stats: {colors: true},
        inline: true,
        hot: true,
        historyApiFallback: true, //return 404 responsecode when not found
        host: devServerHost,
        port: devServerPort,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        },
        // server for static resource
        contentBase: outputPath,
        watchContentBase: true,
        open: true,
        publicPath: assetsPublicPath,
        proxy: {},
        before(app) {

        },
        after(app) {

        }
    }
}


