var path = require('path')
var config = require('../config')
var utils = require('./utils')
var webpack = require('webpack')
var projectRoot = path.resolve(__dirname, '../')
const vueLoaderConfig = require('./vue-loader.conf')
const {VueLoaderPlugin} = require('vue-loader')

var env = process.env.NODE_ENV
// check env & config/index.js to decide weither to enable CSS Sourcemaps for the
// various preprocessor loaders added to vue-loader at the end of this file
var cssSourceMapDev = (env === 'development' && config.dev.cssSourceMap)
var cssSourceMapProd = (env === 'production' && config.build.productionSourceMap)
var useCssSourceMap = cssSourceMapDev || cssSourceMapProd

// define the different HOST between development and production environment
var DEV_HOST = JSON.stringify('http://127.0.0.1/vuetk/php/index.php/')
var PUB_HOST = JSON.stringify('http://127.0.0.1/vuetk/php/index.php/')
 

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
    filename: '[name].js'
  },
 
  plugins: [
    new webpack.DefinePlugin({
      HOST: process.env.NODE_ENV === 'production' ? PUB_HOST : DEV_HOST
    }),
    new VueLoaderPlugin()
  ],
  resolve: {
    // extensions: ['.json', '.js', '.vue'],   
    // fallback: [path.join(__dirname, '../node_modules')],
    // alias: {
    //   'vue$': 'vue/dist/vue',
    //   'src': path.resolve(__dirname, '../src'),
    //   'assets': path.resolve(__dirname, '../src/assets'),
    //   'components': path.resolve(__dirname, '../src/components'),
    //   // 'fallback': [path.join(__dirname, '../node_modules')]
    // }
    alias: {
            //确定vue的构建版本
            'vue$':'vue/dist/vue.esm.js',
            'src': path.resolve(__dirname, '../src'),
            'assets': path.resolve(__dirname, '../src/assets'),
            'components': path.resolve(__dirname, '../src/components'),
            '@': path.resolve(__dirname, '../src')
        },
        extensions: ['*','.js','.vue','.json']

  },
  // resolveLoader: {
  //   fallback: [path.join(__dirname, '../node_modules')]
  // },
  module: {
    rules: [
      {
        test: /\.vue$/,
       loader: 'vue-loader',
       options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: projectRoot,
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'stage-3']
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
     
  ]},
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
  }
 
  // },
  // vue: {
  //   loaders: utils.cssLoaders({ sourceMap: useCssSourceMap }),
  //   postcss: [
  //     require('autoprefixer')({
  //       browsers: ['last 2 versions']
  //     })
  //   ]
  // }
}
