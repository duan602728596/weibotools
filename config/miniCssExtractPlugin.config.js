/* MiniCssExtractPlugin.loader 配置 */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  loader: MiniCssExtractPlugin.loader,
  options: {
    publicPath: '../'
  }
};