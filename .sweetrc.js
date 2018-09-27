import path from 'path';
import process from 'process';

const isDevelopment: string = process.env.NODE_ENV === 'development';

export default {
  frame: 'vue',
  dll: [
    'vue/dist/vue',
    'vue-router/dist/vue-router',
    'vuex/dist/vuex'
  ],
  entry: {
    app: [path.join(__dirname, 'src/app.js')]
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: isDevelopment ? 'script/[name].js' : 'script/[chunkhash:5].js',
    chunkFilename: isDevelopment ? 'script/[name].js' : 'script/[chunkhash:5].js'
  },
  externals: {
    hint: 'window.hint'
  },
  rules: [
    {
      test: /(dll\.js|weibo-pattlock\.js)/,
      use: [{
        loader: 'file-loader',
        options: {
          name: isDevelopment ? '[name].[ext]' : '[hash:5].[ext]',
          outputPath: 'script/'
        }
      }]
    }
  ],
  js: {
    plugins: [['import', { libraryName: 'iview', libraryDirectory: 'src/components' }]],
    exclude: /(dll\.js|weibo-pattlock\.js|node_modules)/
  },
  sass: {
    include: /src/,
    publicPath: '../'
  },
  css: {
    modules: false,
    modifyVars: {
      // https://github.com/iview/iview/blob/3.x/src/styles/custom.less
      '@primary-color': '#9254de',
      '@layout-header-background': '#9254de'
    },
    include: /node_modules[\\/]iview/,
    publicPath: '../'
  },
  html: [{ template: path.join(__dirname, 'src/index.pug') }]
};