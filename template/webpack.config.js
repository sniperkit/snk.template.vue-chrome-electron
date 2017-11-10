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
const cleanDistFolderPlugin = require('clean-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WriteFileWebPackPlugin = require('write-file-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const notifier = require('node-notifier')
//production only
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
const sourceMap = isDevEnvironment ? '#cheap-module-eval-source-map' : '#source-map'
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
  noInfo: false,
  quiet: false,
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
  before (app) {},
  after (app) {}

}

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

const webpackConfig = {
  entry: entryBody,
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
  // node: {
  //    // fs: "empty" //winston需要使用，net库和fs库都是chrome的v8引擎之外的写给nodejs用的。
  //     // 是用在服务端，而不是浏览器你的前端，你在前端渲染。肯定就加载不了这个模块了。
  // },
  devtool: sourceMap,
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
          formatter: require('eslint-friendly-formatter')
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
    new webpack.DefinePlugin({'process.env': {NODE_ENV: JSON.stringify(process.env.NODE_ENV)}}),
    new cleanDistFolderPlugin(['dist']),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // keep module.id stable when vender modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: path.posix.join(assetsOutputPath, 'css/[name].bundle.css')
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
    ]),
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
    // UglifyJs do not support ES6+, you can also use babel-minify for better treeshaking: https://github.com/babel/minify
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true,
      parallel: true
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions:
        {safe: true, map: {inline: false}}
    }),
    // enable scope hoisting
    // new webpack.optimize.ModuleConcatenationPlugin()
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

module.exports = webpackConfig
