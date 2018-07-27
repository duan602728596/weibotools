/* 生产环境 */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssets = require('optimize-css-assets-webpack-plugin');
const config = require('./webpack.config');
const cssConfig = require('./css.config');
const sassConfig = require('./sass.config');

/* 合并配置 */
module.exports = config({
  output: {
    path: path.join(__dirname, '../build'),
    filename: 'script/[name].[chunkhash:5].js',
    chunkFilename: 'script/[name].[chunkhash:5].js'
  },
  module: {
    rules: [
      { // sass
        test: /^.*\.s(a|c)ss$/,
        oneOf: [
          {
            resourceQuery: /scoped/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', sassConfig]
          },
          {
            use: [MiniCssExtractPlugin.loader, cssConfig, sassConfig]
          }
        ]
      },
      { // css
        test: /^.*\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style/[name].[chunkhash:5].css',
      chunkFilename: 'style/[name].[chunkhash:5].css'
    }),
    new OptimizeCssAssets()
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      automaticNameDelimiter: '.'
    }
  }
});