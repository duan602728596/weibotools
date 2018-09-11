/* babel-loader 配置 */
const path = require('path');

module.exports = {
  loader: 'babel-loader',
  options: {
    cacheDirectory: path.join(__dirname, '../.babelCache'),
    presets: ['@babel/preset-flow'],
    plugins: [
      [
        '@babel/plugin-proposal-decorators',
        {
          legacy: true
        }
      ],
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-proposal-export-default-from',
      '@babel/plugin-proposal-do-expressions',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-syntax-dynamic-import',
      [
        'import',
        {
          libraryName: 'iview',
          libraryDirectory: 'src/components'
        }
      ]
    ]
  }
};