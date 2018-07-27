const process = require('process');
const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const babelConfig = require('./babel.config');

function config(options){
  const conf = {
    mode: process.env.NODE_ENV,
    entry: {
      app: [path.join(__dirname, '../src/app.js')]
    },
    externals: {
      Base64: 'window.Base64',
      hint: 'window.hint'
    },
    module: {
      rules: [
        { // js
          test: /^.*\.js$/,
          use: [babelConfig, 'eslint-loader'],
          exclude: /(dll\.js|node_modules|js-base64|weibo-pattlock)/
        },
        { // vue
          test: /^.*\.vue$/,
          use: ['vue-loader']
        },
        {
          test: /(dll\.js|js-base64|weibo-pattlock)/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[hash:5].[ext]',
                outputPath: 'script/'
              }
            }
          ]
        },
        { // 图片
          test: /^.*\.(jpg|png|gif)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 3000,
                name: '[name].[hash:5].[ext]',
                outputPath: 'image/',
              }
            }
          ]
        },
        { // 矢量图片 & 文字
          test: /^.*\.(eot|svg|ttf|woff|woff2)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[hash:5].[ext]',
                outputPath: process.env.NODE_ENV === 'development' ? 'file/' : '../file/'
              }
            }
          ]
        },
        { // pug
          test: /^.*\.pug$/,
          use: [
            {
              loader: 'pug-loader',
              options: {
                pretty: process.env.NODE_ENV === 'development',
                name: '[name].html'
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
  };

  /* 合并 */
  conf.module.rules = conf.module.rules.concat(options.module.rules);       // 合并rules
  conf.plugins = conf.plugins.concat(options.plugins);                      // 合并插件
  conf.output = options.output;                                             // 合并输出目录
  if('devtool' in options) conf.devtool = options.devtool;                  // 合并source-map配置
  if('optimization' in options) conf.optimization = options.optimization;   // 合并optimization

  return conf;
}

module.exports = config;