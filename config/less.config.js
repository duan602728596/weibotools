/* less-loader 配置 (for iview) */

// 换肤
// https://github.com/iview/iview/blob/3.x/src/styles/custom.less
const modifyVars = {
  // Color
  '@primary-color': '#9254de',
  // Layout and Grid
  '@layout-header-background': '#9254de'
};

module.exports = {
  loader: 'less-loader',
  options: {
    javascriptEnabled: true,
    modifyVars
  }
};