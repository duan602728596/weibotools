/* 开发环境 */
const process = require('process');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./webpack.config');
const cssConfig = require('./css.config');
const sassConfig = require('./sass.config');
const manifestJson = require('../.dll/manifest.json');

/* 合并配置 */
module.exports = config({
  output: {
    path: path.join(__dirname, '../build'),
    filename: 'script/[name].js',
    chunkFilename: 'script/[name].js'
  },
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      { // sass
        test: /^.*\.s(a|c)ss$/,
        oneOf: [
          {
            resourceQuery: /scoped/,
            use: ['vue-style-loader', 'css-loader', sassConfig]
          },
          {
            use: ['vue-style-loader', cssConfig, sassConfig]
          }
        ]
      },
      { // css
        test: /^.*\.css$/,
        use: ['vue-style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    // dll
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: manifestJson
    }),
    // html模板
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join(__dirname, '../src/index.pug'),
      NODE_ENV: process.env.NODE_ENV
    })
  ]
});