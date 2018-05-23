/* 开发环境 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./webpack.config');
const sassConfig = require('./sass.config');

/* 合并配置 */
module.exports = config({
  output: {
    path: path.join(__dirname, '../build'),
    filename: 'script/[name].js',
    chunkFilename: 'script/[name]_chunk.js'
  },
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      { // sass
        test: /^.*\.s(a|c)ss$/,
        use: ['vue-style-loader', 'css-loader', sassConfig]
      },
      { // css
        test: /^.*\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      { // vue
        test: /^.*\.vue$/,
        use: ['vue-loader']
      }
    ]
  },
  plugins: [
    // html模板
    new HtmlWebpackPlugin({
      inject: true,
      hash: true,
      template: path.join(__dirname, '../src/index.pug')
    })
  ]
});